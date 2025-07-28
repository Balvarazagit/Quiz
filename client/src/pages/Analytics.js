import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/Analytics.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Analytics() {
  const [chartData, setChartData] = useState(null);
  const navigate = useNavigate();

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
            backgroundColor: '#68D391',
            borderColor: '#38A169',
            borderWidth: 1,
            borderRadius: 4,
          }],
        });
      })
      .catch(err => {
        console.error("❌ Fetch failed:", err);
      });
  }, []);

  const handleGoBack = () => navigate(-1);

  if (!chartData) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
    </div>
  );

  return (
    <div className="analytics-container">
      <button 
        onClick={handleGoBack}
        className="back-button-analytics"
        aria-label="Go back"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </button>

      <div className="analytics-header">
        <h2>📊 Quiz Performance Analytics</h2>
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
                  } 
                }
              },
              tooltip: {
                backgroundColor: '#2D3748',
                titleFont: { size: 16 },
                bodyFont: { size: 14 },
                padding: 12,
                cornerRadius: 8
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: { 
                  color: '#E2E8F0',
                  drawBorder: false
                },
                ticks: { 
                  stepSize: 1, 
                  color: '#4A5568',
                  font: {
                    family: "'Inter', sans-serif"
                  }
                }
              },
              x: {
                grid: { display: false },
                ticks: { 
                  color: '#4A5568',
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