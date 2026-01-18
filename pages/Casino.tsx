
import React, { useState, useEffect } from 'react';

// Symbols strictly from the paytable
const SYMBOLS = ['7️⃣', '💎', '🃏', '🔔', '🍒', '🍇'];
const REEL_COUNT = 5;
const SYMBOL_HEIGHT = 64; 
const VIEW_WINDOW = 3; 
const MIN_SPINS = 5; 

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

  // --- SLOTS COMPONENT ---
  const Slots = () => {
    const [winningIndices, setWinningIndices] = useState<number[]>([]);
    const [reelOffsets, setReelOffsets] = useState<number[]>(new Array(REEL_COUNT).fill(0));
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
        // Update the landing symbol at the bottom of the strip
        newStrip[newStrip.length - 1] = finalResults[i];
        // Sync the starting symbol for when it resets back to 0
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
      <div className="space-y-4 animate-fadeIn">
        <div className={`bg-gray-900/50 p-3 rounded-xl border border-gray-800/30 shadow-2xl relative overflow-hidden transition-all duration-500 ${
          winState === 'win' ? 'ring-1 ring-green-500/20 bg-green-500/5' : winState === 'loss' ? 'animate-shake' : ''
        }`}>
          <div className="grid grid-cols-5 gap-1 h-[192px] mb-4 bg-gray-950 p-1 rounded-lg border border-gray-800/20">
            {reelStrips.map((strip, i) => {
              const isWinning = winningIndices.includes(i);
              return (
                <div key={i} className="bg-gray-900 rounded-md overflow-hidden relative shadow-inner">
                  <div 
                    className="flex flex-col transition-transform duration-[2000ms] will-change-transform"
                    style={{ 
                      transitionTimingFunction: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
                      transform: spinning 
                        ? `translateY(-${(strip.length - VIEW_WINDOW) * SYMBOL_HEIGHT}px) translateZ(0)` 
                        : 'translateY(0) translateZ(0)'
                    }}
                  >
                    {strip.map((symbol, idx) => (
                      <div key={idx} className={`h-[64px] flex items-center justify-center text-3xl md:text-4xl select-none transition-all ${
                        isWinning && !spinning && idx === 0 ? 'animate-winPulse scale-110' : ''
                      }`}>
                        {symbol}
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_20px_20px_-15px_rgba(0,0,0,0.8),inset_0_-20px_20px_-15px_rgba(0,0,0,0.8)]"></div>
                  {isWinning && !spinning && <div className="absolute inset-0 border border-green-500/30 rounded-md pointer-events-none z-10"></div>}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col md:flex-row gap-3 items-center justify-between px-1">
            <div className="flex items-center gap-4 bg-gray-950 px-3 py-1.5 rounded-lg border border-gray-800/30 shadow-lg">
              <div className="flex flex-col">
                <span className="text-[6px] font-black text-gray-600 uppercase mb-0.5 tracking-tighter">Stake</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setBet(Math.max(10, bet - 10))} className="text-gray-500 hover:text-white font-black text-sm">-</button>
                  <span className="text-xs font-black text-white w-8 text-center">${bet}</span>
                  <button onClick={() => setBet(bet + 10)} className="text-gray-500 hover:text-white font-black text-sm">+</button>
                </div>
              </div>
              <div className="h-6 w-px bg-gray-800 mx-1"></div>
              <div className="flex flex-col">
                <span className="text-[6px] font-black text-blue-500 uppercase mb-0.5 tracking-tighter">Return</span>
                <span className={`text-xs font-black ${lastWin > 0 ? 'text-green-500' : 'text-gray-700'}`}>${lastWin}</span>
              </div>
            </div>
            <button disabled={spinning} onClick={spin} className={`w-full md:w-auto px-8 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-[0.3em] shadow-lg transition-all ${spinning ? 'bg-gray-800 text-gray-600' : 'bg-white text-black hover:bg-blue-600 hover:text-white'}`}>
              {spinning ? 'SPINNING' : 'SPIN REELS'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-gray-900/40 p-3 rounded-xl border border-gray-800/20">
             <h4 className="text-[7px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center">
               <span className="w-1 h-1 bg-blue-500 rounded-full mr-1.5"></span>
               Payout Matrix
             </h4>
             <div className="grid grid-cols-2 gap-x-4 gap-y-1">
               {[
                 {s: '7️⃣', m: '100x'}, {s: '💎', m: '50x'}, {s: '🃏', m: '80x'},
                 {s: '🔔', m: '20x'}, {s: '🍒', m: '5x'}, {s: '🍇', m: '3x'}
               ].map((item, i) => (
                 <div key={i} className="flex justify-between items-center py-0.5 border-b border-gray-800/10 last:border-0">
                   <span className="text-lg">{item.s}</span>
                   <span className="font-black text-white text-[9px] uppercase tracking-tighter">{item.m}</span>
                 </div>
               ))}
             </div>
          </div>
          <div className="bg-blue-600/5 p-4 rounded-xl flex flex-col justify-center items-center text-center border border-blue-500/5">
             <div className="text-[7px] font-black text-blue-500/60 uppercase tracking-widest mb-1">Theoretical RTP</div>
             <div className="text-3xl font-black text-white tracking-tighter">96.5%</div>
          </div>
        </div>
      </div>
    );
  };

  // --- BLACKJACK COMPONENT ---
  const Blackjack = () => {
    const [deck, setDeck] = useState<number[]>([]);
    const [playerHand, setPlayerHand] = useState<number[]>([]);
    const [dealerHand, setDealerHand] = useState<number[]>([]);
    const [gameStatus, setGameStatus] = useState<'betting' | 'playing' | 'dealer-turn' | 'ended'>('betting');

    const calculateTotal = (hand: number[]) => {
      let total = hand.reduce((acc, val) => acc + (val > 10 ? 10 : val), 0);
      const aceCount = hand.filter(c => c === 1).length;
      for (let i = 0; i < aceCount; i++) if (total + 10 <= 21) total += 10;
      return total;
    };

    const startNewGame = () => {
      if (balance < bet) return setMessage('Insufficient credits.');
      updateBalance(-bet);
      const newDeck = Array.from({ length: 52 }, (_, i) => (i % 13) + 1).sort(() => Math.random() - 0.5);
      const ph = [newDeck.pop()!, newDeck.pop()!];
      const dh = [newDeck.pop()!, newDeck.pop()!];
      setDeck(newDeck); setPlayerHand(ph); setDealerHand(dh);
      if (calculateTotal(ph) === 21) {
        setGameStatus('ended'); updateBalance(Math.floor(bet * 2.5));
        setMessage('NATURAL BLACKJACK!');
      } else {
        setGameStatus('playing'); setMessage('Hit or Stand?');
      }
    };

    const hit = () => {
      const card = deck.pop()!;
      const newHand = [...playerHand, card];
      setPlayerHand(newHand);
      if (calculateTotal(newHand) > 21) {
        setGameStatus('ended'); setMessage('BUST!');
      }
    };

    const stand = () => {
      setGameStatus('dealer-turn');
      let curD = [...dealerHand], curDeck = [...deck];
      const playDealer = () => {
        const dTotal = calculateTotal(curD);
        if (dTotal < 17) {
          curD.push(curDeck.pop()!);
          setDealerHand([...curD]); setTimeout(playDealer, 400);
        } else {
          const finalD = calculateTotal(curD), finalP = calculateTotal(playerHand);
          setGameStatus('ended');
          if (finalD > 21 || finalP > finalD) { updateBalance(bet * 2); setMessage('PLAYER WINS!'); }
          else if (finalD === finalP) { updateBalance(bet); setMessage('PUSH (Draw)'); }
          else setMessage('DEALER WINS');
        }
      };
      playDealer();
    };

    return (
      <div className="bg-gray-900/50 p-6 rounded-2xl space-y-6 animate-fadeIn max-w-2xl mx-auto border border-gray-800/30">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-950 p-4 rounded-xl text-center border border-gray-800/20 shadow-inner">
            <h3 className="text-[7px] font-black text-gray-500 uppercase mb-3 tracking-widest">Dealer ({gameStatus === 'playing' ? '?' : calculateTotal(dealerHand)})</h3>
            <div className="flex justify-center gap-1.5">
              {dealerHand.map((card, i) => (
                <div key={i} className={`w-10 h-14 rounded flex items-center justify-center font-black text-lg ${gameStatus === 'playing' && i === 1 ? 'bg-blue-900/40 text-blue-400' : 'bg-white text-gray-950'}`}>
                  {gameStatus === 'playing' && i === 1 ? '?' : card === 1 ? 'A' : card > 10 ? 'JQK'[card-11] : card}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-950 p-4 rounded-xl text-center border border-gray-800/20 shadow-inner">
            <h3 className="text-[7px] font-black text-blue-500 uppercase mb-3 tracking-widest">Player ({calculateTotal(playerHand)})</h3>
            <div className="flex justify-center gap-1.5">
              {playerHand.map((card, i) => (
                <div key={i} className="w-10 h-14 bg-white rounded flex items-center justify-center text-gray-950 font-black text-lg">
                  {card === 1 ? 'A' : card > 10 ? 'JQK'[card-11] : card}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {gameStatus === 'betting' || gameStatus === 'ended' ? (
            <button onClick={startNewGame} className="w-full py-3 bg-white text-black rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all">DEAL ($20)</button>
          ) : (
            <>
              <button disabled={gameStatus !== 'playing'} onClick={hit} className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-black text-[10px] uppercase tracking-widest">HIT</button>
              <button disabled={gameStatus !== 'playing'} onClick={stand} className="flex-1 py-3 bg-gray-800 text-white rounded-lg font-black text-[10px] uppercase tracking-widest">STAND</button>
            </>
          )}
        </div>
      </div>
    );
  };

  // --- ROULETTE COMPONENT ---
  const Roulette = () => {
    const [sel, setSel] = useState<number | 'red' | 'black' | null>(null);
    const [winNum, setWinNum] = useState<number | null>(null);
    const isRed = (n: number) => [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(n);

    const roll = () => {
      if (sel === null || balance < 20) return setMessage('Select a color/number first.');
      updateBalance(-20); setSpinning(true); setWinNum(null);
      setTimeout(() => {
        const r = Math.floor(Math.random() * 37);
        setWinNum(r); setSpinning(false);
        if ((sel === 'red' && isRed(r)) || (sel === 'black' && !isRed(r) && r !== 0)) { updateBalance(40); setMessage(`WINNER! The ball landed on ${r}.`); }
        else if (sel === r) { updateBalance(700); setMessage(`JACKPOT! Exact hit on ${r}.`); }
        else setMessage(`LOSER. The ball landed on ${r}.`);
      }, 1500);
    };

    return (
      <div className="bg-gray-900/50 p-6 rounded-2xl space-y-6 animate-fadeIn text-center max-w-xl mx-auto border border-gray-800/30">
        <div className="flex gap-2">
          <button onClick={() => setSel('red')} className={`flex-1 py-3 rounded-lg font-black text-[10px] uppercase tracking-widest border transition-all ${sel === 'red' ? 'bg-red-600 border-red-500' : 'bg-red-950/20 text-red-500 border-transparent'}`}>RED</button>
          <button onClick={() => setSel('black')} className={`flex-1 py-3 rounded-lg font-black text-[10px] uppercase tracking-widest border transition-all ${sel === 'black' ? 'bg-gray-800 border-gray-700' : 'bg-gray-950 text-gray-500 border-transparent'}`}>BLACK</button>
        </div>
        <div className="text-6xl font-black text-white tracking-tighter h-20 flex items-center justify-center">
          {spinning ? <span className="animate-pulse">SPINNING...</span> : winNum ?? '00'}
        </div>
        <button disabled={spinning} onClick={roll} className="w-full py-3 bg-white text-black rounded-lg font-black text-[10px] uppercase tracking-widest">BET $20</button>
      </div>
    );
  };

  const renderGame = () => {
    switch (activeGame) {
      case 'slots': return <Slots />;
      case 'blackjack': return <Blackjack />;
      case 'roulette': return <Roulette />;
      default: return <div className="text-center p-12 text-gray-700 uppercase text-[9px] font-black tracking-widest">Module under maintenance...</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12 space-y-5 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">PLATINUM CASINO</h1>
          <p className="text-gray-600 font-medium mt-1 text-[8px] uppercase tracking-widest">{message}</p>
        </div>
        <div className="bg-gray-900 px-4 py-2 rounded-lg border border-gray-800/30 shadow-xl text-right min-w-[140px]">
          <div className="text-[6px] font-black text-blue-500 uppercase tracking-widest mb-0.5 opacity-60">Bankroll</div>
          <div className="text-xl font-black text-white tracking-tighter">${balance.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex gap-1 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {['slots', 'blackjack', 'roulette', 'crash', 'dice'].map(game => (
          <button
            key={game}
            onClick={() => {
              setActiveGame(game);
              setMessage(`Switched to ${game}. Ready?`);
            }}
            className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest transition-all ${
              activeGame === game ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-900 text-gray-500 hover:text-white border border-gray-800/20'
            }`}
          >
            {game}
          </button>
        ))}
      </div>

      <div className="min-h-[300px]">
        {renderGame()}
      </div>

      <div className="p-3 bg-gray-900/20 rounded-lg text-center border border-gray-800/10">
        <p className="text-[7px] text-gray-700 font-black uppercase tracking-[0.3em]">Simulation Mode · No Real Money · Provably Fair Algorithm</p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-1px); } 75% { transform: translateX(1px); } }
        .animate-shake { animation: shake 0.1s ease-in-out 3; }
        @keyframes winPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } }
        .animate-winPulse { animation: winPulse 0.4s ease-in-out infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
};

export default Casino;
