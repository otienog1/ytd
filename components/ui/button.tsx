import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E74C3C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a] disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-[#E74C3C] text-white hover:bg-[#c0392b] shadow-lg shadow-[#E74C3C]/20 hover:shadow-xl hover:shadow-[#E74C3C]/30",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        outline:
          "border-2 border-[#E74C3C] bg-transparent text-[#E74C3C] hover:bg-[#E74C3C] hover:text-white",
        secondary:
          "bg-[#2d2d2d] text-white hover:bg-[#3d3d3d]",
        ghost: "hover:bg-[#2d2d2d] hover:text-white text-gray-300",
        link: "text-[#E74C3C] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4",
        lg: "h-14 px-10 text-base",
        icon: "h-11 w-11",
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
