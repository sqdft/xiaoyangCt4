
import React, { useEffect, useState } from 'react';
import { AppTab } from '../types';

interface DashboardProps {
  onNavigate: (tab: AppTab) => void;
  onOpenApiManager: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onOpenApiManager }) => {
  const [stats, setStats] = useState({ words: 0, writings: 0 });

  useEffect(() => {
    const masteredWords = JSON.parse(localStorage.getItem('masteredWords') || '[]');
    const writingHistory = JSON.parse(localStorage.getItem('writingHistory') || '[]');
    setStats({
      words: masteredWords.length,
      writings: writingHistory.length
    });
  }, []);

  const wordPercentage = Math.min(Math.round((stats.words / 2500) * 100), 100);

  const recommendations = [
    {
      title: "小羊老师必背词汇",
      tab: AppTab.VOCAB,
      desc: "已攻克 " + stats.words + " 个词汇",
      icon: "fa-book-reader",
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "提分写作锦囊",
      tab: AppTab.SKILLS,
      desc: "高分套路与万能模板库",
      icon: "fa-magic",
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      title: "作文批改实验室",
      tab: AppTab.WRITING,
      desc: "已模拟练习 " + stats.writings + " 篇",
      icon: "fa-pen-nib",
      color: "bg-amber-50 text-amber-600"
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="bg-indigo-600 text-white p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <i className="fas fa-sheep text-sm text-white"></i>
             </div>
             <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest">Teacher Lamb's Hub</p>
          </div>
          <h2 className="text-3xl font-black mt-1">2026 四级通关计</h2>
          
          <div className="mt-8 space-y-4">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-bold opacity-70">词汇能量槽</span>
                <span className="text-xs font-black">{stats.words} / 2500</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-300 rounded-full transition-all duration-1000" 
                  style={{ width: `${wordPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                <span className="block text-[10px] font-bold opacity-60">实战练兵</span>
                <span className="text-2xl font-black">{stats.writings} <small className="text-[10px] opacity-40">篇</small></span>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex flex-col justify-center text-center">
                <span className="block text-[10px] font-bold opacity-60">备考指数</span>
                <span className="text-sm font-black text-indigo-200">🔥 蓄势待发</span>
              </div>
            </div>
          </div>
        </div>
        <i className="fas fa-rocket absolute -right-6 -bottom-6 text-white/5 text-9xl"></i>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span> 备考专项计划
          </h3>
          <button
            onClick={onOpenApiManager}
            className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium hover:bg-slate-200 transition-colors flex items-center gap-1"
          >
            <i className="fas fa-key text-xs"></i>
            API设置
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {recommendations.map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => onNavigate(item.tab)}
              className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-5 flex items-center gap-4 active:scale-[0.98] transition-all"
            >
              <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-2xl shrink-0`}>
                <i className={`fas ${item.icon}`}></i>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                <p className="text-[10px] text-slate-400 mt-1">{item.desc}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                <i className="fas fa-chevron-right text-[10px]"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-slate-900 p-6 rounded-[2rem] shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="text-white text-xs font-bold mb-3 flex items-center gap-2">
            <i className="fas fa-sheep text-indigo-400"></i> 小羊老师语录
          </h4>
          <p className="text-indigo-100 text-sm font-serif italic leading-relaxed">
            "Your persistence today is the key to your success in 2026."
          </p>
        </div>
        <i className="fas fa-quote-right absolute -right-4 -bottom-4 text-white/5 text-7xl"></i>
      </div>
    </div>
  );
};

export default Dashboard;
