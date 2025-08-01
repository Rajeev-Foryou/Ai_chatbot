import React, { useState } from "react";
import "./index.css";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      console.log("[Frontend] Sending POST to /chat with:", input);
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      console.log("[Frontend] Received bot reply:", data.reply);
      const botMessage = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("[Frontend] Error in sendMessage:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-400 via-fuchsia-300 to-pink-400 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-300 opacity-30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-300 opacity-30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-fuchsia-200 opacity-20 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="w-full max-w-lg z-10 bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/40">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-fuchsia-600 to-pink-600 drop-shadow-lg tracking-wider">
          StayNest AI Chatbot
        </h1>

        <div className="h-96 overflow-y-auto border border-white/30 rounded-2xl p-5 mb-8 bg-white/40 custom-scrollbar shadow-inner">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <span
                className={`max-w-xs break-words px-5 py-3 rounded-2xl shadow-lg text-base font-medium ${
                  msg.sender === "user"
                    ? "bg-gradient-to-br from-blue-500 via-fuchsia-400 to-pink-400 text-white border border-blue-200"
                    : "bg-gradient-to-br from-white via-fuchsia-100 to-pink-100 text-gray-900 border border-fuchsia-200"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
          {loading && (
            <p className="text-fuchsia-600 animate-pulse font-semibold">
              Bot is typing...
            </p>
          )}
        </div>

        <div className="flex gap-3 items-center">
          <input
            className="flex-1 border-2 border-fuchsia-300 px-5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition-all shadow-lg bg-white/70 placeholder-gray-400 text-gray-800"
            type="text"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-gradient-to-r from-blue-500 via-fuchsia-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 hover:from-blue-600 hover:to-pink-600 transition-all border-2 border-white/40"
          >
            Send
          </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #a78bfa 0%, #f472b6 100%);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
        }
      `}</style>
    </div>
  );
}

export default App;
