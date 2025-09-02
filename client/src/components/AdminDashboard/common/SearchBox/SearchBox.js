import React from 'react';
import './SearchBox.css'

const SearchBox = ({ placeholder, value, onChange, icon = "🔍" }) => {
  return (
    <div className="search-box">
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