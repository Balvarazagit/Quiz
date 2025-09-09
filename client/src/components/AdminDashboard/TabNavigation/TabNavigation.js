import React from 'react';
import './TabNavigation.css'

const TABS = ['Users', 'Quiz Results', 'Quizzes', 'Messages'];

const TabNavigation = ({ activeTab, setActiveTab, isDarkTheme }) => {
  return (
    <div 
      className="dashboard-tabs"
      data-theme={isDarkTheme ? "dark" : "light"}
    >
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
        >
          {tab}
          {activeTab === tab && <span className="tab-underline"></span>}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;