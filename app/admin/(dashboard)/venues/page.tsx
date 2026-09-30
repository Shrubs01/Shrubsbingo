import Link from "next/link";
import { mockVenues, mockSessions } from "@/data/mock";
import { Button } from "@/components/ui/button";

export default function AdminVenuesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[2rem] font-serif font-medium text-[var(--heading)]">
            Venues Directory
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            All partner venues interlinked with upcoming bingo sessions.
          </p>
        </div>
        <Link href="/admin/venues/new">
          <Button className="uppercase tracking-widest font-semibold bg-[var(--orange-500)] hover:bg-[var(--orange-600)] text-white">
            + New Venue
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockVenues.map((venue) => {
          const venueSessions = mockSessions.filter(
            (s) => s.venueId === venue.id || s.venue?.toLowerCase().includes(venue.name.toLowerCase())
          );

          return (
            <div 
              key={venue.id}
              className="bg-white border border-[var(--border)] rounded-[16px] shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-all"
            >
              <div className="aspect-[16/9] bg-gray-200 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[var(--ink)] shadow-sm">
                  {venueSessions.length} {venueSessions.length === 1 ? "Session" : "Sessions"}
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-[1.25rem] text-[var(--ink)]">{venue.name}</h3>
                </div>
                <p className="text-[0.875rem] text-[var(--text-muted)] leading-relaxed mb-4">{venue.address}</p>
                
                {/* Interlinked Sessions Preview */}
                <div className="mt-auto pt-3 border-t border-[var(--border-control)]">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                    Linked Sessions ({venueSessions.length})
                  </div>
                  {venueSessions.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {venueSessions.slice(0, 3).map(s => (
                        <Link 
                          key={s.id} 
                          href={`/admin/sessions/${s.id}`}
                          className="bg-[#EFF7F2] text-[#2D5A3A] border border-[#D8ECD9] hover:bg-[#D8ECD9] px-2 py-0.5 rounded text-[11px] font-semibold transition-colors"
                        >
                          {s.day} {s.date}
                        </Link>
                      ))}
                      {venueSessions.length > 3 && (
                        <span className="text-[11px] text-[var(--text-muted)] px-1 py-0.5">
                          +{venueSessions.length - 3} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--text-muted)] italic mb-4">No sessions scheduled yet.</p>
                  )}

                  <div className="flex gap-2">
                    <Link href={`/admin/venues/${venue.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full uppercase tracking-widest text-[0.7rem] border-[var(--border-control)] font-semibold">
                        Edit Venue
                      </Button>
                    </Link>
                    <a 
                      href={venue.mapsLink} 
                      target="_blank" 
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-[6px] border border-[var(--border-control)] text-xs font-semibold text-[var(--ink)] hover:bg-gray-50 flex items-center justify-center"
                    >
                      Map ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
