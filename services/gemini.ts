
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ExamLevel, WritingAnalysis, WritingPrompt, Word } from "../types";

// Helper to initialize GoogleGenAI with the required configuration
export const getGeminiClient = () => {
  // Always use process.env.API_KEY directly when initializing the client
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Generate high-frequency vocabulary based on exam level
export const generateDailyWords = async (level: ExamLevel): Promise<Word[]> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 5 high-frequency ${level} English vocabulary words with phonetic symbols, Chinese definitions, and one English example sentence for each. Return as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            phonetic: { type: Type.STRING },
            definition: { type: Type.STRING },
            example: { type: Type.STRING }
          },
          required: ["word", "phonetic", "definition", "example"]
        }
      }
    }
  });
  // Safely parse JSON from the response text property
  return JSON.parse(response.text || '[]');
};

// Writing Analysis - Enhanced with Prompt context
export const analyzeWriting = async (text: string, level: ExamLevel, prompt?: WritingPrompt): Promise<WritingAnalysis> => {
  const ai = getGeminiClient();
  const promptContext = prompt ? `题目内容: ${prompt.title}\n写作要求: ${prompt.directions}` : "自由题目";
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `请作为${level}阅卷专家分析以下作文。
    【背景题目】
    ${promptContext}
    
    【待批改作文】
    "${text}"
    
    要求：
    1. 给出100分制评分（参考真实考试标准）。
    2. 使用【中文】列出亮点（strengths）。
    3. 使用【中文】列出缺点（weaknesses），并特别说明是否跑题或字数不足。
    4. 提供一个地道的【英文】润色版本（improvedVersion）。
    5. 使用【中文】提供一段总体评价和提分建议（feedback）。`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvedVersion: { type: Type.STRING },
          feedback: { type: Type.STRING }
        },
        required: ["score", "strengths", "weaknesses", "improvedVersion", "feedback"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

// Text-to-speech for vocabulary pronunciation using gemini-2.5-flash-preview-tts
export const textToSpeech = async (text: string): Promise<string | undefined> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Pronounce clearly: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  // Audio bytes are returned as raw PCM data in base64 format
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};