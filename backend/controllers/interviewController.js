const axios = require("axios");
const { generateInterviewQuestions } = require("../services/geminiService");

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

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

// ---------------- Generate Interview Summary (Final Fixed + Robust) ----------------
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
Below is the transcript of a mock interview for the ${role} position at ${company}.

Interview Transcript:
${transcript}

Generate a JSON response exactly in this format (no markdown, no extra text):

{
  "confidence": "A numeric percentage or short phrase",
  "nervousness": "A numeric percentage or short phrase",
  "weakAreas": ["Short bullet points of weaknesses"],
  "strongAreas": ["Short bullet points of strengths"],
  "videos": ["Only YouTube links relevant to their weak areas"]
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

    let summaryText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "{}";

    console.log("📜 Raw Gemini Output:\n", summaryText);

    // Remove markdown and junk
    summaryText = summaryText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .replace(/[\u0000-\u001F]+/g, "")
      .trim();

    // If it contains JSON inside a string, extract it
    const innerJsonMatch = summaryText.match(/\{[\s\S]*\}/);
    if (innerJsonMatch) summaryText = innerJsonMatch[0];

    let summary;
    try {
      summary = JSON.parse(summaryText);
    } catch (err) {
      console.warn("⚠️ JSON parse failed — attempting recovery...");
      try {
        // Try double parsing if wrapped JSON is a string
        const parsedOnce = JSON.parse(summaryText);
        if (typeof parsedOnce === "string") {
          summary = JSON.parse(parsedOnce);
        } else {
          summary = parsedOnce;
        }
      } catch (e) {
        console.error("❌ Still failed to parse Gemini summary.");
        console.log("Raw:", summaryText);
        summary = {
          confidence: "Unable to parse.",
          nervousness: "Unable to parse.",
          weakAreas: ["Unable to parse AI feedback."],
          strongAreas: [],
          videos: [],
        };
      }
    }

    // Ensure proper structure
    summary = {
      confidence: summary.confidence || "Not specified",
      nervousness: summary.nervousness || "Not specified",
      weakAreas: Array.isArray(summary.weakAreas)
        ? summary.weakAreas
        : typeof summary.weakAreas === "string"
        ? [summary.weakAreas]
        : ["None identified."],
      strongAreas: Array.isArray(summary.strongAreas)
        ? summary.strongAreas
        : typeof summary.strongAreas === "string"
        ? [summary.strongAreas]
        : ["None identified."],
      videos: Array.isArray(summary.videos)
        ? summary.videos
        : typeof summary.videos === "string"
        ? [summary.videos]
        : [],
    };

    res.status(200).json({ success: true, summary });
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
