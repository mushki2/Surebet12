
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
    <div className={`w-6 h-6 flex-shrink-0 ${isHome ? 'bg-blue-600' : 'bg-orange-600'} rounded flex items-center justify-center text-white font-black text-[9px] shadow-sm`}>
      {(name || "?").charAt(0)}
    </div>
  );

  return (
    <div 
      onClick={() => onSelect(match)}
      className="group bg-gray-900/20 rounded-lg border border-gray-800/40 hover:border-blue-500/30 transition-all cursor-pointer flex flex-col overflow-hidden"
    >
      <div className="bg-gray-800/10 px-3 py-1 flex justify-between items-center text-[7px] font-black text-gray-600 uppercase tracking-widest">
        <span>{match.sport} · {match.league}</span>
        <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(match.id); }} className={`transition-all ${isFavorite ? 'text-red-500' : 'text-gray-700 hover:text-red-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 fill-current" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
        </button>
      </div>
      
      <div className="p-3 space-y-2.5">
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center space-x-1.5 flex-1 min-w-0">
            {getTeamLogo(match.homeTeam, true)}
            <span className="font-bold text-[9px] text-gray-200 truncate uppercase">{match.homeTeam}</span>
          </div>
          <div className="text-[6px] text-gray-700 font-black italic">VS</div>
          <div className="flex items-center justify-end space-x-1.5 flex-1 min-w-0 text-right">
            <span className="font-bold text-[9px] text-gray-200 truncate uppercase">{match.awayTeam}</span>
            {getTeamLogo(match.awayTeam, false)}
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex h-1 w-full rounded-full overflow-hidden bg-gray-950">
            <div className="bg-blue-600 transition-all duration-700" style={{ width: isMounted ? `${probabilities.home}%` : '0%' }}></div>
            <div className="bg-gray-700 transition-all duration-700" style={{ width: isMounted ? `${probabilities.draw}%` : '0%' }}></div>
            <div className="bg-orange-600 transition-all duration-700" style={{ width: isMounted ? `${probabilities.away}%` : '0%' }}></div>
          </div>
          <div className="flex justify-between text-[6px] font-black text-gray-600 uppercase tracking-tighter">
            <span>1: {probabilities.home}%</span>
            <span>X: {probabilities.draw}%</span>
            <span>2: {probabilities.away}%</span>
          </div>
        </div>
      </div>
      <div className="px-3 py-1.5 bg-gray-800/10 text-[6px] font-black text-blue-500/50 flex justify-center uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all">Details</div>
    </div>
  );
};

export default MatchCard;
