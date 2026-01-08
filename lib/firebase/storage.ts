/**
 * Firebase Storage Utilities
 * Handles file uploads to Firebase Storage
 */

import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { getStorageInstance } from "./config"
import { getCurrentUser } from "./auth"

/**
 * Upload a file to Firebase Storage
 * @param file - File to upload
 * @param path - Storage path (e.g., "marksheets/userId/10th-marksheet.pdf")
 * @returns Download URL of the uploaded file
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      throw new Error("User must be authenticated to upload files")
    }

    const storage = getStorageInstance()
    const storageRef = ref(storage, path)
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file)
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    return downloadURL
  } catch (error: any) {
    console.error("Error uploading file:", error)
    throw new Error(error.message || "Failed to upload file")
  }
}

/**
 * Upload marksheet file
 * @param file - Marksheet file
 * @param level - Academic level (10th, 12th, graduation, etc.)
 * @returns Object with download URL and file name
 */
export async function uploadMarksheet(
  file: File,
  level: string
): Promise<{ url: string; fileName: string }> {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      throw new Error("User must be authenticated to upload marksheets")
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only PDF, JPEG, JPG, and PNG files are allowed")
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error("File size must be less than 5MB")
    }

    // Create storage path
    const timestamp = Date.now()
    const fileExtension = file.name.split(".").pop()
    const fileName = `${level}-marksheet-${timestamp}.${fileExtension}`
    const path = `marksheets/${currentUser.uid}/${fileName}`

    // Upload file
    const url = await uploadFile(file, path)

    return {
      url,
      fileName: file.name, // Original file name
    }
  } catch (error: any) {
    console.error("Error uploading marksheet:", error)
    throw new Error(error.message || "Failed to upload marksheet")
  }
}

/**
 * Delete a file from Firebase Storage
 * @param path - Storage path of the file to delete
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const storage = getStorageInstance()
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
  } catch (error: any) {
    console.error("Error deleting file:", error)
    throw new Error(error.message || "Failed to delete file")
  }
}

