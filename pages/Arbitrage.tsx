
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
    <div className="animate-fadeIn max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">LIVE ARBITRAGE</h1>
          <p className="text-gray-500 font-medium mt-2">Real-time risk-free profit opportunities across global bookmakers.</p>
        </div>
        <div className="flex items-center bg-gray-900 p-2 rounded-2xl border border-gray-800 shadow-2xl">
          <input 
            type="number" 
            value={stake} 
            onChange={(e) => setStake(Number(e.target.value))}
            className="bg-transparent px-6 py-3 font-black text-xl text-white focus:outline-none w-40"
          />
          <span className="bg-blue-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">Set Total Stake</span>
        </div>
      </div>

      <div className="grid gap-10">
        {mockArbs.map(arb => (
          <div key={arb.id} className="bg-gray-900 rounded-[2.5rem] shadow-xl border border-gray-800 overflow-hidden hover:border-blue-500/30 transition-all">
            <div className="bg-gray-800/50 px-8 py-6 flex justify-between items-center border-b border-gray-800">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20">{arb.sport}</span>
                <span className="font-black text-xl text-white tracking-tight">{arb.match}</span>
              </div>
              <div className="bg-green-500/10 text-green-400 border border-green-500/20 px-5 py-2 rounded-2xl text-sm font-black shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                {arb.roi}% ROI
              </div>
            </div>
            <div className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {arb.outcomes.map((outcome, idx) => {
                  const individualStake = (stake * (1 / outcome.odds)) / arb.outcomes.reduce((acc, curr) => acc + (1 / curr.odds), 0);
                  return (
                    <div key={idx} className="bg-gray-950 border border-gray-800 p-6 rounded-3xl relative group hover:border-gray-700 transition-colors">
                      <div className="text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest">{outcome.bookie}</div>
                      <div className="font-bold text-gray-300 mb-4">{outcome.name}</div>
                      <div className="flex justify-between items-end">
                        <div className="text-4xl font-black text-blue-500 group-hover:scale-105 transition-transform">{outcome.odds}</div>
                        <div className="text-right">
                          <div className="text-[10px] font-black text-gray-600 uppercase mb-1">Stake</div>
                          <div className="font-mono font-black text-white text-lg">${individualStake.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-10 flex flex-col md:flex-row md:items-center justify-between p-8 bg-green-500/5 rounded-[2rem] border border-green-500/10 border-dashed">
                <div className="mb-6 md:mb-0">
                  <div className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-2">Guaranteed Network Profit</div>
                  <div className="text-4xl font-black text-white shadow-green-500/5">${(stake * (arb.roi / 100)).toFixed(2)}</div>
                </div>
                <div className="flex gap-4">
                  <button className="flex-1 md:flex-none bg-gray-800 text-gray-300 border border-gray-700 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-700 transition-all">
                    Analyze Links
                  </button>
                  <button className="flex-1 md:flex-none bg-white text-gray-950 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-2xl shadow-white/5 active:scale-95">
                    Execute Orders
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 p-8 bg-blue-500/5 rounded-3xl border border-blue-500/10 relative overflow-hidden group">
        <h3 className="text-blue-400 font-black text-sm uppercase tracking-widest mb-4 flex items-center">
          <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Market Integrity Disclaimer
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed font-medium relative z-10">
          Arbitrage involves high execution risk. Odds can change rapidly, and bookmakers may limit or void stakes. Always verify the odds on the bookmaker site before placing any bets. Stake amounts are suggested based on mathematical models. Gamble responsibly.
        </p>
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-colors"></div>
      </div>
    </div>
  );
};

export default Arbitrage;
