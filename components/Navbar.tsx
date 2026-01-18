
import React, { useState } from 'react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

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
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded transition-all ${
                    activeTab === item.id ? 'text-blue-400 bg-blue-400/5' : 'text-gray-500 hover:text-gray-200'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center">
            <div className="text-gray-600 text-[8px] font-black uppercase tracking-widest flex items-center">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block mr-2 animate-pulse"></span>
               Live
            </div>
          </div>
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-500">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-gray-950 border-b border-gray-900 px-4 py-3 space-y-1 animate-fadeIn">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
              className={`block w-full text-left py-2 text-[10px] font-black uppercase tracking-widest ${activeTab === item.id ? 'text-blue-400 bg-blue-400/5 px-2 rounded' : 'text-gray-500 px-2'}`}>
              {item.name}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
