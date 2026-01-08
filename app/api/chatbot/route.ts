import { NextRequest, NextResponse } from "next/server"
import { getStudentProfile } from "@/lib/storage/profile-storage"
import { getOrderedScholarships, getOrderedIndividualScholarships, getStudentState, formatScholarshipsForChat } from "@/lib/scholarship-helper"
import { scholarshipPortals } from "@/lib/scholarship-data"
import { individualScholarships } from "@/lib/individual-scholarships"

interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

/**
 * API Route: Chatbot with OpenAI
 * POST /api/chatbot
 * 
 * Body: {
 *   message: string
 *   userId?: string (optional, for getting student profile)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, userId } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      )
    }

    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey || openaiApiKey === "your_openai_api_key_here") {
      console.warn("OpenAI API key is not configured or is using placeholder value")
      return NextResponse.json(
        { 
          success: false, 
          error: "OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file.",
          message: "OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file."
        },
        { status: 500 }
      )
    }

    // Get student profile if userId is provided (for state-based filtering)
    let studentState: string | undefined
    let studentProfile: any = null
    
    // Try to get profile from request context (if available)
    // Note: In a real app, you'd get this from the authenticated session
    // For now, we'll check if the message asks for scholarships
    const isAskingForScholarships = 
      message.toLowerCase().includes("scholarship") ||
      message.toLowerCase().includes("scholarships") ||
      message.toLowerCase().includes("show me") ||
      message.toLowerCase().includes("find") ||
      message.toLowerCase().includes("recommend")

    // Get ordered scholarships based on student state
    let scholarshipContext = ""
    if (isAskingForScholarships) {
      // In a real implementation, you'd get the profile from the authenticated user
      // For now, we'll provide all scholarships in the correct order
      const orderedPortals = getOrderedScholarships(studentState)
      const orderedIndividual = getOrderedIndividualScholarships(studentState)
      
      scholarshipContext = `
STUDENT SCHOLARSHIP DATA:

Scholarship Portals (${orderedPortals.length} total):
${orderedPortals.map((s, i) => 
  `${i + 1}. [${s.type}] ${s.name} - ${s.description}\n   URL: ${s.portalUrl}\n   Eligibility: ${s.eligibility}`
).join("\n\n")}

Individual Scholarships (${orderedIndividual.length} total):
${orderedIndividual.map((s, i) => 
  `${i + 1}. [${s.type}] ${s.name} - ${s.description}\n   URL: ${s.portalUrl}\n   Category: ${s.category}${s.state ? `\n   State: ${s.state}` : ""}`
).join("\n\n")}

IMPORTANT: When providing scholarships, always order them as:
1. State-level scholarships (for the student's state) - FIRST
2. Central government scholarships - SECOND  
3. Private scholarships - THIRD

Always provide direct links to scholarship portals when available.
`
    }

    // Check if user is asking specifically for a link
    const lowerMessage = message.toLowerCase()
    const isAskingForLink = lowerMessage.includes("link") || 
      lowerMessage.includes("link do") ||
      lowerMessage.includes("link de") ||
      lowerMessage.includes("url") ||
      (lowerMessage.includes("apply") && (lowerMessage.includes("link") || lowerMessage.includes("keliye")))

    // Prepare system message
    let systemContent = ""
    if (isAskingForLink) {
      systemContent = `CRITICAL: The user is asking for a SPECIFIC LINK. Your response must be ONLY the URL, nothing else. No explanations, no suggestions, no extra text. Just the link.

Example:
User: "student credit ko apply krne keliye link do"
You: https://scholarships.gov.in

User: "scholarship link"
You: https://scholarships.gov.in

${scholarshipContext}

When user asks for a link, provide ONLY the URL that matches their request.`
    } else {
      systemContent = `You are a helpful scholarship and student financial aid advisor chatbot for Indian students. Your role is to:

1. Help students find relevant scholarships based on their state and profile
2. Provide information about scholarship portals and application processes
3. Answer questions about student credits, loans, and financial aid
4. Provide direct links to application portals when available
5. Answer questions in the language the user uses (English, Hindi, or mixed)
6. Be friendly, conversational, and helpful

${scholarshipContext}

IMPORTANT INFORMATION:
- Students can apply for scholarships through National Scholarship Portal: https://scholarships.gov.in
- For student credits/loans, students can check with banks like SBI, HDFC, PNB, or government schemes
- Always provide direct, clickable links when available
- If asked for application links, provide the actual portal URLs

When students ask about scholarships:
- First show state-level scholarships (if their state is known)
- Then show central government scholarships
- Finally show private scholarships
- Always include direct links to application portals
- Be friendly, helpful, and encouraging

When students ask about student credits/loans:
- Provide information about government schemes and bank loans
- Give direct links to application portals if available
- Explain eligibility criteria

Answer questions clearly and concisely in the same language/style the user uses. If you don't know something, say so honestly but try to be helpful.`
    }

    const systemMessage: ChatMessage = {
      role: "system",
      content: systemContent
    }

    // Prepare messages for OpenAI
    const messages: ChatMessage[] = [
      systemMessage,
      {
        role: "user",
        content: message,
      },
    ]

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      let errorMessage = "Failed to get response from AI"
      
      try {
        const errorJson = JSON.parse(errorData)
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message
        } else if (errorJson.error) {
          errorMessage = errorJson.error
        }
      } catch (e) {
        // If parsing fails, use the raw error data
        errorMessage = errorData || errorMessage
      }

      console.error("OpenAI API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorMessage,
      })

      // Provide user-friendly error messages
      if (response.status === 401) {
        errorMessage = "Invalid OpenAI API key. Please check your .env.local file."
      } else if (response.status === 429) {
        errorMessage = "OpenAI API rate limit exceeded. Please try again later."
      } else if (response.status === 500) {
        errorMessage = "OpenAI service is temporarily unavailable. Please try again later."
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          details: errorData,
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response."

    return NextResponse.json({
      success: true,
      message: aiResponse,
    })
  } catch (error: any) {
    console.error("Error in chatbot API route:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    )
  }
}
