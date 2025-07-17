import React, { useEffect, useState } from 'react';
import AdminLogin from './AdminLogin';

const FILTER_OPTIONS = [
  { label: 'All Time', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Last 7 Days', value: 'last7' },
  { label: 'This Month', value: 'month' },
];

function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [results, setResults] = useState([]);
  const [searchPIN, setSearchPIN] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!loggedIn) return;

    const query = new URLSearchParams();
    if (searchPIN) query.append('pin', searchPIN);
    if (filter) query.append('filter', filter);

    fetch(`http://localhost:5000/api/results/all?${query.toString()}`)
      .then((res) => res.json())
      .then(setResults)
      .catch(console.error);
  }, [loggedIn, searchPIN, filter]);

  if (!loggedIn) {
    return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-indigo-700">📊 Admin Dashboard</h1>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="🔍 Search by PIN"
            className="border px-3 py-2 rounded-md w-full sm:w-64"
            value={searchPIN}
            onChange={(e) => setSearchPIN(e.target.value)}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border px-3 py-2 rounded-md"
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Results Table */}
        {results.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No quiz results found.</div>
        ) : (
          results.map((result, index) => (
            <div
              key={index}
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
                        className={`${idx === 0 ? 'bg-yellow-100' : 'hover:bg-gray-50'} border-b`}
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
