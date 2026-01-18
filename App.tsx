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
  { id: 'pl-1', sport: 'Soccer', homeTeam: 'Arsenal', awayTeam: 'Man City', league: 'Premier League', competitionType: 'league', startTime: new Date().toISOString(), probabilities: { home: 35, draw: 25, away: 40 }, predictions: { score: '1-2', over25: 65, btts: 60, advice: 'Crucial title clash.' }, standings: generateMockStandings('Premier League', LEAGUES.PREMIER_LEAGUE) },
  { id: 'pl-2', sport: 'Soccer', homeTeam: 'Liverpool', awayTeam: 'Chelsea', league: 'Premier League', competitionType: 'league', startTime: new Date().toISOString(), probabilities: { home: 55, draw: 20, away: 25 }, predictions: { score: '3-1', over25: 75, btts: 70, advice: 'Anfield dominance expected.' }, standings: generateMockStandings('Premier League', LEAGUES.PREMIER_LEAGUE) },
  { id: 'll-1', sport: 'Soccer', homeTeam: 'Real Madrid', awayTeam: 'Barcelona', league: 'La Liga', competitionType: 'league', startTime: new Date().toISOString(), probabilities: { home: 48, draw: 24, away: 28 }, predictions: { score: '2-1', over25: 65, btts: 70, advice: 'El Clasico. Real favored slightly.' }, standings: generateMockStandings('La Liga', LEAGUES.LA_LIGA) },
  { id: 'sa-1', sport: 'Soccer', homeTeam: 'Inter', awayTeam: 'Juventus', league: 'Serie A', competitionType: 'league', startTime: new Date().toISOString(), probabilities: { home: 50, draw: 30, away: 20 }, predictions: { score: '2-0', over25: 45, btts: 40, advice: 'Derby d\'Italia favors Inter.' }, standings: generateMockStandings('Serie A', LEAGUES.SERIE_A) },
  { id: 'bl-1', sport: 'Soccer', homeTeam: 'Bayern Munich', awayTeam: 'Dortmund', league: 'Bundesliga', competitionType: 'league', startTime: new Date().toISOString(), probabilities: { home: 65, draw: 15, away: 20 }, predictions: { score: '4-2', over25: 90, btts: 85, advice: 'Der Klassiker usually high scoring.' }, standings: generateMockStandings('Bundesliga', LEAGUES.BUNDESLIGA) },
  { id: 'tur-1', sport: 'Soccer', homeTeam: 'Galatasaray', awayTeam: 'Fenerbahce', league: 'Süper Lig', competitionType: 'league', startTime: new Date().toISOString(), probabilities: { home: 40, draw: 20, away: 40 }, predictions: { score: '2-2', over25: 80, btts: 85, advice: 'Intercontinental Derby. Volatile.' }, standings: generateMockStandings('Süper Lig', LEAGUES.SUPER_LIG) },
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
          <div className="space-y-12 animate-fadeIn">
            <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/5 pb-10 gap-6">
              <div>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Prediction Hub</h1>
                <p className="text-sm font-medium text-slate-500 mt-2">Market intelligence and advanced Poisson modeling.</p>
              </div>
              <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5 backdrop-blur-md">
                <button 
                  onClick={() => setPredictionSubTab('feed')}
                  className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${predictionSubTab === 'feed' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-500 hover:text-white'}`}
                >
                  Market Feed
                </button>
                <button 
                  onClick={() => setPredictionSubTab('lab')}
                  className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${predictionSubTab === 'lab' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-500 hover:text-white'}`}
                >
                  Poisson Lab
                </button>
              </div>
            </div>

            {predictionSubTab === 'feed' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {matches.map((m, i) => (
                  <div key={m.id} className="animate-slideUp" style={{ animationDelay: `${i * 0.05}s` }}>
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
    <div className="min-h-screen flex flex-col bg-[#020617]">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-600/5 blur-[120px] pointer-events-none rounded-full"></div>
        {renderContent()}
      </main>
      <footer className="bg-[#020617] border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center mb-8 justify-center">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-xl">
              <span className="text-white font-black text-xl italic">S</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase">SureBets<span className="text-blue-500">Odds</span></span>
          </div>
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.5em] opacity-60">© {new Date().getFullYear()} SUREBETS ODDS PLATFORM · PROVABLY FAIR</p>
        </div>
      </footer>
    </div>
  );
};

export default App;