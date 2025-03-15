import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required!");
      return;
    }
  
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await registerUser({ username, email, password });
  
      if (response?.error) {
        throw new Error(response.error);  
      }
  
      alert("Registration successful! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen w-screen">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Create an Account 🚀</h2>
        <p className="text-gray-500 text-center mb-6">Join us and explore amazing features</p>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form className="space-y-4" onSubmit={handleRegister}>
          <InputField label="Username" type="text" value={username} setValue={setUsername} />
          <InputField label="Email" type="email" value={email} setValue={setEmail} />
          <InputField label="Password" type="password" value={password} setValue={setPassword} />
          <InputField label="Confirm Password" type="password" value={confirmPassword} setValue={setConfirmPassword} />

          <button
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-4">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

const InputField = ({ label, type, value, setValue }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
      placeholder={`Enter your ${label.toLowerCase()}`}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      required
    />
  </div>
);
