require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();

// Hugging Face model endpoint (you can change the model name below)
const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.1";
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

// Chatbot route
router.post("/", async (req, res) => {
  const { question } = req.body;

  if (!question || question.trim() === "") {
    return res.status(400).json({ answer: "Please provide a valid question." });
  }

  try {
    const hfResponse = await axios.post(
      HF_API_URL,
      {
        inputs: `Q: ${question}\nA:`,
        parameters: {
          max_new_tokens: 100,
          return_full_text: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    );

    const answer = hfResponse.data?.[0]?.generated_text || "Sorry, I couldn't find an answer.";
    res.json({ answer });
  } catch (err) {
    console.error("Hugging Face API Error:", err?.response?.data || err.message);
    res.status(500).json({ answer: "Sorry, I couldn't get the answer right now." });
  }
});

module.exports = router;
