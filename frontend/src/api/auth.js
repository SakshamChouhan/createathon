import axios from "axios";

// API Base URLs
const BASE_URL = "http://localhost:8000";
const AUTH_API_URL = `${BASE_URL}/api/auth`; // Authentication Endpoints
const CHALLENGE_API_URL = `${BASE_URL}/api/challenges`; // Challenges Endpoints
const PROGRESS_API_URL = `${BASE_URL}/api/progress`; // Progress Endpoints
const TELEGRAM_API_URL = `${BASE_URL}/telegram/webhook/`;  // Webhook URL

// ✅ Get Auth Headers
const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
        },
    };
};

// ✅ Refresh Access Token if Expired
export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
        logout();
        throw new Error("No refresh token found. Please log in again.");
    }

    try {
        const response = await axios.post(`${AUTH_API_URL}/token/refresh/`, {
            refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem("accessToken", access);
        return access;
    } catch (error) {
        logout();
        throw new Error("Session expired. Please log in again.");
    }
};

// ✅ Perform API Requests with Token Handling
const requestWithAuth = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                ...getAuthHeaders().headers,
            },
        });

        if (response.status === 401) {
            // Token expired, refresh it
            const newAccessToken = await refreshAccessToken();
            return requestWithAuth(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${newAccessToken}`,
                },
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Request failed");
        }

        return await response.json();
    } catch (error) {
        console.error(`Error in API request: ${url}`, error);
        return null;
    }
};

// ✅ User Registration
export const registerUser = async (userData) => {
    if (userData.username.toLowerCase() === "admin") {
        return { error: "Username 'admin' is not allowed." };
    }

    return requestWithAuth(`${AUTH_API_URL}/register/`, {
        method: "POST",
        body: JSON.stringify(userData),
    });
};

// ✅ User Login
export const login = async (username, password) => {
    try {
        const response = await requestWithAuth(`${AUTH_API_URL}/login/`, {
            method: "POST",
            body: JSON.stringify({ username, password }),
        });

        if (response) {
            localStorage.setItem("accessToken", response.access);
            localStorage.setItem("refreshToken", response.refresh);
            localStorage.setItem("isAdmin", username === "admin" ? "true" : "false");
       
            localStorage.setItem("username", response.username); 
        }

        return response;
    } catch (error) {
        console.error("Login failed:", error);
        return null;
    }
};


// ✅ User Logout
export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login"; // Redirect to login
};

// ✅ Fetch User Profile
export const fetchUserProfile = async () => {
    return requestWithAuth(`${AUTH_API_URL}/profile/`);
};

// ✅ Check if User is Authenticated
export const isAuthenticated = () => !!localStorage.getItem("accessToken");

// ✅ Fetch All Challenges
export const fetchChallenges = async () => {
    return requestWithAuth(`${CHALLENGE_API_URL}/`);
};

// ✅ Fetch Challenge Details by ID
export const fetchChallengeDetail = async (id) => {
    return requestWithAuth(`${CHALLENGE_API_URL}/${id}/`);
};

// ✅ Create New Challenge (Admin Only)
export const createChallenge = async (challengeData) => {
    return requestWithAuth(`${CHALLENGE_API_URL}/create/`, {
        method: "POST",
        body: JSON.stringify(challengeData),
    });
};

// ✅ Submit Solution for a Challenge
export const submitChallengeSolution = async (challengeId, code) => {
    return requestWithAuth(`${CHALLENGE_API_URL}/${challengeId}/submit/`, {
        method: "POST",
        body: JSON.stringify({ code }),
    });
};

// ✅ Add a Test Case to a Challenge
export const addTestCase = async (challengeId, testCaseData) => {
    return requestWithAuth(`${CHALLENGE_API_URL}/${challengeId}/test-cases/`, {
        method: "POST",
        body: JSON.stringify(testCaseData),
    });
};

// ✅ Fetch Test Cases for a Challenge
export const fetchTestCases = async (challengeId) => {
    return requestWithAuth(`${CHALLENGE_API_URL}/${challengeId}/test-cases/`);
};

// ✅ Run User Code (Execute in the Backend)
export const runUserCode = async (challengeId, code, language) => {
    return requestWithAuth(`${CHALLENGE_API_URL}/${challengeId}/run-code/`, {
        method: "POST",
        body: JSON.stringify({ code, language }),
    });
};

// ✅ Save User Progress
export const saveProgress = async (userId, challengeId, code) => {
    return requestWithAuth(`${PROGRESS_API_URL}/save/`, {
        method: "POST",
        body: JSON.stringify({ user_id: userId, challenge_id: challengeId, code }),
    });
};

// ✅ Get User Progress for a Specific Challenge
export const getUserProgress = async (challengeId) => {
    return requestWithAuth(`${PROGRESS_API_URL}/${challengeId}/`);
};

// ✅ Fetch Overall Progress Summary
export const fetchUserProgress = async () => {
    return requestWithAuth(`${PROGRESS_API_URL}/summary/`);
};

// ✅ Fetch User Leaderboard
export const fetchUserBoard = async () => {
    return requestWithAuth(`${PROGRESS_API_URL}/leaderboard/`);
};

// ✅ Send Message to Telegram Webhook
export const sendMessageToWebhook = async (message) => {
    const userId = localStorage.getItem("username"); 

    if (!userId) {
        console.error("User ID not found in localStorage.");
        return { error: "User ID not found." };
    }

    try {
        const response = await axios.post(TELEGRAM_API_URL, {
            user_id: userId,  
            message: {
                text: message,  
            },
        });

        return response.data;  
    } catch (error) {
        console.error("Error sending message:", error);
        return { error: "Failed to send message" };
    }
};