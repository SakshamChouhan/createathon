import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";

export default function Login() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(credentials.username, credentials.password);

      if (response?.access) {
        localStorage.setItem("token", response.access);
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-screen">
      <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Welcome Back 👋</h2>
        <p className="text-gray-500 text-center mb-6">Sign in to your account</p>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form className="space-y-4" onSubmit={handleLogin}>
          <InputField label="Username or Email Address" type="text" name="username" value={credentials.username} onChange={handleChange} />
          <InputField label="Password" type="password" name="password" value={credentials.password} onChange={handleChange} />

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
            Login
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-4">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

const InputField = ({ label, type, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      placeholder={`Enter your ${label.toLowerCase()}`}
      value={value}
      onChange={onChange}
      required
    />
  </div>
);
