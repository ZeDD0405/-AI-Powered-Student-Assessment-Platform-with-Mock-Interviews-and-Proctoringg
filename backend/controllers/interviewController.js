const { generateInterviewQuestions } = require("../services/geminiService");
const axios = require("axios");

// ---------------- Start the Interview ----------------
const startMockInterview = async (req, res) => {
  try {
    const { role, experience, company } = req.body;

    if (!role || !experience || !company) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const question = await generateInterviewQuestions(role, experience, company);

    res.status(200).json({
      success: true,
      message: "Interview started successfully",
      question,
    });
  } catch (error) {
    console.error("❌ Error in startMockInterview:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ---------------- Handle User Response (Next Question) ----------------
const handleInterviewResponse = async (req, res) => {
  try {
    const { userAnswer, role, company } = req.body;

    if (!userAnswer || !role || !company) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Construct follow-up prompt for Gemini
    const followUpPrompt = `
You are a professional interviewer at ${company}.
The candidate is applying for the ${role} position.

Candidate's last answer:
"${userAnswer}"

Now, evaluate their answer briefly (1-2 lines feedback),
then ask the NEXT question in this mock interview.
Make sure the next question is relevant and realistic.
`;

    // Call Gemini API again directly
    const GEMINI_API_URL =
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: followUpPrompt }] }],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const aiReply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "Error generating next question. Please try again later.";

    res.status(200).json({
      success: true,
      message: "Response processed successfully",
      nextQuestion: aiReply,
    });
  } catch (error) {
    console.error("❌ Error in handleInterviewResponse:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to process response" });
  }
};

module.exports = { startMockInterview, handleInterviewResponse };
