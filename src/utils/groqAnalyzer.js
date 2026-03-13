import { getLocalEmbedding } from './localEmbeddings';
import { getTopMatches } from './vectorUtils';

const SCORING_MODEL = 'llama-3.3-70b-versatile';
const BATCH_SIZE = 5;
const TOP_N_CANDIDATES = 30;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function withRetry(fn, maxRetries = 3) {
  let delay = 1000;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (err.status === 429 && attempt < maxRetries) {
        await sleep(delay);
        delay *= 2;
      } else {
        throw err;
      }
    }
  }
}

/**
 * Scores a batch of PPTs against the reference using Groq.
 */
async function scoreBatch(referenceParsed, contenderBatch, criteriaList, apiKey, isComparison = false) {
  const criteriaText = criteriaList
    .map((c, i) => `${i + 1}. **${c.name}** (weight: ${c.weight}/10): ${c.description}`)
    .join('\n');

  const contendersText = contenderBatch
    .map((ppt, i) => `--- ${isComparison ? 'PRESENTATION B' : `CONTENDER ${i + 1}`}: "${ppt.fileName}" ---\n${ppt.text.slice(0, 3000)}`)
    .join('\n\n');

  const prompt = isComparison 
    ? `You are an expert judge comparing two hackathon presentations side-by-side. Evaluate BOTH presentations independently and fairly — neither is a "reference standard". Both should be judged on their own merits.
  
**PRESENTATION A:** "${referenceParsed.fileName}"
${referenceParsed.text.slice(0, 3000)}

**PRESENTATION B:**
${contendersText}

**CRITERIA:**
${criteriaText}

**INSTRUCTIONS:**
Evaluate BOTH presentations individually against the criteria. Give each its own score, strengths, and weaknesses. Then compare them and declare a winner.
Respond ONLY with a valid JSON object.
Format:
{
  "presentationA": {
    "fileName": "${referenceParsed.fileName}",
    "totalScore": <0-100>,
    "criteriaScores": [{ "name": "name", "score": <1-10>, "weight": <w> }],
    "strengths": ["specific strengths of A"],
    "weaknesses": ["specific weaknesses of A"]
  },
  "presentationB": {
    "fileName": "${contenderBatch[0].fileName}",
    "totalScore": <0-100>,
    "criteriaScores": [{ "name": "name", "score": <1-10>, "weight": <w> }],
    "strengths": ["specific strengths of B"],
    "weaknesses": ["specific weaknesses of B"]
  },
  "comparisonSummary": "Detailed comparison explaining the differences, trade-offs, and why the winner is better",
  "recommendedWinner": "A" or "B"
}`
    : `You are an expert hackathon judge. Compare each contender against the reference PPT standard.
  
**REFERENCE PPT:** "${referenceParsed.fileName}"
${referenceParsed.text.slice(0, 2000)}

**CRITERIA:**
${criteriaText}

**CONTENDERS:**
${contendersText}

**INSTRUCTIONS:**
Evaluate each contender. Respond ONLY with a valid JSON object containing an array of results.
Format:
{
  "results": [
    {
      "fileName": "exact.pptx",
      "totalScore": <0-100>,
      "criteriaScores": [{ "name": "name", "score": <1-10>, "weight": <w> }],
      "strengths": [], "weaknesses": [], "summary": ""
    }
  ]
}`;

  const response = await withRetry(() => 
    fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: SCORING_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      })
    }).then(res => {
      if (!res.ok) throw { status: res.status, message: 'Groq API Error' };
      return res.json();
    })
  );

  const content = response.choices[0].message.content;
  console.log('AI RAW RESPONSE:', content);

  try {
    const parsed = JSON.parse(content);
    
    if (isComparison) {
      // New format returns presentationA and presentationB
      return [parsed];
    }

    // Robust array extraction for Leaderboard mode
    if (Array.isArray(parsed)) return parsed;
    if (parsed.results && Array.isArray(parsed.results)) return parsed.results;
    if (parsed.evaluations && Array.isArray(parsed.evaluations)) return parsed.evaluations;
    
    // Fallback: look for ANY array in the object
    const firstArray = Object.values(parsed).find(val => Array.isArray(val));
    if (firstArray) return firstArray;

    return [];
  } catch (e) {
    console.error('Groq parse error:', e);
    return contenderBatch.map(ppt => ({
      fileName: ppt.fileName,
      totalScore: 0,
      criteriaScores: [],
      strengths: [],
      weaknesses: ['Failed to parse AI response'],
      summary: 'Analysis failed'
    }));
  }
}

export async function analyzePresentations(
  referenceData,
  contenderDataList,
  criteriaList,
  apiKey,
  onProgress,
  analysisMode = 'LEADERBOARD'
) {
  const isComparison = analysisMode === 'COMPARISON';

  // STAGE 1 & 2: Local Embeddings
  onProgress({ stage: 'embedding_reference', current: 0, total: 1 });
  const referenceVector = await getLocalEmbedding(referenceData.text);
  
  const embeddedContenders = [];
  for (let i = 0; i < contenderDataList.length; i++) {
    onProgress({ stage: 'embedding_contenders', current: i + 1, total: contenderDataList.length });
    const vector = await getLocalEmbedding(contenderDataList[i].text);
    embeddedContenders.push({ ...contenderDataList[i], vector });
  }

  // STAGE 3: Filter (Skip filter in comparison mode)
  const topCandidates = isComparison 
    ? embeddedContenders 
    : getTopMatches(referenceVector, embeddedContenders, TOP_N_CANDIDATES);
  
  // STAGE 4: Groq Scoring
  const allResults = [];
  const batches = [];
  for (let i = 0; i < topCandidates.length; i += BATCH_SIZE) {
    batches.push(topCandidates.slice(i, i + BATCH_SIZE));
  }

  for (let bi = 0; bi < batches.length; bi++) {
    onProgress({ stage: 'scoring', current: bi + 1, total: batches.length });
    const batchResults = await scoreBatch(referenceData, batches[bi], criteriaList, apiKey, isComparison);
    allResults.push(...batchResults);
    await sleep(200); 
  }

  const finalRankings = allResults
    .map(result => {
      const candidate = topCandidates.find(c => c.fileName === result.fileName);
      return {
        ...result,
        similarityScore: candidate ? Math.round(candidate.similarityScore * 100) : 0
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((result, idx) => ({ ...result, rank: idx + 1 }));

  if (isComparison && allResults.length > 0) {
    const compData = allResults[0];
    return {
      isComparison: true,
      presentationA: compData.presentationA || { fileName: referenceData.fileName, totalScore: 0, strengths: [], weaknesses: [] },
      presentationB: compData.presentationB || (finalRankings[0] || { fileName: '', totalScore: 0, strengths: [], weaknesses: [] }),
      comparisonSummary: compData.comparisonSummary || '',
      recommendedWinner: compData.recommendedWinner || 'A',
      rankings: finalRankings,
      winner: finalRankings[0] || null
    };
  }

  return { 
    rankings: finalRankings, 
    winner: finalRankings[0] || null,
    isComparison 
  };
}

