import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBarChart2, FiSun, FiMoon } from 'react-icons/fi';
import '../pages/styles/Analytics.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Analytics() {
  const [chartData, setChartData] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Theme state
  const navigate = useNavigate();

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  // Check for saved theme preference on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkTheme(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`${process.env.REACT_APP_API_URL}/api/quiz/my-analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          console.error("❌ API did not return an array");
          return;
        }

        const labels = data.map(q => q.title || 'Untitled Quiz');
        const values = data.map(q => q.plays || 0);

        setChartData({
          labels,
          datasets: [{
            label: 'Number of Plays',
            data: values,
            backgroundColor: isDarkTheme ? '#4CAF50' : '#68D391',
            borderColor: isDarkTheme ? '#388E3C' : '#38A169',
            borderWidth: 1,
            borderRadius: 4,
          }],
        });
      })
      .catch(err => {
        console.error("❌ Fetch failed:", err);
      });
  }, [isDarkTheme]);

  const handleGoBack = () => navigate(-1);

  if (!chartData) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
    </div>
  );

  return (
    <div className="analytics-container">
      {/* Theme Toggle Button */}
      <button 
        className="theme-toggle theme-toggle-analytics" 
        onClick={toggleTheme} 
        aria-label="Toggle theme"
      >
        {isDarkTheme ? <FiSun size={18} /> : <FiMoon size={18} />}
      </button>
      
      <button 
        onClick={handleGoBack}
        className="back-button-analytics"
        aria-label="Go back"
      >
        <FiArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="analytics-header">
        <div className="analytics-icon">
          <FiBarChart2 size={32} />
        </div>
        <h2>Quiz Performance Analytics</h2>
        <p>Track how your quizzes are performing over time</p>
      </div>
      
      <div className="chart-wrapper">
        <Bar 
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { 
                position: 'top',
                labels: { 
                  font: { 
                    size: 14,
                    family: "'Inter', sans-serif" 
                  },
                  color: isDarkTheme ? '#e0e0e0' : '#4A5568'
                }
              },
              tooltip: {
                backgroundColor: isDarkTheme ? '#2D3748' : '#2D3748',
                titleFont: { size: 16 },
                bodyFont: { size: 14 },
                padding: 12,
                cornerRadius: 8,
                titleColor: isDarkTheme ? '#e0e0e0' : '#ffffff',
                bodyColor: isDarkTheme ? '#e0e0e0' : '#ffffff',
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: { 
                  color: isDarkTheme ? '#404040' : '#E2E8F0',
                  drawBorder: false
                },
                ticks: { 
                  stepSize: 1, 
                  color: isDarkTheme ? '#a0a0a0' : '#4A5568',
                  font: {
                    family: "'Inter', sans-serif"
                  }
                }
              },
              x: {
                grid: { display: false },
                ticks: { 
                  color: isDarkTheme ? '#a0a0a0' : '#4A5568',
                  font: {
                    family: "'Inter', sans-serif",
                    size: window.innerWidth < 768 ? 10 : 12
                  }
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
}

export default Analytics;