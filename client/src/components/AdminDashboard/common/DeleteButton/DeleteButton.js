import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import './DeleteButton.css'

const DeleteButton = ({ 
  onDelete, 
  confirmMessage = "Are you sure you want to delete this item?",
  isMobile = false,
  label = "Delete",
  iconOnly = false,
  icon = <FiTrash2 />,
  isDarkTheme = false
}) => {
  const handleClick = () => {
    if (window.confirm(confirmMessage)) {
      onDelete();
    }
  };

  // ✅ Icon Only Button
  if (iconOnly) {
    return (
      <button 
        onClick={handleClick}
        className={`delete-btn ${isMobile ? "delete-btn-mobile" : ""} ${isDarkTheme ? "dark-theme" : ""}`}
        title={label}
      >
        {icon}
      </button>
    );
  }

  // ✅ Normal Button (Icon + Label)
  return (
    <button 
      onClick={handleClick}
      className={`delete-btn ${isMobile ? "delete-btn-mobile" : ""} ${isDarkTheme ? "dark-theme" : ""}`}
    >
      {icon}
      {!isMobile && <span className="delete-label">{label}</span>}
    </button>
  );
};

export default DeleteButton;