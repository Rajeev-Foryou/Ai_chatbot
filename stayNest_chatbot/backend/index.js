const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const faqs = fs.readFileSync("./faqs.txt", "utf-8");

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  console.log("[Backend] Received message from frontend:", userMessage);

  const prompt = `
You are a helpful support agent for StayNest, a homestay rental platform.
Answer user queries based on the following FAQs only:

${faqs}

User: ${userMessage}
AI:
  `;
  console.log("[Backend] Sending prompt to Ollama:", prompt);

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi3:mini",
        prompt: prompt,
        stream: false,
      }),
    });
    console.log("[Backend] Ollama response status:", response.status);
    const data = await response.json();
    console.log("[Backend] Ollama response data:", data);
    res.json({ reply: data.response });
  } catch (error) {
    console.error("Error calling Ollama:", error);
    res.status(500).json({ reply: "Sorry, something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ StayNest Chatbot server running at http://localhost:${PORT}`);
});
