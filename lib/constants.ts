/**
 * Application-wide constants
 */

// Storage keys
export const STORAGE_KEYS = {
  SCHOLARSHIP_APPLICATIONS: "scholarship_applications",
  STUDENT_PROFILE: "studentProfile",
} as const

// API endpoints
export const API_ENDPOINTS = {
  CHATBOT: "/api/chatbot",
  SEND_WELCOME_EMAIL: "/api/send-welcome-email",
} as const

// Routes
export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  TRACKER: "/tracker",
  SCHOLARSHIPS: "/scholarships",
  BY_STATE: "/by-state",
  STATUS: "/status",
} as const

// Error messages
export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "User must be authenticated",
  PROFILE_NOT_FOUND: "Profile not found",
  API_ERROR: "An error occurred. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  PROFILE_SAVED: "Profile saved successfully",
  APPLICATION_SAVED: "Application saved successfully",
  EMAIL_SENT: "Welcome email sent successfully",
} as const

// Chatbot messages
export const CHATBOT_MESSAGES = {
  GREETING: "Hello! 👋 I'm your scholarship advisor. I can help you:\n\n• Find scholarships based on your state\n• Show you state, central, and private scholarships in order\n• Provide direct links to application portals\n• Answer questions about eligibility and requirements\n\nHow can I assist you today?",
  API_NOT_CONFIGURED: "OpenAI API is not configured. Please contact support.",
  RATE_LIMIT: "OpenAI API rate limit exceeded. Please try again later.",
  ERROR: "Sorry, I encountered an error. Please try again.",
} as const
