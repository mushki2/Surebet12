import React, { useState, useMemo } from 'react';
import MatchCard from '../components/MatchCard';
import { Match, Source } from '../types';

interface DashboardProps {
  matches: Match[];
  sources: Source[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  onSelectMatch: (match: Match) => void;
  onSyncLive: () => void;
  isLoadingLive: boolean;
  dataSource: 'demo' | 'csv' | 'live' | 'api';
}

const Dashboard: React.FC<DashboardProps> = ({ 
  matches, sources, favorites, toggleFavorite, onSelectMatch, onSyncLive, isLoadingLive, dataSource
}) => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('All');

  const filteredMatches = useMemo(() => {
    let result = [...matches];
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(m => m.homeTeam.toLowerCase().includes(lowerSearch) || m.awayTeam.toLowerCase().includes(lowerSearch));
    }
    if (sportFilter !== 'All') result = result.filter(m => m.sport === sportFilter);
    return result;
  }, [matches, searchTerm, sportFilter]);

  const displayedMatches = filteredMatches.slice(0, visibleCount);

  return (
    <div className="space-y-10 animate-fadeIn max-w-7xl mx-auto">
      <section className="glass-panel p-8 rounded-[2rem] relative overflow-hidden border border-white/5 shadow-2xl">
        <div className="shimmer absolute inset-0 pointer-events-none opacity-20"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="mb-2 uppercase text-[10px] font-black text-blue-500 tracking-[0.4em] flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></span>
            {dataSource} ENGINE ACTIVE
          </div>
          <h1 className="text-4xl font-black mb-3 tracking-tighter uppercase text-white">Sports Market Analytics</h1>
          <p className="text-slate-400 text-sm mb-8 font-medium leading-relaxed">Predictive modeling for global sport markets using Gemini-3 native reasoning and real-time exchange monitoring.</p>
          <button 
            onClick={onSyncLive} 
            disabled={isLoadingLive} 
            className="bg-white text-black px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {isLoadingLive ? 'Synchronizing Market...' : 'Refresh Market Data'}
          </button>
        </div>
      </section>

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[300px]">
          <input 
            type="text" 
            placeholder="Search teams or leagues..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-12 py-3.5 text-xs font-bold text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-600"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
        <div className="flex gap-2">
          {['All', 'Soccer', 'Basketball', 'American Football'].map(sport => (
            <button
              key={sport}
              onClick={() => setSportFilter(sport)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                sportFilter === sport 
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                : 'bg-slate-900/50 border-white/5 text-slate-500 hover:text-white'
              }`}
            >
              {sport === 'All' ? 'All Markets' : sport}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedMatches.map((match, i) => (
          <div key={match.id} className="animate-slideUp" style={{ animationDelay: `${i * 0.1}s` }}>
            <MatchCard 
              match={match} 
              isFavorite={favorites.includes(match.id)} 
              onToggleFavorite={toggleFavorite} 
              onSelect={onSelectMatch} 
            />
          </div>
        ))}
      </div>

      {visibleCount < filteredMatches.length && (
        <div className="flex justify-center mt-12">
          <button 
            onClick={() => setVisibleCount(v => v + 6)} 
            className="px-10 py-4 bg-slate-900/50 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white hover:bg-slate-800 transition-all border border-white/5 shadow-xl active:scale-95"
          >
            Explore More Markets
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;