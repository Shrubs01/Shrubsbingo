import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-[12px] text-[15px] font-[600] tracking-[0.01em] transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none whitespace-nowrap",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--orange-500)] text-[var(--ink)] hover:bg-[var(--orange-600)] active:bg-[var(--orange-700)] active:text-[var(--white)] disabled:bg-[#FDBA74]",
        secondary:
          "bg-[var(--green-600)] text-[var(--white)] hover:bg-[var(--green-700)] active:bg-[var(--green-800)] disabled:bg-[var(--green-300)] disabled:text-[var(--green-900)]",
        outline:
          "border border-[var(--green-500)] bg-transparent text-[var(--green-900)] hover:bg-[var(--green-100)] active:bg-[var(--green-200)] disabled:bg-[var(--green-100)]",
        ghost:
          "bg-white/72 backdrop-blur-[4px] border border-white text-[var(--ink)] hover:bg-white/88 active:bg-white disabled:bg-white/50",
        destructive:
          "bg-[#DC2626] text-[var(--white)] hover:bg-[#B91C1C] active:bg-[#991B1B] disabled:bg-[#FCA5A5]",
        link: 
          "text-[var(--orange-700)] underline underline-offset-4 hover:text-[var(--orange-800)] active:text-[var(--orange-900)] disabled:text-[var(--orange-300)] h-auto p-0",
      },
      size: {
        default: "h-[44px] px-5",
        sm: "h-[36px] px-4 text-[14px]",
        lg: "h-[52px] px-6 text-[16px]",
        icon: "h-[44px] w-[44px]",
      },
      fullWidth: {
        true: "w-full",
      }
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
  ({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
