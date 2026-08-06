import React, { useState, useEffect } from 'react';

export default function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(50);

    // Fetch learning velocity data from FastAPI backend
    const fetchLeaderboard = async (currentLimit) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:80/api/v1/analytics/learning-velocity?limit=${currentLimit}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setLeaderboardData(result.data);
            } else {
                throw new Error(result.message || 'Failed to fetch leaderboard data');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard(limit);
    }, [limit]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Learning Velocity Leaderboard
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Ranked by accuracy, consistency, and response speed.
                    </p>
                </div>

                {/* Limit Selector Dropdown */}
                <div className="flex items-center gap-2">
                    <label htmlFor="limit-select" className="text-sm font-medium text-gray-700">
                        Show top:
                    </label>
                    <select
                        id="limit-select"
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 shadow-sm"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg shadow-sm">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-red-700 font-medium">Error loading leaderboard: {error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Table Section */}
            <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Rank
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                User ID
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Velocity Index
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Accuracy
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Avg Time (s)
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Consistency
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            // Loading Skeleton Rows
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-6"></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div></td>
                                </tr>
                            ))
                        ) : leaderboardData.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500 text-sm">
                                    No leaderboard data available right now.
                                </td>
                            </tr>
                        ) : (
                            leaderboardData.map((user, index) => {
                                // Highlight top 3 ranks
                                const isTopThree = index < 3;
                                const rankColors = [
                                    "bg-yellow-100 text-yellow-800 border-yellow-300",
                                    "bg-gray-100 text-gray-800 border-gray-300",
                                    "bg-amber-100 text-amber-800 border-amber-300"
                                ];

                                return (
                                    <tr key={user.user_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border ${isTopThree ? rankColors[index] : 'bg-transparent border-transparent text-gray-600'}`}>
                          {index + 1}
                        </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {user.user_id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-blue-600">
                                            {user.learning_velocity_index}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          {user.accuracy}%
                        </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                                            {user.avg_response_time}s
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                                            {user.consistency_score}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
