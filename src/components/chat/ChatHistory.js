"use client";
import React from "react";
import { useChat } from "@/context";

const ChatHistory = () => {
  const { messages } = useChat();

  return (
    <div className="flex-1 overflow-y-auto py-6 space-y-4 flex justify-center">
      <div className="max-w-4xl w-full px-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-5 py-3 rounded-full text-sm ${
                msg.role === "user"
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
