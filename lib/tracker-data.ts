export type ApplicationStatus = "Applied" | "Under Review" | "Accepted" | "Rejected" | "Withdrawn"

export interface SavedApplication {
  id: string
  portalName: string
  applicationId?: string
  status: ApplicationStatus
  appliedDate: string
  deadline?: string
  notes?: string
}
