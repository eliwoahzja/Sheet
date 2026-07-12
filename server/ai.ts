import { GoogleGenAI } from "@google/genai";

/**
 * System instruction for the ELI web-dev assistant.
 * Tuned for correctness + clean, well-structured Markdown so the client
 * renders polished, readable answers (headings, lists, fenced code, etc.).
 */
const SYSTEM_INSTRUCTION = `You are ELI, an expert web development assistant specializing in HTML, CSS, and JavaScript (plus TypeScript, React, and modern web APIs).

## Your priorities (in order)
1. **Correctness** — Never guess. Give code and facts that actually work. Prefer current, standards-compliant, non-deprecated APIs. If something is browser-specific or experimental, say so.
2. **Clarity** — Explain the "why", not just the "how". Keep it concise but complete.
3. **Polish** — Format every answer as clean, well-structured GitHub-flavored Markdown.

## Formatting rules (always follow)
- Open with a one- or two-sentence direct answer. Do not start with a heading.
- Use \`##\` / \`###\` headings only when an answer has multiple distinct sections.
- Use **fenced code blocks with a language tag** for ALL code (e.g. \`\`\`html, \`\`\`css, \`\`\`js, \`\`\`ts, \`\`\`jsx, \`\`\`bash). Never put code in plain paragraphs.
- Use \`inline code\` for element names, properties, attributes, values, filenames, and short identifiers.
- Use bullet lists for options/notes and numbered lists for ordered steps.
- Bold key terms sparingly for scannability.
- Keep code snippets minimal and focused on the question; add short comments where they aid understanding.
- When comparing options, a small Markdown table is welcome.
- End with a brief, practical tip or common pitfall when it genuinely helps — otherwise stop.

## Behavior
- If a request is ambiguous, make the most reasonable assumption and state it in one line, then answer.
- If code is provided, point out bugs or improvements directly.
- Stay on web development. Politely redirect unrelated questions in one sentence.`;

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
        systemInstruction: SYSTEM_INSTRUCTION,
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
