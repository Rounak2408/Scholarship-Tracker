"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { getCurrentUser } from "@/lib/firebase/auth"
import { StudentProfile } from "@/lib/firebase/profile"
import { getStudentProfile, saveProfileStep, completeProfile } from "@/lib/storage/profile-storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { StepProgress } from "@/components/profile/step-progress"
import { Step1Personal } from "@/components/profile/step1-personal"
import { Step2Parents } from "@/components/profile/step2-parents"
import { Step3Academic } from "@/components/profile/step3-academic"
import { Step4Bank } from "@/components/profile/step4-bank"
import { Step5Declaration } from "@/components/profile/step5-declaration"

// Validation schemas for each step
const step1Schema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").regex(/^[0-9]+$/, "Phone number must contain only digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"], {
    required_error: "Please select a gender",
  }),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Pincode must be 6 digits").max(6, "Pincode must be 6 digits").regex(/^[0-9]+$/, "Pincode must contain only digits"),
  country: z.string().min(2, "Country is required"),
  aadharNumber: z.string().optional(),
})

const step2Schema = z.object({
  fatherName: z.string().min(2, "Father's name is required"),
  fatherOccupation: z.string().optional(),
  fatherPhone: z.string().optional(),
  fatherEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  motherName: z.string().min(2, "Mother's name is required"),
  motherOccupation: z.string().optional(),
  motherPhone: z.string().optional(),
  motherEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  annualFamilyIncome: z.string().optional(),
  category: z.enum(["general", "obc", "sc", "st", "other"]),
})

const step4Schema = z.object({
  accountHolderName: z.string().min(2, "Account holder name is required"),
  bankAccountNumber: z.string().min(5, "Bank account number is required"),
  bankName: z.string().min(2, "Bank name is required"),
  ifscCode: z.string().min(11, "IFSC code must be 11 characters").max(11, "IFSC code must be 11 characters"),
})

const step5Schema = z.object({
  declarationAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the declaration to proceed",
  }),
})

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [isViewMode, setIsViewMode] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Combined schema for all steps
  const fullSchema = z.object({
    // Step 1
    fullName: z.string().optional(),
    phoneNumber: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.enum(["male", "female", "other", "prefer-not-to-say"]).optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    country: z.string().optional(),
    aadharNumber: z.string().optional(),
    // Step 2
    fatherName: z.string().optional(),
    fatherOccupation: z.string().optional(),
    fatherPhone: z.string().optional(),
    fatherEmail: z.string().optional(),
    motherName: z.string().optional(),
    motherOccupation: z.string().optional(),
    motherPhone: z.string().optional(),
    motherEmail: z.string().optional(),
    annualFamilyIncome: z.string().optional(),
    category: z.enum(["general", "obc", "sc", "st", "other"]).optional(),
    // Step 3
    academicRecords: z.array(z.any()).optional(),
    // Step 4
    accountHolderName: z.string().optional(),
    bankAccountNumber: z.string().optional(),
    bankName: z.string().optional(),
    ifscCode: z.string().optional(),
    // Step 5
    declarationAccepted: z.boolean().optional(),
  })

  type FormData = z.infer<typeof fullSchema>

  const form = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      country: "India",
      academicRecords: [],
      declarationAccepted: false,
    } as FormData,
    mode: "onChange",
  })

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      const currentUser = getCurrentUser()
      if (!currentUser) {
        router.push("/auth")
        return
      }

      try {
        const existingProfile = getStudentProfile()
        if (existingProfile) {
          setProfile(existingProfile)
          
          if (existingProfile.isProfileComplete) {
            setIsViewMode(true)
            // Populate form with existing data
            form.reset({
              fullName: existingProfile.fullName,
              phoneNumber: existingProfile.phoneNumber,
              dateOfBirth: existingProfile.dateOfBirth,
              gender: existingProfile.gender,
              address: existingProfile.address,
              city: existingProfile.city,
              state: existingProfile.state,
              pincode: existingProfile.pincode,
              country: existingProfile.country,
              aadharNumber: existingProfile.aadharNumber || "",
              fatherName: existingProfile.parents?.fatherName || "",
              fatherOccupation: existingProfile.parents?.fatherOccupation || "",
              fatherPhone: existingProfile.parents?.fatherPhone || "",
              fatherEmail: existingProfile.parents?.fatherEmail || "",
              motherName: existingProfile.parents?.motherName || "",
              motherOccupation: existingProfile.parents?.motherOccupation || "",
              motherPhone: existingProfile.parents?.motherPhone || "",
              motherEmail: existingProfile.parents?.motherEmail || "",
              annualFamilyIncome: existingProfile.parents?.annualFamilyIncome || "",
              category: existingProfile.parents?.category || "general",
              academicRecords: existingProfile.academicRecords || [],
              accountHolderName: existingProfile.accountHolderName || "",
              bankAccountNumber: existingProfile.bankAccountNumber || "",
              bankName: existingProfile.bankName || "",
              ifscCode: existingProfile.ifscCode || "",
              declarationAccepted: existingProfile.declarationAccepted || false,
            })
            setCurrentStep(5)
          } else {
            // Resume from saved step
            setCurrentStep(existingProfile.currentStep || 1)
            // Load existing data
            if (existingProfile.fullName) {
              form.reset({
                fullName: existingProfile.fullName,
                phoneNumber: existingProfile.phoneNumber,
                dateOfBirth: existingProfile.dateOfBirth,
                gender: existingProfile.gender,
                address: existingProfile.address,
                city: existingProfile.city,
                state: existingProfile.state,
                pincode: existingProfile.pincode,
                country: existingProfile.country,
                aadharNumber: existingProfile.aadharNumber || "",
                fatherName: existingProfile.parents?.fatherName || "",
                fatherOccupation: existingProfile.parents?.fatherOccupation || "",
                fatherPhone: existingProfile.parents?.fatherPhone || "",
                fatherEmail: existingProfile.parents?.fatherEmail || "",
                motherName: existingProfile.parents?.motherName || "",
                motherOccupation: existingProfile.parents?.motherOccupation || "",
                motherPhone: existingProfile.parents?.motherPhone || "",
                motherEmail: existingProfile.parents?.motherEmail || "",
                annualFamilyIncome: existingProfile.parents?.annualFamilyIncome || "",
                category: existingProfile.parents?.category || "general",
                academicRecords: existingProfile.academicRecords || [],
                accountHolderName: existingProfile.accountHolderName || "",
                bankAccountNumber: existingProfile.bankAccountNumber || "",
                bankName: existingProfile.bankName || "",
                ifscCode: existingProfile.ifscCode || "",
                declarationAccepted: existingProfile.declarationAccepted || false,
              })
            }
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndProfile()
  }, [router, form, toast])

  const validateStep = async (step: number): Promise<boolean> => {
    let isValid = true
    const formData = form.getValues()

    if (step === 1) {
      const result = step1Schema.safeParse(formData)
      if (!result.success) {
        result.error.errors.forEach((err) => {
          form.setError(err.path[0] as any, { message: err.message })
        })
        isValid = false
      }
    } else if (step === 2) {
      const result = step2Schema.safeParse(formData)
      if (!result.success) {
        result.error.errors.forEach((err) => {
          form.setError(err.path[0] as any, { message: err.message })
        })
        isValid = false
      }
    } else if (step === 4) {
      const result = step4Schema.safeParse(formData)
      if (!result.success) {
        result.error.errors.forEach((err) => {
          form.setError(err.path[0] as any, { message: err.message })
        })
        isValid = false
      }
    } else if (step === 5) {
      const result = step5Schema.safeParse(formData)
      if (!result.success) {
        result.error.errors.forEach((err) => {
          form.setError(err.path[0] as any, { message: err.message })
        })
        isValid = false
      }
    }

    return isValid
  }

  const handleNext = async () => {
    // Validate current step
    const isValid = await validateStep(currentStep)
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      })
      return
    }

    // Optimistic UI: move to next step immediately, save in background
    setSaving(true)

    const formData = form.getValues()

    // Prepare step data based on current step
    let stepData: any = {}

    if (currentStep === 1) {
      stepData = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
        aadharNumber: formData.aadharNumber,
      }
    } else if (currentStep === 2) {
      stepData = {
        parents: {
          fatherName: formData.fatherName,
          fatherOccupation: formData.fatherOccupation,
          fatherPhone: formData.fatherPhone,
          fatherEmail: formData.fatherEmail,
          motherName: formData.motherName,
          motherOccupation: formData.motherOccupation,
          motherPhone: formData.motherPhone,
          motherEmail: formData.motherEmail,
          annualFamilyIncome: formData.annualFamilyIncome,
          category: formData.category,
        },
      }
    } else if (currentStep === 3) {
      stepData = {
        academicRecords: formData.academicRecords || [],
      }
    } else if (currentStep === 4) {
      stepData = {
        accountHolderName: formData.accountHolderName,
        bankAccountNumber: formData.bankAccountNumber,
        bankName: formData.bankName,
        ifscCode: formData.ifscCode,
      }
    } else if (currentStep === 5) {
      stepData = {
        declarationAccepted: formData.declarationAccepted,
        declarationDate: new Date().toISOString(),
      }
    }

    const nextStep = currentStep + 1

    // Optimistic UI: move ahead immediately (except final step)
    if (currentStep < 5) {
      setCurrentStep(nextStep)
      form.clearErrors()
    }

    // Save instantly to localStorage (no network delay!)
    try {
      saveProfileStep(stepData, currentStep)
      
      toast({
        title: "Saved! ✅",
        description: `Step ${currentStep} saved instantly.`,
      })
      
      // If last step, complete profile
      if (currentStep === 5) {
        completeProfile()
        toast({
          title: "Profile completed! 🎉",
          description: "Your profile has been saved successfully.",
        })
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      }
    } catch (error: any) {
      console.error("Error saving profile step:", error)
      toast({
        title: "Save Error",
        description: error.message || "Failed to save. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
      form.clearErrors()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-6 px-4 lg:py-4">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl">
                  {isViewMode ? "Student Profile" : "Complete Your Profile"}
                </CardTitle>
                <CardDescription className="mt-2">
                  {isViewMode
                    ? "View your profile information"
                    : "Please complete all steps. Your progress will be saved after each step."}
                </CardDescription>
              </div>
              {isViewMode && (
                <Button variant="outline" onClick={() => router.push("/dashboard")}>
                  Back to Dashboard
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Step Progress Indicator */}
            {!isViewMode && <StepProgress currentStep={currentStep} totalSteps={5} />}

            {/* Step Content */}
            <form className="space-y-6 mt-8">
              {currentStep === 1 && <Step1Personal form={form} isViewMode={isViewMode} />}
              {currentStep === 2 && <Step2Parents form={form} isViewMode={isViewMode} />}
              {currentStep === 3 && <Step3Academic form={form} isViewMode={isViewMode} />}
              {currentStep === 4 && <Step4Bank form={form} isViewMode={isViewMode} />}
              {currentStep === 5 && <Step5Declaration form={form} isViewMode={isViewMode} />}

              {/* Navigation Buttons */}
              {!isViewMode && (
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1 || saving}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={saving}
                    size="lg"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : currentStep === 5 ? (
                      "Complete Profile"
                    ) : (
                      <>
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
