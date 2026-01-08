/**
 * Scholarship Helper Functions
 * Provides utilities for filtering and ordering scholarships based on student profile
 */

import { scholarshipPortals, type ScholarshipPortal } from "./scholarship-data"
import { individualScholarships, type IndividualScholarship } from "./individual-scholarships"
import type { StudentProfile } from "./firebase/profile"

/**
 * Get scholarships ordered by priority: State -> Central -> Private
 * @param studentState - The state from student profile
 * @returns Ordered list of scholarship portals
 */
export function getOrderedScholarships(studentState?: string): ScholarshipPortal[] {
  if (!studentState) {
    // If no state, return all in default order: Central, State, Private
    return [
      ...scholarshipPortals.filter((s) => s.type === "Central"),
      ...scholarshipPortals.filter((s) => s.type === "State"),
      ...scholarshipPortals.filter((s) => s.type === "Private"),
    ]
  }

  // Order: State (for user's state) -> Central -> State (other states) -> Private
  const stateScholarships = scholarshipPortals.filter(
    (s) => s.type === "State" && (s.applicableStates?.includes(studentState) || s.applicableStates?.includes("ALL"))
  )
  const centralScholarships = scholarshipPortals.filter((s) => s.type === "Central")
  const otherStateScholarships = scholarshipPortals.filter(
    (s) => s.type === "State" && !s.applicableStates?.includes(studentState) && !s.applicableStates?.includes("ALL")
  )
  const privateScholarships = scholarshipPortals.filter((s) => s.type === "Private")

  return [...stateScholarships, ...centralScholarships, ...otherStateScholarships, ...privateScholarships]
}

/**
 * Get individual scholarships ordered by priority: State -> Central -> Private
 * @param studentState - The state from student profile
 * @returns Ordered list of individual scholarships
 */
export function getOrderedIndividualScholarships(studentState?: string): IndividualScholarship[] {
  if (!studentState) {
    return [
      ...individualScholarships.filter((s) => s.type === "Central"),
      ...individualScholarships.filter((s) => s.type === "State"),
      ...individualScholarships.filter((s) => s.type === "Private"),
    ]
  }

  const stateScholarships = individualScholarships.filter(
    (s) => s.type === "State" && (s.state === studentState || !s.state)
  )
  const centralScholarships = individualScholarships.filter((s) => s.type === "Central")
  const otherStateScholarships = individualScholarships.filter(
    (s) => s.type === "State" && s.state && s.state !== studentState
  )
  const privateScholarships = individualScholarships.filter((s) => s.type === "Private")

  return [...stateScholarships, ...centralScholarships, ...otherStateScholarships, ...privateScholarships]
}

/**
 * Get student's state from profile
 * @param profile - Student profile
 * @returns State name or undefined
 */
export function getStudentState(profile: StudentProfile | null): string | undefined {
  return profile?.state || undefined
}

/**
 * Format scholarships for chatbot response
 */
export function formatScholarshipsForChat(scholarships: ScholarshipPortal[]): string {
  if (scholarships.length === 0) {
    return "No scholarships found matching your criteria."
  }

  let result = `I found ${scholarships.length} scholarship(s) for you:\n\n`
  
  let currentType: ScholarshipPortal["type"] | null = null
  scholarships.forEach((scholarship, index) => {
    if (currentType !== scholarship.type) {
      if (currentType !== null) result += "\n"
      result += `**${scholarship.type} Scholarships:**\n`
      currentType = scholarship.type
    }
    result += `${index + 1}. **${scholarship.name}**\n`
    result += `   - ${scholarship.description}\n`
    result += `   - Portal: ${scholarship.portalUrl}\n`
    result += `   - Eligibility: ${scholarship.eligibility}\n\n`
  })

  return result
}

/**
 * Parse percentage or CGPA from string
 * Handles formats like "85%", "85", "8.5 CGPA", "8.5"
 */
function parsePercentage(percentageOrCGPA: string): number | null {
  if (!percentageOrCGPA) return null
  
  // Remove % and spaces
  const cleaned = percentageOrCGPA.toString().trim().replace(/%/g, "")
  
  // Try to parse as number
  const num = parseFloat(cleaned)
  if (isNaN(num)) return null
  
  // If it's CGPA (typically 0-10), convert to percentage (multiply by 10)
  // If it's already percentage (typically 0-100), use as is
  if (num <= 10 && cleaned.toLowerCase().includes("cgpa")) {
    return num * 10 // Convert CGPA to percentage
  }
  if (num <= 10 && !cleaned.toLowerCase().includes("percent")) {
    // Assume CGPA if value is <= 10 and no explicit percentage indicator
    return num * 10
  }
  
  return num
}

/**
 * Get the best percentage from student's academic records
 * Returns the highest percentage found
 */
function getBestPercentage(academicRecords?: any[]): number | null {
  if (!academicRecords || academicRecords.length === 0) return null
  
  let bestPercentage: number | null = null
  
  for (const record of academicRecords) {
    const percentage = parsePercentage(record.percentageOrCGPA)
    if (percentage !== null) {
      if (bestPercentage === null || percentage > bestPercentage) {
        bestPercentage = percentage
      }
    }
  }
  
  return bestPercentage
}

/**
 * Parse annual family income from string
 * Handles formats like "₹2,50,000", "250000", "2.5 Lakh", "2.5L"
 */
function parseIncome(incomeStr?: string): number | null {
  if (!incomeStr) return null
  
  // Remove currency symbols, commas, spaces
  let cleaned = incomeStr.toString().trim()
    .replace(/₹/g, "")
    .replace(/,/g, "")
    .replace(/\s+/g, "")
    .toLowerCase()
  
  // Handle "lakh" or "l" suffix
  if (cleaned.includes("lakh") || cleaned.endsWith("l")) {
    const numStr = cleaned.replace(/lakh|l/g, "")
    const num = parseFloat(numStr)
    if (!isNaN(num)) {
      return num * 100000 // Convert lakh to rupees
    }
  }
  
  // Try to parse as direct number
  const num = parseFloat(cleaned)
  if (!isNaN(num)) {
    return num
  }
  
  return null
}

/**
 * Check if student is eligible for a scholarship based on their profile
 * @param profile - Student profile
 * @param scholarship - Individual scholarship with eligibility criteria
 * @returns Object with eligibility status and reason
 */
export interface EligibilityResult {
  isEligible: boolean
  reason: string
  missingCriteria?: string[]
}

export interface ScholarshipEligibility {
  minPercentage?: number // Minimum percentage required
  maxIncome?: number // Maximum annual family income in rupees
  requiredCategories?: ("general" | "obc" | "sc" | "st" | "other")[] // Required categories
  requiredStates?: string[] // Required states (if empty, all states eligible)
  requiredGender?: ("male" | "female" | "other")[] // Required gender (if empty, all genders eligible)
  minClassLevel?: "10th" | "12th" | "graduation" | "post-graduation" // Minimum class level
}

export function checkEligibility(
  profile: StudentProfile | null,
  eligibility: ScholarshipEligibility
): EligibilityResult {
  if (!profile) {
    return {
      isEligible: false,
      reason: "Complete your profile to check eligibility",
      missingCriteria: ["Profile incomplete"]
    }
  }
  
  const missingCriteria: string[] = []
  
  // Check marks/percentage
  if (eligibility.minPercentage !== undefined) {
    const bestPercentage = getBestPercentage(profile.academicRecords)
    if (bestPercentage === null) {
      missingCriteria.push(`Academic records not found`)
    } else if (bestPercentage < eligibility.minPercentage) {
      return {
        isEligible: false,
        reason: `Minimum ${eligibility.minPercentage}% required. Your best: ${bestPercentage.toFixed(1)}%`,
        missingCriteria: [`Need ${eligibility.minPercentage}% marks (current: ${bestPercentage.toFixed(1)}%)`]
      }
    }
  }
  
  // Check income
  if (eligibility.maxIncome !== undefined) {
    const familyIncome = parseIncome(profile.parents?.annualFamilyIncome)
    if (familyIncome === null) {
      missingCriteria.push("Family income not specified")
    } else if (familyIncome > eligibility.maxIncome) {
      return {
        isEligible: false,
        reason: `Maximum family income ₹${(eligibility.maxIncome / 100000).toFixed(1)}L required. Your income: ₹${(familyIncome / 100000).toFixed(1)}L`,
        missingCriteria: [`Family income should be ≤ ₹${(eligibility.maxIncome / 100000).toFixed(1)}L`]
      }
    }
  }
  
  // Check category
  if (eligibility.requiredCategories && eligibility.requiredCategories.length > 0) {
    const studentCategory = profile.parents?.category
    if (!studentCategory || !eligibility.requiredCategories.includes(studentCategory)) {
      return {
        isEligible: false,
        reason: `This scholarship is for ${eligibility.requiredCategories.join(", ").toUpperCase()} category students`,
        missingCriteria: [`Category: ${eligibility.requiredCategories.join(", ").toUpperCase()} required`]
      }
    }
  }
  
  // Check state
  if (eligibility.requiredStates && eligibility.requiredStates.length > 0) {
    const studentState = profile.state
    if (!studentState || !eligibility.requiredStates.includes(studentState)) {
      return {
        isEligible: false,
        reason: `This scholarship is for ${eligibility.requiredStates.join(", ")} residents only`,
        missingCriteria: [`State: ${eligibility.requiredStates.join(", ")} required`]
      }
    }
  }
  
  // Check gender
  if (eligibility.requiredGender && eligibility.requiredGender.length > 0) {
    const studentGender = profile.gender
    // Handle "prefer-not-to-say" by treating it as not matching specific gender requirements
    if (!studentGender || studentGender === "prefer-not-to-say" || !eligibility.requiredGender.includes(studentGender as "male" | "female" | "other")) {
      return {
        isEligible: false,
        reason: `This scholarship is for ${eligibility.requiredGender.join(", ")} students only`,
        missingCriteria: [`Gender: ${eligibility.requiredGender.join(", ")} required`]
      }
    }
  }
  
  // Check class level
  if (eligibility.minClassLevel) {
    const levels = ["10th", "12th", "graduation", "post-graduation"]
    const minLevelIndex = levels.indexOf(eligibility.minClassLevel)
    const hasRequiredLevel = profile.academicRecords?.some(record => {
      const recordLevelIndex = levels.indexOf(record.level)
      return recordLevelIndex >= minLevelIndex
    })
    
    if (!hasRequiredLevel) {
      return {
        isEligible: false,
        reason: `Minimum ${eligibility.minClassLevel} level required`,
        missingCriteria: [`Need ${eligibility.minClassLevel} qualification`]
      }
    }
  }
  
  // If we get here and have missing criteria, it's a partial match
  if (missingCriteria.length > 0) {
    return {
      isEligible: true, // Still eligible, but some info missing
      reason: "Eligible (some profile information may be incomplete)",
      missingCriteria
    }
  }
  
  return {
    isEligible: true,
    reason: "You meet all eligibility criteria!"
  }
}

/**
 * Get eligible scholarships for a student based on their profile
 * @param profile - Student profile
 * @returns Array of eligible scholarships with eligibility info
 */
export interface EligibleScholarship extends IndividualScholarship {
  eligibilityResult: EligibilityResult
  matchScore: number // Higher score = better match
}

export function getEligibleScholarships(profile: StudentProfile | null): EligibleScholarship[] {
  if (!profile) return []
  
  // Define eligibility criteria for each scholarship
  const eligibilityMap: Record<string, ScholarshipEligibility> = {
    "post-matric": {
      minPercentage: 50,
      maxIncome: 250000, // 2.5 Lakh
      requiredCategories: ["sc", "st", "obc"],
    },
    "pre-matric": {
      minPercentage: 50,
      maxIncome: 250000,
      requiredCategories: ["sc", "st"],
      minClassLevel: "10th",
    },
    "merit-means": {
      minPercentage: 50,
      maxIncome: 250000,
    },
    "minority-merit": {
      minPercentage: 50,
      maxIncome: 250000,
    },
    "ugc-csir": {
      minPercentage: 55,
      minClassLevel: "graduation",
    },
    "inspire": {
      minPercentage: 65,
      minClassLevel: "12th",
    },
    "cm-bicycle-bihar": {
      requiredStates: ["Bihar"],
      requiredGender: ["female"],
      minClassLevel: "10th",
    },
    "mukhyamantri-bihar": {
      requiredStates: ["Bihar"],
      requiredGender: ["female"],
    },
    "up-post-matric": {
      requiredStates: ["Uttar Pradesh"],
      minPercentage: 50,
    },
    "tn-merit": {
      requiredStates: ["Tamil Nadu"],
      minPercentage: 60,
    },
    "maha-mukhyamantri": {
      requiredStates: ["Maharashtra"],
      minPercentage: 50,
    },
    "rajasthan-scholarship": {
      requiredStates: ["Rajasthan"],
      minPercentage: 50,
    },
    "kerala-scholarship": {
      requiredStates: ["Kerala"],
      minPercentage: 50,
    },
    "west-bengal-scholarship": {
      requiredStates: ["West Bengal"],
      minPercentage: 50,
    },
    "tata-scholarship": {
      minPercentage: 60,
      maxIncome: 500000, // 5 Lakh
    },
    "reliance-foundation": {
      minPercentage: 60,
      maxIncome: 600000, // 6 Lakh
    },
    "aditya-birla": {
      minPercentage: 65,
      maxIncome: 400000, // 4 Lakh
    },
    "infosys-foundation": {
      minPercentage: 60,
      minClassLevel: "graduation",
    },
    "wipro-foundation": {
      minPercentage: 55,
      maxIncome: 300000, // 3 Lakh
    },
    "icici-foundation": {
      minPercentage: 55,
      maxIncome: 400000, // 4 Lakh
    },
    "hdfc-bank-scholarship": {
      minPercentage: 60,
      maxIncome: 500000, // 5 Lakh
    },
    "axis-bank-foundation": {
      minPercentage: 55,
      maxIncome: 300000, // 3 Lakh
    },
  }
  
  const eligibleScholarships: EligibleScholarship[] = []
  
  for (const scholarship of individualScholarships) {
    const eligibility = eligibilityMap[scholarship.id]
    if (!eligibility) {
      // If no specific eligibility criteria, consider it eligible
      eligibleScholarships.push({
        ...scholarship,
        eligibilityResult: {
          isEligible: true,
          reason: "Check portal for specific eligibility criteria"
        },
        matchScore: 1
      })
      continue
    }
    
    const eligibilityResult = checkEligibility(profile, eligibility)
    
    if (eligibilityResult.isEligible) {
      // Calculate match score (higher = better match)
      let matchScore = 1
      
      // Boost score for state-specific scholarships matching student's state
      if (eligibility.requiredStates && profile.state && eligibility.requiredStates.includes(profile.state)) {
        matchScore += 3
      }
      
      // Boost score for category-specific scholarships matching student's category
      if (eligibility.requiredCategories && profile.parents?.category && 
          eligibility.requiredCategories.includes(profile.parents.category)) {
        matchScore += 2
      }
      
      // Boost score if marks are well above minimum
      if (eligibility.minPercentage) {
        const bestPercentage = getBestPercentage(profile.academicRecords)
        if (bestPercentage && bestPercentage > eligibility.minPercentage + 10) {
          matchScore += 1
        }
      }
      
      eligibleScholarships.push({
        ...scholarship,
        eligibilityResult,
        matchScore
      })
    }
  }
  
  // Sort by match score (highest first), then by type (State -> Central -> Private)
  eligibleScholarships.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore
    }
    
    const typeOrder = { "State": 3, "Central": 2, "Private": 1 }
    return (typeOrder[b.type] || 0) - (typeOrder[a.type] || 0)
  })
  
  return eligibleScholarships
}

/**
 * Find a specific link based on user query
 * Returns only the URL if found, null otherwise
 */
export function findSpecificLink(query: string): string | null {
  const lowerQuery = query.toLowerCase()
  
  // Check for specific portal names first
  if (lowerQuery.includes("bihar") || lowerQuery.includes("bih")) {
    return "https://scholarship.bih.nic.in"
  }
  if (lowerQuery.includes("uttar pradesh") || lowerQuery.includes("up")) {
    return "https://scholarship.up.gov.in"
  }
  if (lowerQuery.includes("tamil nadu") || lowerQuery.includes("tn")) {
    return "https://www.tnscholarships.gov.in"
  }
  if (lowerQuery.includes("maharashtra") || lowerQuery.includes("maha")) {
    return "https://scholarships.maharashtra.gov.in"
  }
  
  // Check scholarship portals by name
  for (const portal of scholarshipPortals) {
    const portalName = portal.name.toLowerCase()
    const portalWords = portalName.split(' ')
    // Check if any significant word from portal name is in query
    for (const word of portalWords) {
      if (word.length > 3 && lowerQuery.includes(word)) {
        return portal.portalUrl
      }
    }
  }
  
  // Check individual scholarships
  for (const scholarship of individualScholarships) {
    const scholarshipName = scholarship.name.toLowerCase()
    const scholarshipWords = scholarshipName.split(' ')
    for (const word of scholarshipWords) {
      if (word.length > 3 && lowerQuery.includes(word)) {
        return scholarship.portalUrl
      }
    }
  }
  
  // Common queries - student credit/loan/scholarship
  if (lowerQuery.includes("student credit") || lowerQuery.includes("student loan") || 
      (lowerQuery.includes("credit") && lowerQuery.includes("apply")) ||
      (lowerQuery.includes("loan") && lowerQuery.includes("apply"))) {
    return "https://scholarships.gov.in" // Default to NSP for student financial aid
  }
  
  if (lowerQuery.includes("scholarship") && (lowerQuery.includes("link") || lowerQuery.includes("apply"))) {
    return "https://scholarships.gov.in" // National Scholarship Portal
  }
  
  return null
}
