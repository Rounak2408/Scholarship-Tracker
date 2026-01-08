"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { scholarshipPortals, getPortalsByState } from "@/lib/scholarship-data"
import { PortalCard } from "@/components/scholarships/portal-card"
import { StateSelector } from "@/components/states/state-selector"
import { stateCapitals } from "@/lib/states-data"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function ByStatePage() {
  const [selectedState, setSelectedState] = useState("ALL")

  const displayedPortals = useMemo(() => getPortalsByState(selectedState), [selectedState])

  const info = useMemo(() => {
    if (selectedState === "ALL") {
      return {
        title: "Central Government Scholarships",
        description: "These scholarships are available to students across all states of India.",
      }
    }

    return {
      title: `${selectedState} Scholarships`,
      description: `Showing scholarships available for ${selectedState} residents. Capital: ${stateCapitals[selectedState]}`,
    }
  }, [selectedState])

  const portalCounts = useMemo(() => ({
    central: scholarshipPortals.filter((p) => p.type === "Central").length,
    state: scholarshipPortals.filter((p) => p.type === "State").length,
    private: scholarshipPortals.filter((p) => p.type === "Private").length,
  }), [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Search by State</h1>
            <p className="text-muted-foreground max-w-2xl">
              Find scholarships available in your state. Select a state to view all applicable programs.
            </p>
          </div>
        </section>

        {/* Selector Section */}
        <section className="bg-background border-b border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-md">
              <StateSelector value={selectedState} onChange={setSelectedState} />
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-background py-8 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>{info.title}:</strong> {info.description}
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Portals Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {displayedPortals.length > 0 ? (
              <>
                <p className="text-muted-foreground mb-6">
                  Found {displayedPortals.length} scholarship portal{displayedPortals.length !== 1 ? "s" : ""} for{" "}
                  {selectedState === "ALL" ? "all states" : selectedState}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedPortals.map((portal) => (
                    <PortalCard key={portal.id} portal={portal} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No scholarships found for the selected state. Please check other states.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* All Portals Summary */}
        <section className="bg-muted border-t border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Total Available Portals</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg p-6 border border-border">
                <p className="text-4xl font-bold text-primary">
                  {portalCounts.central}
                </p>
                <p className="text-muted-foreground mt-2">Central Government Scholarships</p>
              </div>
              <div className="bg-card rounded-lg p-6 border border-border">
                <p className="text-4xl font-bold text-accent">
                  {portalCounts.state}
                </p>
                <p className="text-muted-foreground mt-2">State Government Scholarships</p>
              </div>
              <div className="bg-card rounded-lg p-6 border border-border">
                <p className="text-4xl font-bold">{portalCounts.private}</p>
                <p className="text-muted-foreground mt-2">Private Scholarships</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
