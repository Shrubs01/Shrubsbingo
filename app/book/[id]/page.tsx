import { notFound } from "next/navigation";
import { mockSessions, getSessionVenue } from "@/data/mock";
import { Navbar } from "@/components/patterns/navbar";
import { Footer } from "@/components/patterns/footer";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BookingForm } from "@/components/patterns/booking-form";
import Link from "next/link";

interface BookingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const resolvedParams = await params;
  const session = mockSessions.find((s) => s.id === resolvedParams.id);

  if (!session) {
    notFound();
  }

  const venue = getSessionVenue(session);

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-0">
        
        {/* Booking Layout */}
        <Section bg="subtle" className="min-h-[calc(100vh-280px)]">
          <Container>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
              
              {/* Left Side: Session Context */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="lg:sticky lg:top-32 pt-2">
                  
                  <div className="mb-8">
                    <Link href="/sessions" className="text-[0.875rem] font-medium text-[var(--text-muted)] hover:text-[var(--orange-600)] transition-colors flex items-center gap-2">
                      ← Back to Sessions
                    </Link>
                  </div>

                  <div className="bg-[var(--green-50)] border border-[var(--green-200)] text-[var(--green-900)] w-[64px] h-[64px] rounded-[8px] flex flex-col items-center justify-center shrink-0 shadow-sm mb-6">
                    <span className="text-[10px] font-[700] uppercase tracking-wider opacity-80">{session.day}</span>
                    <span className="text-[24px] font-bold leading-none mt-1">{session.date.split(" ")[0]}</span>
                  </div>

                  <h1 className="text-[2.5rem] font-serif font-medium text-[var(--heading)] mb-4 leading-tight">
                    Secure your tickets
                  </h1>
                  
                  <div className="flex flex-col gap-4 text-[1rem] text-[var(--text-muted)] mb-8">
                    <div>
                      <strong className="text-[var(--ink)] block mb-1">When</strong>
                      {session.date} • {session.time}
                    </div>
                    <div>
                      <strong className="text-[var(--ink)] block mb-1">Where</strong>
                      <span className="font-semibold text-[var(--ink)]">{venue.name}</span><br />
                      <span className="text-[0.875rem]">{venue.address}</span>
                      {venue.mapsLink && (
                        <div className="mt-1">
                          <a 
                            href={venue.mapsLink} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs text-[var(--orange-600)] hover:underline font-semibold"
                          >
                            Get Directions ↗
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-[8px] border border-[var(--border-control)]">
                    <h3 className="text-[0.875rem] font-bold tracking-wider uppercase text-[var(--orange-600)] mb-3">What to expect</h3>
                    <ul className="text-[0.9375rem] text-[var(--text-muted)] flex flex-col gap-3">
                      <li className="flex items-start gap-3">
                        <span className="text-xl leading-none">🌿</span>
                        <span>A beautiful indoor plant of your choice to take home</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-xl leading-none">🥂</span>
                        <span>One welcome drink (coffee or mocktail)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-xl leading-none">🎫</span>
                        <span>One Shrubs Bingo game card per person</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Side: Interactive Booking Form */}
              <div className="lg:col-span-7">
                <BookingForm session={session} />
              </div>

            </div>
          </Container>
        </Section>

      </main>
      <Footer />
    </>
  );
}
