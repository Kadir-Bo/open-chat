"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
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
import { useAuth } from "./AuthProvider";

const DatabaseContext = createContext();

export function DatabaseProvider({ children }) {
  const db = getFirestore(app);
  const { user } = useAuth();
  const [dbCalls, setDbCalls] = useState(0);

  // ================================
  //  USER ACCOUNT & SETTINGS
  // ================================

  // Fetch account data
  const getAccount = async () => {
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);
    return snapshot.exists() ? snapshot.data().account : null;
  };

  // Update account fields (e.g. username or profile_image)
  const updateAccount = async (updates) => {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      account: updates,
    });
  };

  // Fetch settings data
  const getSettings = async () => {
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);
    return snapshot.exists() ? snapshot.data().settings : null;
  };
  // Update settings (e.g. theme)
  const updateSettings = async (updates) => {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      settings: updates,
    });
  };

  // ================================
  //  CHATS
  // ================================

  // Get all chats for a user
  const getChats = async () => {
    const chatsRef = collection(db, "chats", user.uid, "chatList");
    const q = query(chatsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  // Helper: Generate Title (max 40 chars)
  const generateTitleFromText = (text) => {
    const firstLine = text.split("\n")[0];
    return firstLine.length > 40 ? firstLine.slice(0, 40) + "..." : firstLine;
  };
  // Create a new chat
  const createChat = async (title = "New Chat") => {
    const chatData = {
      createdAt: serverTimestamp(),
      title,
    };
    const docRef = await addDoc(
      collection(db, "chats", user.uid, "chatList"),
      chatData
    );
    return { id: docRef.id, ...chatData };
  };

  // Delete a chat
  const deleteChat = async (chatId) => {
    try {
      await deleteDoc(doc(db, "chats", user.uid, "chatList", chatId));
    } catch (error) {
      console.error("Failed to delete chat:", error);
      throw error; // Re-throw the error so the calling function knows it failed
    }
  };

  // Delete all chats and their messages for the current user
  const deleteAllChats = async () => {
    try {
      const chatsRef = collection(db, "chats", user.uid, "chatList");
      const chatsSnapshot = await getDocs(chatsRef);

      const deletePromises = chatsSnapshot.docs.map(async (chatDoc) => {
        const chatId = chatDoc.id;

        const messagesRef = collection(
          db,
          "chats",
          user.uid,
          "chatList",
          chatId,
          "messages"
        );
        const messagesSnapshot = await getDocs(messagesRef);

        const messageDeletePromises = messagesSnapshot.docs.map((messageDoc) =>
          deleteDoc(messageDoc.ref)
        );

        await Promise.all(messageDeletePromises);

        return deleteDoc(chatDoc.ref);
      });

      await Promise.all(deletePromises);

      console.log(
        `Successfully deleted ${chatsSnapshot.docs.length} chats and all their messages`
      );
    } catch (error) {
      console.error("Failed to delete all chats:", error);
      throw error; // Re-throw the error so the calling function knows it failed
    }
  };

  // Rename a chat
  const renameChat = async (chatId, newTitle) => {
    const chatRef = doc(db, "chats", user.uid, "chatList", chatId);
    await updateDoc(chatRef, { title: newTitle });
  };

  // ================================
  //  MESSAGES
  // ================================

  // Get messages of a chat
  const getMessages = async (chatId) => {
    const messagesRef = collection(
      db,
      "chats",
      user.uid,
      "chatList",
      chatId,
      "messages"
    );
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  // Add a message to a chat
  const addMessage = async (chatId, message) => {
    const messageWithTimestamp = {
      ...message,
      createdAt: serverTimestamp(),
    };
    await addDoc(
      collection(db, "chats", user.uid, "chatList", chatId, "messages"),
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
    generateTitleFromText,
    deleteChat,
    deleteAllChats,
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
