/**
 * Computes cosine similarity between two vectors.
 * @param {number[]} vecA
 * @param {number[]} vecB
 * @returns {number} similarity score between -1 and 1
 */
export function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Returns the top N items from a list scored by cosine similarity to a reference vector.
 * @param {number[]} referenceVec 
 * @param {Array<{vector: number[], ...rest}>} items 
 * @param {number} topN 
 * @returns {Array} Top N items with similarity score attached
 */
export function getTopMatches(referenceVec, items, topN = 30) {
  const scored = items.map(item => ({
    ...item,
    similarityScore: cosineSimilarity(referenceVec, item.vector)
  }));

  scored.sort((a, b) => b.similarityScore - a.similarityScore);
  return scored.slice(0, topN);
}
