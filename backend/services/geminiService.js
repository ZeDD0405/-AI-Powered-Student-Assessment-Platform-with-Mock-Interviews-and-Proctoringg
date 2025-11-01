const axios = require("axios");

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

async function generateInterviewQuestions(role, experience, company) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ Gemini API key missing in .env file!");
      return "Error: Missing Gemini API Key. Please configure it properly.";
    }

    const prompt = `
You are a professional interviewer working at ${company}.
Conduct a mock interview for the position of ${role}.
The candidate has ${experience} of experience.
Ask only ONE question — relevant, realistic, and interview-style (technical or behavioral).
`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ Handle Gemini response safely
    const textResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!textResponse) {
      console.error("❌ No valid text response from Gemini:", response.data);
      return "Error generating interview questions. Please try again later.";
    }

    console.log("✅ Gemini generated question:", textResponse);
    return textResponse;
  } catch (error) {
    console.error(
      "❌ Error calling Gemini API:",
      error.response?.data || error.message
    );
    return "Error generating interview questions. Please try again later.";
  }
}

module.exports = { generateInterviewQuestions };
