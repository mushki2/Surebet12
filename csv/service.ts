import { Match } from "../types";

export const parseStandingsCSV = (csvText: string) => {
  const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim() !== "");
  if (lines.length < 2) throw new Error("CSV is empty or missing data rows");

  return lines.slice(1).map((line, idx) => {
    const values = line.split(',').map(v => v.trim());
    if (values.length < 7) throw new Error(`Row ${idx + 2} is missing columns. Expected 7+ columns.`);
    
    return {
      team: values[0],
      rank: parseInt(values[1]) || 0,
      played: parseInt(values[2]) || 0,
      won: parseInt(values[3]) || 0,
      drawn: parseInt(values[4]) || 0,
      lost: parseInt(values[5]) || 0,
      points: parseInt(values[6]) || 0,
      form: (values[7]?.split('') || []) as ('W' | 'D' | 'L')[]
    };
  });
};

export const parseMatchesCSV = (csvText: string): Match[] => {
  const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim() !== "");
  if (lines.length < 2) throw new Error("CSV is empty or missing data rows");

  return lines.slice(1).map((line, index) => {
    const values = line.split(',').map(v => v.trim());
    if (values.length < 10) throw new Error(`Row ${index + 2} is missing columns. Expected 10 columns.`);

    return {
      id: `csv-${index}-${Date.now()}`,
      sport: 'Soccer',
      homeTeam: values[0],
      awayTeam: values[1],
      league: values[2],
      competitionType: 'league',
      startTime: new Date().toISOString(),
      probabilities: {
        home: parseFloat(values[3]) || 0,
        draw: parseFloat(values[4]) || 0,
        away: parseFloat(values[5]) || 0
      },
      predictions: {
        score: values[6],
        over25: parseFloat(values[7]) || 0,
        btts: parseFloat(values[8]) || 0,
        advice: values[9]
      },
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
};