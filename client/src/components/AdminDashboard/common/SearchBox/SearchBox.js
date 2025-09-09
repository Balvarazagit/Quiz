import React from 'react';
import './SearchBox.css'

const SearchBox = ({ placeholder, value, onChange, icon = "🔍", isDarkTheme }) => {
  return (
    <div className={`search-box ${isDarkTheme ? 'dark-theme' : ''}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBox;