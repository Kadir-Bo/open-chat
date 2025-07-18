"use client";

import React from "react";

const ChatHistory = () => {
  const messages = [
    { id: 1, text: "Hello! How can I help you?", sender: "bot" },
    { id: 2, text: "What models can I use?", sender: "user" },
    {
      id: 3,
      text: "You can choose from GPT-4, Llama, Mistral…",
      sender: "bot",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto py-6 space-y-4 flex justify-center">
      <div className="max-w-4xl w-full px-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-5 py-3 rounded-full text-sm ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-800 text-gray-200"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
