
export interface Source {
  uri: string;
  title: string;
}

export interface Match {
  id: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  competitionType: 'league' | 'cup';
  startTime: string;
  probabilities: {
    home: number;
    draw: number;
    away: number;
  };
  predictions: {
    score: string;
    over25: number;
    btts: number;
    advice: string;
  };
  odds?: {
    h: number;
    d: number;
    a: number;
  };
  h2h?: {
    wins: { home: number; draws: number; away: number };
    recentResults: { score: string; winner: 'home' | 'away' | 'draw'; date: string }[];
    stats: {
      avgGoals: { home: number; away: number };
      possession: { home: number; away: number };
      cleanSheets: { home: number; away: number };
    };
  };
  standings?: {
    team: string;
    rank: number;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    points: number;
    form: ('W' | 'D' | 'L')[];
  }[];
  recentMatches?: {
    home: { opponent: string; score: string; result: 'W' | 'D' | 'L'; date: string }[];
    away: { opponent: string; score: string; result: 'W' | 'D' | 'L'; date: string }[];
  };
}

export interface ArbOpportunity {
  id: string;
  match: string;
  sport: string;
  roi: number;
  outcomes: {
    name: string;
    odds: number;
    bookie: string;
  }[];
  timestamp: string;
}

export interface User {
  uid: string;
  email: string;
  favorites: string[];
}

export interface PoissonPrediction {
  homeWin: number;
  draw: number;
  awayWin: number;
  mostLikelyScore: string;
  over25: number;
  under25: number;
}