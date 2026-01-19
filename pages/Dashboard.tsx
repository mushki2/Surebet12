import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MatchCard from '../components/MatchCard';
import { Match } from '../types';

interface DashboardProps {
  matches: Match[];
  sources: { uri: string; title: string }[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  onSelectMatch: (match: Match) => void;
  onSyncLive: () => void;
  isLoadingLive: boolean;
  dataSource: 'demo' | 'csv' | 'live' | 'api';
}

const Dashboard: React.FC<DashboardProps> = ({ matches, sources, favorites, toggleFavorite, onSelectMatch, onSyncLive, isLoadingLive, dataSource }) => {
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const displayedMatches = filter === 'all'
    ? matches
    : matches.filter(m => favorites.includes(m.id));

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/5 pb-8 gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase">Market Feed</h1>
            <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${dataSource === 'live' || dataSource === 'api' ? 'bg-green-500/10 text-green-500' : 'bg-slate-800 text-slate-500'}`}>
              {dataSource}
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500">Real-time betting intelligence and probability modeling.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5 backdrop-blur-md">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter('all')}
              className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-500 hover:text-white'}`}
            >
              All Matches
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter('favorites')}
              className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'favorites' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-500 hover:text-white'}`}
            >
              Favorites ({favorites.length})
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSyncLive}
            disabled={isLoadingLive}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-blue-500/20 flex items-center ${isLoadingLive ? 'bg-slate-800 text-slate-500' : 'bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white'}`}
          >
            {isLoadingLive ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Syncing AI...
              </>
            ) : 'Live Sync'}
          </motion.button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedMatches.map((match, i) => (
          <div key={match.id} className="animate-slideUp" style={{ animationDelay: `${i * 0.05}s` }}>
            <MatchCard match={match} isFavorite={favorites.includes(match.id)} onToggleFavorite={toggleFavorite} onSelect={onSelectMatch} />
          </div>
        ))}
      </div>

      {/* Sources Footer */}
      {sources.length > 0 && (
        <div className="pt-12 border-t border-white/5">
          <div className="flex flex-wrap gap-4 items-center justify-center opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mr-4">Intelligence Sources:</span>
            {sources.map((s, i) => (
              <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-slate-300 hover:text-blue-400 transition-colors uppercase">
                {s.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
