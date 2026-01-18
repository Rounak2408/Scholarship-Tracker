"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, Bot, User, X, Minimize2, Maximize2 } from "lucide-react"
import { getStudentProfile } from "@/lib/storage/profile-storage"
import { getOrderedScholarships, getOrderedIndividualScholarships, getStudentState, findSpecificLink } from "@/lib/scholarship-helper"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatbotProps {
  className?: string
}

export function Chatbot({ className }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: CHATBOT_MESSAGES.GREETING,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState<"checking" | "working" | "not-configured" | "error">("checking")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]')
      if (scrollContainer) {
        setTimeout(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight
        }, 100)
      }
    }
  }, [messages, loading])

  // Check API status on mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Make a lightweight test call
        const response = await fetch(API_ENDPOINTS.CHATBOT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "hi" }),
        })
        const data = await response.json()
        if (data.error?.includes("OpenAI API key is not configured") || 
            data.error?.includes("OPENAI_API_KEY")) {
          setApiStatus("not-configured")
        } else if (response.ok && data.success) {
          setApiStatus("working")
        } else if (response.status === 401 || data.error?.includes("Invalid")) {
          setApiStatus("error")
        } else {
          setApiStatus("not-configured")
        }
      } catch (error) {
        console.error("API status check error:", error)
        setApiStatus("error")
      }
    }
    if (isOpen) {
      setApiStatus("checking")
      checkApiStatus()
    }
  }, [isOpen])

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isMinimized])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      // Get student profile for context
      const profile = getStudentProfile()
      const studentState = getStudentState(profile)

      // If asking for scholarships, get ordered list
      const lowerMessage = userMessage.content.toLowerCase()
      const isAskingForScholarships = 
        lowerMessage.includes("scholarship") ||
        lowerMessage.includes("scholarships") ||
        lowerMessage.includes("show me") ||
        lowerMessage.includes("find") ||
        lowerMessage.includes("recommend") ||
        lowerMessage.includes("available")

      let responseContent = ""

      // Check if user is asking specifically for a link
      const isAskingForLink = lowerMessage.includes("link") || 
        lowerMessage.includes("link do") ||
        lowerMessage.includes("link de") ||
        lowerMessage.includes("url") ||
        (lowerMessage.includes("apply") && (lowerMessage.includes("link") || lowerMessage.includes("keliye")))

      // If asking for a specific link, find and return it directly (ONLY THE LINK)
      if (isAskingForLink) {
        const specificLink = findSpecificLink(userMessage.content)
        if (specificLink) {
          // Return ONLY the link, nothing else
          responseContent = specificLink
        }
      }

      // If we already have a link, skip everything else - return ONLY the link
      if (responseContent && isAskingForLink) {
        // Link found, use it directly - no OpenAI needed, no other processing
        // responseContent is already set to just the link
      } else {
        // Always try OpenAI first for non-scholarship queries, or if user explicitly asks for links/info
        const shouldUseOpenAI = !isAskingForScholarships || 
          isAskingForLink ||
          lowerMessage.includes("apply") ||
          lowerMessage.includes("credit") ||
          lowerMessage.includes("loan") ||
          lowerMessage.includes("student credit") ||
          lowerMessage.includes("student loan")

        if (isAskingForScholarships && studentState && !shouldUseOpenAI) {
          // Get ordered scholarships
          const orderedPortals = getOrderedScholarships(studentState)
          const orderedIndividual = getOrderedIndividualScholarships(studentState)

          // Format response with ordered scholarships
          responseContent = `Based on your profile (State: ${studentState}), here are scholarships ordered by priority:\n\n`
          
          // State scholarships
          const stateScholarships = [
            ...orderedPortals.filter((s) => s.type === "State"),
            ...orderedIndividual.filter((s) => s.type === "State" && (s.state === studentState || !s.state)),
          ]
          if (stateScholarships.length > 0) {
            responseContent += `**1. State-Level Scholarships (${stateScholarships.length}):**\n`
            stateScholarships.slice(0, 5).forEach((s, i) => {
              const portal = "portalUrl" in s ? s : null
              const individual = "category" in s ? s : null
              responseContent += `${i + 1}. **${s.name}**\n`
              responseContent += `   ${portal?.description || individual?.description || ""}\n`
              responseContent += `   🔗 ${portal?.portalUrl || individual?.portalUrl || ""}\n\n`
            })
          }

          // Central scholarships
          const centralScholarships = [
            ...orderedPortals.filter((s) => s.type === "Central"),
            ...orderedIndividual.filter((s) => s.type === "Central"),
          ]
          if (centralScholarships.length > 0) {
            responseContent += `**2. Central Government Scholarships (${centralScholarships.length}):**\n`
            centralScholarships.slice(0, 5).forEach((s, i) => {
              const portal = "portalUrl" in s ? s : null
              const individual = "category" in s ? s : null
              responseContent += `${i + 1}. **${s.name}**\n`
              responseContent += `   ${portal?.description || individual?.description || ""}\n`
              responseContent += `   🔗 ${portal?.portalUrl || individual?.portalUrl || ""}\n\n`
            })
          }

          // Private scholarships
          const privateScholarships = [
            ...orderedPortals.filter((s) => s.type === "Private"),
            ...orderedIndividual.filter((s) => s.type === "Private"),
          ]
          if (privateScholarships.length > 0) {
            responseContent += `**3. Private Scholarships (${privateScholarships.length}):**\n`
            privateScholarships.slice(0, 5).forEach((s, i) => {
              const portal = "portalUrl" in s ? s : null
              const individual = "category" in s ? s : null
              responseContent += `${i + 1}. **${s.name}**\n`
              responseContent += `   ${portal?.description || individual?.description || ""}\n`
              responseContent += `   🔗 ${portal?.portalUrl || individual?.portalUrl || ""}\n\n`
            })
          }

          responseContent += `\n💡 *Showing top results. Ask me for more details about any specific scholarship!*`
        } else if (isAskingForScholarships && !studentState) {
          // No state available, show all scholarships in order
          const orderedPortals = getOrderedScholarships()
          const orderedIndividual = getOrderedIndividualScholarships()
          
          responseContent = `Here are scholarships available to you (complete your profile to see state-specific ones):\n\n`
          
          // Central scholarships
          const centralScholarships = [
            ...orderedPortals.filter((s) => s.type === "Central"),
            ...orderedIndividual.filter((s) => s.type === "Central"),
          ]
          if (centralScholarships.length > 0) {
            responseContent += `**1. Central Government Scholarships (${centralScholarships.length}):**\n`
            centralScholarships.slice(0, 5).forEach((s, i) => {
              const portal = "portalUrl" in s ? s : null
              const individual = "category" in s ? s : null
              responseContent += `${i + 1}. **${s.name}**\n`
              responseContent += `   ${portal?.description || individual?.description || ""}\n`
              responseContent += `   🔗 ${portal?.portalUrl || individual?.portalUrl || ""}\n\n`
            })
          }

          // Private scholarships
          const privateScholarships = [
            ...orderedPortals.filter((s) => s.type === "Private"),
            ...orderedIndividual.filter((s) => s.type === "Private"),
          ]
          if (privateScholarships.length > 0) {
            responseContent += `**2. Private Scholarships (${privateScholarships.length}):**\n`
            privateScholarships.slice(0, 5).forEach((s, i) => {
              const portal = "portalUrl" in s ? s : null
              const individual = "category" in s ? s : null
              responseContent += `${i + 1}. **${s.name}**\n`
              responseContent += `   ${portal?.description || individual?.description || ""}\n`
              responseContent += `   🔗 ${portal?.portalUrl || individual?.portalUrl || ""}\n\n`
            })
          }
          
          responseContent += `\n💡 *Complete your profile to see state-specific scholarships!*`
        } else {
          // Use OpenAI for ALL other questions - it can handle everything
          try {
            const response = await fetch(API_ENDPOINTS.CHATBOT, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                message: userMessage.content,
              }),
            })

            const data = await response.json()

            if (!response.ok) {
              // Handle API errors gracefully
              if (data.error?.includes("OpenAI API key is not configured") || 
                  data.error?.includes("OPENAI_API_KEY")) {
                responseContent = `I understand you're asking: "${userMessage.content}"\n\n`
                responseContent += `To provide AI-powered responses, please configure your OpenAI API key in the .env.local file.\n\n`
                responseContent += `For now, I can help you with:\n`
                responseContent += `• Type "show me scholarships" to see all available scholarships\n`
                responseContent += `• Ask about specific scholarship portals\n`
                responseContent += `• Get information about eligibility and application processes\n\n`
                responseContent += `Would you like to see available scholarships?`
              } else if (data.error?.includes("rate limit") || response.status === 429) {
                // Handle rate limit error gracefully - don't throw, provide fallback
                console.warn("OpenAI rate limit exceeded, using fallback response")
                
                // If asking for a link, try to find it directly
                if (isAskingForLink) {
                  const fallbackLink = findSpecificLink(userMessage.content)
                  if (fallbackLink) {
                    responseContent = fallbackLink
                  } else {
                    responseContent = "https://scholarships.gov.in"
                  }
                } else {
                  // Provide helpful fallback response
                  responseContent = `I understand you're asking: "${userMessage.content}"\n\n`
                  responseContent += `Due to high demand, AI responses are temporarily limited. Here's what I can help with:\n\n`
                  
                  // Check if asking about scholarships
                  if (lowerMessage.includes("scholarship") || lowerMessage.includes("credit") || lowerMessage.includes("loan")) {
                    responseContent += `**Scholarship Application Links:**\n`
                    responseContent += `• National Scholarship Portal: https://scholarships.gov.in\n`
                    responseContent += `• For state-specific scholarships, complete your profile to see personalized options\n\n`
                    responseContent += `Try asking "show me scholarships" for a complete list!`
                  } else {
                    responseContent += `I can help you find scholarships and application links!\n\n`
                    responseContent += `Try asking:\n`
                    responseContent += `• "Show me scholarships" - to see all available options\n`
                    responseContent += `• "Student credit apply link" - for application links\n`
                    responseContent += `• Any specific question about scholarships\n\n`
                    responseContent += `Note: AI responses are temporarily limited. Please try again in a few minutes.`
                  }
                }
              } else {
                // For other errors, provide fallback instead of throwing
                console.warn("OpenAI API error, using fallback:", data.error)
                
                // If asking for a link, try to find it directly
                if (isAskingForLink) {
                  const fallbackLink = findSpecificLink(userMessage.content)
                  responseContent = fallbackLink || "https://scholarships.gov.in"
                } else {
                  // Provide helpful fallback response
                  responseContent = `I understand you're asking: "${userMessage.content}"\n\n`
                  responseContent += `I can help you with scholarships and application links!\n\n`
                  responseContent += `Try asking:\n`
                  responseContent += `• "Show me scholarships" - to see all available options\n`
                  responseContent += `• "Student credit apply link" - for application links\n`
                  responseContent += `• Any specific question about scholarships\n\n`
                  responseContent += `Note: AI service is temporarily unavailable. Please try again later.`
                }
              }
          } else if (data.success && data.message) {
            // OpenAI responded successfully
            let aiResponse = data.message.trim()
            
            // If asking for a link, extract only the URL from OpenAI response
            if (isAskingForLink) {
              // Try to extract URL from response
              const urlMatch = aiResponse.match(/https?:\/\/[^\s]+/)
              if (urlMatch) {
                responseContent = urlMatch[0] // Return ONLY the URL
              } else {
                // If no URL found, try to find it in our database
                const fallbackLink = findSpecificLink(userMessage.content)
                responseContent = fallbackLink || "https://scholarships.gov.in"
              }
            } else {
              responseContent = aiResponse
            }
          } else {
              // If response is not ok and not handled above, provide fallback
              console.warn("Unexpected API response, using fallback")
              
              // If asking for a link, try to find it directly
              if (isAskingForLink) {
                const fallbackLink = findSpecificLink(userMessage.content)
                responseContent = fallbackLink || "https://scholarships.gov.in"
              } else {
                responseContent = `I understand you're asking: "${userMessage.content}"\n\n`
                responseContent += `I can help you with scholarships and application links!\n\n`
                responseContent += `Try asking:\n`
                responseContent += `• "Show me scholarships" - to see all available options\n`
                responseContent += `• "Student credit apply link" - for application links\n`
                responseContent += `• Any specific question about scholarships\n\n`
                responseContent += `Note: Please try again in a moment.`
              }
            }
          } catch (error: any) {
            console.error("Chatbot error:", error)
            
            // Only use fallback for actual greetings, not for real questions
            const lowerMessage = userMessage.content.toLowerCase()
            const isGreeting = (lowerMessage === "hello" || 
                               lowerMessage === "hi" || 
                               lowerMessage === "hey" ||
                               lowerMessage === "hey bro" ||
                               (lowerMessage.includes("hello") && lowerMessage.length < 10) ||
                               (lowerMessage.includes("hi") && lowerMessage.length < 5))
            
            if (isGreeting) {
              responseContent = `Hello! 👋 Nice to meet you! I'm your scholarship advisor. I can help you:\n\n`
              responseContent += `• Find scholarships based on your state\n`
              responseContent += `• Show you state, central, and private scholarships in order\n`
              responseContent += `• Answer questions about eligibility and requirements\n`
              responseContent += `• Provide direct links to application portals\n\n`
              responseContent += `Try asking: "Show me scholarships" or ask me any question about student loans, credits, or scholarships!\n\n`
              responseContent += `How can I help you today? 😊`
            } else {
              // For real questions, provide a helpful response even if OpenAI fails
              // If asking for a link, try to find it directly
              if (isAskingForLink) {
                const fallbackLink = findSpecificLink(userMessage.content)
                if (fallbackLink) {
                  // Return ONLY the link
                  responseContent = fallbackLink
                } else {
                  // If link not found, provide the default scholarship portal link
                  responseContent = "https://scholarships.gov.in"
                }
              } else {
                responseContent = `I understand you're asking: "${userMessage.content}"\n\n`
                responseContent += `I can help you with scholarships, student credits, loans, and more!\n\n`
                responseContent += `Try asking:\n`
                responseContent += `• "Show me scholarships" - to see available options\n`
                responseContent += `• "Student credit apply link" - for application links\n`
                responseContent += `• Any specific question about scholarships or student financial aid\n\n`
                responseContent += `Note: For detailed AI-powered responses, make sure your OpenAI API key is configured.`
              }
            }
          }
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again or check your connection.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  // Format message content with better semantics
  const formatMessageContent = (content: string) => {
    // Split by lines and format
    const lines = content.split('\n')
    const elements: React.ReactNode[] = []
    
    lines.forEach((line, index) => {
      // Check for bold text (**text**)
      if (line.includes('**')) {
        const parts = line.split(/(\*\*.*?\*\*)/g)
        const formattedLine = parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
          }
          return part
        })
        elements.push(
          <p key={index} className={index > 0 ? "mt-2" : ""}>
            {formattedLine}
          </p>
        )
      } else if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        // Bullet points
        elements.push(
          <p key={index} className="mt-1 ml-2">
            {line.trim()}
          </p>
        )
      } else if (line.trim().startsWith('🔗')) {
        // Links
        const urlMatch = line.match(/https?:\/\/[^\s]+/)
        if (urlMatch) {
          const url = urlMatch[0]
          const beforeUrl = line.substring(0, line.indexOf(url))
          const afterUrl = line.substring(line.indexOf(url) + url.length)
          elements.push(
            <p key={index} className="mt-1">
              {beforeUrl}
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                {url}
              </a>
              {afterUrl}
            </p>
          )
        } else {
          elements.push(<p key={index} className="mt-1">{line}</p>)
        }
      } else if (line.trim() === '') {
        // Empty line
        elements.push(<br key={index} />)
      } else {
        // Regular text
        const urlRegex = /(https?:\/\/[^\s]+)/g
        const parts = line.split(urlRegex)
        if (parts.length > 1) {
          const formattedLine = parts.map((part, i) => {
            if (part.match(urlRegex)) {
              return (
                <a 
                  key={i}
                  href={part} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline break-all"
                >
                  {part}
                </a>
              )
            }
            return part
          })
          elements.push(<p key={index} className={index > 0 ? "mt-2" : ""}>{formattedLine}</p>)
        } else {
          elements.push(<p key={index} className={index > 0 ? "mt-2" : ""}>{line}</p>)
        }
      }
    })
    
    return <div>{elements}</div>
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col ${
        isMinimized ? "h-auto" : ""
      } ${className}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <div className="flex flex-col">
            <CardTitle className="text-lg">Scholarship Advisor</CardTitle>
            {apiStatus === "working" && (
              <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400"></span>
                AI Active
              </span>
            )}
            {apiStatus === "not-configured" && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                Basic Mode
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="flex-1 p-0 flex flex-col overflow-hidden min-h-0">
            <ScrollArea className="flex-1 min-h-0 h-full" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap break-words prose prose-sm max-w-none">
                        {formatMessageContent(message.content)}
                      </div>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3 justify-start">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about scholarships..."
                  disabled={loading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  size="icon"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  )
}
