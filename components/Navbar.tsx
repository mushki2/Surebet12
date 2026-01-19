import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from 'firebase/auth';
import { signInWithGoogle, logout, onAuthChange } from '../services/authService';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    setActiveTab('login');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navItems = [
    { id: 'home', name: 'Feed' },
    { id: 'predictions', name: 'Poisson' },
    { id: 'arbitrage', name: 'Arbs' },
    { id: 'casino', name: 'Casino' },
    { id: 'admin', name: 'Config' },
  ];

  return (
    <nav className="bg-gray-950 border-b border-gray-900 sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-12">
          <div className="flex items-center">
            <div className="flex items-center cursor-pointer group" onClick={() => setActiveTab('home')}>
              <div className="h-6 w-6 bg-blue-600 rounded flex items-center justify-center mr-2 shadow-md group-hover:bg-blue-500 transition-colors">
                <span className="text-white font-black italic text-xs">S</span>
              </div>
              <span className="text-sm font-black tracking-tighter text-white uppercase">SUREBETS<span className="text-blue-500">ODDS</span></span>
            </div>
            <div className="hidden md:ml-8 md:flex space-x-1">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded transition-all ${
                    activeTab === item.id ? 'text-blue-400 bg-blue-400/5' : 'text-gray-500 hover:text-gray-200'
                  }`}
                >
                  {item.name}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center">
              <div className="text-gray-600 text-[8px] font-black uppercase tracking-widest flex items-center">
                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block mr-2 animate-pulse"></span>
                 Live
              </div>
            </div>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-end">
                  <span className="text-[8px] text-white font-bold leading-tight">{user.displayName}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="text-[7px] text-red-500 font-black uppercase hover:text-red-400 transition-colors"
                  >
                    Logout
                  </motion.button>
                </div>
                {user.photoURL && <img src={user.photoURL} alt="User" className="h-6 w-6 rounded-full border border-white/10" />}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('signup')}
                  className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded transition-all ${activeTab === 'signup' ? 'text-blue-400 bg-blue-400/5' : 'text-slate-500 hover:text-white'}`}
                >
                  Sign Up
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('login')}
                  className={`bg-blue-600 text-white text-[9px] font-black uppercase px-4 py-1.5 rounded shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all ${activeTab === 'login' ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-950' : ''}`}
                >
                  Login
                </motion.button>
              </div>
            )}

            <div className="flex items-center md:hidden">
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-500"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-gray-950 border-b border-gray-900 px-4 py-3 space-y-1 animate-fadeIn">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
              className={`block w-full text-left py-2 text-[10px] font-black uppercase tracking-widest ${activeTab === item.id ? 'text-blue-400 bg-blue-400/5 px-2 rounded' : 'text-gray-500 px-2'}`}
            >
              {item.name}
            </motion.button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
