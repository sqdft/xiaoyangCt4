
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import VocabModule from './components/VocabModule';
import SpeakingModule from './components/SpeakingModule';
import WritingModule from './components/WritingModule';
import SkillsModule from './components/SkillsModule';
import ApiKeyManager from './components/ApiKeyManager';
import { AppTab, ApiKeyConfig } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [apiConfig, setApiConfig] = useState<ApiKeyConfig | null>(null);
  const [showApiManager, setShowApiManager] = useState(false);

  useEffect(() => {
    // 检查是否有保存的API配置
    const savedConfigs = localStorage.getItem('api_configs');
    if (savedConfigs) {
      const configs: ApiKeyConfig[] = JSON.parse(savedConfigs);
      const activeConfig = configs.find(config => config.isActive);
      if (activeConfig) {
        setApiConfig(activeConfig);
      }
    }
  }, []);

  const handleNavigate = (tab: AppTab) => {
    setActiveTab(tab);
  };

  const handleApiKeySet = (config: ApiKeyConfig) => {
    setApiConfig(config);
  };

  const handleOpenApiManager = () => {
    setShowApiManager(true);
  };

  const handleCloseApiManager = () => {
    setShowApiManager(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD:
        return <Dashboard onNavigate={handleNavigate} onOpenApiManager={handleOpenApiManager} />;
      case AppTab.VOCAB:
        return <VocabModule />;
      case AppTab.SKILLS:
        return <SkillsModule />; // 锦囊模块
      case AppTab.SPEAKING:
        return <SpeakingModule level={'CET-4'} apiConfig={apiConfig} onOpenApiManager={handleOpenApiManager} />;
      case AppTab.WRITING:
        return <WritingModule apiConfig={apiConfig} onOpenApiManager={handleOpenApiManager} />;
      default:
        return <Dashboard onNavigate={handleNavigate} onOpenApiManager={handleOpenApiManager} />;
    }
  };

  return (
    <>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
      {showApiManager && (
        <ApiKeyManager 
          onApiKeySet={handleApiKeySet} 
          onClose={handleCloseApiManager}
        />
      )}
    </>
  );
};
};

export default App;
