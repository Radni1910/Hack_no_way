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
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // Register User
  const signUp = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  // Logout User
  const logout = async () => {
    return await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthReady, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use Auth in any component
export const useAuth = () => useContext(AuthContext);
