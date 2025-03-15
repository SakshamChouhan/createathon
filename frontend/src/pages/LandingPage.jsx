import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-gray-800">Welcome to Createathon</h1>
      <p className="text-lg text-gray-600 mt-4">An interactive creator platform</p>
      <div className="mt-6">
        <Link to="/login" className="px-6 py-3 bg-blue-500 text-white rounded-lg mr-4">
          Login
        </Link>
        <Link to="/register" className="px-6 py-3 bg-green-500 text-white rounded-lg">
          Register
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
