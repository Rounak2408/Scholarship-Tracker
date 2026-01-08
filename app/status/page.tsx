"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, ExternalLink, CreditCard, Clock, DollarSign, Shield } from "lucide-react"
import Link from "next/link"

export default function StatusPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Track Your Status & Payments</h1>
            <p className="text-muted-foreground max-w-2xl">
              Check your application status and scholarship payment information directly on official portals.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Status Tracking */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Check Application Status</h2>

                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Each scholarship portal has its own status tracking system. Log in with your credentials to check
                      your application status.
                    </AlertDescription>
                  </Alert>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        How to Check Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ol className="space-y-3 text-sm">
                        <li className="flex gap-3">
                          <span className="font-semibold text-primary min-w-6">1</span>
                          <span>Visit the official scholarship portal from our directory</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-semibold text-primary min-w-6">2</span>
                          <span>Log in with your registered email and password</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-semibold text-primary min-w-6">3</span>
                          <span>Navigate to "Application Status" or "Track Application" section</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-semibold text-primary min-w-6">4</span>
                          <span>Enter your application ID or reference number</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-semibold text-primary min-w-6">5</span>
                          <span>View your current status and next steps</span>
                        </li>
                      </ol>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Safety Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        Only use official government portals (.gov.in domains)
                      </p>
                      <p className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        Never share your password or Aadhaar number in emails
                      </p>
                      <p className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        Verify the website URL matches the official portal
                      </p>
                      <p className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        Never pay any fee to check your status
                      </p>
                    </CardContent>
                  </Card>

                  <Link href="/scholarships">
                    <Button className="w-full gap-2">
                      <ExternalLink className="w-4 h-4" />
                      View All Portals
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Payment Tracking */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Payment Status</h2>

                <div className="space-y-4">
                  <Alert>
                    <DollarSign className="h-4 w-4" />
                    <AlertDescription>
                      Scholarship payments are released via PFMS (Public Financial Management System) or Direct Benefit
                      Transfer (DBT). Check with your state/institution for specifics.
                    </AlertDescription>
                  </Alert>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary" />
                        Check Payment Status
                      </CardTitle>
                      <CardDescription>Official payment tracking portals</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="border border-border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">PFMS Portal</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Check the status of scholarship payments released to you through PFMS.
                        </p>
                        <a href="https://pfms.nic.in" target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline" className="gap-2 w-full bg-transparent">
                            <ExternalLink className="w-4 h-4" />
                            Visit PFMS Portal
                          </Button>
                        </a>
                      </div>

                      <div className="border border-border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">State Payment Portals</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Your state may have a dedicated portal for tracking scholarship disbursements.
                        </p>
                        <Link href="/by-state">
                          <Button size="sm" variant="outline" className="gap-2 w-full bg-transparent">
                            <ExternalLink className="w-4 h-4" />
                            Find State Portal
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 text-sm">
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-primary rounded-full"></div>
                            <div className="w-0.5 h-12 bg-border"></div>
                          </div>
                          <div>
                            <p className="font-semibold">Application Approved</p>
                            <p className="text-muted-foreground">Scholarship eligibility confirmed</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-primary rounded-full"></div>
                            <div className="w-0.5 h-12 bg-border"></div>
                          </div>
                          <div>
                            <p className="font-semibold">Payment Generated</p>
                            <p className="text-muted-foreground">Amount finalized by government</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-primary rounded-full"></div>
                            <div className="w-0.5 h-12 bg-border"></div>
                          </div>
                          <div>
                            <p className="font-semibold">Payment Initiated</p>
                            <p className="text-muted-foreground">Transfer sent to your bank account</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-accent rounded-full"></div>
                          </div>
                          <div>
                            <p className="font-semibold">Payment Received</p>
                            <p className="text-muted-foreground">Funds credited to your account</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-12 max-w-4xl">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

              <div className="space-y-4">
                {[
                  {
                    question: "How often should I check my payment status?",
                    answer:
                      "Check your status monthly or after the official notification date for your scholarship program. Payment cycles vary by state and scholarship type.",
                  },
                  {
                    question: "What if my payment is delayed?",
                    answer:
                      "Contact the scholarship portal support team with your application ID. Delays can occur due to bank processing or verification issues.",
                  },
                  {
                    question: "Can I track multiple applications at once?",
                    answer:
                      "Use our Application Tracker to save all your applications in one place for easy reference.",
                  },
                  {
                    question: "How long does payment typically take?",
                    answer:
                      "After approval, payments usually take 2-4 weeks to reach your bank account, though this varies by institution.",
                  },
                ].map((item, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="text-base">{item.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{item.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
