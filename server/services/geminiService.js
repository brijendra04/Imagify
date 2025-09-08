import { GoogleGenerativeAI } from '@google/generative-ai';
import { Buffer } from 'buffer';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY missing in .env file');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateImageFromPrompt = async (prompt) => {
  try {
    if (!prompt || typeof prompt !== 'string') {
      throw new AppError('Invalid prompt provided to image generation service', 400);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const generationPrompt = `Generate only the SVG code for the following concept: "${prompt}". Do not include any other text, e// ... existing code ...

// Set a timeout for the Gemini API call
const timeoutPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error('Request timeout')), 25000); // 25 seconds timeout
});

// Race the API call against the timeout
const result = await Promise.race([
  model.generateContent(generationPrompt),
  timeoutPromise
]);
// ... existing code ...xplanations, or markdown formatting. The output must be a single, valid SVG code block.`;
    
    // Set a timeout for the Gemini API call
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 120000); // 120 seconds timeout
    });
    
    // Race the API call against the timeout
    const result = await Promise.race([
      model.generateContent(generationPrompt),
      timeoutPromise
    ]);
    const response = await result.response;
    const svgText = response.text();

    if (!svgText || !svgText.trim().toLowerCase().startsWith('<svg')) {
      logger.error('Gemini did not return valid SVG:', svgText);
      throw new AppError('Failed to generate a valid image representation', 502);
    }

    const imageBase64 = Buffer.from(svgText).toString('base64');
    return `data:image/svg+xml;base64,${imageBase64}`;
  } catch (error) {
    logger.error('Gemini API Error:', error.message, error.stack);
    
    if (error instanceof AppError) {
      throw error;
    }
    
    // Timeout errors
    if (error.message === 'Request timeout') {
      throw new AppError('Image generation service timed out. Please try again later.', 504);
    }
    
    // Network-related errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      throw new AppError('Unable to connect to image generation service. Please try again later.', 503);
    }
    
    // API quota or rate limit errors
    if (error.message && (error.message.includes('quota') || error.message.includes('rate limit'))) {
      throw new AppError('Image generation service quota exceeded. Please try again later.', 429);
    }
    
    // Default error
    throw new AppError(
      'Image generation failed due to an external service error.',
      500
    );
  }
};

export default {
  generateImageFromPrompt,
};
