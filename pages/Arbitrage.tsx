import React, { useState } from 'react';
import { ArbOpportunity } from '../types';

const Arbitrage: React.FC = () => {
  const [stake, setStake] = useState<number>(1000);
  
  const mockArbs: ArbOpportunity[] = [
    {
      id: 'arb1',
      match: 'Man Utd vs Liverpool',
      sport: 'Soccer',
      roi: 2.15,
      timestamp: new Date().toISOString(),
      outcomes: [
        { name: '1 (Home Win)', odds: 2.55, bookie: 'Bet365' },
        { name: 'X (Draw)', odds: 3.40, bookie: 'Pinnacle' },
        { name: '2 (Away Win)', odds: 3.10, bookie: 'William Hill' }
      ]
    },
    {
      id: 'arb2',
      match: 'Real Madrid vs Barcelona',
      sport: 'Soccer',
      roi: 3.45,
      timestamp: new Date().toISOString(),
      outcomes: [
        { name: 'Over 2.5', odds: 1.95, bookie: 'Betfair' },
        { name: 'Under 2.5', odds: 2.15, bookie: 'DraftKings' }
      ]
    }
  ];

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto space-y-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Live Arbitrage</h1>
          <p className="text-slate-500 font-medium mt-3 text-sm">Real-time risk-free profit opportunities across global bookmakers.</p>
        </div>
        <div className="flex items-center glass-panel p-2 rounded-2xl border border-white/5 shadow-2xl">
          <div className="flex flex-col px-4">
             <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 opacity-60">Investment</span>
             <input 
              type="number" 
              value={stake} 
              onChange={(e) => setStake(Number(e.target.value))}
              className="bg-transparent font-black text-2xl text-white focus:outline-none w-32 tracking-tighter"
            />
          </div>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:bg-blue-500 transition-all active:scale-95">Set Total Stake</button>
        </div>
      </div>

      <div className="grid gap-12">
        {mockArbs.map((arb, i) => (
          <div key={arb.id} className="glass-panel rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden hover:border-blue-500/30 transition-all duration-500 animate-slideUp" style={{ animationDelay: `${i * 0.15}s` }}>
            <div className="bg-white/[0.02] px-10 py-8 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] bg-blue-500/10 px-4 py-1.5 rounded-xl border border-blue-500/20">{arb.sport}</span>
                <span className="font-black text-2xl text-white tracking-tighter uppercase">{arb.match}</span>
              </div>
              <div className="bg-green-500/10 text-green-400 border border-green-500/20 px-6 py-2.5 rounded-2xl text-[11px] font-black shadow-[0_0_20px_rgba(34,197,94,0.1)] tracking-[0.2em] animate-pulse">
                {arb.roi}% ROI
              </div>
            </div>
            <div className="p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {arb.outcomes.map((outcome, idx) => {
                  const individualStake = (stake * (1 / outcome.odds)) / arb.outcomes.reduce((acc, curr) => acc + (1 / curr.odds), 0);
                  return (
                    <div key={idx} className="bg-[#0f172a] border border-white/5 p-8 rounded-[2rem] relative group hover:border-blue-500/30 transition-all duration-300">
                      <div className="text-[10px] font-black text-slate-500 mb-4 uppercase tracking-[0.2em]">{outcome.bookie}</div>
                      <div className="font-bold text-slate-200 mb-6 text-sm">{outcome.name}</div>
                      <div className="flex justify-between items-end">
                        <div className="text-5xl font-black text-blue-500 group-hover:scale-110 transition-transform tracking-tighter">{outcome.odds}</div>
                        <div className="text-right">
                          <div className="text-[10px] font-black text-slate-600 uppercase mb-2 tracking-widest">Stake</div>
                          <div className="font-black text-white text-xl tracking-tighter">${individualStake.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-12 flex flex-col md:flex-row md:items-center justify-between p-10 bg-green-500/5 rounded-[2.5rem] border border-green-500/10 border-dashed animate-glow">
                <div className="mb-8 md:mb-0">
                  <div className="text-[10px] font-black text-green-500 uppercase tracking-[0.4em] mb-3">Guaranteed Profit</div>
                  <div className="text-5xl font-black text-white tracking-tighter">${(stake * (arb.roi / 100)).toFixed(2)}</div>
                </div>
                <div className="flex gap-4">
                  <button className="flex-1 md:flex-none bg-slate-900 text-slate-300 border border-white/5 px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95">
                    Analyze Links
                  </button>
                  <button className="flex-1 md:flex-none bg-white text-slate-950 px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95">
                    Execute Orders
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-10 bg-blue-500/5 rounded-[2rem] border border-blue-500/10 relative overflow-hidden group">
        <h3 className="text-blue-500 font-black text-[11px] uppercase tracking-[0.3em] mb-6 flex items-center">
          <svg className="h-6 w-6 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Exchange Integrity Protocol
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed font-medium relative z-10 max-w-3xl">
          Arbitrage involves high execution risk. Odds can change rapidly, and bookmakers may limit or void stakes. Always verify the odds on the source exchange site before placing any bets. Stake amounts are suggested based on real-time Poisson modeling.
        </p>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      </div>
    </div>
  );
};

export default Arbitrage;