import React from 'react';
import './DashboardHeader.css'

const DashboardHeader = () => {
  return (
    <div className="dashboard-header">
      <h1>
        <span className="header-icon">🌱</span>
        Quiz Admin Portal
      </h1>
      <div className="header-accent"></div>
    </div>
  );
};

export default DashboardHeader;