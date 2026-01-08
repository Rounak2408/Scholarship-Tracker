"use client"

import { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users } from "lucide-react"

interface Step2Props {
  form: UseFormReturn<any>
  isViewMode?: boolean
}

export function Step2Parents({ form, isViewMode = false }: Step2Props) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">Parents Information</h3>
      </div>

      {/* Father's Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-foreground">Father's Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fatherName">Father's Name *</Label>
            <Input
              id="fatherName"
              {...form.register("fatherName")}
              disabled={isViewMode}
              placeholder="Father's full name"
            />
            {form.formState.errors.fatherName && (
              <p className="text-sm text-destructive">{form.formState.errors.fatherName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="fatherOccupation">Father's Occupation</Label>
            <Input
              id="fatherOccupation"
              {...form.register("fatherOccupation")}
              disabled={isViewMode}
              placeholder="Occupation"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fatherPhone">Father's Phone</Label>
            <Input
              id="fatherPhone"
              {...form.register("fatherPhone")}
              disabled={isViewMode}
              placeholder="Phone number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fatherEmail">Father's Email</Label>
            <Input
              id="fatherEmail"
              type="email"
              {...form.register("fatherEmail")}
              disabled={isViewMode}
              placeholder="Email address"
            />
          </div>
        </div>
      </div>

      {/* Mother's Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-foreground">Mother's Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="motherName">Mother's Name *</Label>
            <Input
              id="motherName"
              {...form.register("motherName")}
              disabled={isViewMode}
              placeholder="Mother's full name"
            />
            {form.formState.errors.motherName && (
              <p className="text-sm text-destructive">{form.formState.errors.motherName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="motherOccupation">Mother's Occupation</Label>
            <Input
              id="motherOccupation"
              {...form.register("motherOccupation")}
              disabled={isViewMode}
              placeholder="Occupation"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="motherPhone">Mother's Phone</Label>
            <Input
              id="motherPhone"
              {...form.register("motherPhone")}
              disabled={isViewMode}
              placeholder="Phone number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="motherEmail">Mother's Email</Label>
            <Input
              id="motherEmail"
              type="email"
              {...form.register("motherEmail")}
              disabled={isViewMode}
              placeholder="Email address"
            />
          </div>
        </div>
      </div>

      {/* Family Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-foreground">Family Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="annualFamilyIncome">Annual Family Income</Label>
            <Input
              id="annualFamilyIncome"
              {...form.register("annualFamilyIncome")}
              disabled={isViewMode}
              placeholder="e.g., ₹5,00,000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              onValueChange={(value) => form.setValue("category", value as any)}
              value={form.watch("category")}
              disabled={isViewMode}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="obc">OBC</SelectItem>
                <SelectItem value="sc">SC</SelectItem>
                <SelectItem value="st">ST</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.category && (
              <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

