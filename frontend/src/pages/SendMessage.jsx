import React, { useState } from "react";
import { sendMessageToWebhook } from "../api/auth";
import { Link } from "react-router-dom";

const SendMessage = () => {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState(null);

    const handleSendMessage = async () => {
        const res = await sendMessageToWebhook(message);

        if (res.error) {
            setResponse({ success: false, message: res.error });
        } else {
            setResponse({ success: true, message: res.message });
        }
    };

    return (
        <div className="min-h-screen">
            {/* Navbar */}
            <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white p-4 flex justify-between items-center shadow-md w-full">
                <div className="flex items-center gap-6">
                    <h2 className="text-2xl font-bold">Telegram Bot AI</h2>
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
                        onClick={() => {
                            localStorage.removeItem("accessToken");
                            localStorage.removeItem("refreshToken");
                            localStorage.removeItem("isAdmin");
                            window.location.href = "/login";
                        }}
                        className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Content Layout */}
            <div className="min-h-screen flex flex-col items-center justify-center  p-6 pt-20">
                <h1 className="text-2xl font-bold mb-4">AI HELP</h1>
                <textarea
                    className="w-80 p-2 border rounded-lg"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-3 hover:bg-blue-600 transition"
                >
                    Send
                </button>
                {response && (
                    <div className="mt-3 text-gray-700">
                        {response.success ? (
                            <>
                                <p><strong>AI Reply:</strong> {response.message}</p>
                            </>
                        ) : (
                            <p>❌ Error Sending Message: {response.message}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SendMessage;
