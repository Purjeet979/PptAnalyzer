import JSZip from 'jszip';

/**
 * Extracts raw text from a PPTX file (which is just a zip of XMLs).
 * @param {File} file The PPTX File object.
 * @returns {Promise<{ fileName: string, slideCount: number, text: string }>} 
 */
export async function parsePptxData(file) {
  try {
    const zip = new JSZip();
    const contents = await zip.loadAsync(file);
    
    // Find all slide XML files
    const slideRegex = /ppt\/slides\/slide\d+\.xml/;
    const slideFiles = Object.keys(contents.files).filter(name => slideRegex.test(name));
    
    let allText = '';
    
    // Parse each slide XML to extract text nodes (a:t)
    for (const slideName of slideFiles) {
      const slideXmlStr = await contents.files[slideName].async('text');
      const textMatches = slideXmlStr.match(/<a:t[^>]*>(.*?)<\/a:t>/g);
      
      if (textMatches) {
        const slideText = textMatches
          .map(match => match.replace(/<a:t[^>]*>|<\/a:t>/g, ''))
          .join(' ');
        allText += slideText + '\n\n';
      }
    }
    
    // Clean up XML entities and excessive whitespace
    const cleanText = allText
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();

    // Release memory immediately
    const parsedData = {
      fileName: file.name,
      fileSize: file.size,
      slideCount: slideFiles.length,
      text: cleanText
    };
    
    return parsedData;

  } catch (error) {
    console.error(`Error parsing PPTX ${file.name}:`, error);
    throw new Error(`Failed to read PPTX data for ${file.name}`);
  }
}

/**
 * Parses files in a queue to manage memory.
 * Processes `batchSize` files at a time.
 * @param {File[]} files Array of files to parse
 * @param {Function} onProgress Callback for progress: (parsedCount, totalCount)
 * @returns {Promise<Array>} Array of parsed objects
 */
export async function parsePptxQueue(files, onProgress) {
  const batchSize = 5;
  const results = [];
  
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    
    // Process batch concurrently
    const batchPromises = batch.map(file => parsePptxData(file));
    const batchResults = await Promise.allSettled(batchPromises);
    
    // Collect successful parses
    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        console.error('Batch parsing error:', result.reason);
      }
    }
    
    // Report progress
    if (onProgress) {
      const currentParsed = Math.min(i + batchSize, files.length);
      onProgress(currentParsed, files.length);
    }
    
    // Give UI thread a tiny breather and let GC run
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  return results;
}
