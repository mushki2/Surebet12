
import React, { useState } from 'react';
import { Match } from '../types.ts';

interface MatchDetailsProps {
  match: Match;
  onBack: () => void;
}

const FormCircle: React.FC<{ result: 'W' | 'D' | 'L' }> = ({ result }) => {
  const colors = {
    W: 'bg-green-500 text-white',
    D: 'bg-gray-600 text-white',
    L: 'bg-red-500 text-white'
  };
  return (
    <div className={`w-4 h-4 rounded flex items-center justify-center text-[7px] font-black ${colors[result]}`}>
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
  const h2h = match.h2h || { wins: { home: 0, draws: 0, away: 0 }, stats: { possession: { home: 50, away: 50 }, cleanSheets: { home: 0, away: 0 } } };

  // Calculate H2H Win Rates
  const totalGames = history.length;
  const homeWins = history.filter(h => h.winner === 'home').length;
  const awayWins = history.filter(h => h.winner === 'away').length;
  const draws = totalGames - homeWins - awayWins;

  const homeWinPct = Math.round((homeWins / totalGames) * 100);
  const awayWinPct = Math.round((awayWins / totalGames) * 100);
  const drawPct = 100 - homeWinPct - awayWinPct;

  // Mock Odds for the dropdown
  const generateMockOdds = () => {
    return [
      { name: 'Bet365', h: 2.10, d: 3.40, a: 3.50 },
      { name: 'Pinnacle', h: 2.15, d: 3.35, a: 3.60 },
      { name: 'Bwin', h: 2.05, d: 3.45, a: 3.55 }
    ];
  };
  const bookies = generateMockOdds();

  return (
    <div className="animate-fadeIn space-y-6 max-w-5xl mx-auto pb-12 px-4">
      <button 
        onClick={onBack}
        className="flex items-center text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L6.414 9H17a1 1 0 110 2H6.414l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Return to Dashboard
      </button>

      {/* Hero Section */}
      <div className="bg-gray-950 rounded-2xl p-6 md:p-10 border border-gray-900 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-orange-600 opacity-50"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="text-center md:text-left flex-1">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mb-4 mx-auto md:mx-0 shadow-xl shadow-blue-500/20 border border-white/10">
              {match.homeTeam.charAt(0)}
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">{match.homeTeam}</h1>
            <div className="flex gap-1.5 mt-3 justify-center md:justify-start">
              {match.standings?.find(s => s.team === match.homeTeam)?.form?.map((r, i) => (
                <FormCircle key={i} result={r as any} />
              ))}
            </div>
          </div>
          
          <div className="text-center px-6">
            <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2">{match.league}</div>
            <div className="text-5xl font-black text-gray-800 tracking-tighter italic select-none">VS</div>
            <div className="text-[11px] text-gray-500 font-black mt-3 uppercase tracking-widest">
              {new Date(match.startTime).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <div className="text-center md:text-right flex-1 flex flex-col items-center md:items-end">
            <div className="w-20 h-20 bg-orange-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mb-4 shadow-xl shadow-orange-500/20 border border-white/10">
              {match.awayTeam.charAt(0)}
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">{match.awayTeam}</h1>
            <div className="flex gap-1.5 mt-3 justify-center md:justify-end">
              {match.standings?.find(s => s.team === match.awayTeam)?.form?.map((r, i) => (
                <FormCircle key={i} result={r as any} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Head to Head Visual Section */}
          <section className="bg-gray-900 rounded-2xl border border-gray-800 p-6 md:p-8 space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Historical Dominance</h3>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Based on last {totalGames} matches</p>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-1">Intelligence Score</span>
                <span className="text-2xl font-black text-white">{Math.round((homeWins * 1.5 + draws) / totalGames * 10)} / 10</span>
              </div>
            </div>

            {/* Dominance Multi-Bar */}
            <div className="space-y-4">
              <div className="flex h-5 w-full rounded-xl overflow-hidden bg-gray-950 border border-gray-800 shadow-inner">
                <div 
                  className="bg-blue-600 h-full flex items-center justify-center text-[10px] font-black text-white transition-all duration-1000 shadow-[inset_-4px_0_8px_rgba(0,0,0,0.2)]"
                  style={{ width: `${homeWinPct}%` }}
                >
                  {homeWinPct > 15 && `${homeWins} HW`}
                </div>
                <div 
                  className="bg-gray-700 h-full flex items-center justify-center text-[10px] font-black text-gray-400 transition-all duration-1000"
                  style={{ width: `${drawPct}%` }}
                >
                  {drawPct > 15 && `${draws} D`}
                </div>
                <div 
                  className="bg-orange-600 h-full flex items-center justify-center text-[10px] font-black text-white transition-all duration-1000 shadow-[inset_4px_0_8px_rgba(0,0,0,0.2)]"
                  style={{ width: `${awayWinPct}%` }}
                >
                  {awayWinPct > 15 && `${awayWins} AW`}
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                <span className="text-blue-500">{homeWinPct}% HOME WIN</span>
                <span>{drawPct}% DRAW</span>
                <span className="text-orange-500">{awayWinPct}% AWAY WIN</span>
              </div>
            </div>

            {/* Comparison Gauges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Goal Efficiency
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black mb-1">
                    <span className="text-gray-400 uppercase">Avg Goals / Match</span>
                    <span className="text-white">{(h2h.stats.avgGoals?.home || 1.8).toFixed(1)} vs {(h2h.stats.avgGoals?.away || 1.4).toFixed(1)}</span>
                  </div>
                  <div className="flex h-1.5 bg-gray-950 rounded-full overflow-hidden">
                    <div className="bg-blue-500" style={{ width: '60%' }}></div>
                    <div className="bg-orange-500" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                  Tactical Control
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black mb-1">
                    <span className="text-gray-400 uppercase">Avg Possession</span>
                    <span className="text-white">{h2h.stats.possession.home}% vs {h2h.stats.possession.away}%</span>
                  </div>
                  <div className="flex h-1.5 bg-gray-950 rounded-full overflow-hidden">
                    <div className="bg-blue-500" style={{ width: `${h2h.stats.possession.home}%` }}></div>
                    <div className="bg-orange-500" style={{ width: `${h2h.stats.possession.away}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Full History List */}
          <section>
            <h3 className="text-[11px] font-black text-white uppercase tracking-widest mb-4 flex items-center">
              <span className="w-1 h-3.5 bg-indigo-500 mr-2"></span>
              Encounter Timeline
            </h3>
            <div className="bg-gray-950/30 rounded-2xl border border-gray-900 overflow-hidden divide-y divide-gray-900">
              {history.map((res, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-900/40 transition-colors group">
                  <div className="text-[10px] font-black text-gray-600 group-hover:text-gray-400 transition-colors flex-1 uppercase">
                    {new Date(res.date).getFullYear()} <span className="text-[8px] opacity-40 ml-1">SEASON</span>
                  </div>
                  <div className="flex items-center justify-center gap-4 flex-[3]">
                    <span className={`text-xs font-bold transition-all ${res.winner === 'home' ? 'text-white scale-105' : 'text-gray-600'}`}>{match.homeTeam}</span>
                    <span className="bg-gray-900 px-3 py-1.5 rounded-lg text-[11px] font-black text-blue-400 border border-gray-800 shadow-inner min-w-[50px] text-center tracking-tighter">
                      {res.score}
                    </span>
                    <span className={`text-xs font-bold transition-all ${res.winner === 'away' ? 'text-white scale-105' : 'text-gray-600'}`}>{match.awayTeam}</span>
                  </div>
                  <div className="flex-1 text-right">
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg ${
                      res.winner === 'draw' ? 'bg-gray-800/40 text-gray-500 border border-gray-800' : 
                      res.winner === 'home' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'bg-orange-600/10 text-orange-400 border border-orange-500/20'
                    }`}>
                      {res.winner === 'draw' ? 'STALEMATE' : res.winner === 'home' ? 'HOME WIN' : 'AWAY WIN'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Market Odds Dropdown */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <button 
              onClick={() => setShowOddsDropdown(!showOddsDropdown)}
              className="w-full p-5 flex justify-between items-center group/odds"
            >
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Exchange Market</span>
                <span className="text-sm font-black text-white group-hover:text-blue-300 transition-colors">Compare Bookmakers</span>
              </div>
              <div className={`p-2 rounded-lg bg-gray-950 border border-gray-800 transition-transform ${showOddsDropdown ? 'rotate-180' : ''}`}>
                <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            <div className={`transition-all duration-300 ease-in-out ${showOddsDropdown ? 'max-h-[400px] opacity-100 border-t border-gray-800' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <div className="p-5 space-y-4">
                <div className="flex justify-end gap-6 text-[9px] font-black text-gray-600 px-1 uppercase tracking-widest">
                  <span>1</span>
                  <span>X</span>
                  <span>2</span>
                </div>
                <div className="space-y-3">
                  {bookies.map((b, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-400">{b.name}</span>
                      <div className="flex gap-2">
                        <div className="px-3 py-1.5 bg-gray-950 border border-gray-800 rounded-lg text-xs font-black text-blue-400 hover:border-blue-500/50 transition-colors cursor-pointer min-w-[50px] text-center">
                          {b.h.toFixed(2)}
                        </div>
                        <div className="px-3 py-1.5 bg-gray-950 border border-gray-800 rounded-lg text-xs font-black text-gray-400 hover:border-gray-400/50 transition-colors cursor-pointer min-w-[50px] text-center">
                          {b.d.toFixed(2)}
                        </div>
                        <div className="px-3 py-1.5 bg-gray-950 border border-gray-800 rounded-lg text-xs font-black text-orange-400 hover:border-orange-500/50 transition-colors cursor-pointer min-w-[50px] text-center">
                          {b.a.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-gray-800/50">
                   <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                     Direct Execution
                   </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Strategic Advice</h4>
            <p className="text-gray-200 text-sm leading-relaxed font-medium italic mb-8 relative z-10">
              "{match.predictions.advice}"
            </p>
            <div className="space-y-4">
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 shadow-inner flex justify-between items-center group hover:border-blue-500/40 transition-colors">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Confidence Score</span>
                <span className="text-lg font-black text-white">{(match.probabilities.home + match.probabilities.away) / 2 > 45 ? 'HIGH' : 'MODERATE'}</span>
              </div>
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 shadow-inner flex justify-between items-center">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Over 2.5 Goals</span>
                <span className="text-lg font-black text-orange-400">{match.predictions.over25}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
