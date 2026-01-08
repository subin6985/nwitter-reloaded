// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "nwitter-reloaded-de1c0.firebaseapp.com",
  projectId: "nwitter-reloaded-de1c0",
  storageBucket: "nwitter-reloaded-de1c0.firebasestorage.app",
  messagingSenderId: "910063739444",
  appId: "1:910063739444:web:8adf6e8d5be93f09d66061"
}

// Initialize Firebase
// config 옵션을 통해 app 생성
const app = initializeApp(firebaseConfig);

// app에 인증 서비스를 사용한다고 명시
export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);