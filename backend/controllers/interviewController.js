const { generateInterviewQuestions } = require("../services/geminiService");

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

module.exports = { startMockInterview };
