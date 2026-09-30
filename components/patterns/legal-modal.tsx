"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { mockLegalDocs } from "@/data/mock";
import { Button } from "@/components/ui/button";

interface LegalModalProps {
  docType: "privacyPolicy" | "termsAndConditions";
  children: React.ReactNode;
}

export function LegalModal({ docType, children }: LegalModalProps) {
  const [open, setOpen] = useState(false);
  const doc = mockLegalDocs[docType];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-white rounded-[16px] border border-[var(--border)] shadow-xl">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-[var(--border)] bg-[#FAFBF9]">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--orange-600)]">
                Shrubs Bingo • Official Policy
              </span>
            </div>
            <DialogTitle className="text-2xl md:text-3xl font-serif font-bold text-[var(--heading)]">
              {doc.title}
            </DialogTitle>
            <p className="text-xs text-[var(--text-muted)] font-medium mt-1">
              Last updated: {doc.lastUpdated} • Applies to all attendees &amp; sessions
            </p>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 text-[0.9375rem] text-[var(--ink)] leading-relaxed">
          {doc.content.split("\n\n").map((paragraph, index) => {
            // Check if paragraph is a numbered section heading or bullet point
            const isHeading = /^\d+\.\s/.test(paragraph);
            
            if (isHeading) {
              const lines = paragraph.split("\n");
              const headingText = lines[0];
              const bodyLines = lines.slice(1);
              
              return (
                <div key={index} className="pt-2">
                  <h4 className="font-bold text-[1.0625rem] text-[#1C3B27] mb-2">
                    {headingText}
                  </h4>
                  {bodyLines.map((line, lIdx) => (
                    <p key={lIdx} className="text-[var(--text-muted)] leading-relaxed mb-2 last:mb-0">
                      {line}
                    </p>
                  ))}
                </div>
              );
            }

            return (
              <p key={index} className="text-[var(--text-muted)] leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 md:px-8 border-t border-[var(--border)] bg-gray-50 flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">
            Questions? Contact <a href="mailto:hello@shrubsbingo.com" className="text-[var(--orange-600)] hover:underline font-semibold">hello@shrubsbingo.com</a>
          </span>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-[8px]"
          >
            I Understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
