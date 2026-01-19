import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function fetchLeagueData() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Provide 5 current or upcoming major soccer matches with probabilities (home, draw, away),
    predicted score, over 2.5 goals percentage, BTTS percentage, and a short advice.
    Format as JSON: { "matches": [{ "id": "gen-1", "sport": "Soccer", "homeTeam": "...", "awayTeam": "...", "league": "...", "probabilities": {...}, "predictions": {...} }], "sources": [{"uri": "...", "title": "..."}] }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching from Gemini:", error);
    return { matches: [], sources: [] };
  }
}
