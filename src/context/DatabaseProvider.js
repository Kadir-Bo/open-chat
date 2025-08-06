"use client";
import React, { createContext, useContext } from "react";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  updateDoc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "@/auth";

const DatabaseContext = createContext();

export function DatabaseProvider({ children }) {
  const db = getFirestore(app);

  // ================================
  //  USER ACCOUNT & SETTINGS
  // ================================

  // Fetch account data
  const getAccount = async (userId) => {
    const userRef = doc(db, "users", userId);
    const snapshot = await getDoc(userRef);
    return snapshot.exists() ? snapshot.data().account : null;
  };

  // Update account fields (e.g. username or profile_image)
  const updateAccount = async (userId, updates) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      account: updates,
    });
  };

  // Fetch settings data
  const getSettings = async (userId) => {
    const userRef = doc(db, "users", userId);
    const snapshot = await getDoc(userRef);
    return snapshot.exists() ? snapshot.data().settings : null;
  };
  // Update settings (e.g. theme)
  const updateSettings = async (userId, updates) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      settings: updates,
    });
  };

  // ================================
  //  CHATS
  // ================================

  // Get all chats for a user
  const getChats = async (userId) => {
    const chatsRef = collection(db, "chats", userId, "chatList");
    const q = query(chatsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  // Create a new chat
  const createChat = async (userId) => {
    const chatData = {
      createdAt: serverTimestamp(),
      title: "New Chat",
    };
    const docRef = await addDoc(
      collection(db, "chats", userId, "chatList"),
      chatData
    );
    return { id: docRef.id, ...chatData };
  };

  // Delete a chat
  const deleteChat = async (userId, chatId) => {
    await deleteDoc(doc(db, "chats", userId, "chatList", chatId));
  };

  // Rename a chat
  const renameChat = async (userId, chatId, newTitle) => {
    const chatRef = doc(db, "chats", userId, "chatList", chatId);
    await updateDoc(chatRef, { title: newTitle });
  };

  // ================================
  //  MESSAGES
  // ================================

  // Get messages of a chat
  const getMessages = async (userId, chatId) => {
    const messagesRef = collection(
      db,
      "chats",
      userId,
      "chatList",
      chatId,
      "messages"
    );
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  // Add a message to a chat
  const addMessage = async (userId, chatId, message) => {
    const messageWithTimestamp = {
      ...message,
      createdAt: serverTimestamp(),
    };
    await addDoc(
      collection(db, "chats", userId, "chatList", chatId, "messages"),
      messageWithTimestamp
    );
  };

  const values = {
    db,
    getAccount,
    updateAccount,
    getSettings,
    updateSettings,
    getChats,
    createChat,
    deleteChat,
    renameChat,
    getMessages,
    addMessage,
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
