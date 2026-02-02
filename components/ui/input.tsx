import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // IKONGA Charter: Form input styles
          "w-full h-10 px-4 py-3 rounded-form",
          "font-sans text-base font-normal leading-[24px]",
          "border border-slate-border bg-slate-light",
          "text-[#475569] placeholder:text-[#9CA3AF]",
          "shadow-form",
          "transition-colors",
          "focus:border-focus-blue focus:outline-none focus:shadow-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
