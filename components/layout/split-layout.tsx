import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const splitLayoutVariants = cva(
  "grid grid-cols-1 items-center gap-8 md:gap-10 lg:gap-12",
  {
    variants: {
      ratio: {
        "5/7": "lg:grid-cols-12", // We use col-span-5 and col-span-7 on children
        "6/6": "lg:grid-cols-2",
      },
      reverseOnMobile: {
        true: "", // handled by flex-col-reverse if flex, or dense grid if needed. We'll handle via child classes.
        false: "",
      }
    },
    defaultVariants: {
      ratio: "5/7",
      reverseOnMobile: false,
    },
  }
)

export interface SplitLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "content">, VariantProps<typeof splitLayoutVariants> {
  media: React.ReactNode
  content: React.ReactNode
  mediaPosition?: "left" | "right"
}

export function SplitLayout({
  className,
  ratio,
  reverseOnMobile,
  media,
  content,
  mediaPosition = "left",
  ...props
}: SplitLayoutProps) {
  const is57 = ratio === "5/7"
  
  const mediaColClass = is57 
    ? (mediaPosition === "left" ? "lg:col-span-5" : "lg:col-span-7") 
    : ""
    
  const contentColClass = is57 
    ? (mediaPosition === "left" ? "lg:col-span-7" : "lg:col-span-5") 
    : ""

  return (
    <div className={cn(splitLayoutVariants({ ratio, reverseOnMobile, className }))} {...props}>
      <div className={cn(
        mediaColClass, 
        reverseOnMobile ? "order-1 lg:order-none" : "order-2 lg:order-none",
        mediaPosition === "right" ? "lg:order-2" : "lg:order-1"
      )}>
        {media}
      </div>
      <div className={cn(
        contentColClass,
        reverseOnMobile ? "order-2 lg:order-none" : "order-1 lg:order-none",
        mediaPosition === "right" ? "lg:order-1" : "lg:order-2"
      )}>
        {content}
      </div>
    </div>
  )
}
