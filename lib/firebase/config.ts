import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, Firestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, FirebaseStorage, connectStorageEmulator } from "firebase/storage";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

// Firebase configuration
// Using environment variables for security, with fallback to direct config for development
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Validate Firebase configuration
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error("Firebase configuration is incomplete. Please check your environment variables.")
}

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize services
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
export const getFirebaseAnalytics = async (): Promise<Analytics | null> => {
  const supported = await isSupported()
  if (supported) {
    return getAnalytics(app)
  }
  return null
}

export default app
