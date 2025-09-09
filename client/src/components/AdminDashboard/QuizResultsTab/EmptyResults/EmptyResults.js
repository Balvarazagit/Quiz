import React from 'react';
import './EmptyResults.css'

const EmptyResults = ({ isDarkTheme }) => {
  return (
    <div className="empty-results" data-theme={isDarkTheme ? "dark" : "light"}>
      <div className="empty-state-emptyresults">
        <svg
          viewBox="0 0 400 300"
          xmlns="http://www.w3.org/2000/svg"
          style={{ maxWidth: '100%' }}
        >
          <style>
            {`
              @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
              }
              @keyframes rotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              .magnifier {
                animation: float 3s ease-in-out infinite;
              }
              .glass {
                animation: pulse 2s ease infinite;
              }
              .search-line {
                stroke-dasharray: 100;
                stroke-dashoffset: 100;
                animation: dash 1.5s linear infinite;
              }
              @keyframes dash {
                to { stroke-dashoffset: 0; }
              }
              .confetti {
                opacity: 0;
              }
              .confetti:nth-child(1) { animation: fall 3s ease-in infinite; }
              .confetti:nth-child(2) { animation: fall 3s ease-in 0.5s infinite; }
              .confetti:nth-child(3) { animation: fall 3s ease-in 1s infinite; }
              .confetti:nth-child(4) { animation: fall 3s ease-in 1.5s infinite; }
              .confetti:nth-child(5) { animation: fall 3s ease-in 2s infinite; }
              @keyframes fall {
                0% { transform: translateY(-50px) rotate(0deg); opacity: 0; }
                20% { opacity: 1; }
                100% { transform: translateY(200px) rotate(360deg); opacity: 0; }
              }
            `}
          </style>

          {/* Background */}
          <rect width="400" height="300" fill={isDarkTheme ? "#2d3748" : "#f8f9fa"} rx="10" />

          {/* Magnifier with animation */}
          <g className="magnifier" transform="translate(150, 80)">
            <circle className="glass" cx="50" cy="50" r="40" fill="none" stroke={isDarkTheme ? "#a0aec0" : "#6c757d"} strokeWidth="4" strokeDasharray="5,5" />
            <path d="M90 90 L120 120" stroke={isDarkTheme ? "#a0aec0" : "#6c757d"} strokeWidth="4" strokeLinecap="round" className="search-line" />
            <circle cx="50" cy="50" r="30" fill="none" stroke={isDarkTheme ? "#a0aec0" : "#6c757d"} strokeWidth="2" />
            <path d="M50 30 A20 20 0 0 1 50 70 A20 20 0 0 1 50 30 Z" fill={isDarkTheme ? "#4a5568" : "#e9ecef"} />
          </g>

          {/* Confetti animation */}
          <rect className="confetti" x="50" y="-20" width="15" height="15" fill="#ff6b6b" rx="3" />
          <rect className="confetti" x="100" y="-20" width="15" height="15" fill="#4ecdc4" rx="3" transform="rotate(45)" />
          <rect className="confetti" x="200" y="-20" width="15" height="15" fill="#ffe66d" rx="3" />
          <rect className="confetti" x="250" y="-20" width="15" height="15" fill="#a5d8ff" rx="3" transform="rotate(30)" />
          <rect className="confetti" x="300" y="-20" width="15" height="15" fill="#b2f2bb" rx="3" transform="rotate(60)" />

          {/* Text */}
          <text x="200" y="180" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" textAnchor="middle" fill={isDarkTheme ? "#e2e8f0" : "#495057"}>
            No Results Found
          </text>

          {/* Modern decorative elements */}
          <circle cx="50" cy="50" r="5" fill="#ff6b6b" opacity="0.7">
            <animate attributeName="r" values="5;8;5" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="350" cy="250" r="7" fill="#4ecdc4" opacity="0.7">
            <animate attributeName="r" values="7;10;7" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
      <p>Try adjusting your search or time filter</p>
    </div>
  );
};

export default EmptyResults;