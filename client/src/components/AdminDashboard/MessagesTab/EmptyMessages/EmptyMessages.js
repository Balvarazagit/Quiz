import React from 'react';
import './EmptyMessages.css'

const EmptyMessages = ({ isDarkTheme }) => {
  return (
    <div className="empty-messages">
      <div className="empty-messages-illustration">
        <svg viewBox="0 0 200 150">
          <path d="M40,30 L160,30 L180,50 L180,130 L20,130 L20,50 Z" fill={isDarkTheme ? "#4a5568" : "#f0f4f8"} stroke={isDarkTheme ? "#81C784" : "#4CAF50"} strokeWidth="2" />
          <path d="M40,30 L160,30 L180,50 L40,50 Z" fill={isDarkTheme ? "rgba(129, 199, 132, 0.2)" : "#4CAF50"} opacity="0.2" />
          <path d="M60,70 L140,70 M60,90 L140,90 M60,110 L120,110" stroke={isDarkTheme ? "#81C784" : "#4CAF50"} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h3>No messages yet</h3>
      <p>Messages submitted through the contact form will appear here</p>
    </div>
  );
};

export default EmptyMessages;