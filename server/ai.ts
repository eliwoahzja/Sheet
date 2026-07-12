import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

function getAi() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Please set your Gemini API Key in the environment variables.");
    }
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

export async function askGemini(prompt: string, base64Image?: string, mimeType?: string): Promise<string> {
  try {
    const client = getAi();
    
    let contents: any = prompt;
    if (base64Image && mimeType) {
      contents = [
        { inlineData: { data: base64Image, mimeType } },
        prompt
      ];
    }

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: "You are an expert web development assistant. You provide correct code snippets and explanations for HTML, CSS, and JavaScript. Keep your answers concise, accurate, and provide code blocks when requested.",
      },
    });
    return response.text || '';
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    let errorMessage = "An unexpected error occurred.";
    
    // Try to parse the API error message if it's a JSON string
    try {
      if (error.message) {
        const parsed = JSON.parse(error.message);
        if (parsed.error && parsed.error.message) {
          errorMessage = parsed.error.message;
        } else {
          errorMessage = error.message;
        }
      }
    } catch {
      errorMessage = error.message || errorMessage;
    }
    
    throw new Error(`AI Assistant Error: ${errorMessage}`);
  }
}

export async function explainCodeStepByStep(code: string, context: string): Promise<string> {
  const prompt = `Please explain the following code step by step. Tell me how to build this from scratch and how each part works.\n\nContext: ${context}\n\nCode:\n${code}`;
  return askGemini(prompt);
}

export async function evaluateUserCode(userCode: string, goal: string): Promise<{ isCorrect: boolean, feedback: string }> {
  const prompt = `You are an AI teacher evaluating a student's code.\n\nThe goal of the exercise is: "${goal}"\n\nThe student's code is:\n${userCode}\n\nEvaluate if the student's code correctly achieves the goal. Respond with a JSON object containing exactly two keys: "isCorrect" (boolean) and "feedback" (a string with a short explanation or hint). Do not include markdown code blocks around the JSON.`;
  try {
    const client = getAi();
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You evaluate code and return JSON exactly.",
        responseMimeType: "application/json"
      },
    });
    const text = response.text || "{}";
    const parsed = JSON.parse(text);
    return {
      isCorrect: !!parsed.isCorrect,
      feedback: parsed.feedback || "Unable to evaluate."
    };
  } catch (err: any) {
    console.error("Evaluation Error:", err);
    return {
      isCorrect: false,
      feedback: "There was an error evaluating your code. Please try again."
    };
  }
}
