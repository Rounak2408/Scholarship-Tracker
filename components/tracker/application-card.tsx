"use client"

import type { SavedApplication } from "@/lib/tracker-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Calendar } from "lucide-react"

interface ApplicationCardProps {
  application: SavedApplication
  onDelete: (id: string) => void
}

const getStatusColor = (status: SavedApplication["status"]) => {
  switch (status) {
    case "Applied":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "Under Review":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "Accepted":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "Rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case "Withdrawn":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

export function ApplicationCard({ application, onDelete }: ApplicationCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground">{application.portalName}</h3>
              {application.applicationId && (
                <p className="text-sm text-muted-foreground">ID: {application.applicationId}</p>
              )}
            </div>
            <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Applied: {formatDate(application.appliedDate)}
            </div>

            {application.deadline && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Deadline: {formatDate(application.deadline)}
              </div>
            )}

            {application.notes && <p className="text-muted-foreground italic mt-2">{application.notes}</p>}
          </div>

          {/* Delete Button */}
          <div className="pt-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(application.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 w-full"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
