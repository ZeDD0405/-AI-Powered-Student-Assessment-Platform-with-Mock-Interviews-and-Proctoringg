import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import MockInterviewDashboard from "./MockInterviewDashboard";
import StartTestDashboard from "./StartTestDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to /register */}
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mock-interview" element={<MockInterviewDashboard />} />
        <Route path="/start-test" element={<StartTestDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
