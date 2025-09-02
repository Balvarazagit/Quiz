import React from 'react';
import './UserSearch.css'

const UserSearch = ({ value, onChange }) => {
  return (
    <div className="search-box">
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