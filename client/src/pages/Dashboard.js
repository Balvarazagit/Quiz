import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user?.name} 🎉</h2>
        <p className="text-gray-600 mb-6">Email: {user?.email}</p>

        <div className="flex flex-col space-y-3">
          <button
            onClick={() => navigate('/create-quiz')}
            className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            ➕ Create New Quiz
          </button>

          <button
            onClick={logout}
            className="bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
