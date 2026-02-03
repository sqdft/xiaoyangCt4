
import React, { useState, useEffect } from 'react';
import { Word } from '../types';
import { generateDailyWords, textToSpeech } from '../services/gemini';

const VocabModule: React.FC = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'flashcard'>('list');
  const [activeIndex, setActiveIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    // 读取已掌握词汇
    const mastered = JSON.parse(localStorage.getItem('masteredWords') || '[]');
    setMasteredIds(mastered);
    fetchVocabCollection();
  }, []);

  const fetchVocabCollection = async () => {
    setLoading(true);
    try {
      // Removed 'as any' cast as ExamLevel is now defined in types.ts
      const data = await generateDailyWords('CET-4');
      setWords(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleMastered = (word: string) => {
    let newMastered;
    if (masteredIds.includes(word)) {
      newMastered = masteredIds.filter(id => id !== word);
    } else {
      newMastered = [...masteredIds, word];
    }
    setMasteredIds(newMastered);
    localStorage.setItem('masteredWords', JSON.stringify(newMastered));
  };

  const speak = async (word: string) => {
    const base64 = await textToSpeech(word);
    if (base64) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
      const dataInt16 = new Int16Array(bytes.buffer);
      const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full py-12 gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      <p className="text-slate-400 text-sm italic">正在拉取四级高频词库...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">核心词库</h2>
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Mastery Checklist</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>列表</button>
          <button onClick={() => { setViewMode('flashcard'); setActiveIndex(0); setFlipped(false); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'flashcard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>刷词</button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 gap-3">
          {words.map((w, i) => (
            <div key={i} className={`bg-white p-4 rounded-2xl border ${masteredIds.includes(w.word) ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-50'} shadow-sm flex items-center justify-between group`}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleMastered(w.word)} className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${masteredIds.includes(w.word) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 text-transparent'}`}>
                    <i className="fas fa-check text-[10px]"></i>
                  </button>
                  <span className="font-bold text-slate-800 text-lg">{w.word}</span>
                  <span className="text-xs text-slate-400 font-mono italic">{w.phonetic}</span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5 ml-7">{w.definition}</p>
              </div>
              <button onClick={() => speak(w.word)} className="w-10 h-10 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center">
                <i className="fas fa-volume-up"></i>
              </button>
            </div>
          ))}
          <button onClick={fetchVocabCollection} className="w-full py-4 bg-slate-100 text-slate-500 text-xs font-bold rounded-2xl border-2 border-dashed border-slate-200 mt-4">获取下一组词汇</button>
        </div>
      ) : (
        <div className="space-y-6">
          <div 
            className={`relative w-full h-80 transition-all duration-500 [transform-style:preserve-3d] cursor-pointer ${flipped ? '[transform:rotateY(180deg)]' : ''}`}
            onClick={() => setFlipped(!flipped)}
          >
            <div className="absolute inset-0 bg-white rounded-[2.5rem] shadow-xl flex flex-col items-center justify-center p-8 border border-slate-100 [backface-visibility:hidden]">
              <h3 className="text-4xl font-black text-indigo-700 mb-2">{words[activeIndex]?.word}</h3>
              <p className="text-slate-400 font-mono text-lg">{words[activeIndex]?.phonetic}</p>
              <button onClick={(e) => { e.stopPropagation(); speak(words[activeIndex]?.word); }} className="mt-6 w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center"><i className="fas fa-volume-up"></i></button>
            </div>
            <div className="absolute inset-0 bg-indigo-600 rounded-[2.5rem] shadow-xl flex flex-col items-center justify-center p-8 text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <p className="text-2xl font-bold mb-4">{words[activeIndex]?.definition}</p>
              <div className="bg-indigo-700/50 p-4 rounded-2xl border border-indigo-500/30 w-full text-center">
                <p className="text-indigo-100 italic text-xs leading-relaxed">"{words[activeIndex]?.example}"</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => toggleMastered(words[activeIndex].word)} 
              className={`flex-1 py-4 rounded-2xl font-bold transition-all ${masteredIds.includes(words[activeIndex]?.word) ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-100 text-slate-400'}`}
            >
              {masteredIds.includes(words[activeIndex]?.word) ? '已掌握' : '标记掌握'}
            </button>
            <button 
              onClick={() => { if (activeIndex < words.length - 1) { setActiveIndex(i => i + 1); setFlipped(false); } else { fetchVocabCollection(); } }}
              className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg"
            >
              下一个词
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabModule;