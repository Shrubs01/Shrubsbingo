import Link from "next/link";
import { mockSessions, mockBookings, getSessionAvailability } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { HighlightToggle } from "@/components/admin/highlight-toggle";

function todayISO() {
  return new Date().toISOString().split("T")[0];
}
function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export default function AdminDashboard() {
  const today    = todayISO();
  const tomorrow = tomorrowISO();

  // Sort by date
  const sorted = [...mockSessions].sort((a, b) => a.dateISO.localeCompare(b.dateISO));

  const featuredSessions = sorted.filter(s => s.isFeatured);
  const todaySessions    = sorted.filter(s => s.dateISO === today);
  const tomorrowSessions = sorted.filter(s => s.dateISO === tomorrow);
  const upcoming         = sorted.filter(s => s.dateISO > tomorrow);
  const past             = sorted.filter(s => s.dateISO < today);

  // Totals
  const totalPax = mockBookings.reduce((sum, b) => sum + b.paxCount, 0);
  const totalRevenue = mockBookings.reduce((sum, b) => {
    const s = mockSessions.find(s => s.id === b.sessionId);
    return sum + (s?.prices[b.ticketType as "solo" | "couple"] ?? 0);
  }, 0);

  function SessionRow({ session }: { session: typeof mockSessions[0] }) {
    const bookings = mockBookings.filter(b => b.sessionId === session.id);
    const pax = bookings.reduce((s, b) => s + b.paxCount, 0);
    const isToday = session.dateISO === today;
    const isTomorrow = session.dateISO === tomorrow;

    const availability = getSessionAvailability(session, pax);

    const [dayNum, monthName] = session.date.split(" ");

    return (
      <div
        className={`bg-white border rounded-[16px] p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-w-0 overflow-hidden ${
          session.isFeatured
            ? "border-amber-400 ring-2 ring-amber-200/60 bg-amber-50/15"
            : "border-[var(--border)] hover:border-[var(--green-500)]"
        }`}
      >
        <div>
          {/* Top Row: Date Box on Left, Badges on Right */}
          <div className="flex items-start justify-between gap-2 mb-3">
            {/* Date Box */}
            <Link href={`/admin/sessions/${session.id}`} className="group shrink-0">
              <div className={`w-[50px] h-[50px] rounded-[10px] flex flex-col items-center justify-center shrink-0 border transition-colors ${
                session.isFeatured
                  ? "bg-amber-100 text-amber-900 border-amber-300"
                  : "bg-[#EFF7F2] text-[#2D5A3A] border-[#D8ECD9] group-hover:border-[var(--green-500)]"
              }`}>
                <span className="text-[9px] font-bold uppercase tracking-wider leading-none">{session.day}</span>
                <span className="text-[18px] font-bold leading-none my-0.5">{dayNum}</span>
                <span className="text-[8px] font-semibold uppercase leading-none">{monthName}</span>
              </div>
            </Link>

            {/* Badges Stacked on Right */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap ${availability.style}`}>
                {availability.shortLabel || availability.label}
              </span>
              {session.isFeatured && (
                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full whitespace-nowrap">
                  ⭐ Highlighted
                </span>
              )}
              {isToday && (
                <span className="inline-block text-[9px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                  Today
                </span>
              )}
              {isTomorrow && (
                <span className="inline-block text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full whitespace-nowrap">
                  Tomorrow
                </span>
              )}
            </div>
          </div>

          {/* Middle: Time & Venue (Dedicated Full-Width Line, Never Cramped) */}
          <Link href={`/admin/sessions/${session.id}`} className="block group mb-3">
            <div className="text-[1.05rem] font-bold text-[var(--ink)] tracking-tight leading-tight group-hover:text-[var(--orange-600)] transition-colors mb-0.5">
              {session.time}
            </div>
            <div className="text-xs text-[var(--text-muted)] font-medium truncate" title={session.venue}>
              {session.venue.split(",")[0]}
            </div>
          </Link>

          {/* Seat Capacity Progress Bar */}
          <div className="bg-gray-50 border border-gray-100 rounded-[8px] p-2.5 mb-3">
            <div className="flex justify-between items-center text-[11px] font-semibold mb-1">
              <span className="text-[var(--text-muted)] font-normal text-[10px]">Seats: {pax} / {availability.capacity}</span>
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
        </div>

        {/* Footer: Admin Controls (Toggle, Edit, Run Sheet) */}
        <div className="pt-2.5 border-t border-[var(--border)] mt-auto flex items-center justify-between gap-1.5 flex-wrap">
          <HighlightToggle sessionId={session.id} initialFeatured={Boolean(session.isFeatured)} compact />
          
          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              href={`/admin/sessions/${session.id}/edit`}
              className="text-[11px] font-bold text-gray-600 hover:text-[var(--ink)] px-2 py-1 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
              title="Edit session details & limit"
            >
              Edit ✏️
            </Link>
            <Link
              href={`/admin/sessions/${session.id}`}
              className="text-[var(--orange-600)] hover:text-[var(--orange-700)] text-xs font-bold transition-transform hover:translate-x-0.5 px-1 py-1"
            >
              Run Sheet →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[2rem] font-serif font-medium text-[var(--heading)]">Sessions Dashboard</h1>
        <Link href="/admin/sessions/new">
          <Button className="uppercase tracking-widest font-semibold bg-[var(--orange-500)] hover:bg-[var(--orange-600)] text-white">
            + New Session
          </Button>
        </Link>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-white border border-[var(--border)] rounded-[12px] p-5 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Total Sessions</div>
          <div className="text-3xl font-bold text-[var(--ink)]">{mockSessions.length}</div>
        </div>
        <div className="bg-white border border-[var(--border)] rounded-[12px] p-5 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Total Bookings</div>
          <div className="text-3xl font-bold text-[var(--ink)]">{mockBookings.length}</div>
        </div>
        <div className="bg-white border border-[var(--border)] rounded-[12px] p-5 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Total Attendees</div>
          <div className="text-3xl font-bold text-[var(--ink)]">{totalPax}</div>
        </div>
        <div className="bg-white border border-[var(--border)] rounded-[12px] p-5 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Revenue</div>
          <div className="text-3xl font-bold text-green-700">₹{totalRevenue.toLocaleString("en-IN")}</div>
        </div>
      </div>

      {/* ⭐ Highlighted Sessions on Website */}
      {featuredSessions.length > 0 && (
        <div className="mb-10 p-5 rounded-[16px] bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-amber-50/80 border-2 border-amber-300 shadow-sm">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">⭐</span>
              <div>
                <h2 className="text-lg font-serif font-bold text-amber-950 flex items-center gap-2">
                  <span>Currently Highlighted on Website</span>
                  <span className="text-xs font-sans font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                    {featuredSessions.length} Active
                  </span>
                </h2>
                <p className="text-xs text-amber-800">
                  These meetings/sessions are prioritized at the top of the homepage and public sessions page with gold badges.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-200/80 text-amber-900 border border-amber-300 px-3 py-1 rounded-full">
              Live On Website
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredSessions.map(s => <SessionRow key={s.id} session={s} />)}
          </div>
        </div>
      )}

      {/* Today */}
      {todaySessions.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <h2 className="text-lg font-bold text-[var(--ink)] uppercase tracking-wider">Today</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todaySessions.map(s => <SessionRow key={s.id} session={s} />)}
          </div>
        </div>
      )}

      {/* Tomorrow */}
      {tomorrowSessions.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <h2 className="text-lg font-bold text-[var(--ink)] uppercase tracking-wider">Tomorrow</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tomorrowSessions.map(s => <SessionRow key={s.id} session={s} />)}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-[var(--ink)] uppercase tracking-wider mb-4">
            Upcoming <span className="text-[var(--text-muted)] font-normal normal-case text-sm ml-1">({upcoming.length} sessions)</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map(s => <SessionRow key={s.id} session={s} />)}
          </div>
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <div className="opacity-50">
          <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">
            Past Sessions ({past.length})
          </h2>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
            {past.map(s => {
              const pax = mockBookings.filter(b => b.sessionId === s.id).reduce((sum, b) => sum + b.paxCount, 0);
              return (
                <Link key={s.id} href={`/admin/sessions/${s.id}`}
                  className="bg-white/60 border border-[var(--border)] rounded-[8px] px-4 py-3 flex items-center gap-3 hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 bg-gray-100 rounded flex flex-col items-center justify-center shrink-0">
                    <span className="text-[9px] text-gray-400 font-bold uppercase">{s.day}</span>
                    <span className="text-sm font-bold text-gray-500 leading-none">{s.date.split(" ")[0]}</span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-400">{s.date}</div>
                    <div className="text-xs text-gray-400">{pax} pax</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
