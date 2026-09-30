import { Navbar } from "@/components/patterns/navbar";
import { Footer } from "@/components/patterns/footer";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { mockLegalDocs } from "@/data/mock";
import Link from "next/link";

export default function TermsPage() {
  const doc = mockLegalDocs.termsAndConditions;

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16 bg-[#FAFBF9]">
        <Section bg="subtle" className="border-b border-[var(--border)] py-12 md:py-16">
          <Container size="narrow">
            <div className="mb-4">
              <Link href="/" className="text-xs uppercase tracking-wider font-bold text-[var(--orange-600)] hover:underline">
                ← Back to Home
              </Link>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[var(--heading)] mb-3">
              {doc.title}
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Last updated: {doc.lastUpdated} • Shrubs Bingo Official Agreement
            </p>
          </Container>
        </Section>

        <Section bg="white" className="py-12 md:py-16">
          <Container size="narrow">
            <div className="bg-white rounded-[16px] border border-[var(--border)] p-6 md:p-12 shadow-sm space-y-6 text-[0.95rem] text-[var(--ink)] leading-relaxed">
              {doc.content.split("\n\n").map((paragraph, index) => {
                const isHeading = /^\d+\.\s/.test(paragraph);
                if (isHeading) {
                  const lines = paragraph.split("\n");
                  const headingText = lines[0];
                  const bodyLines = lines.slice(1);
                  return (
                    <div key={index} className="pt-4 border-t border-gray-100 first:border-0 first:pt-0">
                      <h2 className="text-xl font-bold text-[#1C3B27] mb-3">
                        {headingText}
                      </h2>
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
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
