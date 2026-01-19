import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Arbitrage: React.FC = () => {
  const [stake, setStake] = useState<number>(1000);
  const [odds1, setOdds1] = useState<number>(2.10);
  const [odds2, setOdds2] = useState<number>(2.05);

  const profit = (1 / (1/odds1 + 1/odds2));
  const isArb = profit > 1;
  const margin = ((1 - (1/profit)) * 100).toFixed(2);
  
  const stake1 = (stake * (1/odds1) / (1/odds1 + 1/odds2)).toFixed(2);
  const stake2 = (stake * (1/odds2) / (1/odds1 + 1/odds2)).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn">
      <div className="border-b border-white/5 pb-10">
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Arbitrage Lab</h1>
        <p className="text-sm font-medium text-slate-500">Dual-market risk neutralizers and ROI calculators.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8 bg-slate-900/40 backdrop-blur-xl p-10 rounded-3xl border border-white/5 shadow-2xl">
          <div className="space-y-6">
            <label className="block">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 block">Total Capital (USDT)</span>
              <input
                type="number"
                value={stake}
                onChange={(e) => setStake(Number(e.target.value))}
                className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-black text-xl focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </label>
            <div className="grid grid-cols-2 gap-6">
              <label className="block">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 block">Market A Odds</span>
                <input
                  type="number"
                  step="0.01"
                  value={odds1}
                  onChange={(e) => setOdds1(Number(e.target.value))}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-black text-xl focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 block">Market B Odds</span>
                <input
                  type="number"
                  step="0.01"
                  value={odds2}
                  onChange={(e) => setOdds2(Number(e.target.value))}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-black text-xl focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </label>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 text-white px-8 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:bg-blue-500 transition-all"
          >
            Calculate Risk
          </motion.button>
        </div>

        <div className={`p-10 rounded-3xl border transition-all duration-700 flex flex-col justify-between ${isArb ? 'bg-green-500/5 border-green-500/20 shadow-[0_0_50px_-12px_rgba(34,197,94,0.2)]' : 'bg-red-500/5 border-red-500/20'}`}>
          <div>
            <div className="flex justify-between items-start mb-10">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">ROI Potential</span>
                <h3 className={`text-5xl font-black tracking-tighter ${isArb ? 'text-green-500' : 'text-red-500'}`}>{margin}%</h3>
              </div>
              <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${isArb ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {isArb ? 'Arb Detected' : 'No Margin'}
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex justify-between items-center p-6 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xs">A</div>
                  <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Market Alpha</span>
                </div>
                <span className="text-xl font-black text-white">${stake1}</span>
              </div>
              <div className="flex justify-between items-center p-6 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black text-xs">B</div>
                  <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Market Beta</span>
                </div>
                <span className="text-xl font-black text-white">${stake2}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-10 border-t border-white/5 flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-slate-900 text-slate-300 border border-white/5 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
            >
              Export Report
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-white text-slate-950 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl"
            >
              Execute Hedge
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Arbitrage;
