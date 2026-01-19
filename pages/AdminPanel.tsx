import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { parseCSV } from '../services/csvService';

interface AdminPanelProps {
  onDataUpdate: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onDataUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [standingsFile, setStandingsFile] = useState<File | null>(null);
  const [matchesFile, setMatchesFile] = useState<File | null>(null);

  const standingsInputRef = useRef<HTMLInputElement>(null);
  const matchesInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'standings' | 'matches') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'standings') setStandingsFile(file);
      else setMatchesFile(file);
    }
  };

  const handleUpload = async (type: 'standings' | 'matches') => {
    const file = type === 'standings' ? standingsFile : matchesFile;
    if (!file) return;

    setIsUploading(true);
    setStatus(null);

    try {
      const data = await parseCSV(file);
      localStorage.setItem(`custom_${type}`, JSON.stringify(data));
      onDataUpdate();
      setStatus({ type: 'success', message: `${type.charAt(0).toUpperCase() + type.slice(1)} database updated successfully.` });
      if (type === 'standings') setStandingsFile(null);
      else setMatchesFile(null);
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to parse database file.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn">
      <div className="border-b border-white/5 pb-8">
        <h1 className="text-2xl font-black text-white tracking-tighter uppercase mb-1">Core Config</h1>
        <p className="text-sm font-medium text-slate-500">Platform database management and ingestion engine.</p>
      </div>

      {status && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-2xl flex items-center justify-between border ${status.type === 'success' ? 'bg-green-500/5 border-green-500/20 text-green-500' : 'bg-red-500/5 border-red-500/20 text-red-500'}`}
        >
          <span className="text-[11px] font-black uppercase tracking-widest">{status.message}</span>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setStatus(null)} className="text-current opacity-40 hover:opacity-100 transition-opacity">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-10 space-y-8">
          <div>
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-2">Standings DB</h3>
            <p className="text-[10px] text-slate-600 font-bold uppercase">CSV format with Rank, Team, Points.</p>
          </div>
          <div
            onClick={() => standingsInputRef.current?.click()}
            className="h-32 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/30 transition-all bg-slate-800/20"
          >
            <input type="file" ref={standingsInputRef} className="hidden" accept=".csv" onChange={(e) => handleFileChange(e, 'standings')} />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{standingsFile ? standingsFile.name : 'Drop File or Click'}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!standingsFile || isUploading}
            onClick={() => handleUpload('standings')}
            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${standingsFile && !isUploading ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
          >
            Upload CSV
          </motion.button>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-10 space-y-8">
          <div>
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-2">Matches DB</h3>
            <p className="text-[10px] text-slate-600 font-bold uppercase">CSV format for match fixture data.</p>
          </div>
          <div
            onClick={() => matchesInputRef.current?.click()}
            className="h-32 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-500/30 transition-all bg-slate-800/20"
          >
            <input type="file" ref={matchesInputRef} className="hidden" accept=".csv" onChange={(e) => handleFileChange(e, 'matches')} />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{matchesFile ? matchesFile.name : 'Drop File or Click'}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!matchesFile || isUploading}
            onClick={() => handleUpload('matches')}
            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${matchesFile && !isUploading ? 'bg-orange-600 text-white hover:bg-orange-500' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
          >
            Upload CSV
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
