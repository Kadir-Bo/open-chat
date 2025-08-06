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
import { useDatabase } from "./DatabaseProvider";

const ChatContext = createContext();

const SUPPORTED_MODELS = [
  { id: "gemini-2.5-flash-lite", name: "Lite 2.5" },
  { id: "gemini-2.0-flash", name: "Flash 2.0" },
  { id: "gemini-2.0-flash-lite", name: "Lite 2.0" },
];

// Hilfsfunktion: Titel generieren (max 40 Zeichen)
const generateTitleFromText = (text) => {
  const firstLine = text.split("\n")[0];
  return firstLine.length > 40 ? firstLine.slice(0, 40) + "..." : firstLine;
};

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [chatSession, setChatSession] = useState(null);
  const [modelName, setModelName] = useState("gemini-2.0-flash-lite");
  const [trial, setTrial] = useState(false);
  const [chatId, setChatId] = useState(null);

  const { user } = useAuth();
  const { createChat, renameChat, addMessage } = useDatabase();

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API;

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
            setChatId(null); // reset chatId on model change
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
        setChatId(null); // reset chatId on model change
        console.log(`Chat session initialized for model "${modelName}".`);
      }
    } catch (error) {
      console.error("Error initializing chat session:", error);
      setChatSession(null);
      setMessages([]);
    }
  }, [genAI, modelName, is15Model]);

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

      // Wenn noch kein Chat existiert -> Chat erstellen, Titel generieren, Nachrichten speichern
      if (!chatId && user?.uid) {
        const title = generateTitleFromText(botText);
        const newChat = await createChat(user.uid);
        setChatId(newChat.id);

        await renameChat(user.uid, newChat.id, title);
        await addMessage(user.uid, newChat.id, userMessage);
        await addMessage(user.uid, newChat.id, botMessage);
      } else if (chatId && user?.uid) {
        // Folge-Nachrichten speichern
        await addMessage(user.uid, chatId, userMessage);
        await addMessage(user.uid, chatId, botMessage);
      }
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
      setChatId(null);
      setMessages([]);
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
    chatId,
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
