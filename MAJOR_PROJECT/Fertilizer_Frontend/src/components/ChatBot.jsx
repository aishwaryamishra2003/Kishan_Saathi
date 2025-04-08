import React, { useState } from "react";
import axios from "axios";

const ChatBot = () => {
  const [chatLog, setChatLog] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    const userEntry = { sender: "user", text: userMessage };
    setChatLog((prev) => [...prev, userEntry]);

    try {
      const res = await axios.post("http://localhost:3000/api/faq", {
        question: userMessage,
      });

      const botEntry = { sender: "bot", text: res.data.answer };
      setChatLog((prev) => [...prev, botEntry]);
    } catch {
      setChatLog((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, there was an error!" },
      ]);
    }

    setUserMessage("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md h-[600px] bg-white rounded-2xl shadow-xl flex flex-col border border-gray-200">
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-green-500 to-lime-500 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">🌱 AgriBot</h2>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50">
          {chatLog.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-xl text-sm ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t bg-white flex gap-2">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500"
            placeholder="Ask something about farming..."
          />
          <button
            onClick={sendMessage}
            className="bg-lime-500 hover:bg-lime-600 text-white px-5 py-2 rounded-xl font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
