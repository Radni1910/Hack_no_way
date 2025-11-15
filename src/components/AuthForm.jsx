import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase"; // Make sure your firebase.js exports auth
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const AuthContext = createContext();

export const AuthFormProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Login User
  const login = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Register User
  const signUp = async (email, password) => {
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  // Logout User
  const logout = async () => {
    try {
      return await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthReady, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use Auth in any component
export const useAuth = () => useContext(AuthContext);
