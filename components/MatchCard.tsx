import React, { useState, useEffect } from 'react';
import { Match } from '../types';

interface MatchCardProps {
  match: Match;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (match: Match) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, isFavorite, onToggleFavorite, onSelect }) => {
  const [isMounted, setIsMounted] = useState(false);
  const probabilities = match.probabilities || { home: 33, draw: 34, away: 33 };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getTeamLogo = (name: string, isHome: boolean) => (
    <div className={`w-8 h-8 flex-shrink-0 ${isHome ? 'bg-blue-600' : 'bg-orange-600'} rounded-xl flex items-center justify-center text-white font-black text-[12px] shadow-lg group-hover:scale-110 transition-transform duration-300`}>
      {(name || "?").charAt(0)}
    </div>
  );

  return (
    <div 
      onClick={() => onSelect(match)}
      className="group bg-slate-900/40 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/5 relative"
    >
      <div className="bg-white/[0.02] px-5 py-2.5 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
        <span>{match.sport} · {match.league}</span>
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(match.id); }} 
          className={`transition-all active:scale-75 p-1 ${isFavorite ? 'text-red-500' : 'text-slate-700 hover:text-red-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isFavorite ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {getTeamLogo(match.homeTeam, true)}
            <span className="font-black text-xs text-white truncate uppercase tracking-tight">{match.homeTeam}</span>
          </div>
          <div className="text-[10px] text-slate-700 font-black italic tracking-widest opacity-50">VS</div>
          <div className="flex items-center justify-end space-x-3 flex-1 min-w-0 text-right">
            <span className="font-black text-xs text-white truncate uppercase tracking-tight">{match.awayTeam}</span>
            {getTeamLogo(match.awayTeam, false)}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex h-2 w-full rounded-full overflow-hidden bg-slate-950/50 p-0.5">
            <div className="bg-blue-600 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-blue-500/20" style={{ width: isMounted ? `${probabilities.home}%` : '0%' }}></div>
            <div className="bg-slate-700 rounded-full transition-all duration-1000 ease-out mx-0.5" style={{ width: isMounted ? `${probabilities.draw}%` : '0%' }}></div>
            <div className="bg-orange-600 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-orange-500/20" style={{ width: isMounted ? `${probabilities.away}%` : '0%' }}></div>
          </div>
          <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <span className="text-blue-500">1: {probabilities.home}%</span>
            <span>X: {probabilities.draw}%</span>
            <span className="text-orange-500">2: {probabilities.away}%</span>
          </div>
        </div>
      </div>
      <div className="px-5 py-4 bg-white/[0.02] text-[10px] font-black text-blue-500/80 flex justify-center uppercase tracking-[0.3em] group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        Analytical Insights
      </div>
    </div>
  );
};

export default MatchCard;