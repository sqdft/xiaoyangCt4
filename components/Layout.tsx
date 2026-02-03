
import React from 'react';
import { AppTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 shadow-xl overflow-hidden">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <i className="fas fa-graduation-cap"></i>
            小羊老师英语四级
          </h1>
          <span className="text-[10px] text-indigo-200 font-bold tracking-tighter uppercase italic">2026 考点预测提分版</span>
        </div>
        <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black border border-white/20">
          独家授课版
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t flex justify-around items-center py-2 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] safe-area-bottom z-50">
        <NavButton active={activeTab === AppTab.DASHBOARD} onClick={() => setActiveTab(AppTab.DASHBOARD)} icon="fas fa-chart-line" label="主页" />
        <NavButton active={activeTab === AppTab.VOCAB} onClick={() => setActiveTab(AppTab.VOCAB)} icon="fas fa-spell-check" label="词汇" />
        <NavButton active={activeTab === AppTab.SKILLS} onClick={() => setActiveTab(AppTab.SKILLS)} icon="fas fa-magic" label="锦囊" />
        <NavButton active={activeTab === AppTab.SPEAKING} onClick={() => setActiveTab(AppTab.SPEAKING)} icon="fas fa-headset" label="口语" />
        <NavButton active={activeTab === AppTab.WRITING} onClick={() => setActiveTab(AppTab.WRITING)} icon="fas fa-edit" label="作文" />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 flex-1 py-1 transition-colors ${active ? 'text-indigo-600' : 'text-slate-400'}`}
  >
    <i className={`${icon} text-lg`}></i>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default Layout;
