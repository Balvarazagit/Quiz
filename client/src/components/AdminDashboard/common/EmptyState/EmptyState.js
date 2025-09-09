import React from 'react';
import './EmptyState.css'

const EmptyState = ({ 
  imageSrc, 
  title, 
  description, 
  illustration,
  action,
  isDarkTheme
}) => {
  return (
    <div className={`empty-state ${isDarkTheme ? 'dark-theme' : ''}`}>
      {imageSrc && <img src={imageSrc} alt={title} />}
      {illustration && <div className="empty-illustration">{illustration}</div>}
      <h3>{title}</h3>
      <p>{description}</p>
      {action && action}
    </div>
  );
};

export default EmptyState;