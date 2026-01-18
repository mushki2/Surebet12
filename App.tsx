
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Arbitrage from './pages/Arbitrage';
import CustomPredictions from './pages/CustomPredictions';
import MatchDetails from './pages/MatchDetails';
import AdminPanel from './pages/AdminPanel';
import Casino from './pages/Casino';
import MatchCard from './components/MatchCard';
import { Match, Source } from './types';
import { fetchLeagueData } from './services/geminiService';
import { fetchFromFootballData } from './services/footballApiService';

const generateMockStandings = (league: string, teams: string[]) => {
  return teams.map((team, i) => ({
    team,
    rank: i + 1,
    played: 24,
    won: Math.max(0, 18 - i),
    drawn: Math.floor(Math.random() * 5),
    lost: Math.floor(Math.random() * 5),
    points: Math.max(0, 60 - (i * 3)),
    form: (['W', 'W', 'D', 'L', 'W'] as ('W' | 'D' | 'L')[]).slice().sort(() => Math.random() - 0.5)
  }));
};

const LEAGUES = {
  PREMIER_LEAGUE: ['Liverpool', 'Man City', 'Arsenal', 'Aston Villa', 'Tottenham', 'Man Utd', 'West Ham', 'Newcastle', 'Brighton', 'Chelsea', 'Wolves', 'Fulham', 'Bournemouth', 'Everton', 'Brentford', 'Nottingham Forest', 'Luton', 'Burnley', 'Sheffield Utd', 'Crystal Palace'],
  LA_LIGA: ['Real Madrid', 'Girona', 'Barcelona', 'Atletico Madrid', 'Athletic Club', 'Real Sociedad', 'Real Betis', 'Valencia', 'Las Palmas', 'Getafe', 'Osasuna', 'Alaves', 'Villarreal', 'Rayo Vallecano', 'Sevilla', 'Mallorca', 'Celta Vigo', 'Cadiz', 'Granada', 'Almeria'],
  SERIE_A: ['Inter', 'Juventus', 'Milan', 'Atalanta', 'Bologna', 'Roma', 'Fiorentina', 'Lazio', 'Napoli', 'Torino', 'Monza', 'Genoa', 'Lecce', 'Frosinone', 'Udinese', 'Empoli', 'Sassuolo', 'Verona', 'Cagliari', 'Salernitana'],
  BUNDESLIGA: ['Bayer Leverkusen', 'Bayern Munich', 'Stuttgart', 'Dortmund', 'RB Leipzig', 'Frankfurt', 'Hoffenheim', 'Freiburg', 'Heidenheim', 'Bremen', 'Augsburg', 'Wolfsburg', 'Gladbach', 'Bochum', 'Union Berlin', 'Mainz', 'Koln', 'Darmstadt'],
  LIGUE_1: ['PSG', 'Nice', 'Brest', 'Monaco', 'Lille', 'Lens', 'Rennes', 'Marseille', 'Reims', 'Lyon', 'Lorient', 'Strasbourg', 'Toulouse', 'Montpellier', 'Le Havre', 'Nantes', 'Metz', 'Clermont'],
  SUPER_LIG: ['Galatasaray', 'Fenerbahce', 'Besiktas', 'Trabzonspor', 'Kasimpasa', 'Rizespor', 'Alanyaspor', 'Basaksehir', 'Antalyaspor', 'Sivasspor', 'Adana Demirspor', 'Samsunspor', 'Kayserispor', 'Hatayspor', 'Ankaragucu', 'Konyaspor', 'Gaziantep', 'Karagumruk', 'Pendikspor', 'Istanbulspor'],
  NFL: ['Chiefs', '49ers', 'Ravens', 'Bills', 'Lions', 'Eagles', 'Bengals', 'Packers', 'Cowboys', 'Dolphins', 'Texans', 'Browns', 'Steelers', 'Bears', 'Jets'],
  NBA: ['Lakers', 'Celtics', 'Warriors', 'Nuggets', 'Suns', 'Bucks', 'Sixers', 'Knicks', 'Mavericks', 'Clippers', 'Heat', 'Timberwolves', 'Thunder', 'Kings', 'Pacers'],
  ATP: ['Djokovic', 'Alcaraz', 'Sinner', 'Medvedev', 'Zverev', 'Rune', 'Ruud', 'Fritz', 'Tsitsipas', 'Rublev', 'Hurkacz', 'Dimitrov', 'de Minaur', 'Shelton', 'Tiafoe'],
  CRICKET: ['India', 'Australia', 'England', 'South Africa', 'Pakistan', 'New Zealand', 'West Indies', 'Sri Lanka', 'Bangladesh', 'Afghanistan', 'Netherlands', 'USA'],
  NHL: ['Oilers', 'Panthers', 'Rangers', 'Islanders', 'Maple Leafs', 'Bruins', 'Golden Knights', 'Kings', 'Stars', 'Avalanche', 'Capitals', 'Hurricanes', 'Red Wings', 'Lightning', 'Canucks']
};

const DEMO_MATCHES: Match[] = [
  // Existing Soccer Matches
  { id: 'pl-1', sport: 'Soccer', homeTeam: 'Arsenal', awayTeam: 'Man City', league: 'Premier League', competitionType: 'league', startTime: new Date().toISOString(), probabilities: { home: 35, draw: 25, away: 40 }, predictions: { score: '1-2', over25: 65, btts: 60, advice: 'Crucial title clash.' }, standings: generateMockStandings('Premier League', LEAGUES.PREMIER_LEAGUE) },
  { id: 'pl-2', sport: 'Soccer', homeTeam: 'Liverpool', awayTeam: 'Chelsea', league: 'Premier League', competitionType: 'league', startTime: new Date().toISOString(), probabilities: { home: 55, draw: 20, away: 25 }, predictions: { score: '3-1', over25: 75, btts: 70, advice: 'Anfield dominance expected.' }, standings: generateMockStandings('Premier League', LEAGUES.PREMIER_LEAGUE) },
  { id: 'll-1', sport: 'Soccer', homeTeam: 'Real Madrid', awayTeam: 'Barcelona', league: 'La Liga', competitionType: 'league', startTime: new Date().toISOString(), probabilities: { home: 48, draw: 24, away: 28 }, predictions: { score: '2-1', over25: 65, btts: 70, advice: 'El Clasico. Real favored slightly.' }, standings: generateMockStandings('La Liga', LEAGUES.LA_LIGA) },
  { id: 'sa-1', sport: 'Soccer', homeTeam: 'Inter', awayTeam: 'Juventus', league: 'Serie A', competitionType: 'league', startTime: new Date().toISOString(), probabilities: { home: 50, draw: 30, away: 20 }, predictions: { score: '2-0', over25: 45, btts: 40, advice: 'Derby d\'Italia favors Inter.' }, standings: generateMockStandings('Serie A', LEAGUES.SERIE_A) },
  { id: 'bl-1', sport: 'Soccer', homeTeam: 'Bayern Munich', awayTeam: 'Dortmund', league: 'Bundesliga', competitionType: 'league', startTime: new Date().toISOString(), probabilities: { home: 65, draw: 15, away: 20 }, predictions: { score: '4-2', over25: 90, btts: 85, advice: 'Der Klassiker usually high scoring.' }, standings: generateMockStandings('Bundesliga', LEAGUES.BUNDESLIGA) },
  { id: 'tur-1', sport: 'Soccer', homeTeam: 'Galatasaray', awayTeam: 'Fenerbahce', league: 'Süper Lig', competitionType: 'league', startTime: new Date().toISOString(), probabilities: { home: 40, draw: 20, away: 40 }, predictions: { score: '2-2', over25: 80, btts: 85, advice: 'Intercontinental Derby. Volatile.' }, standings: generateMockStandings('Süper Lig', LEAGUES.SUPER_LIG) },

  // NFL Matches (10)
  ...[
    ['Chiefs', '49ers'], ['Ravens', 'Bengals'], ['Lions', 'Packers'], ['Eagles', 'Cowboys'], ['Bills', 'Jets'],
    ['Dolphins', 'Patriots'], ['Texans', 'Colts'], ['Vikings', 'Bears'], ['Bucs', 'Falcons'], ['Seahawks', 'Rams']
  ].map((teams, i) => ({
    id: `nfl-${i}`,
    sport: 'American Football',
    homeTeam: teams[0],
    awayTeam: teams[1],
    league: 'NFL',
    competitionType: 'league' as const,
    startTime: new Date(Date.now() + i * 3600000).toISOString(),
    probabilities: { home: 55, draw: 5, away: 40 },
    predictions: { score: '27-21', over25: 62, btts: 0, advice: 'Explosive offense vs Elite defense.' },
    standings: generateMockStandings('NFL', LEAGUES.NFL)
  })),

  // NBA Matches (10)
  ...[
    ['Lakers', 'Celtics'], ['Warriors', 'Nuggets'], ['Suns', 'Mavericks'], ['Bucks', 'Sixers'], ['Knicks', 'Heat'],
    ['Clippers', 'Kings'], ['Thunder', 'Wolves'], ['Pacers', 'Hawks'], ['Pelicans', 'Grizzlies'], ['Cavs', 'Magic']
  ].map((teams, i) => ({
    id: `nba-${i}`,
    sport: 'Basketball',
    homeTeam: teams[0],
    awayTeam: teams[1],
    league: 'NBA',
    competitionType: 'league' as const,
    startTime: new Date(Date.now() + i * 2400000).toISOString(),
    probabilities: { home: 52, draw: 2, away: 46 },
    predictions: { score: '118-112', over25: 88, btts: 0, advice: 'High tempo transition play expected.' },
    standings: generateMockStandings('NBA', LEAGUES.NBA)
  })),

  // ATP Tennis Matches (10)
  ...[
    ['Djokovic', 'Alcaraz'], ['Sinner', 'Medvedev'], ['Zverev', 'Rune'], ['Fritz', 'Ruud'], ['Tsitsipas', 'de Minaur'],
    ['Hurkacz', 'Dimitrov'], ['Shelton', 'Tiafoe'], ['Rublev', 'Khachanov'], ['Monfils', 'Murray'], ['Berrettini', 'FAA']
  ].map((teams, i) => ({
    id: `atp-${i}`,
    sport: 'Tennis',
    homeTeam: teams[0],
    awayTeam: teams[1],
    league: 'ATP Tour',
    competitionType: 'cup' as const,
    startTime: new Date(Date.now() + i * 1800000).toISOString(),
    probabilities: { home: 60, draw: 0, away: 40 },
    predictions: { score: '2-1 Sets', over25: 55, btts: 0, advice: 'Server dominance on hard court.' },
    standings: generateMockStandings('ATP', LEAGUES.ATP)
  })),

  // Cricket Matches (10)
  ...[
    ['India', 'Australia'], ['England', 'South Africa'], ['Pakistan', 'New Zealand'], ['West Indies', 'Sri Lanka'], ['Bangladesh', 'Afghanistan'],
    ['Ireland', 'Zimbabwe'], ['USA', 'Canada'], ['Nepal', 'UAE'], ['Scotland', 'Netherlands'], ['India', 'Pakistan']
  ].map((teams, i) => ({
    id: `cricket-${i}`,
    sport: 'Cricket',
    homeTeam: teams[0],
    awayTeam: teams[1],
    league: 'Cricket International',
    competitionType: 'cup' as const,
    startTime: new Date(Date.now() + i * 7200000).toISOString(),
    probabilities: { home: 45, draw: 5, away: 50 },
    predictions: { score: '185-182', over25: 70, btts: 0, advice: 'Batting first advantage under lights.' },
    standings: generateMockStandings('Cricket', LEAGUES.CRICKET)
  })),

  // NHL Matches (10)
  ...[
    ['Oilers', 'Flames'], ['Rangers', 'Islanders'], ['Maple Leafs', 'Canadiens'], ['Bruins', 'Panthers'], ['Knights', 'Kings'],
    ['Avalanche', 'Stars'], ['Canes', 'Capitals'], ['Bolts', 'Wings'], ['Canucks', 'Kraken'], ['Hawks', 'Blues']
  ].map((teams, i) => ({
    id: `nhl-${i}`,
    sport: 'Hockey',
    homeTeam: teams[0],
    awayTeam: teams[1],
    league: 'NHL',
    competitionType: 'league' as const,
    startTime: new Date(Date.now() + i * 3000000).toISOString(),
    probabilities: { home: 48, draw: 10, away: 42 },
    predictions: { score: '4-3', over25: 65, btts: 0, advice: 'Power play efficiency will be key.' },
    standings: generateMockStandings('NHL', LEAGUES.NHL)
  }))
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [predictionSubTab, setPredictionSubTab] = useState<'feed' | 'lab'>('feed');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [matches, setMatches] = useState<Match[]>(DEMO_MATCHES);
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<'demo' | 'csv' | 'live' | 'api'>('demo');

  const loadDataFromStorage = () => {
    const customMatchesRaw = localStorage.getItem('custom_matches');
    if (customMatchesRaw) {
      setMatches(JSON.parse(customMatchesRaw));
      setDataSource('csv');
    } else {
      setMatches(DEMO_MATCHES);
      setDataSource('demo');
    }
  };

  const handleSyncLive = async () => {
    setLoading(true);
    const engine = localStorage.getItem('data_engine') || 'gemini';
    const apiKey = localStorage.getItem('external_api_key');

    try {
      if (engine === 'api' && apiKey) {
        const apiMatches = await fetchFromFootballData(apiKey);
        if (apiMatches.length > 0) {
          setMatches(apiMatches);
          setSources([{ uri: 'https://football-data.org', title: 'Football-Data.org API' }]);
          setDataSource('api');
        }
      } else {
        const { matches: realMatches, sources: realSources } = await fetchLeagueData();
        if (realMatches && realMatches.length > 0) {
          setMatches(prev => [...prev.filter(m => !m.id.startsWith('gen-')), ...realMatches]);
          setSources(realSources);
          setDataSource('live');
        }
      }
    } catch (error) {
      console.warn("Live sync failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDataFromStorage();
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match);
    setActiveTab('match-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard matches={matches} sources={sources} favorites={favorites} toggleFavorite={toggleFavorite} onSelectMatch={handleSelectMatch} onSyncLive={handleSyncLive} isLoadingLive={loading} dataSource={dataSource} />;
      case 'predictions':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-gray-800 pb-6">
              <div>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Prediction Hub</h1>
                <p className="text-gray-500 font-medium text-xs mt-1">Market intelligence and advanced Poisson modeling.</p>
              </div>
              <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-800">
                <button 
                  onClick={() => setPredictionSubTab('feed')}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${predictionSubTab === 'feed' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-white'}`}
                >
                  Market Feed
                </button>
                <button 
                  onClick={() => setPredictionSubTab('lab')}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${predictionSubTab === 'lab' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-white'}`}
                >
                  Poisson Lab
                </button>
              </div>
            </div>

            {predictionSubTab === 'feed' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {matches.map(m => (
                  <div key={m.id} className="animate-fadeIn">
                    <MatchCard match={m} isFavorite={favorites.includes(m.id)} onToggleFavorite={toggleFavorite} onSelect={handleSelectMatch} />
                  </div>
                ))}
              </div>
            ) : (
              <CustomPredictions />
            )}
          </div>
        );
      case 'arbitrage': return <Arbitrage />;
      case 'casino': return <Casino />;
      case 'admin': return <AdminPanel onDataUpdate={loadDataFromStorage} />;
      case 'match-details':
        return selectedMatch ? <MatchDetails match={selectedMatch} onBack={() => setActiveTab('home')} /> : null;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {renderContent()}
      </main>
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center mb-6 justify-center">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-black text-lg italic">S</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase">SureBets<span className="text-blue-400">Odds</span></span>
          </div>
          <p className="text-gray-500 text-[9px] uppercase font-black tracking-[0.4em]">© {new Date().getFullYear()} SUREBETS ODDS PLATFORM.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
