import React from 'react';
import './TabNavigation.css'

const TABS = ['Users', 'Quiz Results', 'Quizzes', 'Messages'];

const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="dashboard-tabs">
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