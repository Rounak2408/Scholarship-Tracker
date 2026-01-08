"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Users, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">About Scholarship Link</h1>
            <p className="text-muted-foreground max-w-2xl">
              Your centralized guide to government and private scholarships in India.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mission */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  India Scholarship Link & Status Tracker is designed to simplify the scholarship discovery process for
                  students across the country. We act as a centralized directory, eliminating the confusion of searching
                  through multiple websites and portals. By providing direct links to official scholarship programs, we
                  empower students to make informed decisions about their educational funding.
                </p>
              </CardContent>
            </Card>

            {/* What We Do */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>What We Do</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Directory of Official Portals</p>
                    <p className="text-sm text-muted-foreground">
                      Curated list of Central, State, and Private scholarship portals in India
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">State-wise Discovery</p>
                    <p className="text-sm text-muted-foreground">
                      Filter scholarships relevant to your state of residence
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Personal Application Tracker</p>
                    <p className="text-sm text-muted-foreground">
                      Keep track of your scholarship applications in one place
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Status & Payment Guidance</p>
                    <p className="text-sm text-muted-foreground">
                      Learn how to check your application status and payment updates
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What We Don't Do */}
            <Card className="mb-8 border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  What We Don't Do
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="flex gap-2">
                  <span className="text-destructive">✕</span>
                  <span>We do NOT collect, store, or process Aadhaar numbers or personal identification data</span>
                </p>
                <p className="flex gap-2">
                  <span className="text-destructive">✕</span>
                  <span>We do NOT fetch live government scholarship records or databases</span>
                </p>
                <p className="flex gap-2">
                  <span className="text-destructive">✕</span>
                  <span>We do NOT manage scholarship applications - all applications happen on official portals</span>
                </p>
                <p className="flex gap-2">
                  <span className="text-destructive">✕</span>
                  <span>We do NOT verify application status - only official portals can provide verification</span>
                </p>
                <p className="flex gap-2">
                  <span className="text-destructive">✕</span>
                  <span>
                    We do NOT handle payments - all payments are from official government/institutional sources
                  </span>
                </p>
              </CardContent>
            </Card>

            {/* Why Use This */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Why Use Scholarship Link?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      <strong>One-Stop Guide:</strong> No need to search multiple websites - all major scholarships in
                      one place
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      <strong>Time-Saving:</strong> Quickly discover and apply for scholarships relevant to you
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      <strong>Secure & Private:</strong> Your personal data is never collected or stored
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      <strong>Direct Links:</strong> Always redirected to official portals - no intermediaries
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      <strong>Free Service:</strong> Completely free to use - no hidden fees or charges
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
