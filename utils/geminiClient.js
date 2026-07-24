const { GoogleGenAI } = require('@google/genai');
const { TUTOR_SYSTEM_PROMPT } = require('../prompts/tutorPrompt');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getTutorReply = async (history, hintCount) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite',
    contents: history.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    })),
    config: {
      systemInstruction: `${TUTOR_SYSTEM_PROMPT}\n\nCurrent hint_count: ${hintCount}`
    }
  });
  return response.text;
};

// NEW: reads a problem from an image, returns extracted problem text
const extractProblemFromImage = async (base64Data, mimeType) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite',
    contents: [{
      role: 'user',
      parts: [
        { text: 'Extract the exact DSA problem statement from this image. Return ONLY the problem text, no commentary, no solution, no markdown formatting.' },
        { inlineData: { mimeType, data: base64Data } }
      ]
    }]
  });
  return response.text.trim();
};

module.exports = { getTutorReply, extractProblemFromImage };