"use client";

import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { mockSessions, mockBookings, getSessionAvailability } from "@/data/mock";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}
function getTomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export function Sessions() {
  const today    = getTodayISO();
  const tomorrow = getTomorrowISO();

  // Upcoming sessions on home page: include Host's Highlights and upcoming dates, sorted chronologically (5 horizontal cards)
  const featured = mockSessions.filter(s => s.isFeatured && s.status !== "cancelled" && s.dateISO >= today);
  const regular  = mockSessions.filter(s => !s.isFeatured && s.status !== "cancelled" && s.dateISO >= today);

  const displayList = [...featured, ...regular]
    .slice(0, 5)
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO));

  const display = displayList.length > 0
    ? displayList
    : mockSessions.filter(s => s.status === "coming_soon").slice(0, 5);

  return (
    <Section id="sessions" bg="dark">
      <Container className="max-w-[1520px]">
        <SectionHeader
          align="center"
          eyebrow="Sessions"
          title="Pick your spot."
          lede="Tickets include a game card, a welcome drink, and a guaranteed live plant to take home."
          accentColor="var(--green-500)"
          theme="dark"
        />

        {display.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white/5 border border-white/10 rounded-2xl max-w-lg mx-auto mt-8">
            <span className="text-4xl mb-3 block">🌱</span>
            <h3 className="text-xl font-serif font-bold text-white mb-2">New Sessions Dropping Soon!</h3>
            <p className="text-sm text-[var(--text-light-muted)] mb-6 leading-relaxed">
              We are finalizing dates and cafe venues for upcoming rounds. Check back shortly or follow us for drops!
            </p>
            <a 
              href="https://instagram.com/shrubsbingo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--green-600)] hover:bg-[var(--green-700)] text-white text-xs font-bold uppercase tracking-wider transition"
            >
              <span>📸</span> Follow @shrubsbingo
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full mt-6">
            {display.map((session) => {
            const isToday    = session.dateISO === today;
            const isTomorrow = session.dateISO === tomorrow;
            const isFeatured = Boolean(session.isFeatured);

            const bookings = mockBookings.filter(b => b.sessionId === session.id);
            const pax = bookings.reduce((sum, b) => sum + b.paxCount, 0);
            const availability = getSessionAvailability(session, pax);

            const isBookable = !availability.isSoldOut && session.status !== "coming_soon" && session.status !== "closed" && session.status !== "cancelled";

            return (
              <div
                key={session.id}
                className={`bg-[var(--white)] rounded-[16px] p-4 sm:p-5 flex flex-col text-[var(--ink)] shadow-xs hover:shadow-md transition-all min-w-0 overflow-hidden ${
                  isFeatured
                    ? "border-amber-400 ring-2 ring-amber-300/70 shadow-lg bg-gradient-to-b from-amber-50/20 to-white"
                    : isToday
                    ? "border-orange-400 ring-2 ring-orange-100"
                    : "border-[var(--border)]"
                }`}
              >
                {/* Top Row: Date Box + Status Badges */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className={`w-[48px] h-[48px] rounded-[10px] flex flex-col items-center justify-center shrink-0 border ${
                    isFeatured
                      ? "bg-amber-100 text-amber-950 border-amber-300"
                      : isToday
                      ? "bg-orange-50 text-orange-900 border-orange-200"
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
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-950 bg-amber-100 border border-amber-300 uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap">
                        ⭐ Highlight
                      </span>
                    )}
                    {!isFeatured && isToday && (
                      <span className="block text-[9px] font-bold text-orange-600 uppercase tracking-wider">Today</span>
                    )}
                    {!isFeatured && isTomorrow && (
                      <span className="block text-[9px] font-bold text-green-600 uppercase tracking-wider">Tomorrow</span>
                    )}
                  </div>
                </div>

                {/* Middle: Time & Venue */}
                <div className="mb-3">
                  <div className="font-bold text-[14px] text-[var(--ink)] leading-tight mb-1">{session.time}</div>
                  <div className="text-[12px] font-medium text-[var(--text-muted)] truncate" title={session.venue.split(",")[0]}>
                    {session.venue.split(",")[0]}
                  </div>
                </div>

                {/* Seat Capacity Bar */}
                {session.status !== "coming_soon" && (
                  <div className="mb-3.5 bg-gray-50 border border-gray-100 rounded-[8px] p-2.5">
                    <div className="flex justify-between items-center text-[11px] font-semibold mb-1">
                      <span className="text-[var(--text-muted)] font-normal text-[10px]">Limit: {availability.capacity}</span>
                      <span className={availability.isUrgent ? "text-orange-600 font-bold" : "text-emerald-700 font-bold"}>
                        {availability.spotsLeft} left
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${availability.isUrgent ? "bg-orange-500" : "bg-emerald-500"}`}
                        style={{ width: `${Math.min(100, Math.max(5, (pax / availability.capacity) * 100))}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Price rows */}
                <div className="flex flex-col gap-1.5 mb-3.5 border-t border-[var(--border)] pt-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[var(--text-muted)]">Solo Ticket</span>
                    <span className="font-bold text-[var(--ink)] tabular-nums">₹{session.prices.solo}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[var(--text-muted)]">Couple Ticket</span>
                    <span className="font-bold text-[var(--ink)] tabular-nums">₹{session.prices.couple}</span>
                  </div>
                </div>

                {/* Action */}
                <div className="mt-auto">
                  {isBookable ? (
                    <Button asChild size="sm" fullWidth className="uppercase font-bold tracking-wider text-[11px] h-9 bg-[var(--orange-500)] hover:bg-[var(--orange-600)] text-white">
                      <Link href={`/book/${session.id}`}>Select tickets</Link>
                    </Button>
                  ) : session.status === "coming_soon" ? (
                    <Button variant="outline" size="sm" fullWidth className="uppercase font-bold tracking-wider text-[11px] h-9" disabled>
                      Coming Soon
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" fullWidth className="uppercase font-bold tracking-wider text-[11px] h-9" disabled>
                      {availability.isSoldOut || session.status === "sold_out" ? "Sold Out" : "Closed"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* See all link (only when sessions exist) */}
        {mockSessions.filter(s => s.status !== "cancelled").length > 0 && (
          <div className="text-center mt-10">
            <Link
              href="/sessions"
              className="inline-block text-[0.875rem] font-semibold text-[var(--green-400)] uppercase tracking-widest hover:text-white transition-colors underline underline-offset-4"
            >
              See all {mockSessions.filter(s => s.status !== "cancelled").length} sessions →
            </Link>
          </div>
        )}
      </Container>
    </Section>
  );
}
