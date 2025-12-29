import { GoogleGenAI } from "@google/genai";
import { PAPER_FUSION_SYSTEM_PROMPT } from '../constants';
import { AnalysisResult, FileData } from '../types';

declare global {
  interface Window {
    env: {
      VITE_GEMINI_API_KEY: string;
    };
  }
}

const getGeminiClient = () => {
  const apiKey = window.env?.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY environment variable is missing in both window.env and import.meta.env.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzePaper = async (files: FileData[]): Promise<AnalysisResult> => {
  const ai = getGeminiClient();

  // Create parts for all files
  const fileParts = files.map(file => {
    const base64Data = file.base64.split(',')[1] || file.base64;
    return {
      inlineData: {
        mimeType: file.type,
        data: base64Data
      }
    };
  });

  try {
    const modelId = 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            text: PAPER_FUSION_SYSTEM_PROMPT
          },
          ...fileParts,
          {
            text: `Analyze the attached scientific paper document(s). 
            If multiple papers are provided, perform a cross-paper synthesis:
            - Build a unified method graph that highlights commonalities and differences.
            - Compare key hyperparameters and architectures.
            - Resolve contradictions or note them in the reasoning section.
            
            Extract the method graph, summary, code, variants, and reasoning as per the JSON schema provided.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        temperature: 0.2, // Low temperature for factual extraction
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini.");
    }

    let cleanedText = text.trim();

    // Robust JSON extraction
    // Sometimes models wrap JSON in markdown blocks ```json ... ```
    // We remove those if present.
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json/, '').replace(/```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```/, '').replace(/```$/, '');
    }
    
    // Find the outer-most braces to handle any preamble/postamble text
    const firstBrace = cleanedText.indexOf('{');
    const lastBrace = cleanedText.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
    }
    
    // Remove any potential non-printable characters causing issues
    cleanedText = cleanedText.replace(/[\u0000-\u001F\u007F-\u009F]/g, (c) => {
        // Keep valid whitespace like newline, tab, return
        return ['\n', '\r', '\t'].includes(c) ? c : ''; 
    });

    try {
      const parsed = JSON.parse(cleanedText) as AnalysisResult;
      return parsed;
    } catch (parseError) {
      console.error("JSON Parse Error", parseError);
      console.log("Raw text that failed parsing:", text);
      throw new Error("Failed to parse analysis result from Gemini. The model output might be malformed.");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const chatWithPaperContext = async (prompt: string, context: AnalysisResult): Promise<string> => {
  const ai = getGeminiClient();

  try {
    const modelId = 'gemini-2.5-flash';
    // We send a condensed context to save tokens and focus the model
    const contextString = JSON.stringify({
      summary: context.summary,
      variants: context.variants,
      code_snippet: context.code.substring(0, 1000) + "..." // Truncate code to avoid huge context
    });

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            text: `You are Research-Buddy Assistant. User is asking about a paper analysis (potentially involving multiple papers).
            
            Current Analysis Context:
            ${contextString}

            User Query: ${prompt}
            
            Provide a technical, concise, and helpful response.`
          }
        ]
      }
    });

    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Error communicating with AI service.";
  }
};

export const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};