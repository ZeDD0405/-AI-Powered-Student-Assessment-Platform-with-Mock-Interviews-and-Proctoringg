const express = require("express");
const router = express.Router();
const {
  startMockInterview,
  handleInterviewResponse,
} = require("../controllers/interviewController");

router.post("/start", startMockInterview);
router.post("/respond", handleInterviewResponse);

module.exports = router;
