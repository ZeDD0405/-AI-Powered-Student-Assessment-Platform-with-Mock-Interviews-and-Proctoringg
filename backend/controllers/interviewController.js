const { generateInterviewQuestions } = require("../services/geminiService");
const axios = require("axios");

// ---------------- Start the Interview ----------------
const startMockInterview = async (req, res) => {
  try {
    const { role, experience, company } = req.body;

    if (!role || !experience || !company) {
      return res.status(400).json({ error: "All fields are required" });
    }

    console.log("🎯 Starting mock interview for:", { role, experience, company });

    const question = await generateInterviewQuestions(role, experience, company);

    res.status(200).json({
      success: true,
      message: "Interview started successfully",
      question,
    });
  } catch (error) {
    console.error("❌ Error in startMockInterview:", error.response?.data || error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ---------------- Handle User Response ----------------
const handleInterviewResponse = async (req, res) => {
  try {
    const { userMessage, role, company } = req.body;

    if (!userMessage || !role || !company) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const followUpPrompt = `
You are a professional interviewer at ${company}.
The candidate is applying for the ${role} position.

Candidate's last answer:
"${userMessage}"

Now, evaluate their answer briefly (1-2 lines feedback),
then ask the NEXT question in this mock interview.
`;

    const GEMINI_API_URL =
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

    console.log("🔹 Sending prompt to Gemini...");
    console.log("🔹 Prompt:", followUpPrompt);
    console.log("🔹 API Key Loaded:", process.env.GEMINI_API_KEY ? "✅ Yes" : "❌ No");

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

    console.log("✅ Gemini reply received successfully.");

    res.status(200).json({
      success: true,
      message: "Response processed successfully",
      response: aiReply,
    });
  } catch (error) {
    console.error("❌ Error in handleInterviewResponse:");
    console.error(error.response?.data || error.message);

    res.status(500).json({
      error: "Failed to process response",
      details: error.response?.data || error.message,
    });
  }
};

module.exports = { startMockInterview, handleInterviewResponse };
