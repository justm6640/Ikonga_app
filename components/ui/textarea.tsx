import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        // IKONGA Charter: Textarea styles (similar to input)
        "flex min-h-[60px] w-full px-4 py-3 rounded-form",
        "font-sans text-base font-normal leading-[24px]",
        "border border-slate-border bg-slate-light",
        "text-[#475569] placeholder:text-[#9CA3AF]",
        "shadow-form",
        "transition-colors",
        "focus:border-focus-blue focus:outline-none focus:shadow-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
