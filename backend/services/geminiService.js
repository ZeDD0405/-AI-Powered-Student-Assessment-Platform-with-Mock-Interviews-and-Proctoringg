const axios = require("axios");

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

async function generateInterviewQuestions(role, experience, company) {
  try {
    const prompt = `
You are a professional interviewer at ${company}.
Conduct a mock interview for the position of ${role}.
The candidate has ${experience} of experience.
Ask the first question only.
The question should be relevant to ${role}, focusing on real technical or behavioral interview style.
Ask only one question clearly and concisely.
`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const textResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "No response from Gemini API.";

    return textResponse;
  } catch (error) {
    console.error("❌ Error calling Gemini API:", error.response?.data || error.message);
    return "Error generating interview questions. Please try again later.";
  }
}

module.exports = { generateInterviewQuestions };
