import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserProfile, refreshAccessToken, logout, isAuthenticated } from "../api/auth";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const getUserProfile = async () => {
      try {
        const data = await fetchUserProfile();
        if (!data || data.error) {
          throw new Error(data?.error || "Failed to fetch profile");
        }
        setUser(data);
      } catch (err) {
        if (err.message.includes("401")) {
          try {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
              localStorage.setItem("accessToken", newAccessToken);
              const retryData = await fetchUserProfile();
              setUser(retryData);
            } else {
              throw new Error("Failed to refresh token");
            }
          } catch (refreshError) {
            setError("Session expired. Please log in again.");
            logout();
            navigate("/login");
          }
        } else {
          setError(err?.message || "An error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading profile...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="min-h-screen w-full">
      {/* 🔹 Top Navigation Bar */}
      <div className="bg-white shadow-md py-4 px-6 flex justify-end items-center">
        <Link to="/dashboard" className="text-blue-500 hover:underline mr-6">
          🏠 Dashboard
        </Link>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          🚪 Logout
        </button>
      </div>

      {/* 🔹 Profile Content */}
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="bg-white shadow-lg rounded-lg p-6 w-96">
          <h2 className="text-2xl font-bold mb-4 text-center">User Profile</h2>

          {user ? (
            <div className="text-center">
              <p className="text-lg text-gray-700 font-semibold">Username: {user.username}</p>
              <p className="text-lg text-gray-700">Email: {user.email}</p>
              <p className="text-lg text-gray-700">Date Joined: {user.date_joined}</p>
            </div>
          ) : (
            <p className="text-center text-gray-500">User data not available.</p>
          )}

          {/* 🔹 Go Back to Dashboard Button */}
          <Link to="/dashboard">
            <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
              ⬅ Go Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
