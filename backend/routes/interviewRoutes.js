const express = require("express");
const router = express.Router();
const { startMockInterview } = require("../controllers/interviewController");

// Route to start the mock interview
router.post("/start", startMockInterview);

module.exports = router;
