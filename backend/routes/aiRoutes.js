const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/summary", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title or description missing" });
    }

    // ✅ THIS MODEL IS STABLE WITH SDK
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
Create a clear professional task summary.

Title: ${title}
Description: ${description}
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    res.json({ summary: text });

  } catch (err) {
    console.error("Gemini SDK Error:", err);
    res.status(500).json({ error: "AI summary failed" });
  }
});

module.exports = router;