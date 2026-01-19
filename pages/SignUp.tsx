import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { registerWithEmail, signInWithGoogle } from '../services/authService';

interface SignUpProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerWithEmail(email, password, name);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-6 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[32px] shadow-2xl">
      <div className="text-center mb-10">
        <h2 className="text-xl font-black text-white tracking-tighter uppercase mb-1">Create Account</h2>
        <p className="text-sm font-medium text-slate-500">Join the elite betting intelligence network.</p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-6">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-2">Display Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-blue-500/50 transition-all"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-2">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-blue-500/50 transition-all"
            placeholder="name@example.com"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-2">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-blue-500/50 transition-all"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-orange-600 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-orange-500 transition-all disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Register'}
        </motion.button>
      </form>

      <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleSignUp}
          type="button"
          disabled={loading}
          className="w-full py-4 bg-white text-slate-900 text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:bg-slate-100 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <span>Sign up with Google</span>
        </motion.button>

        <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest pt-4">
          Already have an account? {' '}
          <button onClick={onSwitchToLogin} className="text-blue-500 hover:text-blue-400 transition-colors">Login</button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
