import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // IKONGA Charter: Base button styles
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans font-medium transition-colors focus-visible:outline-dotted focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Lifestyle: Primary CTA with Gradient & Premium Shadow
        default:
          "bg-ikonga-gradient text-white shadow-premium hover:shadow-premium-hover hover:scale-[1.02] active:scale-[0.98] border-0 rounded-button transition-all duration-300",
        // Lifestyle: Secondary with soft Gradient look or Brand color
        secondary:
          "bg-ikonga-gradient opacity-90 text-white shadow-md hover:opacity-100 hover:scale-[1.02] active:scale-[0.98] rounded-button transition-all duration-300",
        // Lifestyle: Outline with Dark Slate
        outline:
          "border-2 border-ikonga-dark text-ikonga-dark bg-transparent hover:bg-ikonga-dark hover:text-white rounded-button transition-all duration-300",
        // Ghost variant for subtle actions
        ghost: "hover:bg-ikonga-lilac hover:text-ikonga-dark rounded-button",
        // Destructive
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 rounded-button",
        // Link variant
        link: "text-ikonga-orange underline-offset-4 hover:underline",
      },
      size: {
        // Charter: Desktop padding - 15px 30px
        default: "h-auto px-[30px] py-[15px] text-base leading-[1em]",
        // Charter: Tablet padding - 14px 28px (≤921px)
        tablet: "h-auto px-[28px] py-[14px] text-base leading-[1em]",
        // Charter: Mobile padding - 12px 24px (≤544px)
        mobile: "h-auto px-[24px] py-[12px] text-base leading-[1em]",
        // Small size for compact UIs
        sm: "h-auto px-4 py-2 text-sm",
        // Icon button
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
