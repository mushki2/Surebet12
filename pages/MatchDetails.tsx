import React, { useState } from 'react';
import { Match } from '../types';

interface MatchDetailsProps {
  match: Match;
  onBack: () => void;
}

const FormCircle: React.FC<{ result: 'W' | 'D' | 'L' }> = ({ result }) => {
  const colors = {
    W: 'bg-green-500 text-white shadow-lg shadow-green-500/20',
    D: 'bg-slate-600 text-white',
    L: 'bg-red-500 text-white shadow-lg shadow-red-500/20'
  };
  return (
    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black ${colors[result]}`}>
      {result}
    </div>
  );
};

const getExtendedHistory = (match: Match) => {
  const baseResults = match.h2h?.recentResults || [];
  if (baseResults.length >= 10) return baseResults;
  
  const years = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];
  const mockResults = [...baseResults];
  
  for (let i = baseResults.length; i < 10; i++) {
    const homeScore = Math.floor(Math.random() * 3);
    const awayScore = Math.floor(Math.random() * 3);
    mockResults.push({
      score: `${homeScore}-${awayScore}`,
      winner: homeScore > awayScore ? 'home' : homeScore < awayScore ? 'away' : 'draw' as any,
      date: `${years[i % years.length]}-0${Math.floor(Math.random()*9)+1}-15`
    });
  }
  return mockResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const MatchDetails: React.FC<MatchDetailsProps> = ({ match, onBack }) => {
  const [showOddsDropdown, setShowOddsDropdown] = useState(false);
  const history = getExtendedHistory(match);
  
  const h2h = match.h2h || { 
    wins: { home: 0, draws: 0, away: 0 }, 
    stats: { 
      possession: { home: 50, away: 50 }, 
      cleanSheets: { home: 0, away: 0 },
      avgGoals: { home: 1.8, away: 1.4 }
    } 
  };

  const totalGames = history.length;
  const homeWins = history.filter(h => h.winner === 'home').length;
  const awayWins = history.filter(h => h.winner === 'away').length;
  const draws = totalGames - homeWins - awayWins;

  const homeWinPct = Math.round((homeWins / totalGames) * 100);
  const awayWinPct = Math.round((awayWins / totalGames) * 100);
  const drawPct = 100 - homeWinPct - awayWinPct;

  const generateMockOdds = () => [
    { name: 'Bet365', h: 2.10, d: 3.40, a: 3.50 },
    { name: 'Pinnacle', h: 2.15, d: 3.35, a: 3.60 },
    { name: 'Bwin', h: 2.05, d: 3.45, a: 3.55 }
  ];
  const bookies = generateMockOdds();

  return (
    <div className="animate-fadeIn space-y-10 max-w-6xl mx-auto pb-24">
      <button 
        onClick={onBack}
        className="flex items-center text-slate-500 hover:text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L6.414 9H17a1 1 0 110 2H6.414l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Return to Market Dashboard
      </button>

      {/* Hero Section */}
      <div className="glass-panel rounded-[2.5rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-orange-600 opacity-30"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="text-center md:text-left flex-1 animate-slideIn">
            <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black mb-6 mx-auto md:mx-0 shadow-2xl shadow-blue-500/30 group-hover:scale-105 transition-transform duration-500">
              {match.homeTeam.charAt(0)}
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">{match.homeTeam}</h1>
            <div className="flex gap-2 mt-5 justify-center md:justify-start">
              {match.standings?.find(s => s.team === match.homeTeam)?.form?.map((r, i) => (
                <FormCircle key={i} result={r as any} />
              ))}
            </div>
          </div>
          
          <div className="text-center px-10 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="text-[11px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">{match.league}</div>
            <div className="text-6xl font-black text-slate-800 tracking-tighter italic select-none opacity-40">VS</div>
            <div className="text-xs text-slate-500 font-bold mt-5 uppercase tracking-[0.3em]">
              {new Date(match.startTime).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <div className="text-center md:text-right flex-1 flex flex-col items-center md:items-end animate-slideIn" style={{ animationDelay: '0.4s' }}>
            <div className="w-24 h-24 bg-orange-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black mb-6 shadow-2xl shadow-orange-500/30 group-hover:scale-105 transition-transform duration-500">
              {match.awayTeam.charAt(0)}
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">{match.awayTeam}</h1>
            <div className="flex gap-2 mt-5 justify-center md:justify-end">
              {match.standings?.find(s => s.team === match.awayTeam)?.form?.map((r, i) => (
                <FormCircle key={i} result={r as any} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {/* Historical Dominance Panel */}
          <section className="glass-panel rounded-[2.5rem] p-10 space-y-10 animate-slideUp">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-2">Historical Dominance</h3>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Aggregate across last {totalGames} matches</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-2 opacity-60">Engine Confidence</span>
                <span className="text-3xl font-black text-white tracking-tighter">{Math.round((homeWins * 1.5 + draws) / totalGames * 10)}/10</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex h-6 w-full rounded-2xl overflow-hidden bg-slate-950/50 p-1 border border-white/5 shadow-inner">
                <div 
                  className="bg-blue-600 h-full flex items-center justify-center text-[10px] font-black text-white transition-all duration-1000 shadow-xl rounded-l-xl"
                  style={{ width: `${homeWinPct}%` }}
                >
                  {homeWinPct > 15 && `${homeWins} HW`}
                </div>
                <div 
                  className="bg-slate-700 h-full flex items-center justify-center text-[10px] font-black text-slate-400 transition-all duration-1000 mx-0.5"
                  style={{ width: `${drawPct}%` }}
                >
                  {drawPct > 15 && `${draws} D`}
                </div>
                <div 
                  className="bg-orange-600 h-full flex items-center justify-center text-[10px] font-black text-white transition-all duration-1000 shadow-xl rounded-r-xl"
                  style={{ width: `${awayWinPct}%` }}
                >
                  {awayWinPct > 15 && `${awayWins} AW`}
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">
                <span className="text-blue-500">{homeWinPct}% HOME ADVANTAGE</span>
                <span>{drawPct}% STALEMATE</span>
                <span className="text-orange-500">{awayWinPct}% AWAY PRESSURE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Offensive Potency
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between text-[11px] font-black">
                    <span className="text-slate-400 uppercase tracking-widest">Goals Per Match</span>
                    <span className="text-white">{(h2h.stats.avgGoals?.home || 1.8).toFixed(1)} vs {(h2h.stats.avgGoals?.away || 1.4).toFixed(1)}</span>
                  </div>
                  <div className="flex h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="bg-blue-500" style={{ width: '60%' }}></div>
                    <div className="bg-orange-500" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  Territorial Control
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between text-[11px] font-black">
                    <span className="text-slate-400 uppercase tracking-widest">Possession Index</span>
                    <span className="text-white">{h2h.stats.possession.home}% vs {h2h.stats.possession.away}%</span>
                  </div>
                  <div className="flex h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="bg-blue-500" style={{ width: `${h2h.stats.possession.home}%` }}></div>
                    <div className="bg-orange-500" style={{ width: `${h2h.stats.possession.away}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-6 flex items-center">
              <span className="w-1.5 h-4 bg-blue-600 mr-4"></span>
              Encounter Timeline
            </h3>
            <div className="bg-[#0f172a]/50 rounded-[2rem] border border-white/5 overflow-hidden divide-y divide-white/5">
              {history.map((res, i) => (
                <div key={i} className="flex items-center justify-between p-6 hover:bg-white/[0.02] transition-all group">
                  <div className="text-[10px] font-black text-slate-600 group-hover:text-slate-400 transition-colors flex-1 uppercase tracking-widest">
                    {new Date(res.date).getFullYear()} <span className="text-[8px] opacity-30 ml-2">SEASON</span>
                  </div>
                  <div className="flex items-center justify-center gap-8 flex-[3]">
                    <span className={`text-sm font-black uppercase tracking-tight transition-all ${res.winner === 'home' ? 'text-white scale-105' : 'text-slate-600'}`}>{match.homeTeam}</span>
                    <span className="bg-[#020617] px-5 py-2 rounded-xl text-xs font-black text-blue-500 border border-white/5 shadow-inner min-w-[70px] text-center tracking-tighter">
                      {res.score}
                    </span>
                    <span className={`text-sm font-black uppercase tracking-tight transition-all ${res.winner === 'away' ? 'text-white scale-105' : 'text-slate-600'}`}>{match.awayTeam}</span>
                  </div>
                  <div className="flex-1 text-right">
                    <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-xl border ${
                      res.winner === 'draw' ? 'bg-slate-800/40 text-slate-500 border-white/5' : 
                      res.winner === 'home' ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' : 'bg-orange-600/10 text-orange-400 border-orange-500/20'
                    }`}>
                      {res.winner === 'draw' ? 'DRAW' : res.winner === 'home' ? 'HOME' : 'AWAY'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <div className="glass-panel border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
            <button 
              onClick={() => setShowOddsDropdown(!showOddsDropdown)}
              className="w-full p-8 flex justify-between items-center group/odds"
            >
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-2 opacity-60">Exchange Market</span>
                <span className="text-lg font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">Compare Liquidity</span>
              </div>
              <div className={`p-3 rounded-xl bg-[#020617] border border-white/5 transition-transform duration-300 ${showOddsDropdown ? 'rotate-180 shadow-glow' : ''}`}>
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            <div className={`transition-all duration-500 ease-in-out ${showOddsDropdown ? 'max-h-[500px] opacity-100 border-t border-white/5' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <div className="p-8 space-y-6">
                <div className="flex justify-end gap-10 text-[10px] font-black text-slate-600 px-2 uppercase tracking-widest">
                  <span>1</span>
                  <span>X</span>
                  <span>2</span>
                </div>
                <div className="space-y-4">
                  {bookies.map((b, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{b.name}</span>
                      <div className="flex gap-2">
                        {[b.h, b.d, b.a].map((odd, i) => (
                          <div key={i} className="px-4 py-2 bg-[#020617] border border-white/5 rounded-xl text-xs font-black text-white hover:border-blue-500/50 transition-all cursor-pointer min-w-[60px] text-center active:scale-95">
                            {odd.toFixed(2)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-white/5">
                   <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95">
                     Direct Execution
                   </button>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="shimmer absolute inset-0 opacity-10"></div>
            <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-6">Strategic Advice</h4>
            <p className="text-slate-100 text-lg leading-relaxed font-bold italic mb-10 relative z-10 tracking-tight">
              "{match.predictions.advice}"
            </p>
            <div className="space-y-4">
              <div className="bg-[#020617] p-6 rounded-2xl border border-white/5 shadow-inner flex justify-between items-center group hover:border-blue-500/30 transition-all duration-300">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Confidence Index</span>
                <span className="text-xl font-black text-white tracking-tighter">{(match.probabilities.home + match.probabilities.away) / 2 > 45 ? 'PEAK' : 'STABLE'}</span>
              </div>
              <div className="bg-[#020617] p-6 rounded-2xl border border-white/5 shadow-inner flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Goals Probability</span>
                <span className="text-2xl font-black text-orange-500 tracking-tighter">{match.predictions.over25}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;