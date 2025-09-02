import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import DeleteButton from '../../common/DeleteButton/DeleteButton';
import './MessageCard.css'

const MessageCard = ({ message, onDelete }) => {
  return (
    <div key={message._id} className="message-card">
      <div className="message-header">
        <div className="sender-info">
          <span className="sender-name">{message.name}</span>
          <span className="sender-email">{message.email}</span>
        </div>
        <div className="message-actions">
          <span className="message-date">
            {new Date(message.createdAt).toLocaleString()}
          </span>
          <DeleteButton 
            onDelete={() => onDelete(message._id)}
            confirmMessage="Are you sure you want to delete this message?"
            iconOnly={true}
            icon={<FiTrash2 />}
          />
        </div>
      </div>
      <div className="message-content">
        <p>{message.message}</p>
      </div>
    </div>
  );
};

export default MessageCard;