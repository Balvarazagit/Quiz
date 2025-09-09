import React from 'react';
import './UserSearch.css'

const UserSearch = ({ value, onChange, isDarkTheme }) => {
  return (
    <div 
      className="search-box"
      data-theme={isDarkTheme ? "dark" : "light"}
    >
      <input
        type="text"
        placeholder="🔍 Search users..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default UserSearch;