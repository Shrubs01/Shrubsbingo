import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import Link from "next/link";

export function FinalCta() {
  return (
    <Section id="book" bg="warm" padding="none" className="py-2.5 md:py-3 overflow-hidden">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
          
          {/* Left Side: Content */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left py-2">
            <h2 
              className="text-[var(--heading)] text-[1.875rem] md:text-[2.25rem] font-serif font-medium tracking-wide mb-3 leading-tight" 
              style={{ fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif" }}
            >
              Ready to play?
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link 
                href="/sessions"
                className="w-full sm:w-auto px-6 py-2.5 bg-[var(--orange-500)] text-white text-[0.8125rem] font-bold tracking-wider uppercase transition-colors hover:bg-[var(--orange-600)] text-center min-w-[150px] rounded-[6px] shadow-sm"
              >
                Book Your Spot
              </Link>
              <Link 
                href="/quiz"
                className="w-full sm:w-auto px-6 py-2.5 bg-transparent border-2 border-[var(--orange-500)] text-[var(--orange-700)] text-[0.8125rem] font-bold tracking-wider uppercase transition-colors hover:bg-[var(--orange-50)] text-center min-w-[150px] rounded-[6px]"
              >
                Plant Quiz
              </Link>
            </div>
          </div>

          {/* Right Side: Vector Image */}
          <div className="flex justify-center md:justify-end shrink-0">
            <div className="h-[150px] sm:h-[180px] md:h-[210px] lg:h-[230px] w-auto flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Meeting-bro.svg"
                alt="Friends meeting and playing bingo"
                className="h-full w-auto object-contain drop-shadow-sm"
              />
            </div>
          </div>

        </div>
      </Container>
    </Section>
  );
}
