import { Navbar } from "@/components/patterns/navbar";
import { Footer } from "@/components/patterns/footer";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { FAQ } from "@/components/patterns/faq";
import { FinalCta } from "@/components/patterns/final-cta";

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-0">
        
        {/* Page Header */}
        <Section bg="warm" className="border-b border-[var(--border)]">
          <Container size="narrow" className="text-center">
            <h1 className="text-[var(--heading)] text-[2.5rem] md:text-[3.5rem] font-serif font-medium tracking-wide mb-4">
              Got Questions?
            </h1>
            <p className="text-[var(--text-muted)] text-[1.125rem] md:text-[1.25rem] max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about how Shrubs Bingo works, ticketing, and what to expect on the day of the event.
            </p>
          </Container>
        </Section>

        {/* FAQ Content */}
        <div className="py-12 md:py-24 bg-[var(--bg-subtle)]">
          <FAQ />
        </div>

        {/* CTA */}
        <FinalCta />

      </main>
      <Footer />
    </>
  );
}
