// Assuming you already have your Firebase initialization imports
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

// --- Global Config Variables (Canvas Environment) ---
const firebaseConfig =
  typeof __firebase_config !== "undefined" ? JSON.parse(__firebase_config) : {};

// Initialize Firebase App and Services
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// --- Authentication Functions ---

/**
 * Signs in a user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<UserCredential>}
 */
export const signInUser = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Creates a new user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<UserCredential>}
 */
export const signUpUser = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Signs out the current user.
 * @returns {Promise<void>}
 */
export const signOutUser = () => {
  return signOut(auth);
};

/**
 * Sets up a listener for authentication state changes.
 * @param {function} callback - Function called with the current user object (or null).
 */
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// You can now import these functions into any component like this:
// import { signInUser, signUpUser, signOutUser } from './firebase.js';
