import { Navbar } from "@/components/patterns/navbar";
import { Footer } from "@/components/patterns/footer";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Quiz } from "@/components/patterns/quiz";

export default function QuizPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        
        {/* Intro Section */}
        <Section bg="tint" className="border-b border-[var(--green-200)] pb-0 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--green-300)] opacity-20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 -left-12 w-48 h-48 bg-[var(--orange-300)] opacity-10 rounded-full blur-2xl pointer-events-none" />
          
          <Container size="narrow" className="text-center relative z-10 pt-8 pb-4">
            <div className="inline-block bg-[var(--green-100)] text-[var(--green-800)] text-[0.75rem] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-6">
              Personality Test
            </div>
            <h1 className="text-[var(--heading)] text-[2.5rem] md:text-[4rem] font-serif font-medium tracking-wide mb-4 leading-tight">
              Which Houseplant<br className="hidden md:block" /> Are You?
            </h1>
            <p className="text-[var(--text-muted)] text-[1.125rem] md:text-[1.25rem] max-w-xl mx-auto leading-relaxed mb-8">
              Take our quick, fun personality quiz to discover your botanical spirit animal. Are you low-maintenance like a Snake Plant, or dramatic like a Calathea?
            </p>
          </Container>
        </Section>

        {/* The Quiz Component */}
        <div className="bg-[var(--bg-subtle)] pb-24">
          <Quiz />
        </div>

      </main>
      <Footer />
    </>
  );
}
