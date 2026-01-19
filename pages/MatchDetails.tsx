import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '../types';

interface MatchDetailsProps {
  match: Match;
  onBack: () => void;
}

const MatchDetails: React.FC<MatchDetailsProps> = ({ match, onBack }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn">
      <motion.button
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="flex items-center text-slate-500 hover:text-white transition-colors group"
      >
        <svg className="w-5 h-5 mr-2 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Market Feed</span>
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Main Card */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[40px] p-12 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <span className="text-9xl font-black italic">S</span>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col items-center mb-16">
                <span className="px-4 py-1.5 bg-blue-600/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 border border-blue-500/20">Match Analysis Engine</span>

                <div className="flex items-center justify-center gap-12 w-full">
                  <div className="flex flex-col items-center flex-1">
                    <div className="h-28 w-28 bg-blue-600 rounded-[32px] flex items-center justify-center text-white font-black text-5xl shadow-2xl shadow-blue-600/20 mb-6">{match.homeTeam[0]}</div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter text-center">{match.homeTeam}</h2>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-slate-700 italic uppercase mb-2">Kickoff</span>
                    <div className="px-6 py-2 bg-slate-800/50 rounded-2xl border border-white/5 text-sm font-black text-white">
                      {new Date(match.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div className="flex flex-col items-center flex-1">
                    <div className="h-28 w-28 bg-orange-600 rounded-[32px] flex items-center justify-center text-white font-black text-5xl shadow-2xl shadow-orange-600/20 mb-6">{match.awayTeam[0]}</div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter text-center">{match.awayTeam}</h2>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/5">
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Prediction</span>
                  <p className="text-3xl font-black text-blue-500">{match.predictions.score}</p>
                </div>
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Over 2.5</span>
                  <p className="text-3xl font-black text-white">{match.predictions.over25}%</p>
                </div>
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">BTTS</span>
                  <p className="text-3xl font-black text-orange-500">{match.predictions.btts}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Advice */}
          <div className="bg-blue-600 p-12 rounded-[40px] shadow-2xl shadow-blue-600/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <h3 className="text-[11px] font-black text-white/60 uppercase tracking-[0.4em] mb-6">Expert Verdict</h3>
              <p className="text-2xl font-black text-white leading-tight mb-10">{match.predictions.advice}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-4 bg-white text-blue-600 text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl transition-all"
              >
                Copy Analysis
              </motion.button>
            </div>
          </div>
        </div>

        {/* Standings */}
        <div className="space-y-8">
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] pl-4">League Context</h3>
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 space-y-6">
            <div className="flex justify-between text-[9px] font-black text-slate-600 uppercase tracking-widest px-4 border-b border-white/5 pb-4">
              <span className="w-8">Pos</span>
              <span className="flex-1">Club</span>
              <span className="w-8 text-center">Pts</span>
              <span className="w-16 text-right">Form</span>
            </div>
            <div className="space-y-1">
              {match.standings && match.standings.slice(0, 10).map((team, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-2xl transition-all ${team.team === match.homeTeam || team.team === match.awayTeam ? 'bg-blue-600/10 border border-blue-500/20' : 'hover:bg-white/5 border border-transparent'}`}>
                  <span className="w-8 text-[11px] font-black text-slate-500">{team.rank}</span>
                  <span className={`flex-1 text-[11px] font-black uppercase tracking-tight ${team.team === match.homeTeam || team.team === match.awayTeam ? 'text-white' : 'text-slate-400'}`}>{team.team}</span>
                  <span className="w-8 text-center text-[11px] font-black text-white">{team.points}</span>
                  <div className="w-16 flex justify-end gap-1">
                    {team.form.slice(0, 3).map((f, j) => (
                      <span key={j} className={`w-1.5 h-1.5 rounded-full ${f === 'W' ? 'bg-green-500' : f === 'L' ? 'bg-red-500' : 'bg-slate-700'}`}></span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
