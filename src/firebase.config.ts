// Firebase Configuration
// TODO: Replace these placeholder values with your actual Firebase config
// You can get these from: Firebase Console > Project Settings > General > Your apps

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Your Firebase configuration object
// Replace these with your actual values from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyALnx_amaM7jLLzDvTRZZZFWFVD4ZlTmFM",
  authDomain: "hci-air-project.firebaseapp.com",
  projectId: "hci-air-project",
  storageBucket: "hci-air-project.firebasestorage.app",
  messagingSenderId: "972050466470",
  appId: "1:972050466470:web:505b38f9c74057efa55667"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Auth (for future use)
export const auth = getAuth(app)

export default app

