// Import the functions you need from the SDKs you need
import { initializeApp , getApp , getApps} from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDe5uIuP0OA0EElrcUZPIIrx0xAgklIZIQ",
  authDomain: "intervueai-fcb78.firebaseapp.com",
  projectId: "intervueai-fcb78",
  storageBucket: "intervueai-fcb78.firebasestorage.app",
  messagingSenderId: "769847152441",
  appId: "1:769847152441:web:62e0a3780e4edf4662e2e8",
  measurementId: "G-V6ETR45L4R"
};

// Initialize Firebase
const app = !getApps().length ?  initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);