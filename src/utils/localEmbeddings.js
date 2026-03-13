import { pipeline, env } from '@xenova/transformers';

// Configure transformers.js to use CDN for models and not look for local files
env.allowLocalModels = false;
env.useBrowserCache = true;

let embeddingPipeline = null;

/**
 * Initializes the embedding pipeline if it doesn't exist.
 */
async function getPipeline() {
  if (!embeddingPipeline) {
    // all-MiniLM-L6-v2 is small (~23MB) and fast
    embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embeddingPipeline;
}

/**
 * Generates an embedding for a piece of text locally.
 * @param {string} text 
 * @returns {Promise<number[]>}
 */
export async function getLocalEmbedding(text) {
  try {
    const extractor = await getPipeline();
    const truncatedText = text.slice(0, 1000); // Token limits are smaller for this model
    
    // Mean pooling is usually needed for feature extraction
    const output = await extractor(truncatedText, { pooling: 'mean', normalize: true });
    
    // Convert to regular array
    return Array.from(output.data);
  } catch (error) {
    console.error('Error in local embedding:', error);
    throw new Error('Failed to generate local embeddings. Please check your internet connection for the model download.');
  }
}
