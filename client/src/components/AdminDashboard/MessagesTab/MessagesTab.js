import React from 'react';
import MessageCard from './MessageCard/MessageCard';
import EmptyState from '../common/EmptyState/EmptyState';
import './MessagesTab.css'

const MessagesTab = ({ messages, onDeleteMessage, isDarkTheme }) => {
  return (
    <div className="messages-tab">
      <div className="messages-header">
        <h2>
          <span className="header-icon">✉️</span>
          User Messages
        </h2>
        <p>View messages submitted by users through the contact form</p>
      </div>

      {messages.length === 0 ? (
        <EmptyState 
          title="No messages yet"
          description="Messages submitted through the contact form will appear here"
          illustration={
            <svg viewBox="0 0 200 150">
              <path d="M40,30 L160,30 L180,50 L180,130 L20,130 L20,50 Z" fill={isDarkTheme ? "#4a5568" : "#f0f4f8"} stroke={isDarkTheme ? "#81C784" : "#4CAF50"} strokeWidth="2" />
              <path d="M40,30 L160,30 L180,50 L40,50 Z" fill={isDarkTheme ? "rgba(129, 199, 132, 0.2)" : "#4CAF50"} opacity="0.2" />
              <path d="M60,70 L140,70 M60,90 L140,90 M60,110 L120,110" stroke={isDarkTheme ? "#81C784" : "#4CAF50"} strokeWidth="2" strokeLinecap="round" />
            </svg>
          }
          isDarkTheme={isDarkTheme}
        />
      ) : (
        <div className="messages-list">
          {messages.map(message => (
            <MessageCard
              key={message._id}
              message={message}
              onDelete={onDeleteMessage}
              isDarkTheme={isDarkTheme}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesTab;