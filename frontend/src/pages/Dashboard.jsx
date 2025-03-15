import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserProgress, fetchUserBoard } from "../api/auth";

const Dashboard = () => {
    const navigate = useNavigate();
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    const [progress, setProgress] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const progressData = await fetchUserProgress();
                const leaderboardData = await fetchUserBoard();
                setProgress(progressData);
                setLeaderboard(leaderboardData || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("isAdmin");
        navigate("/login");
    };

    return (
        <div className="min-h-screen">
            {/* ✅ Navbar (Full Width) */}
            <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white p-4 flex justify-between items-center shadow-md w-full">
                <div className="flex items-center gap-6">
                    <h2 className="text-2xl font-bold">Dashboard</h2>
                    <Link to="/challenges" className="hover:text-gray-300">
                        Challenges
                    </Link>
                    <Link to="/progress" className="hover:text-gray-300">
                        Progress
                    </Link>
                </div>
                <div className="flex items-center gap-6">
                    {isAdmin && (
                        <Link to="/admin/add-challenge" className="hover:text-gray-300">
                            Add Challenge
                        </Link>
                    )}
                    <Link to="/profile" className="hover:text-gray-300">
                        Profile
                    </Link>
                    <Link to="/send-message" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                        Telegram Bot
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* ✅ Content Layout */}
            <div className="min-h-screen flex items-center justify-center px-6 pt-20 w-full">
                <div className="flex justify-between w-full max-w-6xl gap-12">
                    {/* 📊 Left: User Progress */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">📊 Your Progress</h3>
                        {loading ? (
                            <p>Loading progress...</p>
                        ) : progress ? (
                            <div>
                                <p><b>Total Challenges:</b> {progress.total_challenges}</p>
                                <p><b>Solved:</b> {progress.submitted_challenges}</p>

                                {/* Category-wise Progress */}
                                <h4 className="mt-3 font-medium">Category Progress</h4>
                                <ul className="list-disc ml-5">
                                    {Object.entries(progress.category_progress).map(([category, count]) => (
                                        <li key={category}>{category}: {count}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p>No progress data available.</p>
                        )}
                    </div>

                    {/* 🏆 Right: Leaderboard */}
                    <div className="bg-white p-6 rounded-lg shadow-md ">
                        <h3 className="text-xl font-semibold mb-4">🏆 Leaderboard</h3>
                        {loading ? (
                            <p>Loading leaderboard...</p>
                        ) : leaderboard.length > 0 ? (
                            <table className="w-full border">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="px-4 py-2 border">Rank</th>
                                        <th className="px-4 py-2 border">Username</th>
                                        <th className="px-4 py-2 border">Solved</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((user, index) => (
                                        <tr key={user.username} className="border-b">
                                            <td className="px-4 py-2 border text-center">{index + 1}</td>
                                            <td className="px-4 py-2 border">{user.username}</td>
                                            <td className="px-4 py-2 border text-center">{user.submitted_challenges}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No leaderboard data available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
