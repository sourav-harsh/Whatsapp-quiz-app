import React, { useState, useEffect, useContext } from 'react';
// Assuming you have an AuthContext that provides the logged-in user
// Adjust the import path according to your project structure;
import {useAuth} from "../../utils/AuthContext.jsx";

const FatigueAnalysisPage = () => {
    const { user } = useAuth();
    const userId = user?._id || user?.user_id; // Fallback depending on your auth object structure
    // console.log(user)
    const [buckets, setBuckets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bucketSize, setBucketSize] = useState(5);

    // Fetch fatigue analysis data from FastAPI backend
    const fetchFatigueAnalysis = async (currentUserId, currentBucketSize) => {
        if (!currentUserId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `http://localhost:80/api/v1/analytics/fatigue-analysis?user_id=${currentUserId}&bucket_size=${currentBucketSize}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                // result.data contains the FatigueAnalysisResponse object with a `buckets` array
                setBuckets(result.data.buckets || []);
            } else {
                throw new Error(result.message || 'Failed to fetch fatigue analysis data');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchFatigueAnalysis(userId, bucketSize);
        } else {
            setLoading(false);
        }
    }, [userId, bucketSize]);

    if (!userId) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-12 text-center">
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl inline-block shadow-sm">
                    <p className="text-yellow-800 font-medium text-sm">
                        Please log in to view your fatigue analysis metrics.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Fatigue & Endurance Analysis
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Track how your accuracy and response times change over the course of long quiz sessions.
                    </p>
                </div>

                {/* Bucket Size Selector */}
                <div className="flex items-center gap-2">
                    <label htmlFor="bucket-select" className="text-sm font-medium text-gray-700">
                        Questions per bucket:
                    </label>
                    <select
                        id="bucket-select"
                        value={bucketSize}
                        onChange={(e) => setBucketSize(Number(e.target.value))}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 shadow-sm"
                    >
                        <option value={2}>2</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
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
                                Session Progression
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Total Attempts
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Accuracy %
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Avg Response Time (s)
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            // Loading Skeleton Rows
                            [...Array(4)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-36"></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div></td>
                                </tr>
                            ))
                        ) : buckets.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-gray-500 text-sm">
                                    No fatigue data available yet. Complete more quiz questions to generate insights!
                                </td>
                            </tr>
                        ) : (
                            buckets.map((bucket, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        {bucket.bucket_label}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                                        {bucket.total_attempts.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                        {bucket.accuracy}%
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-purple-600">
                                        {bucket.avg_response_time}s
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

export default FatigueAnalysisPage;
