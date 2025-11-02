const { generateInterviewQuestions } = require("../services/geminiService");
const axios = require("axios");

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

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

    console.log("🔹 Sending prompt to Gemini...");

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

// ---------------- Generate Interview Summary ----------------
const generateInterviewSummary = async (req, res) => {
  try {
    const { messages, role, company } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "No messages provided" });
    }

    const transcript = messages
      .map((m) => `${m.sender === "user" ? "Candidate" : "Interviewer"}: ${m.text}`)
      .join("\n");

    const summaryPrompt = `
You are an AI Interview Evaluator.
Below is the full transcript of a mock interview for the role of ${role} at ${company}.

Interview Transcript:
${transcript}

Now provide feedback strictly in this JSON format:

{
  "confidence": "Candidate’s confidence level with reasoning",
  "nervousness": "Candidate’s nervousness level with reasoning",
  "weakAreas": "List of weak technical or behavioral areas",
  "strongAreas": "List of strong areas noticed",
  "videos": ["https://youtube.com/...","https://youtube.com/..."]
}
`;

    console.log("🧩 Generating structured interview summary via Gemini...");

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: summaryPrompt }] }],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const summaryText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "{}";

    console.log("✅ Gemini summary received, parsing JSON...");

    let parsedSummary;
    try {
      parsedSummary = JSON.parse(summaryText);
    } catch (err) {
      console.warn("⚠️ Summary not in valid JSON. Returning raw text.");
      parsedSummary = {
        confidence: "Unable to parse.",
        nervousness: "Unable to parse.",
        weakAreas: summaryText,
        strongAreas: "",
        videos: [],
      };
    }

    res.status(200).json({ success: true, summary: parsedSummary });
  } catch (error) {
    console.error("❌ Error generating interview summary:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate interview summary." });
  }
};


module.exports = {
  startMockInterview,
  handleInterviewResponse,
  generateInterviewSummary,
};
