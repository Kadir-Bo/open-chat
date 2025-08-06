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
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { app } from "@/auth"; // Firebase initialisieren

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Create Firestore user document
  const createUserInFirestore = async (user) => {
    if (!user?.uid) return;

    const userRef = doc(db, "users", user.uid);

    const accountData = {
      username: user.displayName || "",
      email: user.email,
      created_at: serverTimestamp(),
      image: user.photoURL || "",
    };

    const settingsData = {
      theme: "light",
      notifications: true,
    };

    try {
      await setDoc(
        userRef,
        {
          account: accountData,
          settings: settingsData,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Failed to create Firestore user document:", error);
    }
  };

  // Sign In with Email and Password
  async function signIn(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await createUserInFirestore(result.user); // falls vorher nicht vorhanden
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
      await createUserInFirestore(userCredential.user);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  // Sign In with Google
  async function signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserInFirestore(result.user);
      return result.user;
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
        // Firestore-Dokument manuell löschen, wenn gewünscht
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
    signUp,
    signInWithGoogle,
    logOut,
    resetPassword,
    deleteAccount,
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
