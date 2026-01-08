import { NextRequest, NextResponse } from "next/server"
import { sendWelcomeEmail } from "@/lib/sendgrid"

/**
 * API Route: Send Welcome Email
 * POST /api/send-welcome-email
 * 
 * Body: {
 *   email: string
 *   name?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    // Validate input
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      )
    }

    // Send welcome email
    const result = await sendWelcomeEmail(email, name)

    if (result.success) {
      return NextResponse.json(
        { success: true, message: result.message },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { success: false, message: result.message, error: result.error },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("Error in send-welcome-email API route:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    )
  }
}

