import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const sectionVariants = cva(
  "w-full transition-colors",
  {
    variants: {
      bg: {
        white: "bg-[var(--bg)]",
        subtle: "bg-[var(--bg-subtle)]",
        tint: "bg-[var(--bg-tint)]",
        warm: "bg-[var(--bg-warm)]",
        dark: "bg-[var(--bg-brand-dark)] text-[var(--text-on-dark)]",
      },
      padding: {
        default: "py-4 md:py-6 lg:py-8", // 16px, 24px, 32px
        large: "py-6 md:py-8 lg:py-10", // 24px, 32px, 40px
        none: "py-0",
      },
    },
    defaultVariants: {
      bg: "white",
      padding: "default",
    },
  }
)

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: React.ElementType
}

export function Section({ 
  className, 
  bg, 
  padding, 
  as: Component = "section", 
  ...props 
}: SectionProps) {
  return (
    <Component
      className={cn(sectionVariants({ bg, padding, className }))}
      {...props}
    />
  )
}
