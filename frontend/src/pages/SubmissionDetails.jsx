import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserProgress } from "../api/auth";

const SubmissionDetails = () => {
    const { challengeId } = useParams();
    const [submission, setSubmission] = useState(null);

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const progress = await getUserProgress(challengeId);
                if (progress.submitted) {
                    setSubmission({
                        code: progress.code,
                        submittedAt: new Date(progress.submittedAt).toLocaleString(),
                    });
                }
            } catch (error) {
                console.error("Error fetching submission:", error);
            }
        };
        fetchSubmission();
    }, [challengeId]);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <nav className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
                <h1 className="text-xl font-bold">Challenge Submission</h1>
                <Link to="/challenges" className="px-4 hover:text-gray-300">Back to Challenges</Link>
            </nav>

            <div className="bg-white p-6 rounded-md shadow-md mt-6">
                <h2 className="text-2xl font-bold mb-4">Your Submission</h2>

                {submission ? (
                    <div>
                        <p className="text-gray-700 mb-2">
                            <strong>Submitted On:</strong> {submission.submittedAt}
                        </p>
                        <pre className="bg-gray-200 p-4 rounded-md overflow-x-auto">
                            {submission.code}
                        </pre>
                    </div>
                ) : (
                    <p className="text-red-500">No submission found for this challenge.</p>
                )}
            </div>
        </div>
    );
};

export default SubmissionDetails;
