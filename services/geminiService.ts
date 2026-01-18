
import { GoogleGenAI, Type } from "@google/genai";
import { Match, Source } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchLeagueData(): Promise<{ matches: Match[], sources: Source[] }> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search Wikipedia and official sports statistics sources to get current 2024/2025 season data for:
      1. Top 5 European Soccer Leagues (PL, La Liga, Serie A, Bundesliga, Ligue 1)
      2. NFL (American Football)
      3. NBA (Basketball)
      4. ATP Tennis
      5. International Cricket
      6. NHL (Hockey)

      Provide a JSON array of matches. Each match must include:
      - sport (e.g., 'Soccer', 'Basketball', etc.)
      - homeTeam, awayTeam, league, competitionType ('league' or 'cup')
      - probabilities (estimated based on current form)
      - predictions (score, overLine%, btts%, advice)
      - standings for the teams involved
      - recent results (form)`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  sport: { type: Type.STRING },
                  homeTeam: { type: Type.STRING },
                  awayTeam: { type: Type.STRING },
                  league: { type: Type.STRING },
                  competitionType: { type: Type.STRING },
                  startTime: { type: Type.STRING },
                  probabilities: {
                    type: Type.OBJECT,
                    properties: {
                      home: { type: Type.NUMBER },
                      draw: { type: Type.NUMBER },
                      away: { type: Type.NUMBER }
                    },
                    required: ["home", "draw", "away"]
                  },
                  predictions: {
                    type: Type.OBJECT,
                    properties: {
                      score: { type: Type.STRING },
                      over25: { type: Type.NUMBER },
                      btts: { type: Type.NUMBER },
                      advice: { type: Type.STRING }
                    },
                    required: ["score", "over25", "btts", "advice"]
                  }
                },
                required: ["sport", "homeTeam", "awayTeam", "probabilities", "predictions"]
              }
            }
          }
        }
      }
    });

    let data;
    try {
      const text = response.text?.trim() || '{"matches": []}';
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", parseError);
      data = { matches: [] };
    }
    
    const sanitizedMatches = (data.matches || []).map((m: any) => ({
      ...m,
      id: m.id || `gen-${Math.random().toString(36).substr(2, 9)}`,
      sport: m.sport || 'Soccer',
      probabilities: m.probabilities || { home: 33, draw: 34, away: 33 },
      predictions: m.predictions || { score: '?-?', over25: 50, btts: 50, advice: 'Data extraction pending.' }
    }));

    const sources: Source[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            uri: chunk.web.uri,
            title: chunk.web.title || chunk.web.uri
          });
        }
      });
    }

    return { matches: sanitizedMatches, sources };
  } catch (error) {
    console.error("Error fetching league data:", error);
    return { matches: [], sources: [] };
  }
}

export async function getBettingAdvice(match: Match): Promise<string> {
  try {
    const probs = match.probabilities || { home: 0, draw: 0, away: 0 };
    const preds = match.predictions || { score: 'N/A', over25: 0 };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this ${match.sport} match and provide a short, expert betting recommendation (max 50 words). 
      Match: ${match.homeTeam} vs ${match.awayTeam} (${match.league}).
      Probabilities: 1: ${probs.home}%, X: ${probs.draw}%, 2: ${probs.away}%.
      Predicted Score: ${preds.score}. Outcome Confidence: ${preds.over25}%.`
    });
    return response.text || "No advice available at this moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Expert analysis unavailable.";
  }
}
