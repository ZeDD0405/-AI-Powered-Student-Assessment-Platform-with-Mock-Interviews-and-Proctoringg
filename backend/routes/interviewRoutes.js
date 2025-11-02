const express = require("express");
const router = express.Router();
const {
  startMockInterview,
  handleInterviewResponse,
  generateInterviewSummary,
} = require("../controllers/interviewController");

router.post("/start", startMockInterview);
router.post("/respond", handleInterviewResponse);
router.post("/summary", generateInterviewSummary); // ✅ new route

module.exports = router;
