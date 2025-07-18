"use client";
import React, { createContext, useContext } from "react";
import { getFirestore } from "firebase/firestore";
import { app } from "@/auth";

const DatabaseContext = createContext();

export function DatabaseProvider({ children }) {
  const db = getFirestore(app);

  return (
    <DatabaseContext.Provider value={db}>{children}</DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}
