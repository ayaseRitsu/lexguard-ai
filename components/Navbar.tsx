
import React from 'react';
import { FileText, Play, Video } from 'lucide-react';

interface NavbarProps {
  onDemoClick: () => void;
  onTabChange: (tab: 'analysis' | 'video') => void;
  activeTab: 'analysis' | 'video';
}

const Navbar: React.FC<NavbarProps> = ({ onDemoClick, onTabChange, activeTab }) => {
  return (
    <nav className="h-16 border-b border-gray-100 px-8 flex items-center justify-between bg-white sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-md text-white">
          <FileText size={20} />
        </div>
        <span className="font-semibold text-lg text-slate-800">LexGuard AI</span>
        <span className="text-gray-400 font-normal ml-2">Contract Analysis</span>
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={() => onTabChange('analysis')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === 'analysis' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Analysis
        </button>
        <button 
          onClick={() => onTabChange('video')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === 'video' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Video Brief
        </button>
        <div className="h-6 w-px bg-gray-200"></div>
        <button 
          onClick={onDemoClick}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full transition-all border border-blue-100"
        >
          <Play size={16} />
          Watch Demo
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
