import { notFound } from "next/navigation";
import { mockSessions, mockBookings, mockPlants, getSessionVenue, getSessionAvailability } from "@/data/mock";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HighlightToggle } from "@/components/admin/highlight-toggle";
import { AttendeeTable } from "./attendee-table";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RunSheetPage({ params }: PageProps) {
  const { id } = await params;
  
  const session = mockSessions.find(s => s.id === id);
  if (!session) {
    notFound();
  }

  const bookings = mockBookings.filter(b => b.sessionId === id);
  const totalPax = bookings.reduce((s, b) => s + b.paxCount, 0);
  const checkedInPax = bookings.filter(b => b.checkedIn).reduce((s, b) => s + b.paxCount, 0);
  const availability = getSessionAvailability(session, totalPax);
  const venue = getSessionVenue(session);

  // Plant analytics
  const plantCounts: Record<string, number> = {};
  bookings.forEach(b => {
    b.wishlist.forEach(plantId => {
      plantCounts[plantId] = (plantCounts[plantId] || 0) + 1;
    });
  });

  const topPlants = Object.entries(plantCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([pid, count]) => {
      const p = mockPlants.find(x => x.id === pid);
      return { name: p?.name || pid, count };
    });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin" className="text-[0.875rem] text-[var(--orange-600)] hover:underline font-semibold tracking-wider uppercase">
          ← Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <HighlightToggle sessionId={session.id} initialFeatured={Boolean(session.isFeatured)} />
          <Link href={`/admin/sessions/${id}/edit`}>
            <Button variant="outline" className="uppercase tracking-widest font-semibold text-[0.75rem] border-[var(--border-control)]">
              Edit Session ✏️
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Session Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${availability.style}`}>
            {availability.shortLabel || availability.label}
          </span>
          {session.isFeatured && (
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full">
              ⭐ Highlighted on Website (Featured Event)
            </span>
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
            Status: {session.status.replace("_", " ")}
          </span>
        </div>
        <h1 className="text-[2.5rem] font-serif font-medium text-[var(--heading)] leading-tight">
          {session.day}, {session.date} • {session.time}
        </h1>
      </div>

      {/* ─── DETAILED SESSION OVERVIEW CARD (NEW ADD-ONS VISIBLE) ─── */}
      <div className="bg-white border border-[var(--border)] rounded-[16px] p-6 shadow-sm mb-10 grid grid-cols-1 lg:grid-cols-3 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
        
        {/* 1. Seat Limit & Capacity Breakdown */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#1C3B27] mb-2 flex items-center gap-1.5">
              <span>🪑 Seat Headcount Limit</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-extrabold text-[var(--ink)]">{totalPax}</span>
              <span className="text-base text-[var(--text-muted)] font-medium">/ {session.capacity} seats taken</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div 
                className={`h-full transition-all duration-500 ${availability.isUrgent ? "bg-orange-500" : "bg-emerald-600"}`}
                style={{ width: `${Math.min(100, (totalPax / session.capacity) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              {availability.spotsLeft > 0 
                ? `${availability.spotsLeft} seats remaining before auto-close`
                : "🔴 Capacity reached — Applications closed"}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-[#2A4E35] font-semibold">
            🔒 Automatic closing active once limit reached
          </div>
        </div>

        {/* 2. Interlinked Venue Card */}
        <div className="pt-6 lg:pt-0 lg:pl-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2 flex items-center justify-between">
              <span>📍 Venue (Interlinked)</span>
              <Link href="/admin/venues" className="text-[11px] text-[var(--orange-600)] hover:underline font-bold">
                Directory →
              </Link>
            </div>
            <div className="flex items-start gap-3 mt-1">
              <div className="w-14 h-14 rounded-[10px] bg-gray-200 overflow-hidden shrink-0 border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-[var(--ink)] text-sm">{venue.name}</div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">{venue.address}</div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">City: {venue.city || "Hyderabad"}</span>
            <a 
              href={venue.mapsLink} 
              target="_blank" 
              rel="noreferrer" 
              className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-md"
            >
              Open in Maps ↗
            </a>
          </div>
        </div>

        {/* 3. Pricing & Booking Stats */}
        <div className="pt-6 lg:pt-0 lg:pl-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">
              🎟️ Pricing & Attendance
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-gray-50 p-2.5 rounded-[10px] border border-gray-100">
                <div className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Solo Ticket</div>
                <div className="text-base font-extrabold text-[var(--ink)]">₹{session.prices.solo}</div>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-[10px] border border-gray-100">
                <div className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Couple Ticket</div>
                <div className="text-base font-extrabold text-[var(--ink)]">₹{session.prices.couple}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-[#F7FAF8] border border-[#D8ECD9] rounded-[10px] p-2 text-center">
              <div className="text-lg font-bold text-[#1C3B27] leading-none">{checkedInPax} / {totalPax}</div>
              <div className="text-[10px] uppercase font-bold text-[#3E6B4A] mt-1">Checked In</div>
            </div>
            <div className="flex-1 bg-[#F7FAF8] border border-[#D8ECD9] rounded-[10px] p-2 text-center">
              <div className="text-lg font-bold text-[#1C3B27] leading-none">{bookings.length}</div>
              <div className="text-[10px] uppercase font-bold text-[#3E6B4A] mt-1">Bookings</div>
            </div>
          </div>
        </div>

      </div>

      {topPlants.length > 0 && (
        <div className="bg-[var(--green-50)] border border-[var(--green-200)] rounded-[12px] p-6 mb-10">
          <h3 className="text-[0.875rem] font-bold tracking-widest uppercase text-[var(--green-900)] mb-4">Wishlist Analytics (Requested)</h3>
          <div className="flex gap-4 flex-wrap">
            {topPlants.map(p => (
              <div key={p.name} className="bg-white border border-[var(--green-200)] px-3 py-1.5 rounded-md shadow-sm text-[0.875rem] font-medium text-[var(--ink)]">
                {p.name} <span className="text-[var(--text-muted)] ml-2">x{p.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <AttendeeTable initialBookings={bookings} />
    </div>
  );
}
