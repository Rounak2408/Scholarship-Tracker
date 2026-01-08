"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { scholarshipPortals } from "@/lib/scholarship-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { SavedApplication, ApplicationStatus } from "@/lib/tracker-data"
import { Plus } from "lucide-react"

const statusOptions: ApplicationStatus[] = ["Applied", "Under Review", "Accepted", "Rejected", "Withdrawn"]

interface ApplicationFormProps {
  onAddApplication: (app: SavedApplication) => void
}

export function ApplicationForm({ onAddApplication }: ApplicationFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [portalName, setPortalName] = useState("")
  const [applicationId, setApplicationId] = useState("")
  const [status, setStatus] = useState<ApplicationStatus>("Applied")
  const [deadline, setDeadline] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!portalName || !status) {
      alert("Please fill in required fields")
      return
    }

    const newApp: SavedApplication = {
      id: Date.now().toString(),
      portalName,
      applicationId: applicationId || undefined,
      status,
      appliedDate: new Date().toISOString().split("T")[0],
      deadline: deadline || undefined,
      notes: notes || undefined,
    }

    onAddApplication(newApp)

    // Reset form
    setPortalName("")
    setApplicationId("")
    setStatus("Applied")
    setDeadline("")
    setNotes("")
    setIsOpen(false)
  }

  return (
    <div>
      {!isOpen ? (
        <Button onClick={() => setIsOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Scholarship Application
        </Button>
      ) : (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Add New Application</CardTitle>
            <CardDescription>
              Save your scholarship application details for easy tracking. Your data is stored locally.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Scholarship Portal Selection */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Scholarship Portal Name *</label>
                <Select value={portalName} onValueChange={setPortalName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a portal..." />
                  </SelectTrigger>
                  <SelectContent>
                    {scholarshipPortals.map((portal) => (
                      <SelectItem key={portal.id} value={portal.name}>
                        {portal.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Other Portal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Application ID */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Application ID (Optional)</label>
                <Input
                  type="text"
                  placeholder="Enter your application ID for reference"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Keep this for your records - this is NOT verified against official records.
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Current Status *</label>
                <Select value={status} onValueChange={(val) => setStatus(val as ApplicationStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Deadline (Optional)</label>
                <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Personal Notes (Optional)</label>
                <Textarea
                  placeholder="Add any notes about this application..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-24"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Save Application
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
