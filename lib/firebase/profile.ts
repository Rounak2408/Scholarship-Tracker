/**
 * Student Profile Management
 * Handles student profile creation and retrieval from Firestore
 */

import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { getDbInstance } from "./config"
import { getCurrentUser } from "./auth"

export interface AcademicRecord {
  level: "10th" | "12th" | "graduation" | "post-graduation"
  boardOrUniversity: string
  institution: string
  yearOfPassing: string
  percentageOrCGPA: string
  marksheetUrl?: string
  marksheetFileName?: string
}

export interface ParentDetails {
  fatherName: string
  fatherOccupation?: string
  fatherPhone?: string
  fatherEmail?: string
  motherName: string
  motherOccupation?: string
  motherPhone?: string
  motherEmail?: string
  annualFamilyIncome?: string
  category: "general" | "obc" | "sc" | "st" | "other"
}

export interface StudentProfile {
  uid: string
  email: string
  
  // Step 1: Personal & Address Information
  fullName: string
  phoneNumber: string
  dateOfBirth: string
  gender: "male" | "female" | "other" | "prefer-not-to-say"
  address: string
  city: string
  state: string
  pincode: string
  country: string
  aadharNumber?: string
  
  // Step 2: Parents Information
  parents?: ParentDetails
  
  // Step 3: Academic History
  academicRecords?: AcademicRecord[]
  
  // Step 4: Bank Details
  bankAccountNumber?: string
  bankName?: string
  ifscCode?: string
  accountHolderName?: string
  
  // Step 5: Declaration
  declarationAccepted?: boolean
  declarationDate?: any
  
  // Profile Status & Progress
  currentStep: number // 1-5
  isProfileComplete: boolean
  completedAt?: any
  createdAt: any
  updatedAt: any
}

/**
 * Get student profile from Firestore
 */
export async function getStudentProfile(uid: string): Promise<StudentProfile | null> {
  try {
    const dbInstance = getDbInstance()
    const profileDoc = await getDoc(doc(dbInstance, "studentProfiles", uid))
    
    if (profileDoc.exists()) {
      return profileDoc.data() as StudentProfile
    }
    return null
  } catch (error: any) {
    // Handle offline errors gracefully - don't throw, just return null
    const errorMessage = error?.message || ""
    if (errorMessage.includes("offline") || errorMessage.includes("Failed to get document")) {
      console.warn("Firestore offline - student profile will be loaded when connection is restored")
      return null
    }
    // For other errors, log but don't throw - profile is non-critical
    console.warn("Error getting student profile (non-critical):", error)
    return null
  }
}

/**
 * Save profile step by step (allows partial updates)
 * Optimized for speed - uses updateDoc for faster writes
 */
export async function saveProfileStep(
  stepData: Partial<StudentProfile>,
  stepNumber: number
): Promise<void> {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      throw new Error("User must be authenticated to save profile")
    }

    const dbInstance = getDbInstance()
    const profileRef = doc(dbInstance, "studentProfiles", currentUser.uid)
    
    // Prepare update data
    const updateData: any = {
      ...stepData,
      currentStep: stepNumber,
      updatedAt: serverTimestamp(),
    }

    // Try updateDoc first (faster for existing documents)
    // If it fails, fall back to setDoc with merge (for new documents)
    try {
      await updateDoc(profileRef, updateData)
      console.log(`Profile step ${stepNumber} updated successfully`)
    } catch (updateError: any) {
      // If document doesn't exist, use setDoc with merge
      if (updateError.code === "not-found" || updateError.message?.includes("No document")) {
        const createData: Partial<StudentProfile> = {
          ...updateData,
          uid: currentUser.uid,
          email: currentUser.email || "",
          createdAt: serverTimestamp(),
          isProfileComplete: false,
        }
        await setDoc(profileRef, createData, { merge: true })
        console.log(`Profile step ${stepNumber} created successfully`)
      } else {
        throw updateError
      }
    }
  } catch (error: any) {
    // Handle offline errors gracefully
    const errorMessage = error?.message || ""
    if (errorMessage.includes("offline") || errorMessage.includes("Failed to get document")) {
      console.warn("Firestore offline - profile will be saved when connection is restored")
      // Don't throw error - allow user to continue, data will sync when online
      return
    }
    console.error("Error saving profile step:", error)
    throw new Error(error.message || "Failed to save profile step")
  }
}

/**
 * Complete profile (mark as finished)
 */
export async function completeProfile(): Promise<void> {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      throw new Error("User must be authenticated to complete profile")
    }

    const dbInstance = getDbInstance()
    const profileRef = doc(dbInstance, "studentProfiles", currentUser.uid)
    
    await setDoc(
      profileRef,
      {
        isProfileComplete: true,
        currentStep: 5,
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )

    console.log("Profile marked as complete")
  } catch (error: any) {
    // Handle offline errors gracefully
    const errorMessage = error?.message || ""
    if (errorMessage.includes("offline") || errorMessage.includes("Failed to get document")) {
      console.warn("Firestore offline - profile completion will be saved when connection is restored")
      // Don't throw error - allow user to continue, data will sync when online
      return
    }
    console.error("Error completing profile:", error)
    throw new Error(error.message || "Failed to complete profile")
  }
}

/**
 * Create or update student profile (legacy - for backward compatibility)
 */
export async function saveStudentProfile(profileData: Omit<StudentProfile, "uid" | "email" | "createdAt" | "updatedAt" | "completedAt" | "isProfileComplete" | "currentStep">): Promise<void> {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      throw new Error("User must be authenticated to save profile")
    }

    const dbInstance = getDbInstance()
    const profileRef = doc(dbInstance, "studentProfiles", currentUser.uid)
    
    // Check if profile already exists (handle offline gracefully)
    let existingProfile = null
    try {
      existingProfile = await getDoc(profileRef)
    } catch (error: any) {
      const errorMessage = error?.message || ""
      if (errorMessage.includes("offline") || errorMessage.includes("Failed to get document")) {
        console.warn("Firestore offline - attempting to save without checking existing profile")
        // Continue with save attempt
      } else {
        throw error
      }
    }
    
    if (existingProfile && existingProfile.exists() && existingProfile.data()?.isProfileComplete) {
      throw new Error("Profile already exists and cannot be modified")
    }

    // Create or update profile
    const studentProfile: Partial<StudentProfile> = {
      ...profileData,
      uid: currentUser.uid,
      email: currentUser.email || "",
      isProfileComplete: true,
      currentStep: 5,
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    await setDoc(profileRef, studentProfile, { merge: true })
    console.log("Student profile saved successfully")
  } catch (error: any) {
    // Handle offline errors gracefully
    const errorMessage = error?.message || ""
    if (errorMessage.includes("offline") || errorMessage.includes("Failed to get document")) {
      console.warn("Firestore offline - profile will be saved when connection is restored")
      // Don't throw error - allow user to continue
      return
    }
    console.error("Error saving student profile:", error)
    throw new Error(error.message || "Failed to save student profile")
  }
}

/**
 * Check if current user has completed their profile
 */
export async function hasCompletedProfile(): Promise<boolean> {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      return false
    }

    const profile = await getStudentProfile(currentUser.uid)
    // If profile is null (offline or doesn't exist), return false
    // This will redirect to profile page when online
    return profile?.isProfileComplete || false
  } catch (error) {
    // Handle errors gracefully - assume profile is incomplete
    console.warn("Error checking profile completion (non-critical):", error)
    return false
  }
}

