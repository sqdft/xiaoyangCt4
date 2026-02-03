
import React, { useState, useRef, useEffect } from 'react';
import { ExamLevel, ApiKeyConfig } from '../types';
import { getGeminiClient } from '../services/gemini';
import { Modality, LiveServerMessage } from '@google/genai';

interface SpeakingModuleProps {
  level: ExamLevel;
  apiConfig?: ApiKeyConfig | null;
  onOpenApiManager: () => void;
}

const SpeakingModule: React.FC<SpeakingModuleProps> = ({ level, apiConfig, onOpenApiManager }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('点击开始口语模拟练习');
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

  const startConversation = async () => {
    if (!apiConfig) {
      alert("请先配置API Key才能使用AI口语练习功能");
      onOpenApiManager();
      return;
    }

    try {
      const ai = getGeminiClient();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus('正在通话中... 请说话');
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.onended = () => sourcesRef.current.delete(source);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Speaking Error', e);
            setStatus('连接发生错误');
            setIsActive(false);
          },
          onclose: () => {
            setIsActive(false);
            setStatus('通话已结束');
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: `You are an English examiner for the ${level} oral exam. Your role is to conduct a simulated speaking test. Start by greeting the student, introducing a topic common in ${level} (e.g., technology, campus life, environment), and asking a warm-up question. Be encouraging but professional. Correct errors gently in your responses.`,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          }
        }
      });

      sessionRef.current = await sessionPromise;

    } catch (err) {
      console.error(err);
      setStatus('无法访问麦克风');
    }
  };

  const stopConversation = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
    setStatus('点击开始口语模拟练习');
  };

  // Helpers from requirements
  function createBlob(data: Float32Array): { data: string; mimeType: string } {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000'
    };
  }

  function encode(bytes: Uint8Array) {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  function decode(base64: string) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  }

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">口语模拟考</h2>
        <p className="text-slate-500">与AI考官进行1对1即时对话练习</p>
      </div>

      <div className="relative">
        <div className={`absolute -inset-4 bg-indigo-500/20 rounded-full animate-ping ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
        <button 
          onClick={isActive ? stopConversation : startConversation}
          className={`relative w-32 h-32 rounded-full shadow-2xl flex items-center justify-center text-3xl transition-all active:scale-95 ${isActive ? 'bg-rose-500 text-white' : 'bg-indigo-600 text-white'}`}
        >
          <i className={`fas ${isActive ? 'fa-stop' : 'fa-microphone'}`}></i>
        </button>
      </div>

      <div className="bg-white px-6 py-3 rounded-full border shadow-sm text-sm font-medium text-slate-600">
        <span className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
          {status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="bg-slate-100 p-4 rounded-2xl flex flex-col items-center text-center">
          <i className="fas fa-headphones text-indigo-500 mb-2"></i>
          <span className="text-xs font-bold text-slate-700">实时听力</span>
          <span className="text-[10px] text-slate-400">听懂考官提问</span>
        </div>
        <div className="bg-slate-100 p-4 rounded-2xl flex flex-col items-center text-center">
          <i className="fas fa-comments text-indigo-500 mb-2"></i>
          <span className="text-xs font-bold text-slate-700">口语表达</span>
          <span className="text-[10px] text-slate-400">流利地做出回应</span>
        </div>
      </div>
    </div>
  );
};

export default SpeakingModule;
