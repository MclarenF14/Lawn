import { Groq } from 'groq-sdk';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

async function fileToBase64(filePath) {
  const readFile = promisify(fs.readFile);
  const fileBuffer = await readFile(filePath);
  return fileBuffer.toString('base64');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    if (!process.env.NEXT_PUBLIC_GROQ_API_KEY) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    // Extract base64 from data URL if present
    let base64Image = image;
    if (image.startsWith('data:')) {
      base64Image = image.split(',')[1];
    }

    // Create message with vision capability
    const message = await groq.messages.create({
      model: 'llava-1.5-7b-4096-preview',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: `You are a professional lawn care estimator. Analyze this lawn photo and provide:
1. Estimated lawn size (in square feet)
2. Lawn condition (excellent/good/fair/poor)
3. Complexity level (low/medium/high) considering factors like slopes, obstacles, etc.
4. Estimated mowing cost (for a single cut, assume $0.05 per square foot as base rate)

Respond ONLY in this exact JSON format:
{
  "lawnSize": "X square feet",
  "condition": "excellent/good/fair/poor",
  "complexity": "low/medium/high",
  "estimatedPrice": "X",
  "reasoning": "Brief explanation of the estimate"
}`,
            },
          ],
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    // Parse JSON response
    let estimate;
    try {
      estimate = JSON.parse(responseText);
    } catch (e) {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        estimate = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse estimate response');
      }
    }

    return res.status(200).json(estimate);
  } catch (error) {
    console.error('Estimate error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to process image' 
    });
  }
}
