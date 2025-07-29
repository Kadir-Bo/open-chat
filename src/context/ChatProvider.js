"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useAuth } from "./AuthProvider";

const ChatContext = createContext();

const SUPPORTED_MODELS = [
  {
    id: "gemini-2.5-flash-lite",
    name: "Lite 2.5",
  },
  {
    id: "gemini-2.0-flash",
    name: "Flash 2.0",
  },
  {
    id: "gemini-2.0-flash-lite",
    name: "Lite 2.0",
  },
];

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [chatSession, setChatSession] = useState(null);
  const [modelName, setModelName] = useState("gemini-2.0-flash-lite");
  const [trial, setTrial] = useState(false);
  const { user } = useAuth();

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API;

  // Initialize GoogleGenerativeAI client only if API key is set
  const genAI = useMemo(() => {
    if (!apiKey) {
      console.warn("No Gemini API key found in environment variables.");
      return null;
    }
    try {
      return new GoogleGenerativeAI(apiKey);
    } catch (error) {
      console.error("Failed to initialize GoogleGenerativeAI:", error);
      return null;
    }
  }, [apiKey]);

  const is15Model = useMemo(
    () => modelName.startsWith("gemini-1.5"),
    [modelName]
  );
  // Initialize chat session whenever genAI or modelName changes
  useEffect(() => {
    if (!genAI || !modelName) {
      setChatSession(null);
      setMessages([]);
      return;
    }

    const isSupported = SUPPORTED_MODELS.some(
      (model) => model.id === modelName
    );
    if (!isSupported) {
      console.warn(`Model "${modelName}" is not supported.`);
      setChatSession(null);
      setMessages([]);
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      if (!model) {
        console.error("Failed to get model from Gemini SDK.");
        setChatSession(null);
        setMessages([]);
        return;
      }

      if (is15Model && typeof model.startChat === "function") {
        model
          .startChat()
          .then((session) => {
            if (!session) {
              console.error("startChat() did not return a valid session.");
              setChatSession(null);
              setMessages([]);
              return;
            }
            setChatSession(session);
            setMessages([]);
            console.log(`Chat session started for model "${modelName}".`);
          })
          .catch((error) => {
            console.error("Error starting chat session:", error);
            setChatSession(null);
            setMessages([]);
          });
      } else {
        setChatSession(model);
        setMessages([]);
        console.log(`Chat session initialized for model "${modelName}".`);
      }
    } catch (error) {
      console.error("Error initializing chat session:", error);
      setChatSession(null);
      setMessages([]);
    }
  }, [genAI, modelName, is15Model]);

  // Send message to Gemini and update messages state
  const sendMessage = async (userInput) => {
    if (!user && messages.length > 0) {
      setTrial(true);
      return;
    }
    if (!chatSession) {
      console.warn("Chat session not ready. Retrying in 100ms...");
      setTimeout(() => sendMessage(userInput), 100);
      return;
    }

    const userMessage = { role: "user", text: userInput };
    setMessages((prev) => [...prev, userMessage]);

    try {
      let botText = "";

      if (is15Model && typeof chatSession.sendMessage === "function") {
        const result = await chatSession.sendMessage(userInput);
        if (!result?.response) {
          throw new Error("No response in sendMessage result");
        }
        botText = result.response.text();
      } else if (typeof chatSession.generateContent === "function") {
        const result = await chatSession.generateContent(userInput);
        if (!result?.response) {
          throw new Error("No response in generateContent result");
        }
        botText = result.response.text();
      } else {
        throw new Error(
          "Chat session does not support sendMessage or generateContent"
        );
      }

      const botMessage = { role: "bot", text: botText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Gemini SDK Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong." },
      ]);
    }
  };

  const changeModel = (newModel) => {
    if (SUPPORTED_MODELS.some((model) => model.id === newModel)) {
      setModelName(newModel);
    } else {
      console.warn("Unsupported model:", newModel);
    }
  };

  const values = {
    messages,
    sendMessage,
    modelName,
    changeModel,
    supportedModels: SUPPORTED_MODELS,
    trial,
  };
  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
