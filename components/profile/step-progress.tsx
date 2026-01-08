"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepProgressProps {
  currentStep: number
  totalSteps?: number
}

const steps = [
  { number: 1, label: "Personal & Address", icon: "👤" },
  { number: 2, label: "Parents Details", icon: "👨‍👩‍👧‍👦" },
  { number: 3, label: "Academic History", icon: "🎓" },
  { number: 4, label: "Bank Details", icon: "🏦" },
  { number: 5, label: "Declaration", icon: "✅" },
]

export function StepProgress({ currentStep, totalSteps = 5 }: StepProgressProps) {
  return (
    <div className="w-full py-8">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-border">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` } as React.CSSProperties}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = step.number < currentStep
            const isCurrent = step.number === currentStep
            const isPending = step.number > currentStep

            return (
              <div key={step.number} className="flex flex-col items-center flex-1">
                {/* Step Circle */}
                <div
                  className={cn(
                    "relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    isCompleted && "bg-primary border-primary text-primary-foreground",
                    isCurrent && "bg-primary border-primary text-primary-foreground scale-110 shadow-lg",
                    isPending && "bg-background border-border text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span className="text-lg">{step.icon}</span>
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-3 text-center">
                  <p
                    className={cn(
                      "text-xs font-medium",
                      isCurrent && "text-primary font-semibold",
                      isPending && "text-muted-foreground"
                    )}
                  >
                    Step {step.number}
                  </p>
                  <p
                    className={cn(
                      "text-xs mt-1 max-w-[100px]",
                      isCurrent && "text-foreground font-medium",
                      isPending && "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

