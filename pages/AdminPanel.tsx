
import React, { useState, useRef, useEffect } from 'react';
import { parseStandingsCSV, parseMatchesCSV } from '../services/csvService.ts';

interface AdminPanelProps {
  onDataUpdate: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onDataUpdate }) => {
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [standingsFile, setStandingsFile] = useState<File | null>(null);
  const [matchesFile, setMatchesFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [engine, setEngine] = useState<'gemini' | 'api'>(() => (localStorage.getItem('data_engine') as any) || 'gemini');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('external_api_key') || '');

  const standingsInputRef = useRef<HTMLInputElement>(null);
  const matchesInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('data_engine', engine);
  }, [engine]);

  const saveSettings = () => {
    localStorage.setItem('external_api_key', apiKey);
    setStatus({ type: 'success', msg: 'Settings saved successfully.' });
  };

  const handleUpload = async (type: 'standings' | 'matches') => {
    const file = type === 'standings' ? standingsFile : matchesFile;
    if (!file) {
      setStatus({ type: 'error', msg: 'Please select a file first.' });
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (type === 'standings') {
          const data = parseStandingsCSV(text);
          localStorage.setItem('custom_standings', JSON.stringify(data));
          setStandingsFile(null);
          if (standingsInputRef.current) standingsInputRef.current.value = '';
        } else {
          const data = parseMatchesCSV(text);
          localStorage.setItem('custom_matches', JSON.stringify(data));
          setMatchesFile(null);
          if (matchesInputRef.current) matchesInputRef.current.value = '';
        }
        
        setStatus({ type: 'success', msg: `${type === 'standings' ? 'Standings' : 'Matches'} data uploaded successfully!` });
        onDataUpdate();
      } catch (err: any) {
        setStatus({ type: 'error', msg: err.message || 'Failed to parse CSV.' });
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn pb-20 space-y-12">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">SYSTEM CONFIG</h1>
        <p className="text-gray-500 font-medium mt-2">Manage your data engines and API integrations.</p>
      </div>

      {status && (
        <div className={`p-5 rounded-2xl flex items-center justify-between shadow-2xl animate-slideUp ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          <div className="flex items-center">
            <span className={`w-2.5 h-2.5 rounded-full mr-4 ${status.type === 'success' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}></span>
            <span className="font-black text-sm uppercase tracking-widest">{status.msg}</span>
          </div>
          <button onClick={() => setStatus(null)} className="text-current opacity-40 hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {/* Engine Selection */}
      <div className="bg-gray-900 p-10 rounded-[2.5rem] border border-gray-800 shadow-xl">
        <h2 className="text-2xl font-black text-white mb-8 flex items-center">
          <span className="mr-3 p-2 bg-blue-500/10 rounded-lg text-blue-400">⚙️</span>
          Primary Data Engine
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => setEngine('gemini')}
            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-start text-left ${engine === 'gemini' ? 'border-blue-500 bg-blue-500/5' : 'border-gray-800 bg-gray-950/50 hover:border-gray-700'}`}
          >
            <span className={`text-[10px] font-black uppercase tracking-widest mb-2 ${engine === 'gemini' ? 'text-blue-400' : 'text-gray-600'}`}>AI Engine</span>
            <span className="text-lg font-black text-white">Gemini AI Search</span>
            <p className="text-xs text-gray-500 mt-2">Fetches live data from Google Search/Wikipedia using LLM extraction.</p>
          </button>
          <button 
            onClick={() => setEngine('api')}
            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-start text-left ${engine === 'api' ? 'border-green-500 bg-green-500/5' : 'border-gray-800 bg-gray-950/50 hover:border-gray-700'}`}
          >
            <span className={`text-[10px] font-black uppercase tracking-widest mb-2 ${engine === 'api' ? 'text-green-400' : 'text-gray-600'}`}>API Engine</span>
            <span className="text-lg font-black text-white">Football-Data.org</span>
            <p className="text-xs text-gray-500 mt-2">Fetches structured accurate data from official football APIs.</p>
          </button>
        </div>

        {engine === 'api' && (
          <div className="mt-8 pt-8 border-t border-gray-800 space-y-4 animate-slideUp">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Football-Data.org API Key</label>
              <div className="flex gap-4">
                <input 
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste your API key here..."
                  className="flex-1 bg-gray-950 border border-gray-800 rounded-2xl px-6 py-4 text-white font-mono text-sm outline-none focus:border-green-500 transition-all"
                />
                <button 
                  onClick={saveSettings}
                  className="bg-white text-gray-950 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
                >
                  Save Key
                </button>
              </div>
              <p className="text-[10px] text-gray-600">Get a free key at <a href="https://www.football-data.org/" target="_blank" className="text-blue-400 underline">football-data.org</a></p>
            </div>
          </div>
        )}
      </div>

      {/* CSV Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-gray-900 p-10 rounded-[2.5rem] shadow-xl border border-gray-800 flex flex-col justify-between group hover:border-blue-500/30 transition-all">
          <div>
            <div className="h-16 w-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <h2 className="text-2xl font-black text-white mb-3">League Standings CSV</h2>
          </div>
          
          <div className="space-y-6">
            <input ref={standingsInputRef} type="file" accept=".csv" onChange={(e) => setStandingsFile(e.target.files?.[0] || null)} className="hidden" id="standings-file" />
            <label htmlFor="standings-file" className="flex items-center justify-center w-full px-6 py-5 border-2 border-dashed border-gray-800 rounded-3xl cursor-pointer hover:border-blue-500/50 hover:bg-gray-800/50 transition-all">
              <span className="text-xs font-black text-gray-500 uppercase tracking-widest text-center">{standingsFile ? standingsFile.name : 'Select Standings CSV'}</span>
            </label>
            <button disabled={!standingsFile || isUploading} onClick={() => handleUpload('standings')} className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${standingsFile && !isUploading ? 'bg-blue-600 text-white hover:bg-blue-500 active:scale-[0.98]' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}>Upload CSV</button>
          </div>
        </div>

        <div className="bg-gray-900 p-10 rounded-[2.5rem] shadow-xl border border-gray-800 flex flex-col justify-between group hover:border-orange-500/30 transition-all">
          <div>
            <div className="h-16 w-16 bg-orange-500/10 text-orange-400 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h2 className="text-2xl font-black text-white mb-3">Predictions CSV</h2>
          </div>
          
          <div className="space-y-6">
            <input ref={matchesInputRef} type="file" accept=".csv" onChange={(e) => setMatchesFile(e.target.files?.[0] || null)} className="hidden" id="matches-file" />
            <label htmlFor="matches-file" className="flex items-center justify-center w-full px-6 py-5 border-2 border-dashed border-gray-800 rounded-3xl cursor-pointer hover:border-orange-500/50 hover:bg-gray-800/50 transition-all">
              <span className="text-xs font-black text-gray-500 uppercase tracking-widest text-center">{matchesFile ? matchesFile.name : 'Select Predictions CSV'}</span>
            </label>
            <button disabled={!matchesFile || isUploading} onClick={() => handleUpload('matches')} className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${matchesFile && !isUploading ? 'bg-orange-600 text-white hover:bg-orange-500 active:scale-[0.98]' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}>Upload CSV</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;