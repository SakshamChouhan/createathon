import React, { useState } from "react";
import { createChallenge } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";

const AddChallenge = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [difficulty, setDifficulty] = useState("beginner");
    const [category, setCategory] = useState("arrays");
    const [points, setPoints] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const challengeData = { title, description, difficulty, category, points };

        try {
            await createChallenge(challengeData);
            setMessage("Challenge added successfully!");
            setTitle("");
            setDescription("");
            setDifficulty("beginner");
            setCategory("arrays");
            setPoints("");
        } catch (error) {
            setMessage("Failed to add challenge.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("isAdmin");
        navigate("/login");
    };

    return (
        <div className="min-h-screen">
            {/* Navbar */}
            <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white p-4 flex justify-between items-center shadow-md w-full">
                <div className="flex items-center gap-6">
                    <h2 className="text-2xl font-bold">ADD CHALLENGE</h2>
                    <Link to="/dashboard" className="hover:text-gray-300">
                        Dashboard
                    </Link>
                    <Link to="/challenges" className="hover:text-gray-300">
                        Challenges
                    </Link>
                    <Link to="/progress" className="hover:text-gray-300">
                        Progress
                    </Link>
                </div>
                <div className="flex items-center gap-6">
                    <Link to="/profile" className="hover:text-gray-300">
                        Profile
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Content Layout */}
            <div className="min-h-screen flex flex-col items-center justify-center  p-6 pt-20">
                <h1 className="text-2xl font-bold mb-4">Add New Challenge</h1>
                {message && <p className="text-green-600">{message}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    ></textarea>

                    {/* Difficulty Selection */}
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>

                    {/* Points Input */}
                    <input
                        type="number"
                        placeholder="Points"
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />

                    {/* Category Selection */}
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="arrays">Arrays</option>
                        <option value="strings">Strings</option>
                        <option value="linked_list">Linked List</option>
                        <option value="stacks">Stacks</option>
                        <option value="queues">Queues</option>
                        <option value="recursion">Recursion</option>
                        <option value="dynamic_programming">Dynamic Programming</option>
                        <option value="graph">Graph</option>
                        <option value="tree">Tree</option>
                        <option value="greedy">Greedy</option>
                        <option value="bit_manipulation">Bit Manipulation</option>
                        <option value="math">Math</option>
                        <option value="miscellaneous">Miscellaneous</option>
                    </select>

                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Add Challenge
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddChallenge;
