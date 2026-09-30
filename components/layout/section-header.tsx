import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const headerVariants = cva(
  "flex flex-col mb-5 md:mb-6", // Header -> content gap 20/24
  {
    variants: {
      align: {
        left: "items-start text-left",
        center: "items-center text-center mx-auto",
      },
    },
    defaultVariants: {
      align: "center",
    },
  }
)

export interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">, VariantProps<typeof headerVariants> {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  lede?: React.ReactNode
  accentColor?: string
  theme?: 'light' | 'dark'
}

export function SectionHeader({
  className,
  align,
  eyebrow,
  title,
  lede,
  accentColor = "var(--orange-500)",
  theme = 'light',
  ...props
}: SectionHeaderProps) {
  const isDark = theme === 'dark'
  
  return (
    <div className={cn(headerVariants({ align, className }))} {...props}>

      <h2 className={cn(
        "text-[clamp(1.75rem,1.3rem+2vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.015em] mb-2 md:mb-3",
        isDark ? "text-white" : "text-[var(--heading)]"
      )}>
        {title}
      </h2>
      {lede && (
        <p className={cn(
          "text-[clamp(1.0625rem,1rem+0.3vw,1.25rem)] leading-[1.6] max-w-[56ch]",
          isDark ? "text-white/80" : "text-[var(--text-muted)]"
        )}>
          {lede}
        </p>
      )}
    </div>
  )
}
