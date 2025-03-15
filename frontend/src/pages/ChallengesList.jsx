import React, { useEffect, useState } from "react";
import { fetchChallenges, getUserProgress } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";

const ChallengesList = () => {
    const [challenges, setChallenges] = useState([]);
    const [progressMap, setProgressMap] = useState({});
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const navigate = useNavigate(); 

    useEffect(() => {
        const getChallenges = async () => {
            try {
                const data = await fetchChallenges();
                setChallenges(data);

                const progressData = {};
                for (const challenge of data) {
                    const progress = await getUserProgress(challenge.id);
                    if (progress.submitted) {
                        progressData[challenge.id] = {
                            code: progress.code,
                            submittedAt: progress.submittedAt,
                        };
                    }
                }
                setProgressMap(progressData);
            } catch (error) {
                console.error("Error fetching challenges:", error);
            }
        };
        getChallenges();
    }, []);

    // 🔹 Logout Function
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("isAdmin");
        navigate("/login"); 
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-gray-800 text-white p-4 flex justify-between items-center fixed w-full top-0 shadow-md z-50">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">Challenge Platform</h1>
                <Link to="/dashboard" className="hover:text-gray-300">
                        Dashboard
                            </Link>
                        </div>
        
            <div className="flex items-center space-x-4">
                <Link to="/profile" className="hover:text-gray-300">Profile</Link>
                {isAdmin && (
                    <Link to="/add-challenge" className="hover:text-gray-300">Add Challenge</Link>
                )}
                <button 
                    onClick={handleLogout} 
                    className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </nav>


            <div className="p-6 pt-20">
                <h1 className="text-2xl font-bold mb-4">Challenges</h1>
                
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 bg-white">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="border p-3">Title</th>
                                <th className="border p-3">Description</th>
                                <th className="border p-3">Category</th>
                                <th className="border p-3">Difficulty</th>
                                <th className="border p-3">Points</th>
                                <th className="border p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {challenges.map((challenge) => (
                                <tr key={challenge.id} className="border">
                                    <td className="border p-3 font-semibold">{challenge.title}</td>
                                    <td className="border p-3">{challenge.description}</td>
                                    <td className="border p-3">{challenge.category}</td>
                                    <td className="border p-3">{challenge.difficulty}</td>
                                    <td className="border p-3">{challenge.points}</td>
                                    <td className="border p-3 flex space-x-2">
                                        {progressMap[challenge.id] ? (
                                            <Link
                                                to={`/submissions/${challenge.id}`}
                                                className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                                            >
                                                View Submission
                                            </Link>
                                        ) : (
                                            <Link
                                                to={`/challenges/${challenge.id}`}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            >
                                                View
                                            </Link>
                                        )}

                                        {isAdmin && (
                                            <>
                                                <Link
                                                    to={`/edit-challenge/${challenge.id}`}
                                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    to={`/add-test-cases/${challenge.id}`}
                                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                                >
                                                    Add or Modify Test Cases
                                                </Link>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ChallengesList;
