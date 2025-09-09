import React from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import './ResultsFilter.css'

const ResultsFilter = ({
  searchPIN,
  setSearchPIN,
  filter,
  setFilter,
  isMobile,
  mobileFilterOpen,
  setMobileFilterOpen,
  filterOptions,
  isDarkTheme
}) => {
  return (
    <div className="search-filter" data-theme={isDarkTheme ? "dark" : "light"}>
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by PIN..."
          value={searchPIN}
          onChange={(e) => setSearchPIN(e.target.value)}
        />
      </div>
      {isMobile ? (
        <>
          <button 
            className="mobile-filter-btn"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            <FiFilter /> Filters
          </button>
          {mobileFilterOpen && (
            <div className="mobile-filter-dropdown">
              <div className="filter-header">
                <h4>Filter Options</h4>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <FiX />
                </button>
              </div>
              {filterOptions.map((f) => (
                <button
                  key={f.value}
                  className={`filter-option ${filter === f.value ? 'active' : ''}`}
                  onClick={() => {
                    setFilter(f.value);
                    setMobileFilterOpen(false);
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="time-filter"
        >
          {filterOptions.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      )}
    </div>
  );
};

export default ResultsFilter;