import { initializeApp, getApps, FirebaseApp } from "firebase/app"
import { getAuth, Auth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, Firestore, connectFirestoreEmulator } from "firebase/firestore"
import { getStorage, FirebaseStorage, connectStorageEmulator } from "firebase/storage"
import { getAnalytics, Analytics, isSupported } from "firebase/analytics"

// Firebase configuration
// Using environment variables for security, with fallback to direct config for development
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyACjNI_ZxbAuuIwgJpwC1Ut1c4Y7OYVSJk",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "student-scholarship-tracker.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "student-scholarship-tracker",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "student-scholarship-tracker.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "611999606512",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:611999606512:web:af04ce52f2f425ab0e4435",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-LFWT8HBLW5",
}

// Validate Firebase configuration
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error("Firebase configuration is incomplete. Please check your environment variables.")
}

// Initialize Firebase
let app: FirebaseApp
if (getApps().length === 0) {
  try {
    app = initializeApp(firebaseConfig)
  } catch (error) {
    console.error("Error initializing Firebase:", error)
    throw error
  }
} else {
  app = getApps()[0]
}

// Initialize Firebase services (only on client side)
// Use getter functions to ensure services are initialized when needed
export const getAuthInstance = (): Auth => {
  if (typeof window === "undefined") {
    throw new Error("Firebase Auth can only be used on the client side")
  }
  return getAuth(app)
}

export const getDbInstance = (): Firestore => {
  if (typeof window === "undefined") {
    throw new Error("Firestore can only be used on the client side")
  }
  return getFirestore(app)
}

export const getStorageInstance = (): FirebaseStorage => {
  if (typeof window === "undefined") {
    throw new Error("Firebase Storage can only be used on the client side")
  }
  return getStorage(app)
}

// Export for backward compatibility (client-side only)
export const auth = typeof window !== "undefined" ? getAuth(app) : (null as any)
export const db = typeof window !== "undefined" ? getFirestore(app) : (null as any)
export const storage = typeof window !== "undefined" ? getStorage(app) : (null as any)

// Initialize Analytics (only in browser environment)
// Analytics is initialized lazily to avoid SSR issues
export const getFirebaseAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window === "undefined") return null
  
  const supported = await isSupported()
  if (supported) {
    return getAnalytics(app)
  }
  return null
}

// Export the app instance
export default app

