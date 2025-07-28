"use client";
import React, { createContext, useContext, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API;

  // Init client
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const sendMessage = async (userInput) => {
    // User message anzeigen
    setMessages((prev) => [...prev, { role: "user", text: userInput }]);

    try {
      const result = await model.generateContent(userInput);
      const response = await result.response;
      const text = response.text();

      setMessages((prev) => [...prev, { role: "bot", text }]);
    } catch (error) {
      console.error("Gemini SDK Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong." },
      ]);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
}
