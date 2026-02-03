
export type ExamLevel = 'CET-4' | 'CET-6';

export enum AppTab {
  DASHBOARD = 'dashboard',
  VOCAB = 'vocab',
  SPEAKING = 'speaking',
  WRITING = 'writing',
  SKILLS = 'skills' // 新增锦囊选项
}

export interface ApiProvider {
  id: string;
  name: string;
  baseUrl?: string;
  keyFormat: string;
  description: string;
}

export interface ApiKeyConfig {
  provider: string;
  apiKey: string;
  baseUrl?: string;
  isActive: boolean;
}

export interface Word {
  word: string;
  phonetic: string;
  definition: string;
  example: string;
}

export interface WritingPrompt {
  id: string;
  type: 'Letter' | 'Essay' | 'Notice' | 'Graph';
  typeName: string;
  title: string;
  directions: string;
  modelEssay: string;
}

export interface WritingAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvedVersion: string;
  feedback: string;
}

export interface WritingTemplate {
  category: string;
  title: string;
  content: string;
  scene?: string; // 适用场景
}

export interface UsefulSentence {
  category: string;
  english: string;
  chinese: string;
  tip?: string;
}

export interface WritingSkill {
  title: string;
  usage: string;
  example: string;
  chinese: string;
  group: 'logic' | 'vocabulary' | 'structure'; // 分组属性
}
