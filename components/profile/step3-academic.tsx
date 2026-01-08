"use client"

import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { GraduationCap, Upload, X, FileText } from "lucide-react"
import { uploadMarksheet } from "@/lib/firebase/storage"
import { useToast } from "@/hooks/use-toast"
import { AcademicRecord } from "@/lib/firebase/profile"

interface Step3Props {
  form: UseFormReturn<any>
  isViewMode?: boolean
}

export function Step3Academic({ form, isViewMode = false }: Step3Props) {
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({})
  const { toast } = useToast()

  const academicLevels: Array<"10th" | "12th" | "graduation" | "post-graduation"> = [
    "10th",
    "12th",
    "graduation",
    "post-graduation",
  ]

  const handleFileUpload = async (level: string, file: File) => {
    if (isViewMode) return

    setUploading((prev) => ({ ...prev, [level]: true }))

    try {
      const result = await uploadMarksheet(file, level)
      
      // Update form with marksheet URL
      const academicRecords = form.watch("academicRecords") || []
      const existingIndex = academicRecords.findIndex((r: AcademicRecord) => r.level === level)
      
      const updatedRecord: AcademicRecord = {
        level: level as any,
        boardOrUniversity: academicRecords[existingIndex]?.boardOrUniversity || "",
        institution: academicRecords[existingIndex]?.institution || "",
        yearOfPassing: academicRecords[existingIndex]?.yearOfPassing || "",
        percentageOrCGPA: academicRecords[existingIndex]?.percentageOrCGPA || "",
        marksheetUrl: result.url,
        marksheetFileName: result.fileName,
      }

      if (existingIndex >= 0) {
        academicRecords[existingIndex] = updatedRecord
      } else {
        academicRecords.push(updatedRecord)
      }

      form.setValue("academicRecords", academicRecords)

      toast({
        title: "Marksheet uploaded! ✅",
        description: `${level} marksheet uploaded successfully.`,
      })
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload marksheet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading((prev) => ({ ...prev, [level]: false }))
    }
  }

  const updateAcademicRecord = (level: string, field: string, value: string) => {
    const academicRecords = form.watch("academicRecords") || []
    const existingIndex = academicRecords.findIndex((r: AcademicRecord) => r.level === level)

    const updatedRecord: AcademicRecord = {
      level: level as any,
      boardOrUniversity: field === "boardOrUniversity" ? value : academicRecords[existingIndex]?.boardOrUniversity || "",
      institution: field === "institution" ? value : academicRecords[existingIndex]?.institution || "",
      yearOfPassing: field === "yearOfPassing" ? value : academicRecords[existingIndex]?.yearOfPassing || "",
      percentageOrCGPA: field === "percentageOrCGPA" ? value : academicRecords[existingIndex]?.percentageOrCGPA || "",
      marksheetUrl: academicRecords[existingIndex]?.marksheetUrl,
      marksheetFileName: academicRecords[existingIndex]?.marksheetFileName,
    }

    if (existingIndex >= 0) {
      academicRecords[existingIndex] = updatedRecord
    } else {
      academicRecords.push(updatedRecord)
    }

    form.setValue("academicRecords", academicRecords)
  }

  const getRecordForLevel = (level: string): AcademicRecord | undefined => {
    const academicRecords = form.watch("academicRecords") || []
    return academicRecords.find((r: AcademicRecord) => r.level === level)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-6">
        <GraduationCap className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">Academic History</h3>
      </div>

      {academicLevels.map((level) => {
        const record = getRecordForLevel(level)
        const levelLabel = level.charAt(0).toUpperCase() + level.slice(1)

        return (
          <div key={level} className="space-y-4 p-6 border border-border rounded-lg">
            <h4 className="text-lg font-medium text-foreground">{levelLabel} Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${level}-board`}>Board/University</Label>
                <Input
                  id={`${level}-board`}
                  value={record?.boardOrUniversity || ""}
                  onChange={(e) => updateAcademicRecord(level, "boardOrUniversity", e.target.value)}
                  disabled={isViewMode}
                  placeholder="Board or University name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${level}-institution`}>Institution</Label>
                <Input
                  id={`${level}-institution`}
                  value={record?.institution || ""}
                  onChange={(e) => updateAcademicRecord(level, "institution", e.target.value)}
                  disabled={isViewMode}
                  placeholder="School/College name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${level}-year`}>Year of Passing</Label>
                <Input
                  id={`${level}-year`}
                  type="number"
                  value={record?.yearOfPassing || ""}
                  onChange={(e) => updateAcademicRecord(level, "yearOfPassing", e.target.value)}
                  disabled={isViewMode}
                  placeholder="e.g., 2020"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${level}-percentage`}>Percentage/CGPA</Label>
                <Input
                  id={`${level}-percentage`}
                  value={record?.percentageOrCGPA || ""}
                  onChange={(e) => updateAcademicRecord(level, "percentageOrCGPA", e.target.value)}
                  disabled={isViewMode}
                  placeholder="e.g., 85% or 8.5"
                />
              </div>
            </div>

            {/* Marksheet Upload */}
            <div className="space-y-2">
              <Label>Marksheet Upload</Label>
              {record?.marksheetUrl ? (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm flex-1">{record.marksheetFileName}</span>
                  {!isViewMode && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const academicRecords = form.watch("academicRecords") || []
                        const updated = academicRecords.filter((r: AcademicRecord) => r.level !== level)
                        form.setValue("academicRecords", updated)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ) : (
                <div>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    disabled={isViewMode || uploading[level]}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleFileUpload(level, file)
                      }
                    }}
                    className="hidden"
                    id={`${level}-file`}
                  />
                  <Label
                    htmlFor={`${level}-file`}
                    className="flex items-center gap-2 cursor-pointer p-4 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors"
                  >
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">
                      {uploading[level] ? "Uploading..." : "Click to upload marksheet (PDF, JPG, PNG - Max 5MB)"}
                    </span>
                  </Label>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

