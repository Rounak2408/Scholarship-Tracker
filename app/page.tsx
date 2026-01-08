import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { ScrollingNotices } from "@/components/notices/scrolling-notices"
import { ScholarshipStats } from "@/components/notices/scholarship-stats"
import { Search, TrendingUp, Shield, Globe, GraduationCap, BookOpen, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left side - Text content */}
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-balance">
                  All Government & Private Scholarships
                </h1>
                <p className="text-lg md:text-xl opacity-95 mb-8 text-balance">
                  Apply and track scholarships only through official portals. This platform acts as a guide and
                  redirection service.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/scholarships">
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
                      <Search className="w-5 h-5 mr-2" />
                      Find Scholarships
                    </Button>
                  </Link>
                  <Link href="/tracker">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto bg-transparent"
                    >
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Track Status
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right side - Image */}
              <div className="relative hidden lg:block">
                <div className="relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
                  <Image
                    src="https://newhorizonindia.edu/wp-content/uploads/2025/10/download-15-1024x683.png"
                    alt="Students studying and learning - Scholarship opportunities"
                    fill
                    className="object-cover rounded-2xl shadow-2xl"
                    priority
                    sizes="(max-width: 1024px) 0vw, 50vw"
                  />
                  {/* Overlay gradient for better text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Important Scholarships Notices Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Scholarship Hub
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Explore comprehensive statistics and discover important scholarship opportunities
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
              {/* Left side - Statistics and Quick Actions */}
              <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-7">
                <ScholarshipStats />
              </div>
              
              {/* Right side - Scrolling Notices */}
              <div className="lg:col-span-8">
                <ScrollingNotices />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How It Works</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              We simplify the scholarship search process by providing direct links to official portals.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Globe className="w-8 h-8" />,
                  title: "Browse Official Portals",
                  description: "Find links to all Central, State, and Private scholarship portals in one place.",
                },
                {
                  icon: <Search className="w-8 h-8" />,
                  title: "Search by State",
                  description: "Filter scholarships by your state to find programs most relevant to you.",
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Official & Secure",
                  description: "All applications and verification happen on official government portals only.",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="text-primary mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to explore scholarships?</h2>
            <p className="text-muted-foreground mb-8">
              Start your journey by browsing available scholarships or checking your application status.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/scholarships">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse All Scholarships
                </Button>
              </Link>
              <Link href="/by-state">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Search by State
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
