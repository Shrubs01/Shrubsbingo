import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const containerVariants = cva(
  "mx-auto w-full px-[20px] sm:px-[32px] lg:px-[48px]",
  {
    variants: {
      size: {
        default: "max-w-[1280px]",
        narrow: "max-w-[720px]",
        form: "max-w-[560px]",
        sheet: "max-w-[480px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export function Container({ className, size, ...props }: ContainerProps) {
  return (
    <div
      className={cn(containerVariants({ size, className }))}
      {...props}
    />
  )
}
