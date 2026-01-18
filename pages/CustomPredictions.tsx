
import React, { useState } from 'react';
import { PoissonPrediction } from '../types';

const CustomPredictions: React.FC = () => {
  const [homeTeam, setHomeTeam] = useState('Arsenal');
  const [awayTeam, setAwayTeam] = useState('Man City');
  const [homeAtk, setHomeAtk] = useState(1.85);
  const [awayDef, setAwayDef] = useState(1.10);
  const [awayAtk, setAwayAtk] = useState(2.10);
  const [homeDef, setHomeDef] = useState(0.95);
  
  const [prediction, setPrediction] = useState<PoissonPrediction | null>(null);

  const calculatePoisson = () => {
    const homeExp = homeAtk * awayDef;
    const awayExp = awayAtk * homeDef;
    
    const homeWinProb = (homeExp / (homeExp + awayExp)) * 0.75 + 0.1;
    const awayWinProb = (awayExp / (homeExp + awayExp)) * 0.75 + 0.1;
    const drawProb = 1 - homeWinProb - awayWinProb;

    setPrediction({
      homeWin: Math.round(homeWinProb * 100),
      draw: Math.round(drawProb * 100),
      awayWin: Math.round(awayWinProb * 100),
      mostLikelyScore: `${Math.round(homeExp)}-${Math.round(awayExp)}`,
      over25: Math.round((homeExp + awayExp > 2.5 ? 0.65 : 0.45) * 100),
      under25: 100 - Math.round((homeExp + awayExp > 2.5 ? 0.65 : 0.45) * 100)
    });
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn pb-20">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white tracking-tighter">POISSON LAB</h1>
        <p className="text-gray-500 font-medium mt-2">Fine-tune attack and defense parameters to generate custom match probabilities.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-gray-900 p-10 rounded-[2.5rem] shadow-xl border border-gray-800 space-y-10">
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-6">
              <h3 className="font-black text-blue-400 uppercase text-[10px] tracking-widest">Home Territory</h3>
              <input 
                className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
              />
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Attack</label>
                  <span className="font-mono font-black text-blue-400 text-sm">{homeAtk}</span>
                </div>
                <input 
                  type="range" min="0" max="5" step="0.1" 
                  className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  value={homeAtk} onChange={(e) => setHomeAtk(Number(e.target.value))}
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Defense</label>
                  <span className="font-mono font-black text-blue-400 text-sm">{homeDef}</span>
                </div>
                <input 
                  type="range" min="0" max="5" step="0.1" 
                  className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  value={homeDef} onChange={(e) => setHomeDef(Number(e.target.value))}
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="font-black text-orange-400 uppercase text-[10px] tracking-widest">Away Territory</h3>
              <input 
                className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 text-white font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
              />
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Attack</label>
                  <span className="font-mono font-black text-orange-400 text-sm">{awayAtk}</span>
                </div>
                <input 
                  type="range" min="0" max="5" step="0.1" 
                  className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  value={awayAtk} onChange={(e) => setAwayAtk(Number(e.target.value))}
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Defense</label>
                  <span className="font-mono font-black text-orange-400 text-sm">{awayDef}</span>
                </div>
                <input 
                  type="range" min="0" max="5" step="0.1" 
                  className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  value={awayDef} onChange={(e) => setAwayDef(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          
          <button 
            onClick={calculatePoisson}
            className="w-full bg-white text-gray-950 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-gray-200 transition-all shadow-xl shadow-white/5 active:scale-[0.98]"
          >
            Synthesize Model
          </button>
        </div>

        <div className="flex flex-col justify-center">
          {prediction ? (
            <div className="bg-gray-900 rounded-[3rem] p-12 text-white shadow-2xl border border-gray-800 relative overflow-hidden animate-slideUp">
              <div className="absolute top-0 right-0 p-8">
                <span className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">Model Convergence</span>
              </div>
              
              <div className="text-center mb-12">
                <div className="text-gray-500 uppercase text-[10px] font-black tracking-[0.3em] mb-4">Estimated Final Result</div>
                <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-600 tracking-tighter">{prediction.mostLikelyScore}</div>
              </div>

              <div className="space-y-10">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase text-gray-500 tracking-widest mb-4">
                    <span>Probability Distribution</span>
                  </div>
                  <div className="flex h-3 rounded-full overflow-hidden bg-gray-950 border border-gray-800">
                    <div className="bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]" style={{ width: `${prediction.homeWin}%` }} />
                    <div className="bg-gray-700" style={{ width: `${prediction.draw}%` }} />
                    <div className="bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]" style={{ width: `${prediction.awayWin}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] font-black mt-4">
                    <span className="text-blue-400">{homeTeam} {prediction.homeWin}%</span>
                    <span className="text-gray-500">Draw {prediction.draw}%</span>
                    <span className="text-orange-400">{awayTeam} {prediction.awayWin}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-950 rounded-3xl p-6 text-center border border-gray-800 shadow-inner">
                    <div className="text-[10px] font-black text-gray-600 uppercase mb-2 tracking-widest">Over 2.5 Prob</div>
                    <div className="text-3xl font-black text-blue-400">{prediction.over25}%</div>
                  </div>
                  <div className="bg-gray-950 rounded-3xl p-6 text-center border border-gray-800 shadow-inner">
                    <div className="text-[10px] font-black text-gray-600 uppercase mb-2 tracking-widest">Under 2.5 Prob</div>
                    <div className="text-3xl font-black text-orange-400">{prediction.under25}%</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900/50 border-2 border-dashed border-gray-800 rounded-[3rem] p-20 text-center text-gray-600">
              <div className="mb-6">
                <svg className="mx-auto h-16 w-16 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="font-bold text-lg max-w-xs mx-auto">Configure team parameters and click predict to see model outputs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomPredictions;
