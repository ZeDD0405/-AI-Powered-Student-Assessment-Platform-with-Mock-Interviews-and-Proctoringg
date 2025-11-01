import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import MockInterviewDashboard from "./MockInterviewDashboard";
import StartTestDashboard from "./StartTestDashboard";
import StartMockInterview from "./StartMockInterview";
import MockSession from "./MockSession"; // ✅ newly added import

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to /register */}
        <Route path="/" element={<Navigate to="/register" />} />

        {/* Auth Pages */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Student Dashboard */}
        <Route path="/home" element={<Home />} />
        <Route path="/mock-interview" element={<MockInterviewDashboard />} />
        <Route path="/start-test" element={<StartTestDashboard />} />

        {/* ✅ New Mock Interview Routes */}
        <Route path="/start-mock-interview" element={<StartMockInterview />} />
        <Route path="/mock-session" element={<MockSession />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
