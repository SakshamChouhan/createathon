import "./index.css"; // Ensure this import is present
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ChallengesList from "./pages/ChallengesList";
import ChallengeDetail from "./pages/ChallengeDetail";
import AddChallenge from "./pages/AddChallenge";
import AddTestCase from "./pages/AddTestCase";
import SubmissionDetails from "./pages/SubmissionDetails";
import ProgressTab from "./pages/ProgressTab";
import SendMessage from "./pages/SendMessage";

export default function App() {
  return (
    <Router>
      <div className="flex justify-center items-center min-h-screen w-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />}/>
          <Route path="/challenges" element={<ChallengesList />} />
          <Route path="/challenges/:id" element={<ChallengeDetail />} />
          <Route path="/admin/add-challenge" element={<AddChallenge />} /> 
          <Route path="/add-test-cases/:challengeId" element={<AddTestCase />} />
          <Route path="/submissions/:challengeId" element={<SubmissionDetails />} />
          <Route path="/progress" element={<ProgressTab />} />
          <Route path="/send-message" element={<SendMessage />} />
        </Routes>
      </div>
    </Router>
  );
}
