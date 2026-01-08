"use client"

import { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { User, MapPin } from "lucide-react"

interface Step1Data {
  fullName: string
  phoneNumber: string
  dateOfBirth: string
  gender: "male" | "female" | "other" | "prefer-not-to-say"
  address: string
  city: string
  state: string
  pincode: string
  country: string
  aadharNumber?: string
}

interface Step1Props {
  form: UseFormReturn<any>
  isViewMode?: boolean
}

export type Step1FormData = {
  fullName: string
  phoneNumber: string
  dateOfBirth: string
  gender: "male" | "female" | "other" | "prefer-not-to-say"
  address: string
  city: string
  state: string
  pincode: string
  country: string
  aadharNumber?: string
}

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
  "Chandigarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Lakshadweep", "Puducherry"
]

export function Step1Personal({ form, isViewMode = false }: Step1Props) {
  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Personal Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              {...form.register("fullName")}
              disabled={isViewMode}
              placeholder="Enter your full name"
            />
            {form.formState.errors.fullName && (
              <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              {...form.register("phoneNumber")}
              disabled={isViewMode}
              placeholder="10-digit phone number"
            />
            {form.formState.errors.phoneNumber && (
              <p className="text-sm text-destructive">{form.formState.errors.phoneNumber.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              {...form.register("dateOfBirth")}
              disabled={isViewMode}
            />
            {form.formState.errors.dateOfBirth && (
              <p className="text-sm text-destructive">{form.formState.errors.dateOfBirth.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select
              onValueChange={(value) => form.setValue("gender", value as any)}
              value={form.watch("gender")}
              disabled={isViewMode}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.gender && (
              <p className="text-sm text-destructive">{form.formState.errors.gender.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="aadharNumber">Aadhar Number</Label>
            <Input
              id="aadharNumber"
              {...form.register("aadharNumber")}
              disabled={isViewMode}
              placeholder="12-digit Aadhar number"
              maxLength={12}
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Address Information</h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              {...form.register("address")}
              disabled={isViewMode}
              placeholder="Enter your complete address"
              rows={3}
            />
            {form.formState.errors.address && (
              <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                {...form.register("city")}
                disabled={isViewMode}
                placeholder="Enter city"
              />
              {form.formState.errors.city && (
                <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Select
                onValueChange={(value) => form.setValue("state", value)}
                value={form.watch("state")}
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {indianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.state && (
                <p className="text-sm text-destructive">{form.formState.errors.state.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                {...form.register("pincode")}
                disabled={isViewMode}
                placeholder="6-digit pincode"
                maxLength={6}
              />
              {form.formState.errors.pincode && (
                <p className="text-sm text-destructive">{form.formState.errors.pincode.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                {...form.register("country")}
                disabled={isViewMode}
                placeholder="Country"
              />
              {form.formState.errors.country && (
                <p className="text-sm text-destructive">{form.formState.errors.country.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

