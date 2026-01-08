"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms of Use</h1>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-invert max-w-none">
            <div className="space-y-6 text-muted-foreground">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">1. Purpose</h2>
                <p>
                  India Scholarship Link & Status Tracker is a free online directory that provides links to official
                  scholarship portals. We are NOT a scholarship provider or application management service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">2. Official Portals Only</h2>
                <p>
                  All scholarship applications and status checks must be done through official government or
                  institutional portals only. Always verify the website URL before providing personal information.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">3. No Aadhaar Collection</h2>
                <p>
                  This platform NEVER collects, stores, or processes Aadhaar numbers or other sensitive personal data.
                  Aadhaar information should only be provided on official government portals.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">4. Personal Responsibility</h2>
                <p>
                  Users are responsible for:
                  <ul className="list-disc pl-5 mt-2">
                    <li>Verifying the authenticity of official portal websites</li>
                    <li>Meeting scholarship eligibility requirements</li>
                    <li>Submitting applications before deadlines</li>
                    <li>Keeping their passwords and credentials confidential</li>
                  </ul>
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">5. Application Tracker Disclaimer</h2>
                <p>
                  The Application Tracker is for personal reference only. It does not connect to official portals and
                  cannot provide real-time status updates. Always check official portals for accurate and current
                  information.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">6. Limitation of Liability</h2>
                <p>
                  We are not responsible for:
                  <ul className="list-disc pl-5 mt-2">
                    <li>Changes or updates to official scholarship portals</li>
                    <li>Application rejections or delays</li>
                    <li>Payment delays or issues</li>
                    <li>Technical issues on external portals</li>
                    <li>Outdated information about scholarships</li>
                  </ul>
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">7. Intellectual Property</h2>
                <p>
                  All content on this website is provided for informational purposes. You may not reproduce, distribute,
                  or modify any content without permission.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">8. Changes to Terms</h2>
                <p>
                  We reserve the right to update these terms at any time. Continued use of the website implies
                  acceptance of any updates.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">9. Disclaimer on Government Content</h2>
                <p>
                  This website is not affiliated with any government agency or official scholarship provider. We are an
                  independent directory service providing links to official resources.
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
