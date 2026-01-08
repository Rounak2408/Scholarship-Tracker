"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, getUserProfile, logOut, UserProfile } from "@/lib/firebase/auth"
import { hasCompletedProfile, clearProfile, getStudentProfile } from "@/lib/storage/profile-storage"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Loader2,
  LogOut,
  User as UserIcon,
  Mail,
  Calendar,
  FileText,
  Sparkles,
  Compass,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Bell,
  Target,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  Zap,
  BarChart3,
  Star,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import type { SavedApplication } from "@/lib/tracker-data"
import { scholarshipPortals } from "@/lib/scholarship-data"
import { Chatbot } from "@/components/chatbot/chatbot"
import { getEligibleScholarships, type EligibleScholarship } from "@/lib/scholarship-helper"
import type { StudentProfile } from "@/lib/firebase/profile"

const STORAGE_KEY = "scholarship_applications"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [studentProfile, setStudentProfile] = useState<any>(null)
  const [profileComplete, setProfileComplete] = useState(false)
  const [loading, setLoading] = useState(true)
  const [signingOut, setSigningOut] = useState(false)
  const [applications, setApplications] = useState<SavedApplication[]>([])
  const router = useRouter()

  // Get display name with proper fallback chain
  const displayName = useMemo(() => {
    return studentProfile?.fullName || profile?.displayName || user?.displayName || user?.email?.split("@")[0] || "Not set"
  }, [studentProfile, profile, user])

  const greetingName = useMemo(() => {
    return studentProfile?.fullName || profile?.displayName || user?.displayName || user?.email?.split("@")[0] || "there"
  }, [studentProfile, profile, user])

  // Load applications from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setApplications(JSON.parse(saved))
      } catch (error) {
        console.error("Failed to load applications:", error)
      }
    }
  }, [])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalApplications = applications.length
    const statusCounts = {
      applied: applications.filter((a) => a.status === "Applied").length,
      underReview: applications.filter((a) => a.status === "Under Review").length,
      accepted: applications.filter((a) => a.status === "Accepted").length,
      rejected: applications.filter((a) => a.status === "Rejected").length,
    }
    const upcomingDeadlines = applications.filter((app) => {
      if (!app.deadline) return false
      const deadline = new Date(app.deadline)
      const today = new Date()
      const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilDeadline > 0 && daysUntilDeadline <= 30
    }).length

    return {
      totalApplications,
      statusCounts,
      upcomingDeadlines,
      successRate: totalApplications > 0 ? Math.round((statusCounts.accepted / totalApplications) * 100) : 0,
    }
  }, [applications])

  // Get eligible scholarships based on student profile
  const eligibleScholarships = useMemo(() => {
    if (!studentProfile) return []
    return getEligibleScholarships(studentProfile as StudentProfile)
  }, [studentProfile])

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/auth")
      return
    }

    setUser(currentUser)
    
    // Fetch user profile (non-blocking, handles offline gracefully)
    getUserProfile(currentUser.uid)
      .then((userProfile) => {
        if (!userProfile) {
          // Profile might not exist if Firestore write was still in progress or offline
          // It will be created/loaded on next page load when connection is restored
          console.log("User profile not found yet, will be loaded when available")
        }
        setProfile(userProfile)
      })
      .catch((error) => {
        // Error already handled in getUserProfile - just log for debugging
        console.warn("Profile fetch completed with warning:", error)
      })

    // Check if student profile is complete (instant - localStorage)
    try {
      const studentProf = getStudentProfile()
      setStudentProfile(studentProf)
      const complete = hasCompletedProfile()
      setProfileComplete(complete)
      if (!complete) {
        // Redirect to profile page if not complete (after a short delay to show dashboard)
        setTimeout(() => {
          router.push("/profile")
        }, 500)
      }
    } catch (error) {
      console.error("Error checking profile completion:", error)
    }
    
    // Set loading to false immediately - don't wait for profile check
    setLoading(false)
  }, [router])

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      // Clear localStorage profile data
      clearProfile()
      await logOut()
      router.push("/auth")
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setSigningOut(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_50%)]" />
          <CardContent className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between p-8">
            <div className="space-y-4 flex-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-primary border border-primary/30">
                <Sparkles className="h-4 w-4 animate-pulse" />
                Welcome back
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Hi, {greetingName}! 👋
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Your scholarship journey dashboard. Track applications, discover opportunities, and stay ahead of deadlines.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge 
                  variant={profileComplete ? "default" : "secondary"} 
                  className="flex items-center gap-2 px-3 py-1.5 text-sm"
                >
                  {profileComplete ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Profile complete
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4" />
                      Complete your profile
                    </>
                  )}
                </Badge>
                {profile?.createdAt && (
                  <Badge variant="outline" className="flex items-center gap-2 px-3 py-1.5">
                    <Calendar className="h-4 w-4" />
                    Joined {profile.createdAt?.toDate?.()?.toLocaleDateString() || "recently"}
                  </Badge>
                )}
                {stats.totalApplications > 0 && (
                  <Badge variant="outline" className="flex items-center gap-2 px-3 py-1.5">
                    <Award className="h-4 w-4 text-primary" />
                    {stats.totalApplications} {stats.totalApplications === 1 ? "application" : "applications"}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/30">
                  <UserIcon className="h-7 w-7 text-primary" />
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-xs text-muted-foreground font-medium">Signed in as</p>
                  <p className="font-semibold text-sm break-all max-w-[200px]">{user.email}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut} 
                disabled={signingOut}
                className="w-full md:w-auto"
              >
                {signingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing out...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </div>

        {/* Statistics Cards */}
        {stats.totalApplications > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalApplications}</p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors">
                    <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Under Review</p>
                <p className="text-3xl font-bold text-foreground">{stats.statusCounts.underReview}</p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Accepted</p>
                <p className="text-3xl font-bold text-foreground">{stats.statusCounts.accepted}</p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                    <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Success Rate</p>
                <p className="text-3xl font-bold text-foreground">{stats.successRate}%</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upcoming Deadlines Alert */}
        {stats.upcomingDeadlines > 0 && (
          <Card className="border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-950/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-orange-500/20">
                  <Bell className="h-6 w-6 text-orange-600 dark:text-orange-400 animate-pulse" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground mb-1">
                    {stats.upcomingDeadlines} {stats.upcomingDeadlines === 1 ? "deadline" : "deadlines"} approaching
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You have applications with deadlines in the next 30 days. Stay on top of them!
                  </p>
                </div>
                <Link href="/tracker">
                  <Button variant="outline" size="sm">
                    View Tracker
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Action Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="group border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                {!profileComplete && (
                  <Badge variant="destructive" className="animate-pulse">Action Required</Badge>
                )}
              </div>
              <CardTitle className="text-xl">Complete Your Profile</CardTitle>
              <CardDescription className="text-base">
                {profileComplete 
                  ? "Your profile is complete! Update anytime to improve matches." 
                  : "Finish your profile to unlock personalized scholarship recommendations."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!profileComplete && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Profile completion</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              )}
              <Link href="/profile">
                <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" variant={profileComplete ? "outline" : "default"}>
                  <FileText className="mr-2 h-4 w-4" />
                  {profileComplete ? "View Profile" : "Complete Profile"}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="pb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 group-hover:from-accent/30 group-hover:to-accent/20 transition-all w-fit mb-2">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-xl">Discover Scholarships</CardTitle>
              <CardDescription className="text-base">
                Browse {scholarshipPortals.length}+ scholarship portals and find opportunities that match your profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Link href="/scholarships" className="w-full">
                  <Button variant="default" className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Browse All
                  </Button>
                </Link>
                <Link href="/by-state" className="w-full">
                  <Button variant="outline" className="w-full">
                    <MapPin className="mr-2 h-4 w-4" />
                    By State
                  </Button>
                </Link>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Zap className="h-3 w-3" />
                  {scholarshipPortals.length} portals available • Updated regularly
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="group border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="pb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 group-hover:from-purple-500/30 group-hover:to-purple-500/20 transition-all w-fit mb-2">
                <Compass className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl">Track Applications</CardTitle>
              <CardDescription className="text-base">
                Manage your scholarship applications, track deadlines, and monitor your progress.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-primary/10 bg-primary/5 px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold">Active Applications</p>
                  <Badge variant="secondary">{stats.totalApplications}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalApplications === 0 
                    ? "Start tracking your applications" 
                    : `${stats.statusCounts.accepted} accepted • ${stats.statusCounts.underReview} under review`}
                </p>
              </div>
              <Link href="/tracker">
                <Button variant="outline" className="w-full group-hover:bg-purple-500/10 group-hover:border-purple-500/30 transition-colors">
                  <Compass className="mr-2 h-4 w-4" />
                  Go to Tracker
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Profile Snapshot + Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-primary/10 hover:border-primary/20 transition-all">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-primary" />
                  Profile Information
                </CardTitle>
                <CardDescription className="text-base mt-1">Your account details and progress</CardDescription>
              </div>
              <Badge variant={profileComplete ? "default" : "secondary"} className="w-fit">
                {profileComplete ? (
                  <>
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Complete
                  </>
                ) : (
                  "In Progress"
                )}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="group flex items-start gap-4 rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/50 p-4 hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 p-3 group-hover:scale-110 transition-transform">
                    <UserIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Display Name</p>
                    <p className="font-semibold text-foreground truncate">
                      {displayName}
                    </p>
                  </div>
                </div>
                
                <div className="group flex items-start gap-4 rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/50 p-4 hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 p-3 group-hover:scale-110 transition-transform">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Email</p>
                    <p className="font-semibold text-foreground break-all text-sm">{user.email}</p>
                  </div>
                </div>
                
                <div className="group flex items-start gap-4 rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/50 p-4 hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 p-3 group-hover:scale-110 transition-transform">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Member Since</p>
                    <p className="font-semibold text-foreground">
                      {profile?.createdAt?.toDate?.()?.toLocaleDateString("en-US", { 
                        month: "long", 
                        year: "numeric" 
                      }) || "Recently"}
                    </p>
                  </div>
                </div>
                
                <div className="group flex items-start gap-4 rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/50 p-4 hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 p-3 group-hover:scale-110 transition-transform">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Status</p>
                    <p className="font-semibold text-foreground">
                      {profileComplete ? "Ready to apply" : "Complete profile"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/10 hover:border-primary/20 transition-all">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription className="text-base">Navigate to key features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/profile">
                <Button variant="ghost" className="w-full justify-between h-auto py-3 hover:bg-primary/5 group">
                  <span className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">Update Profile</span>
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
              <Link href="/scholarships">
                <Button variant="ghost" className="w-full justify-between h-auto py-3 hover:bg-primary/5 group">
                  <span className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                      <Sparkles className="h-4 w-4 text-accent" />
                    </div>
                    <span className="font-medium">Browse Scholarships</span>
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
              <Link href="/tracker">
                <Button variant="ghost" className="w-full justify-between h-auto py-3 hover:bg-primary/5 group">
                  <span className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                      <Compass className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="font-medium">Track Applications</span>
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
              <Link href="/by-state">
                <Button variant="ghost" className="w-full justify-between h-auto py-3 hover:bg-primary/5 group">
                  <span className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                      <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-medium">Search by State</span>
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Suggested Scholarships Based on Eligibility */}
        {profileComplete && eligibleScholarships.length > 0 && (
          <Card className="border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                    <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      Suggested Scholarships
                      <Badge variant="default" className="bg-green-600 dark:bg-green-500">
                        {eligibleScholarships.length} matches
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                      Based on your marks, state, category, and eligibility criteria
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eligibleScholarships.slice(0, 6).map((scholarship) => (
                  <div
                    key={scholarship.id}
                    className="group rounded-xl border border-green-200/50 dark:border-green-900/50 bg-card/50 hover:bg-card hover:border-green-300 dark:hover:border-green-800 transition-all p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                            {scholarship.name}
                          </h4>
                          <Badge
                            variant={
                              scholarship.type === "State"
                                ? "default"
                                : scholarship.type === "Central"
                                ? "secondary"
                                : "outline"
                            }
                            className="text-xs"
                          >
                            {scholarship.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {scholarship.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                          <span className="text-green-700 dark:text-green-300 font-medium">
                            {scholarship.eligibilityResult.reason}
                          </span>
                        </div>
                      </div>
                      <a
                        href={scholarship.portalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-colors"
                        >
                          Apply
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
                {eligibleScholarships.length > 6 && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm text-muted-foreground text-center">
                      +{eligibleScholarships.length - 6} more scholarships available
                    </p>
                    <Link href="/scholarships" className="block mt-2">
                      <Button variant="outline" className="w-full">
                        View All Eligible Scholarships
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Incomplete Message for Scholarships */}
        {!profileComplete && (
          <Card className="border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-950/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-orange-500/20">
                  <Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground mb-1">
                    Complete your profile to see personalized scholarship suggestions
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    We'll analyze your marks, state, category, and eligibility to suggest the best scholarships for you.
                  </p>
                  <Link href="/profile">
                    <Button variant="default" size="sm">
                      Complete Profile
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Chatbot />
    </div>
  )
}

