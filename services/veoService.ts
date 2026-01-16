
import { GoogleGenAI } from "@google/genai";

export const generateVeoVideo = async (
  imageBase64: string, 
  onProgress: (status: string) => void
): Promise<string> => {
  // Check for API key selection first if using high-quality models
  if (!(window as any).aistudio?.hasSelectedApiKey()) {
    onProgress("Prompting for API Key...");
    await (window as any).aistudio?.openSelectKey();
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const cleanBase64 = imageBase64.split(',')[1];
  
  onProgress("Initializing Veo generation...");
  
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: 'A professional legal office environment with dust motes dancing in the light, transitioning to a close-up of a signed contract.',
      image: {
        imageBytes: cleanBase64,
        mimeType: 'image/png',
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    onProgress("Generation in progress (Phase 1)...");
    
    let attempts = 0;
    while (!operation.done && attempts < 120) { // Timeout after ~10 mins
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
      attempts++;
      if (attempts % 4 === 0) {
        onProgress(`Enhancing frames... (${attempts * 5}s)`);
      }
    }

    if (!operation.done) {
      throw new Error("Video generation timed out. Please try again.");
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      throw new Error("No video URL received from model.");
    }

    onProgress("Downloading video...");
    const fetchResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await fetchResponse.blob();
    return URL.createObjectURL(blob);
    
  } catch (error: any) {
    console.error("Veo Error:", error);
    if (error.message?.includes("Requested entity was not found")) {
      await (window as any).aistudio?.openSelectKey();
      throw new Error("Please select a valid paid project API key.");
    }
    throw error;
  }
};
