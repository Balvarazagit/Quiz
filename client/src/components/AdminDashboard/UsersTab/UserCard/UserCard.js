import React from 'react';
import DeleteButton from '../../common/DeleteButton/DeleteButton';
import './UserCard.css'

const UserCard = ({ user, onDelete, isMobile }) => {
  return (
    <div className="user-card">
      <div className="user-avatar">
        {user.name.charAt(0).toUpperCase()}
      </div>
      <div className="user-details">
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <div className="user-id">{user._id}</div>
      </div>
      <DeleteButton 
        onDelete={() => onDelete(user._id)}
        confirmMessage="Are you sure you want to delete this user?"
        isMobile={isMobile}
        label="Delete"
      />
    </div>
  );
};

export default UserCard;