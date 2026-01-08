"use client"

import { memo } from "react"
import type { ScholarshipPortal } from "@/lib/scholarship-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

interface PortalCardProps {
  portal: ScholarshipPortal
}

const getBadgeVariant = (type: ScholarshipPortal["type"]) => {
  switch (type) {
    case "Central":
      return "default"
    case "State":
      return "secondary"
    case "Private":
      return "outline"
    default:
      return "default"
  }
}

export const PortalCard = memo(function PortalCard({ portal }: PortalCardProps) {

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-xl">{portal.name}</CardTitle>
            <CardDescription className="mt-1">{portal.description}</CardDescription>
          </div>
          <Badge variant={getBadgeVariant(portal.type)}>{portal.type}</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground mb-1">Covered Schemes:</p>
          <p className="text-sm text-muted-foreground">{portal.coveredSchemes}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground mb-1">Eligibility:</p>
          <p className="text-sm text-muted-foreground">{portal.eligibility}</p>
        </div>

        <div className="mt-auto pt-4 border-t border-border">
          <a href={portal.portalUrl} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button className="w-full gap-2">
              <ExternalLink className="w-4 h-4" />
              Go to Official Portal
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  )
})
