"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ApplicationForm } from "@/components/tracker/application-form"
import { ApplicationCard } from "@/components/tracker/application-card"
import type { SavedApplication } from "@/lib/tracker-data"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Inbox, Loader2 } from "lucide-react"
import { getCurrentUser } from "@/lib/firebase/auth"

const STORAGE_KEY = "scholarship_applications"

export default function TrackerPage() {
  const [applications, setApplications] = useState<SavedApplication[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const router = useRouter()

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = getCurrentUser()
      if (!currentUser) {
        // Redirect to auth page with return URL so user comes back to tracker after login
        const returnUrl = encodeURIComponent("/tracker")
        router.push(`/auth?returnUrl=${returnUrl}`)
        return
      }
      setIsCheckingAuth(false)
    }
    
    checkAuth()
  }, [router])

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setApplications(JSON.parse(saved))
      } catch (error) {
        console.error("Failed to load applications:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
    }
  }, [applications, isLoaded])

  const handleAddApplication = useCallback((app: SavedApplication) => {
    setApplications((prev) => [app, ...prev])
  }, [])

  const handleDeleteApplication = useCallback((id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id))
  }, [])

  const statusCounts = useMemo(() => ({
    applied: applications.filter((a) => a.status === "Applied").length,
    underReview: applications.filter((a) => a.status === "Under Review").length,
    accepted: applications.filter((a) => a.status === "Accepted").length,
  }), [applications])

  // Show loading state while checking auth or loading data
  if (isCheckingAuth || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Application Tracker</h1>
            <p className="text-muted-foreground max-w-2xl">
              Keep track of your scholarship applications. Your data is saved locally on your device.
            </p>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-background border-b border-border py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> This tracker is for your personal reference only. It does not connect to
                official portals. To check your actual application status, visit the official scholarship portal
                directly.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Add Application Form */}
            <div className="mb-8">
              <ApplicationForm onAddApplication={handleAddApplication} />
            </div>

            {/* Stats Section */}
            {applications.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Applications</p>
                  <p className="text-3xl font-bold text-primary">{applications.length}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Under Review</p>
                  <p className="text-3xl font-bold text-yellow-600">{statusCounts.underReview}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Accepted</p>
                  <p className="text-3xl font-bold text-accent">{statusCounts.accepted}</p>
                </div>
              </div>
            )}

            {/* Applications List */}
            {applications.length > 0 ? (
              <>
                <h2 className="text-2xl font-bold mb-6">Your Applications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {applications.map((app) => (
                    <ApplicationCard key={app.id} application={app} onDelete={handleDeleteApplication} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-muted rounded-lg border border-border">
                <Inbox className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Applications Yet</h3>
                <p className="text-muted-foreground">
                  Start tracking your scholarship applications by clicking the button above.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
