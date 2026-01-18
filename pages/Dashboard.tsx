
import React, { useState, useMemo } from 'react';
import MatchCard from '../components/MatchCard.tsx';
import { Match, Source } from '../types.ts';

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
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto px-4">
      <section className="bg-gray-900/40 p-6 rounded-xl relative overflow-hidden border border-gray-800/30">
        <div className="relative z-10 max-w-xl">
          <div className="mb-1 uppercase text-[7px] font-black text-blue-400 tracking-[0.3em]">{dataSource} engine</div>
          <h1 className="text-2xl font-black mb-1.5 tracking-tighter uppercase text-white">SPORTS MARKET ANALYTICS</h1>
          <p className="text-gray-500 text-[10px] mb-4 font-medium leading-relaxed">Predictive modeling for global sport markets using Gemini-3 reasoning.</p>
          <button onClick={onSyncLive} disabled={isLoadingLive} className="bg-white text-black px-4 py-2 rounded font-black text-[9px] uppercase tracking-widest hover:bg-gray-200 transition-all">
            {isLoadingLive ? 'Syncing...' : 'Refresh Data'}
          </button>
        </div>
      </section>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[150px]">
          <input type="text" placeholder="Search teams..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded px-8 py-1.5 text-[10px] font-bold text-white focus:outline-none focus:border-blue-500/30 transition-all"/>
          <svg className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
        <select value={sportFilter} onChange={(e) => setSportFilter(e.target.value)}
          className="bg-gray-900 border border-gray-800 rounded px-3 py-1.5 text-[9px] font-black uppercase text-blue-400 outline-none cursor-pointer">
          <option value="All">All Markets</option>
          <option value="Soccer">Soccer</option>
          <option value="Basketball">NBA</option>
          <option value="American Football">NFL</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[400px]">
        {displayedMatches.map(match => (
          <MatchCard key={match.id} match={match} isFavorite={favorites.includes(match.id)} onToggleFavorite={toggleFavorite} onSelect={onSelectMatch} />
        ))}
      </div>

      {visibleCount < filteredMatches.length && (
        <div className="flex justify-center mt-4">
          <button onClick={() => setVisibleCount(v => v + 6)} className="px-5 py-2 bg-gray-900 rounded text-[9px] font-black uppercase text-gray-500 hover:text-white transition-all border border-gray-800">Load More</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
