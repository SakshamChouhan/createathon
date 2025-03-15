import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchChallengeDetail, runUserCode, saveProgress } from "../api/auth"; // Import saveProgress
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { refreshAccessToken } from "../api/auth"; 

const ChallengeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [challenge, setChallenge] = useState(null);
    const [code, setCode] = useState("");
    const [result, setResult] = useState(null);
    const [allTestsPassed, setAllTestsPassed] = useState(false); 
    const [language, setLanguage] = useState("javascript");

    const isAdmin = localStorage.getItem("isAdmin") === "true";

    useEffect(() => {
        const getChallenge = async () => {
            const data = await fetchChallengeDetail(id);
            setChallenge(data);
        };
        getChallenge();
    }, [id]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("isAdmin");
        navigate("/login");
    };

    const handleSubmit = async () => {
        setResult(null);
        setAllTestsPassed(false); 

        try {
            const response = await runUserCode(id, code, language);

            if (!response || !response.results) {
                throw new Error("Invalid response from the server.");
            }

            const passedAll = response.results.every(test => test.passed);
            setAllTestsPassed(passedAll);

            // Format results
            const formattedResults = response.results.map((test, index) => (
                <div key={index} className="p-3 border rounded mt-2">
                    <strong>Test Case {index + 1}</strong>
                    <div><strong>Input:</strong> {test.input}</div>
                    <div><strong>Expected Output:</strong> {test.expected_output}</div>
                    <div><strong>Your Output:</strong> {test.user_output}</div>
                    <div>
                        <strong>Status:</strong>{" "}
                        {test.passed ? (
                            <span className="text-green-600">✅ Passed</span>
                        ) : (
                            <span className="text-red-600">❌ Failed</span>
                        )}
                    </div>
                </div>
            ));

            setResult(formattedResults);
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await refreshAccessToken();
                    const retryResponse = await runUserCode(id, code, language);

                    const passedAllRetry = retryResponse.results.every(test => test.passed);
                    setAllTestsPassed(passedAllRetry);

                    const formattedRetryResults = retryResponse.results.map((test, index) => (
                        <div key={index} className="p-3 border rounded mt-2">
                            <strong>Test Case {index + 1}</strong>
                            <div><strong>Input:</strong> {test.input}</div>
                            <div><strong>Expected Output:</strong> {test.expected_output}</div>
                            <div><strong>Your Output:</strong> {test.user_output}</div>
                            <div>
                                <strong>Status:</strong>{" "}
                                {test.passed ? (
                                    <span className="text-green-600">✅ Passed</span>
                                ) : (
                                    <span className="text-red-600">❌ Failed</span>
                                )}
                            </div>
                        </div>
                    ));

                    setResult(formattedRetryResults);
                } catch (refreshError) {
                    setResult(<div className="text-red-600">Session expired. Please log in again.</div>);
                }
            } else {
                setResult(<div className="text-red-600">Error submitting code. Please try again.</div>);
            }
        }
    };

    const saveUserProgress = async () => {
        try {
            const userId = localStorage.getItem("userId"); 
            const challengeId = id; 
            await refreshAccessToken(); 
            const response = await saveProgress(userId, challengeId, code);
            alert(response.message);
            navigate("/challenges"); 
        } catch (error) {
            alert("Error saving progress. Please try again.");
        }
    };

    if (!challenge) return <p>Loading...</p>;

    const languages = {
        javascript: javascript(),
        python: python(),
        cpp: cpp(),
    };

    return (
        <div>
            <div className="fixed top-0 w-full bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold">{challenge.title}</h2>
                    <Link to="/dashboard" className="hover:text-gray-300">
                        Dashboard
                    </Link>
                    <Link to="/challenges" className="hover:text-gray-300">
                        Challenges
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {isAdmin && (
                        <Link to="/admin/add-challenge" className="hover:text-gray-300">
                            Add Challenge
                        </Link>
                    )}
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

            {/* Challenge Details Section */}
            <div className="p-6 mt-16">
                <h1 className="text-2xl font-bold">{challenge.title}</h1>
                <p className="text-gray-600 mb-4">Category: {challenge.category}</p>
                <p className="mb-4">{challenge.description}</p>

                {/* Language Selection */}
                <div className="mb-4 p-2 w-[150px]">
                    <label className="block text-sm font-medium">Select Language:</label>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                    </select>
                </div>

                {/* Code Editor */}
                <div className="mb-4">
                    <CodeMirror
                        value={code}
                        height="300px"
                        theme={oneDark}
                        extensions={[languages[language]]}
                        onChange={(value) => setCode(value)}
                    />
                </div>

                <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Submit Solution
                </button>

                {/* Show Save Button Only if All Tests Passed */}
                {allTestsPassed && (
                    <button
                        onClick={saveUserProgress}
                        className="bg-green-500 text-white px-4 py-2 rounded ml-4"
                    >
                        Save Progress
                    </button>
                )}

                {/* Submission Result */}
                {result && <div className="mt-4">{result}</div>}
            </div>
        </div>
    );
};

export default ChallengeDetail;
