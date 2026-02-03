import React, { useState, useEffect } from 'react';
import { ApiProvider, ApiKeyConfig } from '../types';

interface ApiKeyManagerProps {
  onApiKeySet: (config: ApiKeyConfig) => void;
  onClose: () => void;
}

const API_PROVIDERS: ApiProvider[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    keyFormat: 'AIza...',
    description: '谷歌最新的AI模型，支持多模态对话'
  },
  {
    id: 'openai',
    name: 'OpenAI GPT',
    keyFormat: 'sk-...',
    description: 'OpenAI的GPT系列模型'
  },
  {
    id: 'claude',
    name: 'Anthropic Claude',
    keyFormat: 'sk-ant-...',
    description: 'Anthropic的Claude AI助手'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    keyFormat: 'sk-...',
    description: '国产AI模型，性价比高'
  },
  {
    id: 'custom',
    name: '自定义API',
    keyFormat: '自定义格式',
    description: '支持OpenAI兼容的API接口'
  }
];

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onApiKeySet, onClose }) => {
  const [selectedProvider, setSelectedProvider] = useState('gemini');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [savedConfigs, setSavedConfigs] = useState<ApiKeyConfig[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadSavedConfigs();
  }, []);

  const loadSavedConfigs = () => {
    const saved = localStorage.getItem('api_configs');
    if (saved) {
      setSavedConfigs(JSON.parse(saved));
    }
  };

  const saveConfig = () => {
    if (!apiKey.trim()) return;

    const newConfig: ApiKeyConfig = {
      provider: selectedProvider,
      apiKey: apiKey.trim(),
      baseUrl: selectedProvider === 'custom' ? baseUrl.trim() : undefined,
      isActive: savedConfigs.length === 0 // 第一个配置自动激活
    };

    const updatedConfigs = [...savedConfigs, newConfig];
    setSavedConfigs(updatedConfigs);
    localStorage.setItem('api_configs', JSON.stringify(updatedConfigs));
    
    // 如果是第一个配置，自动设置为活跃
    if (savedConfigs.length === 0) {
      onApiKeySet(newConfig);
    }

    // 重置表单
    setApiKey('');
    setBaseUrl('');
    setShowAddForm(false);
  };

  const activateConfig = (index: number) => {
    const updatedConfigs = savedConfigs.map((config, i) => ({
      ...config,
      isActive: i === index
    }));
    setSavedConfigs(updatedConfigs);
    localStorage.setItem('api_configs', JSON.stringify(updatedConfigs));
    onApiKeySet(updatedConfigs[index]);
  };

  const deleteConfig = (index: number) => {
    const updatedConfigs = savedConfigs.filter((_, i) => i !== index);
    setSavedConfigs(updatedConfigs);
    localStorage.setItem('api_configs', JSON.stringify(updatedConfigs));
  };

  const getProviderInfo = (providerId: string) => {
    return API_PROVIDERS.find(p => p.id === providerId) || API_PROVIDERS[0];
  };

  const getProviderLinks = (providerId: string) => {
    const links = {
      gemini: 'https://ai.google.dev/',
      openai: 'https://platform.openai.com/api-keys',
      claude: 'https://console.anthropic.com/',
      deepseek: 'https://platform.deepseek.com/',
      custom: ''
    };
    return links[providerId as keyof typeof links] || '';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-zoomIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <i className="fas fa-key text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold">API Key 管理</h3>
                <p className="text-indigo-100 text-sm">管理你的AI服务密钥</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* 已保存的配置 */}
          {savedConfigs.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <i className="fas fa-list text-indigo-600"></i>
                已保存的配置
              </h4>
              <div className="space-y-3">
                {savedConfigs.map((config, index) => {
                  const provider = getProviderInfo(config.provider);
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        config.isActive
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            config.isActive ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-600'
                          }`}>
                            <i className="fas fa-robot text-sm"></i>
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">{provider.name}</div>
                            <div className="text-xs text-slate-500">
                              {config.apiKey.substring(0, 8)}...
                              {config.baseUrl && ` • ${config.baseUrl}`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {config.isActive && (
                            <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                              活跃
                            </span>
                          )}
                          {!config.isActive && (
                            <button
                              onClick={() => activateConfig(index)}
                              className="px-3 py-1 bg-indigo-100 text-indigo-600 text-xs font-medium rounded-full hover:bg-indigo-200 transition-colors"
                            >
                              激活
                            </button>
                          )}
                          <button
                            onClick={() => deleteConfig(index)}
                            className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                          >
                            <i className="fas fa-trash text-xs"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 添加新配置 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <i className="fas fa-plus text-indigo-600"></i>
                添加新配置
              </h4>
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                  添加配置
                </button>
              )}
            </div>

            {showAddForm && (
              <div className="space-y-4 p-4 bg-slate-50 rounded-xl">
                {/* 选择供应商 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    选择AI供应商
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {API_PROVIDERS.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => setSelectedProvider(provider.id)}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          selectedProvider === provider.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="font-medium text-slate-800">{provider.name}</div>
                        <div className="text-xs text-slate-500 mt-1">{provider.description}</div>
                        <div className="text-xs text-slate-400 mt-1">格式: {provider.keyFormat}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* API Key输入 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={`输入你的 ${getProviderInfo(selectedProvider).name} API Key`}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* 自定义API的Base URL */}
                {selectedProvider === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Base URL
                    </label>
                    <input
                      type="url"
                      value={baseUrl}
                      onChange={(e) => setBaseUrl(e.target.value)}
                      placeholder="https://api.example.com/v1"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    />
                  </div>
                )}

                {/* 获取API Key的帮助信息 */}
                {getProviderLinks(selectedProvider) && (
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                    <div className="flex items-start gap-3">
                      <i className="fas fa-info-circle text-amber-600 mt-0.5"></i>
                      <div className="text-xs text-amber-800">
                        <p className="font-medium mb-1">如何获取 {getProviderInfo(selectedProvider).name} API Key：</p>
                        <p>访问 <a href={getProviderLinks(selectedProvider)} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">{getProviderInfo(selectedProvider).name} 官网</a> 创建API密钥</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setApiKey('');
                      setBaseUrl('');
                    }}
                    className="flex-1 py-3 px-4 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={saveConfig}
                    disabled={!apiKey.trim() || (selectedProvider === 'custom' && !baseUrl.trim())}
                    className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
                  >
                    保存配置
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 底部说明 */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <i className="fas fa-shield-alt"></i>
              <span>所有API Key仅保存在你的浏览器本地，不会上传到服务器</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyManager;