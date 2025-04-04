import { type FirebaseApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { config } from "./config";

// Initialize Firebase app
export const firebaseApp: FirebaseApp = initializeApp(config.firebaseConfig);

// Export Firebase auth instance
export const firebaseAuth = getAuth(firebaseApp);