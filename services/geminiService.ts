
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeContract = async (text: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following legal contract text. Provide a summary, identify high risks, and suggest negotiation points.\n\nCONTRACT TEXT:\n${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: {
            type: Type.STRING,
            description: "A 2-sentence summary of the contract.",
          },
          risks: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of 3 high risks.",
          },
          negotiations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of 3 negotiation suggestions.",
          },
        },
        required: ["summary", "risks", "negotiations"]
      },
    },
  });

  try {
    return JSON.parse(response.text.trim()) as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse analysis result", e);
    throw new Error("Invalid response from analysis engine.");
  }
};
