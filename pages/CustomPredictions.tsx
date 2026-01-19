import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CustomPredictions: React.FC = () => {
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [homeStrength, setHomeStrength] = useState(1.5);
  const [awayStrength, setAwayStrength] = useState(1.2);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-10 rounded-3xl space-y-8">
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-8">Model Parameters</h3>

            <div className="space-y-4">
              <label className="block">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Home Contender</span>
                <input 
                  type="text"
                  value={homeTeam}
                  onChange={(e) => setHomeTeam(e.target.value)}
                  placeholder="TEAM NAME"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-black text-xs focus:outline-none focus:border-blue-500/50 transition-all uppercase placeholder:text-slate-700"
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Attack Index</span>
                <input 
                  type="range"
                  min="0.1" max="5.0" step="0.1"
                  value={homeStrength}
                  onChange={(e) => setHomeStrength(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </label>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <label className="block">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Away Contender</span>
                <input 
                  type="text"
                  value={awayTeam}
                  onChange={(e) => setAwayTeam(e.target.value)}
                  placeholder="TEAM NAME"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-black text-xs focus:outline-none focus:border-orange-500/50 transition-all uppercase placeholder:text-slate-700"
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Attack Index</span>
                <input 
                  type="range"
                  min="0.1" max="5.0" step="0.1"
                  value={awayStrength}
                  onChange={(e) => setAwayStrength(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
              </label>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white text-slate-950 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 hover:text-white transition-all"
          >
            Generate Poisson Matrix
          </motion.button>
        </div>

        <div className="flex flex-col justify-center items-center text-center p-8 bg-blue-600/5 rounded-3xl border border-blue-500/10 border-dashed">
          <div className="h-16 w-16 bg-slate-900/50 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
            <svg className="w-8 h-8 text-blue-500 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Matrix Pending</h4>
          <p className="text-[10px] text-slate-600 font-bold uppercase leading-relaxed">Adjust parameters to simulate <br/>match outcome probabilities.</p>
        </div>
      </div>
    </div>
  );
};

export default CustomPredictions;
