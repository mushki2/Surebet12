import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Match } from '../types';

interface MatchCardProps {
  match: Match;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (match: Match) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, isFavorite, onToggleFavorite, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all group"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{match.sport} · {match.league}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(match.id); }}
            className={`p-2 rounded-full ${isFavorite ? 'text-red-500 bg-red-500/10' : 'text-slate-600 bg-slate-800/50 hover:text-slate-400'}`}
          >
            <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </motion.button>
        </div>

        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex-1 flex items-center justify-center space-x-3">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/20">{match.homeTeam[0]}</div>
            <span className="text-xs font-black text-white uppercase tracking-tight truncate max-w-[70px]">{match.homeTeam}</span>
          </div>
          <div className="text-[9px] font-black text-slate-700 uppercase italic px-2 py-0.5 bg-slate-800/30 rounded-full">vs</div>
          <div className="flex-1 flex items-center justify-center space-x-3">
            <span className="text-xs font-black text-white uppercase tracking-tight truncate max-w-[70px] text-right">{match.awayTeam}</span>
            <div className="h-10 w-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-orange-500/20">{match.awayTeam[0]}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div style={{ width: `${match.probabilities.home}%` }} className="bg-blue-500"></div>
            <div style={{ width: `${match.probabilities.draw}%` }} className="bg-slate-700"></div>
            <div style={{ width: `${match.probabilities.away}%` }} className="bg-orange-500"></div>
          </div>
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-blue-500">1: {match.probabilities.home}%</span>
            <span className="text-slate-500">X: {match.probabilities.draw}%</span>
            <span className="text-orange-500">2: {match.probabilities.away}%</span>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        onClick={() => onSelect(match)}
        className="w-full py-5 border-t border-white/5 text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] hover:text-blue-300 transition-colors bg-white/0"
      >
        Analytical Insights
      </motion.button>
    </motion.div>
  );
};

export default MatchCard;
