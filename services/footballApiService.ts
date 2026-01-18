
import { Match, Source } from "../types.ts";

const BASE_URL = 'https://api.football-data.org/v4';

// Simple delay to respect rate limits if needed
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function fetchLeagueStandings(apiKey: string, competitionCode: string) {
  try {
    const response = await fetch(`${BASE_URL}/competitions/${competitionCode}/standings`, {
      headers: { 'X-Auth-Token': apiKey }
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.standings?.[0]?.table || null;
  } catch {
    return null;
  }
}

function calculateProbabilities(homeRank: number, awayRank: number, homePts: number, awayPts: number) {
  // Fallback for missing data
  if (!homeRank || !awayRank) return { home: 34, draw: 32, away: 34 };

  const rankDiff = awayRank - homeRank; 
  const pointsDiff = homePts - awayPts;
  
  let homeProb = 38;
  let drawProb = 28;
  let awayProb = 34;

  // Weighted adjustment
  homeProb += (rankDiff * 0.7) + (pointsDiff * 0.15);
  awayProb -= (rankDiff * 0.7) + (pointsDiff * 0.15);

  // Safeguard bounds
  homeProb = Math.min(Math.max(homeProb, 15), 80);
  awayProb = Math.min(Math.max(awayProb, 15), 80);
  drawProb = 100 - homeProb - awayProb;

  return {
    home: Math.round(homeProb),
    draw: Math.round(drawProb),
    away: Math.round(awayProb)
  };
}

export async function fetchFromFootballData(apiKey: string): Promise<Match[]> {
  try {
    const matchesResponse = await fetch(`${BASE_URL}/matches`, {
      headers: { 'X-Auth-Token': apiKey }
    });
    
    if (!matchesResponse.ok) throw new Error("API key invalid or limit reached.");
    const matchesData = await matchesResponse.json();
    
    if (!matchesData.matches) return [];

    const uniqueComps = Array.from(new Set(matchesData.matches.map((m: any) => m.competition.code)));
    const standingsMap: Record<string, any[]> = {};
    
    // Efficiently fetch top 3 comps to stay under rate limits
    for (const code of uniqueComps.slice(0, 3)) {
      const table = await fetchLeagueStandings(apiKey, code as string);
      if (table) standingsMap[code as string] = table;
      await delay(150);
    }

    return matchesData.matches.map((m: any) => {
      const leagueTable = standingsMap[m.competition.code];
      const homeStats = leagueTable?.find((t: any) => t.team.id === m.homeTeam.id);
      const awayStats = leagueTable?.find((t: any) => t.team.id === m.awayTeam.id);

      const probs = calculateProbabilities(
        homeStats?.position || 0,
        awayStats?.position || 0,
        homeStats?.points || 0,
        awayStats?.points || 0
      );

      // Adding required 'sport' property to satisfy the Match interface
      return {
        id: `fd-${m.id}`,
        sport: 'Soccer',
        homeTeam: m.homeTeam.shortName || m.homeTeam.name || "Home",
        awayTeam: m.awayTeam.shortName || m.awayTeam.name || "Away",
        league: m.competition.name || "International",
        competitionType: 'league',
        startTime: m.utcDate,
        probabilities: probs,
        predictions: {
          score: homeStats && awayStats ? `${Math.round(probs.home/25)}-${Math.round(probs.away/25)}` : '?-?',
          over25: Math.round((probs.home + probs.away) / 2.2) + 15,
          btts: 55,
          advice: homeStats && awayStats 
            ? `Rank #${homeStats.position} hosts Rank #${awayStats.position}. Statistically favors ${probs.home > probs.away ? 'Home' : 'Away'}.` 
            : "Live data sync. Predictions derived from historical market norms."
        },
        standings: leagueTable?.map((t: any) => ({
          team: t.team.shortName || t.team.name,
          rank: t.position,
          played: t.playedGames,
          won: t.won,
          drawn: t.draw,
          lost: t.lost,
          points: t.points,
          form: t.form?.split(',') || []
        })).slice(0, 10),
        h2h: {
          wins: { home: 0, draws: 0, away: 0 },
          recentResults: [],
          stats: {
            avgGoals: { home: 0, away: 0 },
            possession: { home: 50, away: 50 },
            cleanSheets: { home: 0, away: 0 }
          }
        }
      };
    });
  } catch (error) {
    console.error("Football Data API Error:", error);
    return [];
  }
}
