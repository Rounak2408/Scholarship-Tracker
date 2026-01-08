"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-invert max-w-none">
            <div className="space-y-6 text-muted-foreground">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">1. Data Collection</h2>
                <p>
                  India Scholarship Link does NOT collect, store, or process any personal data including Aadhaar
                  numbers, phone numbers, emails, or identification documents. Your privacy is our priority.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">2. Cookies & Tracking</h2>
                <p>
                  This website may use cookies to improve your browsing experience. These cookies do not identify you
                  personally. You can disable cookies in your browser settings if you prefer.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">3. External Links</h2>
                <p>
                  We provide links to official government and institutional scholarship portals. We are not responsible
                  for the privacy practices of external websites. Please review their privacy policies before providing
                  personal information.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">4. Local Storage</h2>
                <p>
                  The Application Tracker feature uses your browser's local storage to save your applications. This data
                  remains only on your device and is never transmitted to our servers.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">5. Analytics</h2>
                <p>
                  We may use anonymous analytics to understand how visitors use our website and improve our service.
                  This does not include any personally identifiable information.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">6. Changes to This Policy</h2>
                <p>
                  We may update this privacy policy from time to time. Continued use of the website implies acceptance
                  of any updates.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">7. Contact</h2>
                <p>
                  If you have any questions about our privacy practices, please contact us at{" "}
                  <a href="mailto:support@scholarshiplink.in" className="text-primary hover:underline">
                    support@scholarshiplink.in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
