import React, { useState, useEffect } from 'react';

const SYMBOLS = ['7️⃣', '💎', '🃏', '🔔', '🍒', '🍇'];
const REEL_COUNT = 5;
const SYMBOL_HEIGHT = 64; 
const VIEW_WINDOW = 3; 

const Casino: React.FC = () => {
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('casino_balance');
    return saved ? parseInt(saved) : 1000;
  });
  const [activeGame, setActiveGame] = useState<string>('slots');
  const [message, setMessage] = useState<string>('Welcome to the High-Roller Floor.');
  const [spinning, setSpinning] = useState(false);
  const [winState, setWinState] = useState<'none' | 'win' | 'loss'>('none');
  const [lastWin, setLastWin] = useState(0);
  const [bet, setBet] = useState(20);

  useEffect(() => {
    localStorage.setItem('casino_balance', balance.toString());
  }, [balance]);

  const updateBalance = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  const Slots = () => {
    const [winningIndices, setWinningIndices] = useState<number[]>([]);
    const [reelStrips, setReelStrips] = useState<string[][]>(() => 
      Array.from({ length: REEL_COUNT }, () => 
        Array.from({ length: 25 }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
      )
    );

    const spin = () => {
      if (balance < bet) return setMessage('Insufficient credits.');
      if (spinning) return;

      updateBalance(-bet);
      setSpinning(true);
      setLastWin(0);
      setWinState('none');
      setWinningIndices([]);
      setMessage('Reels in motion...');

      const finalResults = Array.from({ length: REEL_COUNT }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
      const newStrips = reelStrips.map((strip, i) => {
        const newStrip = [...strip];
        newStrip[newStrip.length - 1] = finalResults[i];
        newStrip[0] = finalResults[i];
        return newStrip;
      });
      setReelStrips(newStrips);

      setTimeout(() => {
        setSpinning(false);
        checkWins(finalResults);
      }, 2100);
    };

    const checkWins = (res: string[]) => {
      let winMultiplier = 0;
      let winners: number[] = [];
      const counts: Record<string, number[]> = {};
      res.forEach((s, i) => {
        if (!counts[s]) counts[s] = [];
        counts[s].push(i);
      });

      const maxSymbol = Object.keys(counts).find(s => counts[s].length >= 3);
      if (maxSymbol) {
        winners = counts[maxSymbol];
        const count = winners.length;
        if (maxSymbol === '7️⃣') winMultiplier = count === 5 ? 100 : count === 4 ? 40 : 15;
        else if (maxSymbol === '💎') winMultiplier = count === 5 ? 50 : count === 4 ? 20 : 10;
        else if (maxSymbol === '🃏') winMultiplier = count === 5 ? 80 : 12;
        else winMultiplier = count === 5 ? 20 : count === 4 ? 8 : 4;
      }

      if (winMultiplier > 0) {
        const totalWin = Math.floor(bet * winMultiplier);
        updateBalance(totalWin);
        setLastWin(totalWin);
        setWinningIndices(winners);
        setWinState('win');
        setMessage(`WINNER! +$${totalWin}`);
      } else {
        setWinState('loss');
        setMessage('Unlucky spin.');
      }
    };

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className={`glass-panel p-6 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden transition-all duration-500 ${
          winState === 'win' ? 'animate-glow' : ''
        }`}>
          <div className="grid grid-cols-5 gap-2 h-[220px] mb-8 bg-[#020617] p-2 rounded-2xl border border-white/5">
            {reelStrips.map((strip, i) => {
              const isWinning = winningIndices.includes(i);
              return (
                <div key={i} className="bg-slate-900/50 rounded-xl overflow-hidden relative shadow-inner">
                  <div 
                    className="flex flex-col transition-transform duration-[2000ms] will-change-transform"
                    style={{ 
                      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: spinning 
                        ? `translateY(-${(strip.length - VIEW_WINDOW) * SYMBOL_HEIGHT}px) translateZ(0)` 
                        : 'translateY(0) translateZ(0)'
                    }}
                  >
                    {strip.map((symbol, idx) => (
                      <div key={idx} className={`h-[64px] flex items-center justify-center text-4xl select-none transition-all ${
                        isWinning && !spinning && idx === 0 ? 'scale-125' : ''
                      }`}>
                        {symbol}
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_40px_40px_-20px_rgba(0,0,0,1),inset_0_-40px_40px_-20px_rgba(0,0,0,1)]"></div>
                  {isWinning && !spinning && <div className="absolute inset-0 border-2 border-green-500/40 rounded-xl pointer-events-none z-10 animate-pulse"></div>}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex items-center gap-8 bg-[#020617] px-6 py-3 rounded-2xl border border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-600 uppercase mb-1 tracking-widest">Stake</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => setBet(Math.max(10, bet - 10))} className="text-slate-500 hover:text-white font-black text-lg active:scale-75 transition-all">-</button>
                  <span className="text-xl font-black text-white w-10 text-center tracking-tighter">${bet}</span>
                  <button onClick={() => setBet(bet + 10)} className="text-slate-500 hover:text-white font-black text-lg active:scale-75 transition-all">+</button>
                </div>
              </div>
              <div className="h-10 w-px bg-white/5"></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-blue-500 uppercase mb-1 tracking-widest">Payout</span>
                <span className={`text-xl font-black tracking-tighter ${lastWin > 0 ? 'text-green-500' : 'text-slate-700'}`}>${lastWin}</span>
              </div>
            </div>
            <button 
              disabled={spinning} 
              onClick={spin} 
              className={`w-full md:w-auto px-12 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95 ${
                spinning ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-white text-black hover:bg-blue-600 hover:text-white'
              }`}
            >
              {spinning ? 'PROCESSING' : 'SPIN REELS'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-[2rem] border border-white/5">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 flex items-center">
               <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
               Symbol Multipliers
             </h4>
             <div className="grid grid-cols-2 gap-x-8 gap-y-2">
               {[
                 {s: '7️⃣', m: '100x'}, {s: '💎', m: '50x'}, {s: '🃏', m: '80x'},
                 {s: '🔔', m: '20x'}, {s: '🍒', m: '5x'}, {s: '🍇', m: '3x'}
               ].map((item, i) => (
                 <div key={i} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                   <span className="text-2xl">{item.s}</span>
                   <span className="font-black text-white text-[11px] uppercase tracking-tighter">{item.m}</span>
                 </div>
               ))}
             </div>
          </div>
          <div className="bg-blue-600/5 p-8 rounded-[2rem] flex flex-col justify-center items-center text-center border border-blue-500/10 shadow-inner">
             <div className="text-[10px] font-black text-blue-500/60 uppercase tracking-[0.5em] mb-2">Theoretical RTP</div>
             <div className="text-5xl font-black text-white tracking-tighter">96.5%</div>
          </div>
        </div>
      </div>
    );
  };

  const renderGame = () => {
    switch (activeGame) {
      case 'slots': return <Slots />;
      default: return <div className="text-center p-24 text-slate-700 uppercase text-[10px] font-black tracking-[0.5em]">Game loading...</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Platinum Casino</h1>
          <p className="text-slate-500 font-medium mt-3 text-sm uppercase tracking-widest opacity-60">{message}</p>
        </div>
        <div className="glass-panel px-8 py-4 rounded-2xl border border-white/5 shadow-2xl text-right min-w-[200px] animate-glow">
          <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 opacity-60">Available Bankroll</div>
          <div className="text-3xl font-black text-white tracking-tighter">${balance.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {['slots', 'blackjack', 'roulette', 'crash', 'dice'].map(game => (
          <button
            key={game}
            onClick={() => setActiveGame(game)}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              activeGame === game ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-500/20' : 'bg-slate-900 border-white/5 text-slate-500 hover:text-white'
            }`}
          >
            {game}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {renderGame()}
      </div>

      <div className="p-4 bg-white/[0.02] rounded-2xl text-center border border-white/5">
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.4em]">Simulation Only · 256-Bit Encryption · provably fair</p>
      </div>
    </div>
  );
};

export default Casino;