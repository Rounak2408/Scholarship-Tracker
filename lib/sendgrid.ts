/**
 * SendGrid Email Service
 * Handles sending emails using SendGrid Mail API
 */

interface EmailResult {
  success: boolean
  message: string
  error?: any
}

/**
 * Send a welcome email to a new user
 * @param userEmail - User's email address
 * @param userFullName - User's full name (optional)
 * @returns Promise with success status and message
 */
export async function sendWelcomeEmail(
  userEmail: string,
  userFullName?: string
): Promise<EmailResult> {
  try {
    const apiKey = process.env.SENDGRID_API_KEY
    const senderEmail = process.env.SENDGRID_FROM_EMAIL || process.env.SENDGRID_SENDER_EMAIL
    const senderName = process.env.SENDGRID_FROM_NAME || "Scholarship Tracker"

    // Debug logging (without exposing sensitive data)
    console.log("SendGrid Configuration Check:", {
      hasApiKey: !!apiKey,
      hasSenderEmail: !!senderEmail,
      senderEmail: senderEmail || "NOT SET",
      senderName: senderName,
    })

    if (!apiKey) {
      console.error("SendGrid API key is not configured")
      console.error("Please set SENDGRID_API_KEY in your .env.local file")
      return {
        success: false,
        message: "Email service is not configured",
        error: "SENDGRID_API_KEY is missing. Please add it to your .env.local file.",
      }
    }

    if (!senderEmail) {
      console.error("SendGrid sender email is not configured")
      console.error("Please set SENDGRID_FROM_EMAIL in your .env.local file")
      console.error("Example: SENDGRID_FROM_EMAIL=sudhanshurounak242@gmail.com")
      return {
        success: false,
        message: "Email service is not configured",
        error: "SENDGRID_FROM_EMAIL or SENDGRID_SENDER_EMAIL environment variable is missing. Please set a verified sender email address in your .env.local file.",
      }
    }

    // Prepare email content
    const displayName = userFullName || "Student"
    const dashboardUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const dashboardLink = `${dashboardUrl}/dashboard`

    // HTML email template
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Scholarship Tracker</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🎓 Welcome to Scholarship Tracker!</h1>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                Welcome, ${displayName}!
              </h2>
              
              <p style="margin: 0 0 20px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                You've successfully logged in to <strong>Scholarship Tracker</strong>! 🎉
              </p>
              
              <p style="margin: 0 0 30px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Start exploring scholarships and apply now to get funding for your education. We're here to help you find the perfect scholarship opportunities.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                <tr>
                  <td align="center" style="padding: 0;">
                    <a href="${dashboardLink}" 
                       style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                      Go to Apply Scholarships
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                If you have any questions or need assistance, feel free to reach out to our support team.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 12px; text-align: center; line-height: 1.5;">
                © ${new Date().getFullYear()} Scholarship Tracker. All rights reserved.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 11px; text-align: center; line-height: 1.5;">
                You're receiving this email because you signed up for Scholarship Tracker.
                <br>
                If you no longer wish to receive these emails, you can unsubscribe from your account settings.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim()

    // Plain text version for email clients that don't support HTML
    const textContent = `
Welcome, ${displayName}!

You've successfully logged in to Scholarship Tracker! 🎉

Start exploring scholarships and apply now to get funding for your education. We're here to help you find the perfect scholarship opportunities.

Go to Apply Scholarships: ${dashboardLink}

If you have any questions or need assistance, feel free to reach out to our support team.

© ${new Date().getFullYear()} Scholarship Tracker. All rights reserved.

You're receiving this email because you signed up for Scholarship Tracker.
If you no longer wish to receive these emails, you can unsubscribe from your account settings.
    `.trim()

    // SendGrid API request
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: userEmail, name: displayName }],
            subject: "Welcome to Scholarship Tracker! 🎓",
          },
        ],
        from: {
          email: senderEmail,
          name: senderName,
        },
        content: [
          {
            type: "text/plain",
            value: textContent,
          },
          {
            type: "text/html",
            value: htmlContent,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      let errorMessage = "Failed to send welcome email"
      
      // Parse error to provide helpful messages
      try {
        const errorJson = JSON.parse(errorData)
        if (errorJson.errors && Array.isArray(errorJson.errors)) {
          const senderIdentityError = errorJson.errors.find((e: any) => 
            e.message && e.message.includes("verified Sender Identity")
          )
          if (senderIdentityError) {
            errorMessage = `Sender email "${senderEmail}" is not verified in SendGrid. Please verify your sender identity at https://sendgrid.com/docs/for-developers/sending-email/sender-identity/`
          }
        }
      } catch (e) {
        // If error parsing fails, use default message
      }

      console.error("SendGrid API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        senderEmail: senderEmail,
      })

      return {
        success: false,
        message: errorMessage,
        error: {
          status: response.status,
          statusText: response.statusText,
          details: errorData,
          senderEmail: senderEmail,
        },
      }
    }

    console.log("Welcome email sent successfully to:", userEmail)
    return {
      success: true,
      message: "Welcome email sent successfully",
    }
  } catch (error: any) {
    console.error("Error sending welcome email:", error)
    return {
      success: false,
      message: "Failed to send welcome email",
      error: error.message || error,
    }
  }
}

