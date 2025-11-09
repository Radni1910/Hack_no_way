import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getDatabase, ref, push, onValue, set } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCvviVDDmhtczlcQwLIDUq2iwdmZ4jC6CI",
  authDomain: "hackathon-b5cd5.firebaseapp.com",
  databaseURL:
    "https://hackathon-b5cd5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hackathon-b5cd5",
  storageBucket: "hackathon-b5cd5.appspot.com",
  messagingSenderId: "824418926341",
  appId: "1:824418926341:web:9ec5eb9562daa2a49f016c",
  measurementId: "G-Y8B309ZF0L",
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);


export const signInUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const signUpUser = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const signOutUser = () => signOut(auth);

export const subscribeToAuthChanges = (callback) =>
  onAuthStateChanged(auth, callback);


export const sendMessage = async (chatRoomId, messageObj) => {
  const messagesRef = ref(rtdb, `chats/${chatRoomId}`);
  await push(messagesRef, messageObj);
};

export const listenToMessages = (chatRoomId, callback) => {
  const messagesRef = ref(rtdb, `chats/${chatRoomId}`);
  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    const allMessages = data ? Object.values(data) : [];
    callback(allMessages);
  });
};


export const uploadFile = (file, folder = "chat_files") => {
  const fileRef = storageRef(storage, `${folder}/${file.name}`);
  const uploadTask = uploadBytesResumable(fileRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on("state_changed", null, reject, async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      resolve(downloadURL);
    });
  });
};
