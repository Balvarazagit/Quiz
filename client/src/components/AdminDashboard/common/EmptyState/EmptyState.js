import React from 'react';
import './EmptyState.css'

const EmptyState = ({ 
  imageSrc, 
  title, 
  description, 
  illustration,
  action 
}) => {
  return (
    <div className="empty-state">
      {imageSrc && <img src={imageSrc} alt={title} />}
      {illustration && <div className="empty-illustration">{illustration}</div>}
      <h3>{title}</h3>
      <p>{description}</p>
      {action && action}
    </div>
  );
};

export default EmptyState;