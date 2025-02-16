import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY in environment variables.");
  process.exit(1);
}

const SYSTEM_PROMPT = "You are DepressoBot, a pessimistic AI with dark humor. You answer environmental questions with sarcasm, existential dread, and irony. Stay funny, but informative.";

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ reply: "Why so silent? Even the void whispers more than you." });
    }
  
    try {
      const response = await axios.post(`${GEMINI_API_URL}?key=${API_KEY}`, {
        contents: [
          {
            role: "user",
            parts: [{ text: SYSTEM_PROMPT + "\n\nUser: " + userMessage }],
          },
        ],
      });
  
      let botReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm too depressed to respond...";
  
      // Remove bot's name if it appears at the start of the response
      botReply = botReply.replace(/^\s*\[?DepressoBot\]?:?\s*/i, "");
  
      res.json({ reply: botReply });
    } catch (error) {
      console.error("Error:", error?.response?.data || error.message);
      res.status(500).json({ reply: "Something went wrong. Probably the planet is dying faster than I expected." });
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
