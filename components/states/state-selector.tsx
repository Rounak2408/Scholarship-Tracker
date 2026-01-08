"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { indianStates } from "@/lib/states-data"

interface StateSelectorProps {
  value: string
  onChange: (state: string) => void
}

export function StateSelector({ value, onChange }: StateSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-foreground mb-2">Select Your State</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose your state..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All States (Central Scholarships)</SelectItem>
          {indianStates.map((state) => (
            <SelectItem key={state} value={state}>
              {state}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
