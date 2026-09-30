"use client";

import { useState } from "react";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { mockFaqs } from "@/data/mock";
import { cn } from "@/lib/utils";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq" bg="white">
      <Container size="narrow">
        <SectionHeader
          align="center"
          eyebrow="FAQ"
          title="Questions? We've got answers."
          accentColor="#6366F1" // Indigo
        />
        
        {mockFaqs.length === 0 ? (
          <div className="text-center py-10 text-sm text-[var(--text-muted)]">
            Frequently asked questions will be published here once added in the admin panel.
          </div>
        ) : (
          <div className="flex flex-col border-t border-[var(--border)] mt-4">
            {mockFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="border-b border-[var(--border)]">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full py-6 flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--focus-ring)] rounded-md"
                    aria-expanded={isOpen}
                  >
                    <span className="text-[18px] font-semibold text-[var(--ink)]">
                      {faq.question}
                    </span>
                    <span className={cn(
                      "ml-4 shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300",
                      isOpen 
                        ? "border-[#6366F1] bg-[#6366F1]/10 text-[#6366F1] rotate-180" 
                        : "border-[var(--gray-300)] text-[var(--text-muted)] hover:border-[var(--gray-400)]"
                    )}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </button>
                  <div 
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      isOpen ? "max-h-[500px] opacity-100 mb-6" : "max-h-0 opacity-0"
                    )}
                  >
                    <p className="text-[16px] text-[var(--text-muted)] leading-relaxed pr-12">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </Section>
  );
}
