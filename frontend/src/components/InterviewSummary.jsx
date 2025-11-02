import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./InterviewSummary.css";

const InterviewSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { summary } = location.state || {};

  const [parsedSummary, setParsedSummary] = useState({
    confidence: "N/A",
    nervousness: "N/A",
    weakAreas: [],
    strongAreas: [],
    videos: [],
  });

  useEffect(() => {
    if (summary) {
      try {
        // Try to extract JSON block if it's wrapped in triple backticks
        let cleanSummary = summary.weakAreas;

        if (typeof cleanSummary === "string" && cleanSummary.includes("```json")) {
          const jsonMatch = cleanSummary.match(/```json([\s\S]*?)```/);
          if (jsonMatch && jsonMatch[1]) {
            const parsed = JSON.parse(jsonMatch[1].trim());
            setParsedSummary(parsed);
            return;
          }
        }

        // Fallback: if it's already a JSON object
        if (typeof summary.weakAreas === "object") {
          setParsedSummary(summary.weakAreas);
        }
      } catch (err) {
        console.error("Error parsing summary JSON:", err);
      }
    }
  }, [summary]);

  return (
    <div className="summary-container">
      <h2 className="summary-heading">Interview Summary</h2>

      <div className="summary-section">
        <h3>Confidence</h3>
        <p>{parsedSummary.confidence || summary.confidence}</p>
      </div>

      <div className="summary-section">
        <h3>Nervousness</h3>
        <p>{parsedSummary.nervousness || summary.nervousness}</p>
      </div>

      <div className="summary-section">
        <h3>Weak Areas</h3>
        {parsedSummary.weakAreas?.length ? (
          <ul>
            {parsedSummary.weakAreas.map((area, index) => (
              <li key={index}>{area}</li>
            ))}
          </ul>
        ) : (
          <p>None identified.</p>
        )}
      </div>

      <div className="summary-section">
        <h3>Strong Areas</h3>
        {parsedSummary.strongAreas?.length ? (
          <ul>
            {parsedSummary.strongAreas.map((area, index) => (
              <li key={index}>{area}</li>
            ))}
          </ul>
        ) : (
          <p>None identified.</p>
        )}
      </div>

      <div className="summary-section">
        <h3>YouTube Recommendations</h3>
        {parsedSummary.videos?.length ? (
          parsedSummary.videos.map((url, index) => (
            <a key={index} href={url} target="_blank" rel="noopener noreferrer">
              Watch Video {index + 1}
            </a>
          ))
        ) : (
          <p>No links available.</p>
        )}
      </div>

      <button className="dashboard-btn" onClick={() => navigate("/student-dashboard")}>
        Go to Dashboard
      </button>
    </div>
  );
};

export default InterviewSummary;
