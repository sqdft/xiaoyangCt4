
import React, { useState, useEffect } from 'react';
import { WritingAnalysis, WritingPrompt, ApiKeyConfig } from '../types';
import { analyzeWriting } from '../services/gemini';
import { getRandomPrompt } from '../services/prompts';
import { WRITING_TEMPLATES, HIGH_SCORE_SENTENCES, WRITING_SKILLS } from '../services/references';

interface WritingModuleProps {
  apiConfig?: ApiKeyConfig | null;
  onOpenApiManager: () => void;
}

const WritingModule: React.FC<WritingModuleProps> = ({ apiConfig, onOpenApiManager }) => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<WritingAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<WritingPrompt | null>(null);
  const [showReference, setShowReference] = useState(false);
  const [showModelEssay, setShowModelEssay] = useState(false);
  const [refType, setRefType] = useState<'template' | 'sentence' | 'skill'>('template');

  useEffect(() => {
    setCurrentPrompt(getRandomPrompt());
  }, []);

  const handleRefreshPrompt = () => {
    setCurrentPrompt(getRandomPrompt());
    setText('');
    setAnalysis(null);
    setShowModelEssay(false);
  };

  const handleAnalyze = async () => {
    if (!apiConfig) {
      alert("请先配置API Key才能使用AI分析功能");
      onOpenApiManager();
      return;
    }

    if (!text.trim() || text.split(/\s+/).length < 20) {
      alert("请至少输入20个单词。");
      return;
    }
    setLoading(true);
    try {
      const result = await analyzeWriting(text, 'CET-4', currentPrompt || undefined);
      setAnalysis(result);
      
      const history = JSON.parse(localStorage.getItem('writingHistory') || '[]');
      history.push({ date: new Date().toISOString(), score: result.score });
      localStorage.setItem('writingHistory', JSON.stringify(history));
      
    } catch (error) {
      console.error(error);
      alert("分析失败，请检查API配置是否正确");
    } finally {
      setLoading(false);
    }
  };

  // 格式化范文：增加段落感和结构标注
  const formatEssay = (essay: string) => {
    const paragraphs = essay.split('\n\n');
    return paragraphs.map((p, idx) => {
      let label = "";
      let colorClass = "border-slate-100";
      if (idx === 0) { label = "Introduction"; colorClass = "border-indigo-100 bg-indigo-50/20"; }
      else if (idx === paragraphs.length - 1) { label = "Conclusion"; colorClass = "border-emerald-100 bg-emerald-50/20"; }
      else { label = `Body Para ${idx}`; colorClass = "border-slate-100 bg-slate-50/30"; }

      return (
        <div key={idx} className={`relative mb-6 p-4 rounded-xl border-l-4 ${colorClass}`}>
          <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-white border border-slate-100 rounded-md text-[9px] font-black text-slate-400 uppercase tracking-tighter">
            {label}
          </span>
          <p className="text-sm text-slate-700 leading-relaxed font-serif italic">{p}</p>
        </div>
      );
    });
  };

  return (
    <div className="relative h-full flex flex-col space-y-6 pb-20">
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-2xl font-bold text-slate-800">写作实战</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowReference(true)}
            className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full"
          >
            资料库
          </button>
          <button 
            onClick={handleRefreshPrompt}
            className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full"
          >
            换一题
          </button>
        </div>
      </div>

      {!analysis ? (
        <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
          {currentPrompt && (
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shrink-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-800 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                    {currentPrompt.typeName}
                  </span>
                  <h3 className="font-bold text-slate-800 text-xs">{currentPrompt.title}</h3>
                </div>
                <button 
                  onClick={() => setShowModelEssay(true)}
                  className="text-[9px] text-indigo-600 underline font-bold"
                >
                  查看题库范文
                </button>
              </div>
              <p className="text-[10px] text-slate-500 italic leading-relaxed font-serif line-clamp-2">
                {currentPrompt.directions}
              </p>
            </div>
          )}

          <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 p-4 flex flex-col">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">
              <span>写作区域</span>
              <span>WORD COUNT: {text.split(/\s+/).filter(Boolean).length}</span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start writing your essay..."
              className="flex-1 w-full border-none focus:ring-0 text-slate-700 bg-slate-50/50 rounded-xl resize-none text-sm font-serif p-4"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !text}
              className="mt-4 w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg"
            >
              {loading ? 'AI 阅卷官评审中...' : '提交并获取专家点评'}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-6 animate-slideUp">
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-2">
              <span className="text-2xl font-black text-indigo-600">{analysis.score}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800">专家评分</h3>
            <p className="text-slate-500 mt-2 text-xs leading-relaxed italic px-4">“{analysis.feedback}”</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
              <h4 className="text-emerald-700 font-bold text-xs mb-2">写作亮点</h4>
              <ul className="text-xs text-slate-700 space-y-1.5">
                {analysis.strengths.map((s, i) => <li key={i}>• {s}</li>)}
              </ul>
            </div>
            <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100">
              <h4 className="text-rose-700 font-bold text-xs mb-2">存在不足</h4>
              <ul className="text-xs text-slate-700 space-y-1.5">
                {analysis.weaknesses.map((w, i) => <li key={i}>• {w}</li>)}
              </ul>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 shadow-xl">
            <h4 className="text-white font-bold mb-3 text-xs flex items-center gap-2">
              <i className="fas fa-magic text-indigo-400"></i> AI 润色提分版本
            </h4>
            <div className="text-indigo-50 text-xs leading-relaxed whitespace-pre-wrap italic font-serif opacity-90">
              {analysis.improvedVersion}
            </div>
          </div>

          <button 
            onClick={() => { setAnalysis(null); setText(''); }}
            className="w-full py-4 rounded-2xl border-2 border-slate-100 text-slate-400 font-bold"
          >
            继续练习下一题
          </button>
        </div>
      )}

      {/* 范文查看弹窗：优化为结构化文档展示 */}
      {showModelEssay && currentPrompt && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setShowModelEssay(false)}></div>
          <div className="relative bg-white w-full max-h-[85vh] rounded-[2.5rem] flex flex-col p-6 overflow-hidden animate-zoomIn border border-slate-200">
            <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-800">四级考场满分范文</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Structured Model Answer</p>
              </div>
              <button onClick={() => setShowModelEssay(false)} className="text-slate-300 active:scale-90 transition-all">
                <i className="fas fa-times-circle text-2xl"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="mb-6 p-4 bg-slate-50 rounded-2xl">
                <h4 className="text-xs font-black text-slate-800 mb-1">【题目回顾】</h4>
                <p className="text-[11px] text-slate-500 font-serif leading-relaxed italic">{currentPrompt.directions}</p>
              </div>
              <div className="space-y-4">
                {formatEssay(currentPrompt.modelEssay)}
              </div>
            </div>
            <button 
              onClick={() => { navigator.clipboard.writeText(currentPrompt.modelEssay); alert('范文已复制'); }}
              className="mt-6 w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100"
            >
              复制范文全文
            </button>
          </div>
        </div>
      )}

      {/* 资料库弹窗：新增逻辑连词选项 */}
      {showReference && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-20">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowReference(false)}></div>
          <div className="relative bg-white w-full max-w-md h-[80vh] rounded-t-[2.5rem] flex flex-col animate-slideUp overflow-hidden">
            <div className="p-6 border-b shrink-0 bg-white">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-black text-slate-800">写作高分宝典</h3>
                  <p className="text-[10px] text-indigo-400 font-bold">Writing Toolbox</p>
                </div>
                <button onClick={() => setShowReference(false)} className="text-slate-300">
                  <i className="fas fa-times-circle text-2xl"></i>
                </button>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setRefType('template')}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${refType === 'template' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                >
                  固定格式
                </button>
                <button 
                  onClick={() => setRefType('sentence')}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${refType === 'sentence' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                >
                  高分句式
                </button>
                <button 
                  onClick={() => setRefType('skill')}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${refType === 'skill' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                >
                  逻辑连词
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {refType === 'template' && (
                WRITING_TEMPLATES.map((tpl, i) => (
                  <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase">{tpl.category}</span>
                    <h5 className="font-bold text-slate-800 text-sm mt-2 mb-1">{tpl.title}</h5>
                    <p className="text-xs text-slate-600 font-serif leading-relaxed italic">{tpl.content}</p>
                  </div>
                ))
              )}

              {refType === 'sentence' && (
                HIGH_SCORE_SENTENCES.map((sen, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">{sen.category}</span>
                    <p className="text-sm font-bold text-slate-800 font-serif mt-2">{sen.english}</p>
                    <p className="text-xs text-slate-400 mt-1">{sen.chinese}</p>
                    {sen.tip && <div className="mt-2 text-[10px] text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100 italic">💡 解析：{sen.tip}</div>}
                  </div>
                ))
              )}

              {refType === 'skill' && (
                WRITING_SKILLS.map((skill, i) => (
                  <div key={i} className="bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100/50">
                    <h5 className="font-black text-indigo-600 text-sm mb-1">{skill.title}</h5>
                    <p className="text-[10px] text-slate-500 mb-3">{skill.usage}</p>
                    <div className="bg-white p-3 rounded-xl border border-indigo-50 shadow-sm">
                      <p className="text-xs font-bold text-slate-800 font-serif italic mb-1">"{skill.example}"</p>
                      <p className="text-[10px] text-slate-400">释：{skill.chinese}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WritingModule;
