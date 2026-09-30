"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-[var(--border)]"
          : "bg-transparent"
      )}
    >
      <Container className="h-20 flex items-center justify-between">
        <Link href="/" className="z-50 shrink-0 flex items-center">
          <img
            src="/meenu-logo.png"
            alt="Shrubs Bingo Logo"
            className="h-8 md:h-9 w-auto object-contain"
          />
        </Link>

        {/* Right Side Container */}
        <div className="flex items-center gap-6 lg:gap-8 z-50">
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium">
            <Link href="/sessions" className={cn("transition-colors", isScrolled ? "text-neutral-700 hover:text-ink" : "text-neutral-700 hover:text-ink")}>
              Sessions
            </Link>
            <Link href="/quiz" className={cn("transition-colors", isScrolled ? "text-neutral-700 hover:text-ink" : "text-neutral-700 hover:text-ink")}>
              Plant quiz
            </Link>
          </nav>



          <button
            type="button"
            className="lg:hidden p-2 -mr-2 flex flex-col justify-center items-center gap-1.5 w-10 h-10"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span
              className={cn(
                "block w-5 h-0.5 bg-ink transition-transform duration-300 ease-in-out",
                isMenuOpen ? "translate-y-2 rotate-45" : ""
              )}
            />
            <span
              className={cn(
                "block w-5 h-0.5 bg-ink transition-transform duration-300 ease-in-out",
                isMenuOpen ? "-translate-y-2 -rotate-45" : ""
              )}
            />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={cn(
            "fixed inset-0 bg-white/95 backdrop-blur-xl z-40 lg:hidden flex flex-col items-center justify-center transition-all duration-500 ease-in-out",
            isMenuOpen
              ? "opacity-100 pointer-events-auto translate-y-0"
              : "opacity-0 pointer-events-none -translate-y-full"
          )}
        >
          <nav className="flex flex-col items-center gap-8 text-2xl font-semibold text-ink">
            <Link href="/sessions" onClick={() => setIsMenuOpen(false)}>
              Sessions
            </Link>
            <Link href="/quiz" onClick={() => setIsMenuOpen(false)}>
              Plant quiz
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}
