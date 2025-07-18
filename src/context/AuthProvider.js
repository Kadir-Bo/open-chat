"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  deleteUser,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { app } from "@/auth"; // Firebase initialisieren

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, [auth]);

  // Sign In with Email and Password
  async function signIn(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // user state wird automatisch durch onAuthStateChanged aktualisiert
    } catch (error) {
      throw error;
    }
  }

  // Sign Up with Email and Password
  async function signUp(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // user state will automatically update via onAuthStateChanged
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  // Sign Out
  async function logOut() {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  }

  // Reset Password via Email
  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  }

  // Delete current user account
  async function deleteAccount() {
    try {
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      } else {
        throw new Error("No user is currently signed in");
      }
    } catch (error) {
      throw error;
    }
  }

  const values = {
    user,
    loading,
    signIn,
    logOut,
    resetPassword,
    deleteAccount,
    signUp,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
