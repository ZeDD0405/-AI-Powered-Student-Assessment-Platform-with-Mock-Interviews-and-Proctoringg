import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./StartMockInterview.css";

const StartMockInterview = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    selectedTopic: "",
    difficulty: "",
    mode: "",
    role: "",
    experience: "",
    company: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStart = async () => {
    const { selectedTopic, difficulty, mode, role, experience, company } = formData;

    if (!selectedTopic || !difficulty || !mode || !role || !experience || !company) {
      alert("Please fill out all fields before starting your mock interview!");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/interview/start", formData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Response from backend:", res.data);

      navigate("/mock-session", { state: { ...formData, interviewData: res.data } });
    } catch (error) {
      console.error("Error starting mock interview:", error);
      alert("Unable to connect to backend. Please ensure the server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="start-mock-container">
      <div className="start-card">
        <h2 className="text-center mb-4 fw-bold">Start a New Mock Interview</h2>

        <div className="mb-4">
          <label className="form-label fw-semibold">Role you want to interview for</label>
          <input
            type="text"
            className="form-control"
            name="role"
            placeholder="e.g., Frontend Developer"
            value={formData.role}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Experience you have in this field</label>
          <input
            type="text"
            className="form-control"
            name="experience"
            placeholder="e.g., 6 months, 2 years, Fresher"
            value={formData.experience}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Company Name</label>
          <input
            type="text"
            className="form-control"
            name="company"
            placeholder="e.g., Google, Infosys, TCS"
            value={formData.company}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Select Topic</label>
          <select
            className="form-select"
            name="selectedTopic"
            value={formData.selectedTopic}
            onChange={handleChange}
          >
            <option value="">-- Choose a topic --</option>
            <option value="DSA">Data Structures & Algorithms</option>
            <option value="Frontend">Frontend (HTML, CSS, React)</option>
            <option value="Backend">Backend (Node.js, Express, MongoDB)</option>
            <option value="Behavioral">Behavioral / HR Questions</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Select Difficulty</label>
          <div className="btn-group-container">
            {["Easy", "Medium", "Hard"].map((level) => (
              <button
                key={level}
                type="button"
                className={`btn ${
                  formData.difficulty === level ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setFormData({ ...formData, difficulty: level })}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Interview Mode</label>
          <div className="btn-group-container">
            {["Voice", "Text"].map((m) => (
              <button
                key={m}
                type="button"
                className={`btn ${
                  formData.mode === m ? "btn-success" : "btn-outline-success"
                }`}
                onClick={() => setFormData({ ...formData, mode: m })}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={handleStart}
            className="btn btn-dark btn-lg start-btn"
            disabled={loading}
          >
            {loading ? "Starting..." : "Start Interview"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartMockInterview;
