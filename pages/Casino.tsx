import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Casino: React.FC = () => {
  const [balance, setBalance] = useState(10000);
  const [bet, setBet] = useState(100);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const handleSpin = () => {
    if (balance < bet) return;
    setIsSpinning(true);
    setResult(null);

    setTimeout(() => {
      const win = Math.random() > 0.6;
      const multiplier = win ? (Math.random() > 0.8 ? 5 : 2) : 0;
      const winAmount = bet * multiplier;

      setBalance(prev => prev - bet + winAmount);
      setResult(winAmount);
      setIsSpinning(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/5 pb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">High Roller</h1>
          <p className="text-sm font-medium text-slate-500">Provably fair instant settlement engine.</p>
        </div>
        <div className="bg-slate-900/80 px-8 py-4 rounded-2xl border border-white/5 shadow-2xl">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-1">Total Liquidity</span>
          <span className="text-2xl font-black text-white">${balance.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
          <div className="absolute inset-0 bg-blue-600/5 blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 text-center">
            {isSpinning ? (
              <div className="flex space-x-4">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    className="h-20 w-16 bg-slate-800 rounded-2xl border border-white/10 flex items-center justify-center text-4xl"
                  >
                    🎰
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-7xl mb-8">💎</div>
                {result !== null && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-2xl font-black uppercase tracking-widest ${result > 0 ? 'text-green-500' : 'text-slate-500'}`}
                  >
                    {result > 0 ? `+ $${result}` : 'Try Again'}
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900/60 p-10 rounded-3xl border border-white/5 space-y-8">
          <div className="space-y-6">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block">Wager Size</span>
            <div className="flex items-center justify-between bg-slate-800/50 rounded-2xl p-4 border border-white/5">
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => setBet(Math.max(10, bet - 10))}
                className="text-slate-500 hover:text-white font-black text-lg p-2 transition-all"
              >
                -
              </motion.button>
              <span className="text-2xl font-black text-white">${bet}</span>
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => setBet(bet + 10)}
                className="text-slate-500 hover:text-white font-black text-lg p-2 transition-all"
              >
                +
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[0.5, 2, 5, 10].map(m => (
              <motion.button
                key={m}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setBet(Math.floor(bet * m))}
                className="py-3 bg-slate-800/30 rounded-xl text-[10px] font-black text-slate-400 border border-white/5 hover:bg-slate-700 transition-all uppercase"
              >
                {m}x
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSpinning || balance < bet}
            onClick={handleSpin}
            className={`w-full py-6 rounded-2xl text-[12px] font-black uppercase tracking-[0.4em] shadow-2xl transition-all ${isSpinning || balance < bet ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/30'}`}
          >
            {isSpinning ? 'Rolling...' : 'Initiate'}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Casino;
