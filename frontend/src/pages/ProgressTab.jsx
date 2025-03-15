import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchUserProgress, logout } from "../api/auth";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProgressTab = () => {
  const [progress, setProgress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getProgress = async () => {
      try {
        const data = await fetchUserProgress();
        setProgress(data);
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };
    getProgress();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!progress) {
    return <p className="text-center text-gray-500">Loading progress...</p>;
  }

  const { total_challenges, submitted_challenges, category_progress, difficulty_progress } = progress;

  const categoryChartData = {
    labels: Object.keys(category_progress),
    datasets: [
      {
        label: "Challenges Solved by Category",
        data: Object.values(category_progress),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const difficultyChartData = {
    labels: Object.keys(difficulty_progress),
    datasets: [
      {
        label: "Challenges Solved by Difficulty",
        data: Object.values(difficulty_progress),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  return (
    <div className="min-h-screen w-full bg-gray-100">
      {/* 🔹 Navigation Bar */}
      <div className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <Link to="/dashboard" className="text-blue-500 hover:underline font-bold">
          🏠 Dashboard
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          🚪 Logout
        </button>
      </div>

      {/* 🔹 Progress Content */}
      <div className="p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">📊 Your Progress</h1>

        {/* 🔹 Overall Progress */}
        <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6 mb-6">
          <p className="text-lg font-semibold">
            ✅ {submitted_challenges} / {total_challenges} Challenges Completed
          </p>
          <div className="w-full bg-gray-200 rounded-full h-6 mt-3">
            <div
              className="bg-green-500 h-6 rounded-full text-center text-white text-sm font-semibold"
              style={{ width: `${(submitted_challenges / total_challenges) * 100}%` }}
            >
              {((submitted_challenges / total_challenges) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* 🔹 Category-Wise Progress */}
        <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📌 Progress by Category</h2>
          <Bar data={categoryChartData} />
        </div>

        {/* 🔹 Difficulty-Wise Progress */}
        <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🔥 Progress by Difficulty</h2>
          <Bar data={difficultyChartData} />
        </div>
      </div>
    </div>
  );
};

export default ProgressTab;
