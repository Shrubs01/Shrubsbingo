"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { mockFaqs } from "@/data/mock";
import { cn } from "@/lib/utils";

export function FaqModal({ children }: { children: React.ReactNode }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Dialog>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold mb-4">FAQ</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col border-t border-[var(--border)] mt-2">
          {mockFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="border-b border-[var(--border)]">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full py-5 flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--focus-ring)] rounded-md"
                  aria-expanded={isOpen}
                >
                  <span className="text-[16px] font-semibold text-[var(--ink)] pr-4">
                    {faq.question}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300",
                      isOpen
                        ? "border-[#6366F1] bg-[#6366F1]/10 text-[#6366F1] rotate-180"
                        : "border-[var(--gray-300)] text-[var(--text-muted)] hover:border-[var(--gray-400)]"
                    )}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-[500px] opacity-100 mb-5" : "max-h-0 opacity-0"
                  )}
                >
                  <p className="text-[15px] text-[var(--text-muted)] leading-relaxed pr-12">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
