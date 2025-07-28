"use client";
import React, { createContext, useContext } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "@/auth";

const DatabaseContext = createContext();

export function DatabaseProvider({ children }) {
  const db = getFirestore(app);

  // 🔹 Fetch all chats for a user
  const getChats = async (userId) => {
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef); // Option: where("userId", "==", userId)
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  // 🔹 Create a new chat
  const createChat = async (userId) => {
    const newChat = {
      userId,
      createdAt: serverTimestamp(),
      title: "New Chat",
    };
    const docRef = await addDoc(collection(db, "chats"), newChat);
    return { id: docRef.id, ...newChat };
  };

  // 🔹 Get all messages from a chat
  const getMessages = async (chatId) => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  // 🔹 Add a message to a chat
  const addMessage = async (chatId, message) => {
    const messageWithTimestamp = {
      ...message,
      createdAt: serverTimestamp(),
    };
    await addDoc(
      collection(db, "chats", chatId, "messages"),
      messageWithTimestamp
    );
  };

  // 🔹 Delete a chat (and optionally its messages)
  const deleteChat = async (chatId) => {
    await deleteDoc(doc(db, "chats", chatId));
    // Optional: manually delete all messages too, if needed
  };

  // 🔹 Rename chat
  const renameChat = async (chatId, newTitle) => {
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, { title: newTitle });
  };

  const values = {
    db,
    getChats,
    createChat,
    getMessages,
    addMessage,
    deleteChat,
    renameChat,
  };

  return (
    <DatabaseContext.Provider value={values}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}
