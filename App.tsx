
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import VocabModule from './components/VocabModule';
import SpeakingModule from './components/SpeakingModule';
import WritingModule from './components/WritingModule';
import SkillsModule from './components/SkillsModule'; // 新增导入
import { AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);

  const handleNavigate = (tab: AppTab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD:
        return <Dashboard onNavigate={handleNavigate} />;
      case AppTab.VOCAB:
        return <VocabModule />;
      case AppTab.SKILLS:
        return <SkillsModule />; // 锦囊模块
      case AppTab.SPEAKING:
        return <SpeakingModule level={'CET-4'} />;
      case AppTab.WRITING:
        return <WritingModule />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
