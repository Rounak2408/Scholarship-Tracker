import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { getAuthInstance, getDbInstance } from "./config"

export interface UserProfile {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt: any
  updatedAt: any
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(
  email: string,
  password: string,
  displayName?: string
): Promise<UserCredential> {
  try {
    const authInstance = getAuthInstance()
    const dbInstance = getDbInstance()

    // Create user account
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password)
    const user = userCredential.user

    // Create user profile in Firestore (non-blocking - don't wait for it)
    // This allows the user to be redirected immediately while profile is created in background
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: displayName || user.displayName || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    // Firestore write happens in background - don't block on it
    setDoc(doc(dbInstance, "users", user.uid), userProfile).catch((error) => {
      console.error("Failed to create user profile in Firestore (non-critical):", error)
      // Profile will be created on first dashboard load if needed
    })

    return userCredential
  } catch (error: any) {
    // Provide more helpful error messages
    let errorMessage = "Failed to create account"
    const errorCode = error?.code || ""
    
    if (errorCode === "auth/email-already-in-use") {
      errorMessage = "This email is already registered. Please sign in instead."
    } else if (errorCode === "auth/invalid-email") {
      errorMessage = "Invalid email address."
    } else if (errorCode === "auth/weak-password") {
      errorMessage = "Password is too weak. Please use at least 6 characters."
    } else if (errorCode === "auth/configuration-not-found" || errorCode === "auth/operation-not-allowed") {
      errorMessage = "Firebase Authentication is not configured. Please enable Email/Password authentication in Firebase Console (Authentication > Sign-in method > Email/Password > Enable)."
    } else if (errorCode === "auth/network-request-failed") {
      errorMessage = "Network error. Please check your internet connection."
    } else if (error?.message) {
      errorMessage = error.message
    }
    
    console.error("Sign up error:", error)
    throw new Error(errorMessage)
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(email: string, password: string): Promise<UserCredential> {
  try {
    const authInstance = getAuthInstance()
    return await signInWithEmailAndPassword(authInstance, email, password)
  } catch (error: any) {
    // Extract error code from Firebase error
    // Firebase errors can have the code in different places
    const errorCode = error?.code || error?.errorCode || ""
    const errorMessage = error?.message || ""
    
    // Provide more helpful error messages
    let userFriendlyMessage = "Failed to sign in"
    
    // Handle specific Firebase Auth error codes
    if (errorCode === "auth/user-not-found" || errorCode.includes("user-not-found")) {
      userFriendlyMessage = "No account found with this email. Please sign up first."
    } else if (
      errorCode === "auth/wrong-password" || 
      errorCode === "auth/invalid-credential" ||
      errorCode.includes("wrong-password") ||
      errorCode.includes("invalid-credential")
    ) {
      userFriendlyMessage = "Incorrect email or password. Please check your credentials and try again."
    } else if (errorCode === "auth/invalid-email" || errorCode.includes("invalid-email")) {
      userFriendlyMessage = "Invalid email address. Please enter a valid email."
    } else if (
      errorCode === "auth/configuration-not-found" || 
      errorCode === "auth/operation-not-allowed" ||
      errorCode.includes("configuration-not-found") ||
      errorCode.includes("operation-not-allowed")
    ) {
      userFriendlyMessage = "Firebase Authentication is not configured. Please enable Email/Password authentication in Firebase Console (Authentication > Sign-in method > Email/Password > Enable)."
    } else if (errorCode === "auth/network-request-failed" || errorCode.includes("network")) {
      userFriendlyMessage = "Network error. Please check your internet connection and try again."
    } else if (errorCode === "auth/too-many-requests" || errorCode.includes("too-many-requests")) {
      userFriendlyMessage = "Too many failed login attempts. Please try again later."
    } else if (errorMessage && !errorMessage.includes("Firebase:")) {
      // Use the error message if it's not a raw Firebase error
      userFriendlyMessage = errorMessage
    } else {
      // Fallback for unknown errors
      userFriendlyMessage = "Incorrect email or password. Please check your credentials and try again."
    }
    
    // Log the full error for debugging (but don't expose it to users)
    console.error("Sign in error:", { code: errorCode, message: errorMessage, error })
    
    // Throw a user-friendly error
    const friendlyError = new Error(userFriendlyMessage)
    // Preserve the original error code for debugging if needed
    ;(friendlyError as any).originalCode = errorCode
    throw friendlyError
  }
}

/**
 * Sign out the current user
 */
export async function logOut(): Promise<void> {
  try {
    const authInstance = getAuthInstance()
    await signOut(authInstance)
  } catch (error: any) {
    throw new Error(error.message || "Failed to sign out")
  }
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const dbInstance = getDbInstance()
    const userDoc = await getDoc(doc(dbInstance, "users", uid))
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile
    }
    return null
  } catch (error: any) {
    // Handle offline errors gracefully - don't throw, just return null
    const errorMessage = error?.message || ""
    if (errorMessage.includes("offline") || errorMessage.includes("Failed to get document")) {
      console.warn("Firestore offline - user profile will be loaded when connection is restored")
      return null
    }
    // For other errors, log but don't throw - profile is non-critical
    console.warn("Error fetching user profile (non-critical):", error)
    return null
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<UserCredential> {
  try {
    const authInstance = getAuthInstance()
    const dbInstance = getDbInstance()
    const provider = new GoogleAuthProvider()

    // Sign in with Google popup
    const userCredential = await signInWithPopup(authInstance, provider)
    const user = userCredential.user

    // Create or update user profile in Firestore (completely non-blocking)
    // Don't check if document exists first - just create/update with merge
    // This prevents blocking on offline errors and allows sign-in to complete
    const userDocRef = doc(dbInstance, "users", user.uid)
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(), // Will be preserved if document already exists due to merge
    }

    // Update or create profile in background - don't wait for it
    // Use merge: true to preserve existing createdAt if user already exists
    // This is completely non-blocking and won't affect sign-in flow
    setDoc(userDocRef, userProfile, { merge: true }).catch((error) => {
      // Log but don't throw - profile creation is non-critical
      // Profile will be created/updated when connection is restored
      console.warn("Failed to update user profile in Firestore (non-critical, will retry later):", error)
    })

    return userCredential
  } catch (error: any) {
    // Extract error code from Firebase error
    // Handle both Auth errors and Firestore errors
    const errorCode = error?.code || error?.errorCode || ""
    const errorMessage = error?.message || error?.toString() || ""
    
    // Provide more helpful error messages for Auth errors
    // Note: Firestore errors won't be caught here since they're non-blocking
    let userFriendlyMessage = "Failed to sign in with Google"

    // Handle specific Firebase Auth error codes
    if (errorCode === "auth/popup-closed-by-user" || errorCode.includes("popup-closed")) {
      userFriendlyMessage = "Sign-in popup was closed. Please try again."
    } else if (errorCode === "auth/cancelled-popup-request" || errorCode.includes("cancelled")) {
      userFriendlyMessage = "Sign-in was cancelled. Please try again."
    } else if (
      errorCode === "auth/configuration-not-found" ||
      errorCode === "auth/operation-not-allowed" ||
      errorCode.includes("configuration-not-found") ||
      errorCode.includes("operation-not-allowed")
    ) {
      userFriendlyMessage =
        "Google Sign-In is not configured. Please enable Google authentication in Firebase Console (Authentication > Sign-in method > Google > Enable)."
    } else if (errorCode === "auth/network-request-failed" || errorCode.includes("network")) {
      userFriendlyMessage = "Network error. Please check your internet connection and try again."
    } else if (errorCode === "auth/popup-blocked") {
      userFriendlyMessage = "Popup was blocked by your browser. Please allow popups and try again."
    } else if (errorMessage && !errorMessage.includes("Firebase:")) {
      userFriendlyMessage = errorMessage
    }

    // Log the full error for debugging
    console.error("Google sign in error:", { 
      code: errorCode, 
      message: errorMessage, 
      errorName: error?.name,
      errorStack: error?.stack,
      fullError: error 
    })

    // Throw a user-friendly error
    const friendlyError = new Error(userFriendlyMessage)
    ;(friendlyError as any).originalCode = errorCode
    throw friendlyError
  }
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const authInstance = getAuthInstance()
  return authInstance.currentUser
}

