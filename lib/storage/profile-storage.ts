/**
 * LocalStorage-based Student Profile Storage
 * Fast, instant saves without network delays
 */

import { StudentProfile, AcademicRecord, ParentDetails } from "@/lib/firebase/profile"
import { getCurrentUser } from "@/lib/firebase/auth"

const STORAGE_KEY_PREFIX = "student_profile_"

/**
 * Get storage key for current user
 */
function getStorageKey(): string {
  const currentUser = getCurrentUser()
  if (!currentUser) {
    throw new Error("User must be authenticated to access profile")
  }
  return `${STORAGE_KEY_PREFIX}${currentUser.uid}`
}

/**
 * Get student profile from localStorage
 */
export function getStudentProfile(): StudentProfile | null {
  try {
    const storageKey = getStorageKey()
    const stored = localStorage.getItem(storageKey)
    if (!stored) {
      return null
    }
    const profile = JSON.parse(stored) as StudentProfile
    return profile
  } catch (error) {
    console.error("Error reading profile from localStorage:", error)
    return null
  }
}

/**
 * Save profile step to localStorage (instant, no network delay)
 */
export function saveProfileStep(
  stepData: Partial<StudentProfile>,
  stepNumber: number
): void {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      throw new Error("User must be authenticated to save profile")
    }

    const storageKey = getStorageKey()
    const existingProfile = getStudentProfile()

    // Merge with existing profile data
    const updatedProfile: StudentProfile = {
      ...(existingProfile || {
        uid: currentUser.uid,
        email: currentUser.email || "",
        fullName: "",
        phoneNumber: "",
        dateOfBirth: "",
        gender: "male",
        address: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        currentStep: 1,
        isProfileComplete: false,
        createdAt: new Date().toISOString(),
      }),
      ...stepData,
      currentStep: stepNumber,
      updatedAt: new Date().toISOString(),
    } as StudentProfile

    // Save to localStorage (instant!)
    localStorage.setItem(storageKey, JSON.stringify(updatedProfile))
    console.log(`Profile step ${stepNumber} saved to localStorage`)
  } catch (error: any) {
    console.error("Error saving profile step to localStorage:", error)
    throw new Error(error.message || "Failed to save profile step")
  }
}

/**
 * Complete profile (mark as finished)
 */
export function completeProfile(): void {
  try {
    const existingProfile = getStudentProfile()
    if (!existingProfile) {
      throw new Error("Profile not found. Please complete all steps first.")
    }

    const storageKey = getStorageKey()
    const completedProfile: StudentProfile = {
      ...existingProfile,
      isProfileComplete: true,
      currentStep: 5,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem(storageKey, JSON.stringify(completedProfile))
    console.log("Profile marked as complete in localStorage")
  } catch (error: any) {
    console.error("Error completing profile:", error)
    throw new Error(error.message || "Failed to complete profile")
  }
}

/**
 * Check if profile is complete
 */
export function hasCompletedProfile(): boolean {
  try {
    const profile = getStudentProfile()
    return profile?.isProfileComplete === true
  } catch (error) {
    console.error("Error checking profile completion:", error)
    return false
  }
}

/**
 * Clear profile data (for logout or reset)
 */
export function clearProfile(): void {
  try {
    const storageKey = getStorageKey()
    localStorage.removeItem(storageKey)
    console.log("Profile cleared from localStorage")
  } catch (error) {
    console.error("Error clearing profile:", error)
  }
}

