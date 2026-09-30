import { Navbar } from "@/components/patterns/navbar";
import { Footer } from "@/components/patterns/footer";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { mockSessions, mockBookings, getSessionVenue, getSessionAvailability } from "@/data/mock";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ─── Date helpers ───────────────────────────────────────────────
function todayISO() {
  return new Date().toISOString().split("T")[0]; // "2026-10-03"
}
function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function SessionCard({ session }: { session: typeof mockSessions[0] }) {
  const bookings = mockBookings.filter(b => b.sessionId === session.id);
  const pax = bookings.reduce((sum, b) => sum + b.paxCount, 0);
  const availability = getSessionAvailability(session, pax);
  const venue = getSessionVenue(session);
  const isFeatured = Boolean(session.isFeatured);

  const bookable = !availability.isSoldOut && session.status !== "coming_soon" && session.status !== "closed" && session.status !== "cancelled";

  return (
    <div className={`bg-white border rounded-[16px] p-4 flex flex-col h-full shadow-xs hover:shadow-md transition-all min-w-0 overflow-hidden ${
      isFeatured 
        ? "border-amber-400 ring-2 ring-amber-300/70 shadow-md bg-gradient-to-b from-amber-50/25 to-white" 
        : "border-[var(--border)]"
    }`}>
      {/* Top: Date & Status */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className={`w-[48px] h-[48px] rounded-[10px] flex flex-col items-center justify-center shrink-0 border ${
          isFeatured 
            ? "bg-amber-100 text-amber-950 border-amber-300" 
            : "bg-[var(--green-50)] text-[var(--green-900)] border-[#D8ECD9]"
        }`}>
          <span className="text-[9px] font-bold uppercase tracking-wider">{session.day}</span>
          <span className="text-[17px] font-bold leading-none my-0.5">{session.date.split(" ")[0]}</span>
          <span className="text-[8px] font-medium leading-none">{session.date.split(" ")[1]}</span>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap ${availability.style}`}>
            {availability.shortLabel || availability.label}
          </div>
          {isFeatured && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-300 inline-flex items-center gap-0.5 shadow-xs whitespace-nowrap">
              ⭐ Highlight
            </span>
          )}
        </div>
      </div>

      {/* Middle */}
      <div className="mb-4">
        <h3 className="text-[1.05rem] font-semibold text-[var(--ink)] mb-1 leading-tight">{session.time}</h3>
        <p className="text-[0.875rem] text-[var(--ink)] font-semibold truncate" title={venue.name}>{venue.name}</p>
        <p className="text-[0.75rem] text-[var(--text-muted)] line-clamp-1 leading-relaxed" title={venue.address}>{venue.address}</p>

        {/* Seat Availability Progress indicator */}
        {session.status !== "coming_soon" && (
          <div className="mt-3 pt-2.5 border-t border-gray-100">
            <div className="flex justify-between items-center text-[11px] font-semibold mb-1">
              <span className="text-[var(--text-muted)] font-normal text-[11px]">Seats</span>
              <span className={availability.isUrgent ? "text-orange-600 font-bold" : "text-emerald-700 font-bold"}>
                {availability.spotsLeft} of {availability.capacity} left
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${availability.isUrgent ? "bg-orange-500" : "bg-emerald-500"}`}
                style={{ width: `${Math.min(100, Math.max(5, (pax / availability.capacity) * 100))}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom: Price + Action */}
      <div className="pt-3.5 border-t border-[var(--border)] mt-auto flex items-center justify-between gap-2">
        <p className="text-[0.95rem] font-semibold text-[var(--ink)] whitespace-nowrap">
          ₹{session.prices.solo} <span className="text-[0.75rem] font-normal text-[var(--text-muted)]">/ solo</span>
        </p>
        {availability.isSoldOut || session.status === "sold_out" ? (
          <Button size="sm" disabled className="uppercase tracking-wider font-semibold text-[11px] px-3 h-8 opacity-50 cursor-not-allowed">
            Sold Out
          </Button>
        ) : session.status === "coming_soon" ? (
          <Button variant="outline" size="sm" disabled className="uppercase tracking-wider font-semibold text-[11px] px-3 h-8">
            Soon
          </Button>
        ) : bookable ? (
          <Button asChild size="sm" className="uppercase tracking-wider font-semibold text-[11px] px-3.5 h-8 bg-[var(--orange-500)] hover:bg-[var(--orange-600)] text-white shrink-0">
            <Link href={`/book/${session.id}`}>Book Now</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="uppercase tracking-wider font-semibold text-[11px] px-3 h-8">
            Closed
          </Button>
        )}
      </div>
    </div>
  );
}

export default function SessionsPage() {
  const today = todayISO();
  const tomorrow = tomorrowISO();

  // Split sessions into normal date buckets (featured sessions remain in their regular chronological group)
  const todaySessions     = mockSessions.filter(s => s.dateISO === today && s.status !== "cancelled");
  const tomorrowSessions  = mockSessions.filter(s => s.dateISO === tomorrow && s.status !== "cancelled");
  const bookableSessions  = mockSessions.filter(s =>
    s.dateISO > tomorrow &&
    s.status !== "coming_soon" &&
    s.status !== "cancelled"
  );
  const comingSoon        = mockSessions.filter(s =>
    s.status === "coming_soon" && s.dateISO > today
  );
  const pastSessions      = mockSessions.filter(s =>
    s.dateISO < today && s.status !== "cancelled"
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-0">
        <Section bg="warm">
          <Container className="max-w-[1520px]">
            {/* Hero */}
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 pt-8">
              <p className="text-[var(--orange-500)] text-[0.75rem] font-bold tracking-[0.1em] uppercase mb-4">
                Upcoming Sessions
              </p>
              <h1 className="text-[var(--heading)] text-[2.5rem] md:text-[3.5rem] font-serif font-medium tracking-wide mb-6 leading-tight">
                Book Your Spot
              </h1>
              <p className="text-[var(--text-muted)] text-[1.125rem] leading-relaxed">
                Secure your ticket for our upcoming Plant Bingo sessions. Every ticket includes a game card, a welcome drink, and a guaranteed live plant.
              </p>
            </div>

            {/* TODAY */}
            {todaySessions.length > 0 && (
              <div className="mb-14">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <h2 className="text-[1.5rem] font-serif font-medium text-[var(--ink)]">Happening Today</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {todaySessions.map(s => <SessionCard key={s.id} session={s} />)}
                </div>
              </div>
            )}

            {/* TOMORROW */}
            {tomorrowSessions.length > 0 && (
              <div className="mb-14">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <h2 className="text-[1.5rem] font-serif font-medium text-[var(--ink)]">Tomorrow</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {tomorrowSessions.map(s => <SessionCard key={s.id} session={s} />)}
                </div>
              </div>
            )}

            {/* NOW BOOKING */}
            {bookableSessions.length > 0 && (
              <div className="mb-14">
                <h2 className="text-[1.5rem] font-serif font-medium text-[var(--ink)] mb-6">Now Booking</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {bookableSessions.map(s => <SessionCard key={s.id} session={s} />)}
                </div>
              </div>
            )}

            {/* No sessions notice */}
            {todaySessions.length === 0 && tomorrowSessions.length === 0 && bookableSessions.length === 0 && (
              <div className="text-center py-20 text-[var(--text-muted)]">
                <p className="text-5xl mb-4">🌿</p>
                <p className="text-xl font-semibold text-[var(--ink)] mb-2">No sessions open for booking right now</p>
                <p className="text-[0.9375rem]">Check back soon — new dates drop regularly!</p>
              </div>
            )}

            {/* COMING SOON */}
            {comingSoon.length > 0 && (
              <div className="mb-14">
                <div className="flex items-center justify-between mb-8 border-b border-[var(--border)] pb-4">
                  <h2 className="text-[1.5rem] font-serif font-medium text-[var(--text-muted)]">Coming Soon</h2>
                  <span className="text-[0.875rem] text-[var(--text-muted)]">{comingSoon.length} dates</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 opacity-80">
                  {comingSoon.map(s => <SessionCard key={s.id} session={s} />)}
                </div>
              </div>
            )}

            {/* PAST (collapsed) */}
            {pastSessions.length > 0 && (
              <div className="mb-10 opacity-50">
                <div className="flex items-center gap-3 mb-4 border-t border-[var(--border)] pt-6">
                  <h2 className="text-[1rem] font-serif font-medium text-[var(--text-muted)] uppercase tracking-widest">Past Sessions ({pastSessions.length})</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {pastSessions.map(s => (
                    <div key={s.id} className="bg-white/50 border border-[var(--border)] rounded-[8px] px-4 py-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-gray-100 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[9px] font-bold uppercase text-gray-400">{s.day}</span>
                        <span className="text-sm font-bold text-gray-500 leading-none">{s.date.split(" ")[0]}</span>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-400">{s.date}</div>
                        <div className="text-xs text-gray-400">{s.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </Container>
        </Section>

        {/* Good to know */}
        <Section bg="subtle">
          <Container size="narrow">
            <h2 className="text-[2rem] font-serif font-medium text-[var(--heading)] mb-8 text-center">Good to know</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-[8px] border border-[var(--border)] shadow-sm">
                <h3 className="font-semibold text-[1.125rem] text-[var(--ink)] mb-2">What is included?</h3>
                <p className="text-[var(--text-muted)] text-[0.9375rem] leading-relaxed">
                  Your ticket covers entry, a bingo game card, a welcome drink, and a beautiful indoor plant to take home!
                </p>
              </div>
              <div className="bg-white p-6 rounded-[8px] border border-[var(--border)] shadow-sm">
                <h3 className="font-semibold text-[1.125rem] text-[var(--ink)] mb-2">Can I cancel?</h3>
                <p className="text-[var(--text-muted)] text-[0.9375rem] leading-relaxed">
                  Tickets are non-refundable, but you can transfer them to a friend if you inform us at least 24 hours prior.
                </p>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
