require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

console.log("API KEY:", process.env.GEMINI_API_KEY);
console.log("API URL:", API_URL);

app.post('/chat', async (req, res) => {
  try {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": process.env.GEMINI_API_KEY 
      },
      body: JSON.stringify(req.body)
    };
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    console.log("Gemini API response:", data);

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.status(response.status).json(data);
    }

    res.status(response.status).json(data);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = app;);
