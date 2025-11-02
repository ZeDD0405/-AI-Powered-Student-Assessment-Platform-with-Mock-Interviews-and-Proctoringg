import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./InterviewSummary.css";

const InterviewSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const summary = location.state?.summary;

  if (!summary) {
    return (
      <div className="summary-container">
        <h2>No summary available.</h2>
        <button className="btn btn-dark mt-3" onClick={() => navigate("/")}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="summary-container">
      <div className="summary-card">
        <h2 className="text-center mb-4 fw-bold">Interview Summary</h2>

        <div className="summary-section">
          <h5>Confidence:</h5>
          <p>{summary.confidence}</p>
        </div>

        <div className="summary-section">
          <h5>Nervousness:</h5>
          <p>{summary.nervousness}</p>
        </div>

        <div className="summary-section">
          <h5>Weak Areas:</h5>
          <p>{summary.weakAreas}</p>
        </div>

        <div className="summary-section">
          <h5>Strong Areas:</h5>
          <p>{summary.strongAreas}</p>
        </div>

        <div className="summary-section">
          <h5>YouTube Videos Recommended:</h5>
          <ul>
            {summary.videos?.map((video, index) => (
              <li key={index}>
                <a href={video} target="_blank" rel="noopener noreferrer">
                  {video}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-dark" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSummary;
