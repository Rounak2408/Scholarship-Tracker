"use client"

import { UseFormReturn } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { FileCheck } from "lucide-react"

interface Step5Props {
  form: UseFormReturn<any>
  isViewMode?: boolean
}

const declarationText = `I hereby declare that:

1. All the information provided by me in this application is true, correct, and complete to the best of my knowledge and belief.

2. I understand that any false or misleading information provided may result in the rejection of my application or cancellation of any scholarship awarded.

3. I have read and understood all the terms and conditions related to the scholarship application process.

4. I agree to provide any additional documents or information as and when required by the scholarship authorities.

5. I understand that the decision of the scholarship committee will be final and binding.

6. I authorize the scholarship authorities to verify the information provided by me through any means they deem appropriate.`

export function Step5Declaration({ form, isViewMode = false }: Step5Props) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-6">
        <FileCheck className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">Declaration</h3>
      </div>

      <div className="space-y-6">
        <div className="p-6 bg-muted rounded-lg border border-border">
          <Textarea
            value={declarationText}
            readOnly
            rows={12}
            className="resize-none bg-background"
          />
        </div>

        <div className="flex items-start gap-3 p-4 border border-border rounded-lg">
          <Checkbox
            id="declaration"
            checked={form.watch("declarationAccepted") || false}
            onCheckedChange={(checked) => {
              form.setValue("declarationAccepted", checked === true)
              if (checked) {
                form.setValue("declarationDate", new Date().toISOString())
              }
            }}
            disabled={isViewMode}
            className="mt-1"
          />
          <Label
            htmlFor="declaration"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            I have read and understood the above declaration. I accept all the terms and conditions mentioned above. *
          </Label>
        </div>

        {form.formState.errors.declarationAccepted && (
          <p className="text-sm text-destructive">
            {form.formState.errors.declarationAccepted.message}
          </p>
        )}
      </div>
    </div>
  )
}

