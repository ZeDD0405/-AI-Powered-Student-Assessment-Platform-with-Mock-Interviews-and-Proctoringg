const express = require("express");
const router = express.Router();
const {
  startMockInterview,
  handleInterviewResponse,
} = require("../controllers/interviewController");

// ---------------- Start Interview ----------------
router.post("/start", startMockInterview);

// ---------------- Handle Response (Next Question) ----------------
router.post("/respond", handleInterviewResponse);

module.exports = router;
