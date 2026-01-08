"use client"

import { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2 } from "lucide-react"

interface Step4Props {
  form: UseFormReturn<any>
  isViewMode?: boolean
}

export function Step4Bank({ form, isViewMode = false }: Step4Props) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">Bank Details</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="accountHolderName">Account Holder Name *</Label>
          <Input
            id="accountHolderName"
            {...form.register("accountHolderName")}
            disabled={isViewMode}
            placeholder="Account holder name"
          />
          {form.formState.errors.accountHolderName && (
            <p className="text-sm text-destructive">{form.formState.errors.accountHolderName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="bankAccountNumber">Bank Account Number *</Label>
          <Input
            id="bankAccountNumber"
            {...form.register("bankAccountNumber")}
            disabled={isViewMode}
            placeholder="Bank account number"
          />
          {form.formState.errors.bankAccountNumber && (
            <p className="text-sm text-destructive">{form.formState.errors.bankAccountNumber.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="bankName">Bank Name *</Label>
          <Input
            id="bankName"
            {...form.register("bankName")}
            disabled={isViewMode}
            placeholder="Bank name"
          />
          {form.formState.errors.bankName && (
            <p className="text-sm text-destructive">{form.formState.errors.bankName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="ifscCode">IFSC Code *</Label>
          <Input
            id="ifscCode"
            {...form.register("ifscCode")}
            disabled={isViewMode}
            placeholder="IFSC code"
            style={{ textTransform: "uppercase" }}
          />
          {form.formState.errors.ifscCode && (
            <p className="text-sm text-destructive">{form.formState.errors.ifscCode.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}

