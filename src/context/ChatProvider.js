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

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [chatSession, setChatSession] = useState(null);
  const [modelName, setModelName] = useState("gemini-2.0-flash-lite");
  const [trial, setTrial] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [chatsList, setChatsList] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [viewAllChats, setViewAllChats] = useState(false);

  const { user } = useAuth();
  const {
    createChat,
    renameChat,
    addMessage,
    getChats,
    generateTitleFromText,
    getMessages,
  } = useDatabase();

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

  // ================================
  //  Messages
  // ================================
  const sendMessage = async (userInput) => {
    console.log("[sendMessage] Called with input:", userInput);

    if (!user && messages.length > 0) {
      console.log("[sendMessage] User not logged in & trial already started.");
      setTrial(true);
      return;
    }

    if (!chatSession) {
      console.warn(
        "[sendMessage] Chat session not ready. Retrying in 100ms..."
      );
      setTimeout(() => sendMessage(userInput), 100);
      return;
    }

    const userMessage = { role: "user", text: userInput };
    console.log("[sendMessage] Adding user message to state:", userMessage);
    setMessages((prev) => [...prev, userMessage]);

    try {
      let botText = "";

      if (is15Model && typeof chatSession.sendMessage === "function") {
        const result = await chatSession.sendMessage(userInput);
        if (!result?.response)
          throw new Error("No response in sendMessage result");
        botText = result.response.text();
      } else if (typeof chatSession.generateContent === "function") {
        const result = await chatSession.generateContent(userInput);
        if (!result?.response)
          throw new Error("No response in generateContent result");
        botText = result.response.text();
      } else {
        throw new Error(
          "Chat session does not support sendMessage or generateContent"
        );
      }

      const botMessage = { role: "bot", text: botText };
      setMessages((prev) => [...prev, botMessage]);

      // Create new chat if none exists
      if (!chatId && user?.uid) {
        const generatedTitle = await generateTitleFromText(botText);
        const newChat = await createChat(generatedTitle);

        setChatId(newChat.id);
        setActiveChatId(newChat.id);

        await addMessage(newChat.id, userMessage);
        await addMessage(newChat.id, botMessage);

        const chatWithTitle = { ...newChat, title: generatedTitle };
        addChatToList(chatWithTitle);
        console.log(chatsList);
      } else if (chatId && user?.uid) {
        await addMessage(chatId, userMessage);
        await addMessage(chatId, botMessage);
      }
    } catch (error) {
      console.error("[sendMessage] Gemini SDK Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong." },
      ]);
    }
  };

  // ================================
  //  Model
  // ================================
  const changeModel = (newModel) => {
    if (SUPPORTED_MODELS.some((model) => model.id === newModel)) {
      setModelName(newModel);
      setChatId(null);
      setMessages([]);
    } else {
      console.warn("Unsupported model:", newModel);
    }
  };

  // ================================
  //  Chats
  // ================================
  const resetMessages = () => {
    setMessages([]);
    return;
  };
  const changeChat = async (chatId) => {
    setActiveChatId(chatId);

    // Check if it's a temp chat (not in DB yet)
    if (chatId.startsWith("temp-")) {
      resetMessages();
      return;
    }

    const chatMessages = await getMessages(chatId);
    setMessages(chatMessages);
  };
  const enableViewAllChats = () => {
    setViewAllChats(true);
  };
  const disableViewAllChats = () => {
    setViewAllChats(false);
  };
  // ================================
  //  Chat List
  // ================================
  const fetchChats = async () => {
    const chatList = await getChats();
    setChatsList(chatList);
  };

  const addChatToList = (chat) => {
    setChatsList((prev) => [chat, ...prev]);
  };

  const removeChatFromList = (chatId) => {
    setChatsList((prev) => prev.filter((chat) => chat.id !== chatId));
    resetMessages();
  };

  const updateChatInList = (updatedChat) => {
    setChatsList((prev) =>
      prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
    );
  };

  const values = {
    messages,
    sendMessage,
    modelName,
    changeModel,
    supportedModels: SUPPORTED_MODELS,
    trial,
    chatId,
    fetchChats,
    chatsList,
    addChatToList,
    removeChatFromList,
    updateChatInList,
    activeChatId,
    changeChat,
    viewAllChats,
    disableViewAllChats,
    enableViewAllChats,
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
