import React, { useState } from 'react';
import ResultsFilter from './ResultsFilter/ResultsFilter';
import ResultsStats from './ResultsStats/ResultsStats';
import ResultCard from './ResultCard/ResultCard';
import EmptyResults from './EmptyResults/EmptyResults';
import './QuizResultsTab.css'

const FILTER_OPTIONS = [
  { label: 'All Time', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Last 7 Days', value: 'last7' },
  { label: 'This Month', value: 'month' },
];

const QuizResultsTab = ({ 
  results, 
  onDeleteResults, 
  isMobile, 
  searchPIN, 
  setSearchPIN,
  filter,
  setFilter 
}) => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  return (
    <div className="results-tab">
      <div className="results-header">
        <ResultsFilter
          searchPIN={searchPIN}
          setSearchPIN={setSearchPIN}
          filter={filter}
          setFilter={setFilter}
          isMobile={isMobile}
          mobileFilterOpen={mobileFilterOpen}
          setMobileFilterOpen={setMobileFilterOpen}
          filterOptions={FILTER_OPTIONS}
        />
        <ResultsStats results={results} />
      </div>

      {results.length === 0 ? (
        <EmptyResults />
      ) : (
        <div className="results-grid">
          {results.map((result) => (
            <ResultCard
              key={result._id}
              result={result}
              onDelete={onDeleteResults}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizResultsTab;