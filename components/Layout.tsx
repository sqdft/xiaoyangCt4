
import React, { useState, useEffect } from 'react';
import { AppTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  // 背景图片数组
  const backgroundImages = [
    "https://g.gtimg.cn/music/photo_new/T053XD010017SNjl46uSEf.jpg",
    "https://g.gtimg.cn/music/photo_new/T053XD01000ID6X30dg8kF.png",
    "https://g.gtimg.cn/music/photo_new/T053XD01004ZhNnT19PB1K.png",
    "https://g.gtimg.cn/music/photo_new/T053XD010017eQvt3m0xkv.png",
    "https://g.gtimg.cn/music/photo_new/T053XD010029Kc8r2weatK.png",
    "https://g.gtimg.cn/music/photo_new/T053XD01001uXcoJ0NzyaL.jpg",
    "https://g.gtimg.cn/music/photo_new/T053XD01001mjxrm0RDgnP.jpg"
  ];

  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // 每30秒切换背景图片
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 30000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto shadow-xl overflow-hidden relative">
      {/* 动态背景图片 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundImage: `url(${backgroundImages[currentBgIndex]})`,
          filter: 'blur(0.5px) brightness(0.3)'
        }}
      />
      
      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-800/40 to-slate-900/70" />
      
      {/* 内容区域 */}
      <div className="relative z-10 flex flex-col h-full">
      {/* Header */}
      <header className="bg-indigo-600/90 backdrop-blur-sm text-white p-4 flex justify-between items-center shrink-0 border-b border-white/10">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <i className="fas fa-sheep"></i>
            小羊老师英语四级
          </h1>
          <span className="text-[10px] text-indigo-200 font-bold tracking-tighter uppercase italic">2026 考点预测提分版</span>
        </div>
        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black border border-white/30">
          独家授课版
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-white/20 flex justify-around items-center py-2 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] safe-area-bottom z-50">
        <NavButton active={activeTab === AppTab.DASHBOARD} onClick={() => setActiveTab(AppTab.DASHBOARD)} icon="fas fa-chart-line" label="主页" />
        <NavButton active={activeTab === AppTab.VOCAB} onClick={() => setActiveTab(AppTab.VOCAB)} icon="fas fa-spell-check" label="词汇" />
        <NavButton active={activeTab === AppTab.SKILLS} onClick={() => setActiveTab(AppTab.SKILLS)} icon="fas fa-magic" label="锦囊" />
        <NavButton active={activeTab === AppTab.SPEAKING} onClick={() => setActiveTab(AppTab.SPEAKING)} icon="fas fa-headset" label="口语" />
        <NavButton active={activeTab === AppTab.WRITING} onClick={() => setActiveTab(AppTab.WRITING)} icon="fas fa-edit" label="作文" />
      </nav>
      </div>
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
