import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { addTestCase, fetchTestCases } from "../api/auth";

const AddTestCase = () => {
    const { challengeId } = useParams(); 
    const [inputData, setInputData] = useState("");
    const [expectedOutput, setExpectedOutput] = useState("");
    const [testCases, setTestCases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTestCases();
    }, []);

    const loadTestCases = async () => {
        setLoading(true);
        try {
            const data = await fetchTestCases(challengeId);
            setTestCases(data);
        } catch (error) {
            setError("Failed to load test cases.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const testCaseData = { input_data: inputData, expected_output: expectedOutput };
            await addTestCase(challengeId, testCaseData);
            setInputData("");
            setExpectedOutput("");
            loadTestCases(); 
        } catch (err) {
            setError("Failed to add test case.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        // Add your logout logic here
        console.log("User logged out");
    };

    return (
        <div>
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

            {/* Main Content */}
            <div className="min-h-screen flex flex-col items-center justify-center pt-16">
                <div className="bg-white p-6 rounded shadow-md w-96">
                    <h2 className="text-2xl font-bold mb-4">Add Test Case</h2>

                    {error && <p className="text-red-500">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-semibold">Input Data:</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                value={inputData}
                                onChange={(e) => setInputData(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-semibold">Expected Output:</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                value={expectedOutput}
                                onChange={(e) => setExpectedOutput(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            disabled={loading}
                        >
                            {loading ? "Adding..." : "Add Test Case"}
                        </button>
                    </form>
                </div>

                {/* Display Existing Test Cases */}
                <div className="bg-white p-6 rounded shadow-md w-96 mt-6">
                    <h3 className="text-xl font-bold mb-2">Existing Test Cases</h3>
                    {loading ? (
                        <p>Loading test cases...</p>
                    ) : (
                        <ul className="list-disc pl-4">
                            {testCases.length > 0 ? (
                                testCases.map((test, index) => (
                                    <li key={index} className="mb-2">
                                        <strong>Input:</strong> {test.input_data}
                                        <br />
                                        <strong>Expected Output:</strong> {test.expected_output}
                                    </li>
                                ))
                            ) : (
                                <p>No test cases available.</p>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddTestCase;
