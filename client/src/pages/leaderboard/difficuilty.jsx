import React, { useState, useEffect } from 'react';

const QuestionDifficultyPage = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(100);

    // Fetch question difficulty data from FastAPI backend
    const fetchQuestionDifficulty = async (currentLimit) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:80/api/v1/analytics/question-difficulty?limit=${currentLimit}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setQuestions(result.data);
            } else {
                throw new Error(result.message || 'Failed to fetch question difficulty data');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestionDifficulty(limit);
    }, [limit]);

    // Helper function to color code difficulty tiers
    const getDifficultyBadge = (score) => {
        if (score >= 70) {
            return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Hard</span>;
        } else if (score >= 40) {
            return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Medium</span>;
        } else {
            return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Easy</span>;
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Question Difficulty Analysis
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Questions ranked by difficulty score factoring in accuracy and response time.
                    </p>
                </div>

                {/* Limit Selector Dropdown */}
                <div className="flex items-center gap-2">
                    <label htmlFor="limit-select" className="text-sm font-medium text-gray-700">
                        Show limit:
                    </label>
                    <select
                        id="limit-select"
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 shadow-sm"
                    >
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={250}>250</option>
                        <option value={500}>500</option>
                    </select>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg shadow-sm">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-red-700 font-medium">Error loading data: {error}</p>
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
                                Question ID
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Difficulty Score
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Tier
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Total Attempts
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Accuracy %
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Avg Time (s)
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            // Loading Skeleton Rows
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center"><div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div></td>
                                </tr>
                            ))
                        ) : questions.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500 text-sm">
                                    No question difficulty metrics available.
                                </td>
                            </tr>
                        ) : (
                            questions.map((item) => (
                                <tr key={item.question_id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        {item.question_id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-indigo-600">
                                        {item.difficulty_score}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {getDifficultyBadge(item.difficulty_score)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                                        {item.total_attempts.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {item.accuracy_percentage}%
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                                        {item.avg_response_time}s
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default QuestionDifficultyPage;
