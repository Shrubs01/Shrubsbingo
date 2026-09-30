"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StickyCtaBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past roughly the hero section (100vh)
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-[var(--white)] border-t border-[var(--border)] p-4 shadow-[0_-8px_24px_rgba(15,23,42,0.1)] transition-transform duration-300 ease-in-out md:hidden",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="flex items-center justify-between gap-4 max-w-[480px] mx-auto">
        <div className="flex flex-col">
          <span className="text-[12px] uppercase tracking-[0.12em] font-medium text-[var(--text-muted)]">
            Next Session
          </span>
          <span className="text-[14px] font-semibold text-[var(--ink)]">
            From ₹549/-
          </span>
        </div>
        <Button asChild size="default" className="uppercase px-6 shrink-0">
          <Link href="/sessions">Book spot</Link>
        </Button>
      </div>
    </div>
  );
}
