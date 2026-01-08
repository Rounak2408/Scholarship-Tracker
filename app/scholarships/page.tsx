"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { scholarshipPortals, type ScholarshipPortal } from "@/lib/scholarship-data"
import { PortalCard } from "@/components/scholarships/portal-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"

export default function ScholarshipsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<ScholarshipPortal["type"] | "All">("All")

  const filteredPortals = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return scholarshipPortals.filter((portal) => {
      const matchesSearch =
        portal.name.toLowerCase().includes(query) ||
        portal.description.toLowerCase().includes(query) ||
        portal.coveredSchemes.toLowerCase().includes(query)

      const matchesType = filterType === "All" || portal.type === filterType

      return matchesSearch && matchesType
    })
  }, [searchQuery, filterType])

  const portalCounts = useMemo(() => ({
    central: scholarshipPortals.filter((p) => p.type === "Central").length,
    state: scholarshipPortals.filter((p) => p.type === "State").length,
    private: scholarshipPortals.filter((p) => p.type === "Private").length,
    all: scholarshipPortals.length,
  }), [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Scholarship Portal Directory</h1>
            <p className="text-muted-foreground max-w-2xl">
              Browse official Central, State, and Private scholarship portals. Click "Go to Official Portal" to apply or
              check your status.
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="bg-background border-b border-border py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search Box */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search scholarships, schemes, or portals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <Tabs value={filterType} onValueChange={(val) => setFilterType(val as ScholarshipPortal["type"] | "All")}>
              <TabsList className="bg-muted">
                <TabsTrigger value="All">All ({portalCounts.all})</TabsTrigger>
                <TabsTrigger value="Central">Central ({portalCounts.central})</TabsTrigger>
                <TabsTrigger value="State">State ({portalCounts.state})</TabsTrigger>
                <TabsTrigger value="Private">Private ({portalCounts.private})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </section>

        {/* Portals Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredPortals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPortals.map((portal) => (
                  <PortalCard key={portal.id} portal={portal} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">No scholarships found matching your search.</p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
