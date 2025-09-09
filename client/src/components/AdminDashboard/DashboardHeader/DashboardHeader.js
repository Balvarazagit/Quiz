import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import './DashboardHeader.css'

const DashboardHeader = ({ isDarkTheme, toggleTheme }) => {
  return (
    <div className="dashboard-header">
      <h1>
        <span className="header-icon">🌱</span>
        Quiz Admin Portal
      </h1>
      <button 
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {isDarkTheme ? <FiSun /> : <FiMoon />}
      </button>
      <div className="header-accent"></div>
    </div>
  );
};

export default DashboardHeader;