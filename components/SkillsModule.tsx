
import React, { useState, useEffect } from 'react';
import { OPENING_MASTER, BODY_CONNECTORS, CLOSING_MASTER, VOCAB_UPGRADES } from '../services/references';

const ITEMS_PER_PAGE = 5;

const SkillsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'opening' | 'body' | 'closing' | 'vocab'>('opening');
  const [currentPage, setCurrentPage] = useState(1);

  // 当切换 Tab 时，重置页码
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-bounce z-[100]';
    notification.innerText = '✨ 已复制到剪贴板！';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  };

  // 根据当前 Tab 获取对应数据源
  const getDataSource = () => {
    switch (activeTab) {
      case 'opening': return OPENING_MASTER;
      case 'body': return BODY_CONNECTORS;
      case 'closing': return CLOSING_MASTER;
      case 'vocab': return VOCAB_UPGRADES;
      default: return [];
    }
  };

  const dataSource = getDataSource();
  const totalPages = Math.ceil(dataSource.length / ITEMS_PER_PAGE);
  const currentItems = dataSource.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-center gap-2 mt-8 pb-4">
        <button 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
          className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 disabled:opacity-30 active:bg-slate-50 transition-all"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <div className="flex items-center gap-1.5 px-4">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${currentPage === i + 1 ? 'bg-indigo-600 w-6' : 'bg-slate-300'}`}
            ></button>
          ))}
        </div>
        <button 
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
          className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 disabled:opacity-30 active:bg-slate-50 transition-all"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-4">
         <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center shrink-0 border-2 border-indigo-100">
           <i className="fas fa-sheep text-3xl text-indigo-600"></i>
         </div>
         <div className="flex-1">
           <h3 className="text-lg font-black text-slate-800 tracking-tight">小羊老师提分笔记</h3>
           <p className="text-[10px] text-indigo-500 font-bold uppercase mt-1">CET-4 Writing Elite Toolbox</p>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-200/50 p-1.5 rounded-2xl overflow-x-auto no-scrollbar gap-1">
        {[
          { id: 'opening', label: '万能开头', count: OPENING_MASTER.length },
          { id: 'body', label: '逻辑衔接', count: BODY_CONNECTORS.length },
          { id: 'closing', label: '精妙结尾', count: CLOSING_MASTER.length },
          { id: 'vocab', label: '词汇升级', count: VOCAB_UPGRADES.length }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-none px-4 py-2.5 text-[11px] font-bold rounded-xl transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 bg-transparent'}`}
          >
            {tab.label}
            <span className={`text-[9px] px-1.5 py-0.5 rounded-md ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-400'}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="space-y-4 min-h-[400px]">
        {activeTab === 'opening' && (
          <div className="space-y-4 animate-slideInRight">
            {currentItems.map((tpl: any, i) => (
              <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-all">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[9px] font-black bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                    {tpl.category}
                  </span>
                  <span className="text-[9px] text-slate-300"># {tpl.scene}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-3 pr-8">{tpl.title}</h4>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 font-serif italic text-xs leading-relaxed text-slate-600">
                   "{tpl.content}"
                </div>
                <button 
                  onClick={() => copyToClipboard(tpl.content)}
                  className="absolute right-4 top-10 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"
                >
                  <i className="fas fa-copy text-[10px]"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'body' && (
          <div className="space-y-4 animate-slideInRight">
            {currentItems.map((skill: any, i) => (
              <div key={i} className="bg-slate-900 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden border border-slate-800 group">
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-black text-sm text-indigo-400">{skill.title}</h5>
                    <span className="text-[8px] font-black bg-white/10 px-2 py-0.5 rounded-full text-indigo-200 tracking-widest uppercase">{skill.group}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mb-4">{skill.usage}</p>
                  <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 mb-4 group-hover:bg-white/10 transition-colors">
                    <p className="text-xs font-serif italic leading-relaxed text-indigo-100">"{skill.example}"</p>
                    <p className="mt-2 text-[10px] text-slate-500 not-italic">解析：{skill.chinese}</p>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(skill.example)}
                    className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-[10px] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-magic"></i> 立即学习此高分句
                  </button>
                </div>
                <i className="fas fa-link absolute -right-6 -bottom-6 text-white/5 text-9xl"></i>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'closing' && (
          <div className="space-y-4 animate-slideInRight">
            {currentItems.map((tpl: any, i) => (
              <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    <h5 className="font-bold text-slate-800 text-xs">{tpl.title}</h5>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-tighter">{tpl.category}</span>
                </div>
                <div className="bg-emerald-50/20 p-5 rounded-2xl border border-emerald-100/50 relative">
                  <p className="text-sm font-serif italic text-emerald-900 leading-relaxed mb-1">"{tpl.content}"</p>
                  <p className="text-[9px] text-emerald-600/50 mb-4 italic"># {tpl.scene}</p>
                  <button 
                    onClick={() => copyToClipboard(tpl.content)}
                    className="w-full py-2 bg-emerald-600 text-white rounded-xl font-bold text-[10px] shadow-sm flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-check-double"></i> 复制满分结尾
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'vocab' && (
          <div className="space-y-3 animate-slideInRight">
            <div className="grid grid-cols-1 gap-3">
              {currentItems.map((v: any, i) => (
                <div key={i} className="bg-white p-5 rounded-3xl border border-slate-50 shadow-sm flex flex-col gap-3 group active:bg-indigo-50 transition-all border-l-4 border-l-amber-400">
                  <div className="flex items-center justify-between">
                    <div className="bg-amber-100 text-amber-600 w-8 h-8 rounded-xl flex items-center justify-center text-xs">
                      <i className="fas fa-star"></i>
                    </div>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{v.category}</span>
                  </div>
                  <div>
                    <h5 className="text-base font-black text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{v.english}</h5>
                    <p className="text-xs text-slate-400 font-medium">中文含义：{v.chinese}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl text-[10px] text-slate-500 font-serif italic border-l-2 border-indigo-200">
                    <span className="font-bold text-indigo-600 not-italic mr-1">提分点：</span> {v.tip}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 分页组件 */}
        {renderPagination()}
      </div>

      {/* 小羊老师独家寄语 */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden mt-8">
        <div className="relative z-10">
          <h4 className="text-lg font-black mb-4 flex items-center gap-2">
            <i className="fas fa-quote-left opacity-40"></i> 
            羊师提分心法
          </h4>
          <p className="text-xs text-indigo-100 leading-relaxed font-medium opacity-90">
            内容我已经帮你全部扩充到了 <span className="text-white font-bold">155 条</span> 精华内容，涵盖了四级作文 99% 的场景。
            <br/><br/>
            <span className="text-white font-bold">记住：</span> 不要贪多，每页 5 个句子，今天背一页，明天练习的时候强迫自己用上。分页是为了让你更有节奏地“攻克”，而不是一次性看完。
          </p>
          <p className="text-xs text-amber-200 leading-relaxed font-medium opacity-90 mt-3 border-t border-white/20 pt-3">
            <span className="text-amber-300 font-bold">新增亮点：</span> 35个万能开头 + 40个逻辑衔接 + 30个精彩结尾 + 50个高分词汇，助你从15分冲刺到25分！
          </p>
        </div>
        <i className="fas fa-sheep absolute -right-10 -bottom-10 text-white/5 text-[15rem]"></i>
      </div>
    </div>
  );
};

export default SkillsModule;
