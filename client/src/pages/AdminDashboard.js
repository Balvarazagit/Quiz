import React, { useEffect, useState } from 'react';
import AdminLogin from './AdminLogin';

const FILTER_OPTIONS = [
  { label: 'All Time', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Last 7 Days', value: 'last7' },
  { label: 'This Month', value: 'month' },
];
const TABS = ['Users', 'Quiz Results', 'Quizzes'];

function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('Users');
  const [results, setResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [searchPIN, setSearchPIN] = useState('');
  const [filter, setFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [quizSearch, setQuizSearch] = useState('');
  const [quizSortBy, setQuizSortBy] = useState('date'); // 'date' or 'name'

  // Results Fetch
  useEffect(() => {
    if (!loggedIn) return;

    const query = new URLSearchParams();
    if (searchPIN) query.append('pin', searchPIN);
    if (filter) query.append('filter', filter);

    fetch(`${process.env.REACT_APP_API_URL}/api/results/all?${query.toString()}`)
      .then((res) => res.json())
      .then(setResults)
      .catch(console.error);
  }, [loggedIn, searchPIN, filter]);

  // Users Fetch
  useEffect(() => {
    if (loggedIn) {
      fetch(`${process.env.REACT_APP_API_URL}/api/users`)
        .then(res => res.json())
        .then(setUsers)
        .catch(console.error);
    }
  }, [loggedIn]);

  // Quizzes Fetch
  useEffect(() => {
    if (loggedIn) {
      fetch(`${process.env.REACT_APP_API_URL}/api/quiz/admin/all`)
        .then(res => res.json())
        .then(setQuizzes)
        .catch(console.error);
    }
  }, [loggedIn]);

  const handleDeleteResults = async (id) => {
    if (!window.confirm('Delete this quiz result?')) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/results/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      alert(data.message || 'Deleted');
      setResults(prev => prev.filter(r => r._id !== id));
    } catch (e) {
      alert('Error deleting result.');
      console.error(e);
    }
  };

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredQuizzes = quizzes
    .filter((q) => {
      const search = quizSearch.toLowerCase();

      return (
        q._id.toLowerCase().includes(search) ||
        q.title.toLowerCase().includes(search) ||
        q.host?.name?.toLowerCase().includes(search) ||
        q.host?.email?.toLowerCase().includes(search) ||
        new Date(q.createdAt).toLocaleDateString().toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      if (quizSortBy === 'name') {
        return a.title.localeCompare(b.title);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const handleDeleteQuiz = async (quizId) => {
    const confirm = window.confirm("Are you sure you want to delete this quiz?");
    if (!confirm) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/quiz/${quizId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      alert(data.message);

      // Refetch quizzes after deletion
      const updated = await fetch(`${process.env.REACT_APP_API_URL}/api/quiz/admin/all`)
        .then(res => res.json());
      setQuizzes(updated);
    } catch (err) {
      console.error("❌ Error deleting quiz:", err);
      alert("Failed to delete quiz");
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/users/${userId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        // Remove user from local state
        setUsers((prev) => prev.filter((user) => user._id !== userId));
      } else {
        alert('Failed to delete user');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting user');
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg p-6">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">📊 Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 text-sm font-medium ${activeTab === tab
                  ? 'border-b-2 border-indigo-600 text-indigo-700'
                  : 'text-gray-500'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* === USERS === */}
        {activeTab === 'Users' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Registered Users</h2>

            {users.length === 0 ? (
              <p className="text-gray-500 text-center">No users found.</p>
            ) : (
              <div className="overflow-x-auto rounded-md shadow border">
                <table className="min-w-full text-sm">
                  <thead className="bg-indigo-100 text-indigo-900 text-left">
                    <tr>
                      <th className="p-3">User ID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="even:bg-gray-50 hover:bg-indigo-50 border-t">
                        <td className="p-3 text-gray-600">{user._id}</td>
                        <td className="p-3">{user.name}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-xs transition"
                          >
                            🗑 Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}



        {/* === QUIZ RESULTS === */}
        {activeTab === 'Quiz Results' && (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
              <input
                type="text"
                placeholder="Search by PIN"
                value={searchPIN}
                onChange={(e) => setSearchPIN(e.target.value)}
                className="border px-3 py-2 rounded-md w-52"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border px-3 py-2 rounded-md"
              >
                {FILTER_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {results.length === 0 ? (
              <p className="text-gray-500">No quiz results found.</p>
            ) : (
              results.map((result, i) => (
                <div
                  key={i}
                  className="mb-6 p-5 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 shadow-md"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-gray-700 font-semibold">Quiz PIN: {result.pin}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(result.date).toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-white rounded-md overflow-hidden">
                    <table className="min-w-full text-sm table-auto border-collapse">
                      <thead>
                        <tr className="bg-indigo-100 text-indigo-800">
                          <th className="py-2 px-4 text-left">#</th>
                          <th className="py-2 px-4 text-left">Player</th>
                          <th className="py-2 px-4 text-right">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.players.map((p, idx) => (
                          <tr
                            key={idx}
                            className={`${idx === 0 ? 'bg-yellow-100' : 'hover:bg-gray-50'
                              } border-b`}
                          >
                            <td className="py-2 px-4">{idx + 1}</td>
                            <td className="py-2 px-4">{p.name}</td>
                            <td className="py-2 px-4 text-right font-bold text-indigo-600">
                              {p.score} pts
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={() => handleDeleteResults(result._id)}
                    className="mt-2 text-red-500 text-sm hover:underline"
                  >
                    🗑 Delete Result
                  </button>
                </div>
              ))
            )}
          </div>
        )}


        {/* === QUIZZES === */}
        {activeTab === 'Quizzes' && (
          <div>
            {/* Search and Sort */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="🔍 Search quizzes..."
                className="px-4 py-2 border rounded-md w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                value={quizSearch}
                onChange={(e) => setQuizSearch(e.target.value)}
              />
            </div>

            {/* Table */}
            {quizzes.length === 0 ? (
              <p className="text-gray-500 text-center">No quizzes found.</p>
            ) : (
              <div className="overflow-x-auto rounded-md shadow-md border">
                <table className="min-w-full text-sm">
                  <thead className="bg-indigo-100 text-indigo-900 text-left">
                    <tr>
                      <th className="p-3">Quiz ID</th>
                      <th className="p-3">Title</th>
                      <th className="p-3">Host Name</th>
                      <th className="p-3">Host Email</th>
                      <th className="p-3">Created On</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuizzes.map((quiz) => (
                      <tr key={quiz._id} className="even:bg-gray-50 hover:bg-indigo-50 border-t">
                        <td className="p-3 text-gray-600">{quiz._id}</td>
                        <td className="p-3 font-medium">{quiz.title}</td>
                        <td className="p-3">{quiz.host?.name || 'N/A'}</td>
                        <td className="p-3">{quiz.host?.email || 'N/A'}</td>
                        <td className="p-3 text-gray-500">{new Date(quiz.createdAt).toLocaleDateString()}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteQuiz(quiz._id)}
                            className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-xs transition"
                          >
                            🗑 Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}


      </div>
    </div>
  );
}

export default AdminDashboard;
