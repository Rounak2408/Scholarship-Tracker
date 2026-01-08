"use client"

import { individualScholarships } from "@/lib/individual-scholarships"
import { ExternalLink, Sparkles } from "lucide-react"
import Link from "next/link"

export function ScrollingNotices() {
  // Get all scholarships including private ones
  const allScholarships = individualScholarships

  // Duplicate items for seamless loop
  const duplicatedScholarships = [...allScholarships, ...allScholarships]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Central":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
      case "State":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
      case "Private":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
      default:
        return "bg-primary/10 text-primary border-primary/20"
    }
  }

  return (
    <section className="bg-gradient-to-br from-card via-card/95 to-card/90 border-2 border-primary/20 rounded-2xl p-6 lg:p-8 xl:p-10 shadow-xl backdrop-blur-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-300 h-full">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-7 lg:mb-8">
          <div className="p-2.5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl shadow-sm">
            <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
          </div>
          <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground">Important Scholarships</h2>
        </div>
        
        <div className="relative h-80 lg:h-[28rem] xl:h-[32rem] overflow-hidden rounded-xl bg-muted/40 backdrop-blur-sm border border-border/50 shadow-inner">
          {/* Enhanced gradient overlays */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-card via-card/90 to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card via-card/90 to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling container */}
          <div className="h-full overflow-hidden">
            <div className="animate-scroll-up space-y-4 lg:space-y-5 px-3 lg:px-4 py-2 lg:py-3">
              {duplicatedScholarships.map((scholarship, index) => (
                <article
                  key={`${scholarship.id}-${index}`}
                  className="flex items-start gap-4 lg:gap-5 p-4 lg:p-5 rounded-xl bg-background/90 backdrop-blur-sm border border-border/60 hover:bg-background hover:border-primary/40 hover:shadow-lg transition-all duration-300 group/item"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <h3 className="font-bold text-sm text-foreground line-clamp-2 group-hover/item:text-primary transition-colors">
                        {scholarship.name}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3.5 leading-relaxed">
                      {scholarship.description}
                    </p>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <a
                        href={scholarship.portalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-semibold transition-all hover:gap-2.5 hover:underline"
                      >
                        Visit Portal
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      {scholarship.state && (
                        <span className="text-xs text-muted-foreground font-medium">• {scholarship.state}</span>
                      )}
                    </div>
                  </div>
                  <span className={`px-3.5 py-2 text-xs font-bold rounded-lg border shadow-sm ${getTypeColor(scholarship.type)} whitespace-nowrap flex-shrink-0 group-hover/item:scale-105 transition-transform`}>
                    {scholarship.type}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-7 lg:mt-8 text-center">
          <Link
            href="/scholarships"
            className="inline-flex items-center gap-2.5 text-sm lg:text-base text-primary hover:text-primary/80 font-semibold transition-all hover:gap-3.5 group/link"
          >
            View All Scholarships
            <span className="text-lg lg:text-xl group-hover/link:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

