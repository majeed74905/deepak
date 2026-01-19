import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RuleAnalysis } from "../types";
import { OFFICIAL_RULEBOOK_TEXT } from "./rulebookData";

// Define the expected JSON output schema based on the new 5-step process
const ruleAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    ruleName: {
      type: Type.STRING,
      description: "A short, 2-5 word headline for the primary rule involved (e.g., 'Personal Foul – Blocking', 'Travelling Violation').",
    },
    summary: {
      type: Type.STRING,
      description: "Step 1: A clear summary of the user's described situation in 2-3 sentences.",
    },
    relevantRules: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Step 2: A list of applicable rules and articles from the rule book relevant to the situation.",
    },
    decision: {
      type: Type.STRING,
      description: "Step 3: The clear, definitive referee decision (e.g., 'Foul on defender; 2 free throws for offense').",
    },
    reasoning: {
      type: Type.STRING,
      description: "Step 4: A detailed explanation referencing the exact rule language and matching it to the user's situation.",
    },
    citations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Step 5: Specific citations including Article number and section (e.g., '[Article 33.2 - Principle of Verticality]').",
    }
  },
  required: ["ruleName", "summary", "relevantRules", "decision", "reasoning", "citations"],
};

export const analyzeBasketballSituation = async (description: string): Promise<RuleAnalysis> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    You are an Expert Decision-Making Advisor for Basketball Rules.
    Your role is to analyze user situations, apply relevant rules from the provided Official Basketball Rules 2024, and deliver clear, justified decisions.
    
    SOURCE MATERIAL:
    ${OFFICIAL_RULEBOOK_TEXT}

    TASK:
    When the user describes a situation, you must strictly follow this process:
    1. Summarize What Happened: Clearly state the facts of the situation.
    2. Identify Applicable Rules: Identify all rules and articles from the source material relevant to the circumstances.
    3. State the Decision: Provide a clear, direct decision based on the applicable rules.
    4. Explain the Reasoning: Provide a detailed explanation referencing the exact rule language. Show how the situation matches the conditions in the rules.
    5. Cite Sources: For each rule applied, include the exact article number.

    CONSTRAINTS:
    - Ground every recommendation in the provided rule book.
    - Do not invent rules.
    - If the situation is ambiguous, state what information is missing or choose the most standard interpretation while acknowledging the ambiguity.
    - Be authoritative, neutral, and precise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: description,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: ruleAnalysisSchema,
        temperature: 0.1, // Very low temperature for strict adherence to rules
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response from AI.");
    }

    const data = JSON.parse(jsonText) as RuleAnalysis;
    return data;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze the play. Please try again.");
  }
};