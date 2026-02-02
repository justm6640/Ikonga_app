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
        // Charter: Primary (filled) - coral bg, black text
        default:
          "bg-ikonga-coral text-black shadow-form hover:bg-ikonga-pink-accent border-0 rounded-button",
        // Charter: Outline - coral border, rounded-full
        outline:
          "border-2 border-ikonga-coral text-ikonga-coral bg-transparent hover:bg-ikonga-pink-accent hover:text-black hover:border-ikonga-pink-accent rounded-pill",
        // Ghost variant for subtle actions
        ghost: "hover:bg-slate-light hover:text-slate-dark",
        // Destructive (keep standard)
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 rounded-button",
        // Secondary (using charter colors)
        secondary:
          "bg-slate-light text-slate-dark shadow-sm hover:bg-slate-border rounded-button",
        // Link variant
        link: "text-ikonga-coral underline-offset-4 hover:underline hover:text-ikonga-pink-accent",
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
