"use client";
import React, { createContext, useContext } from "react";
import { getFirestore } from "firebase/firestore";
import { app } from "@/auth";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const db = getFirestore(app);

  return <ModalContext.Provider value={db}>{children}</ModalContext.Provider>;
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
