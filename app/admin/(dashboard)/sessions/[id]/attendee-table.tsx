"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { mockPlants } from "@/data/mock";

type Booking = {
  id: string;
  sessionId: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  ticketType: string;
  paxCount: number;
  checkedIn: boolean;
  wishlist: string[];
  utrNumber?: string;
};

export function AttendeeTable({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState(initialBookings);

  const toggleCheckIn = (id: string) => {
    setBookings(bookings.map(b => 
      b.id === id ? { ...b, checkedIn: !b.checkedIn } : b
    ));
  };

  return (
    <>
      <div className="bg-white border border-[var(--border)] rounded-[12px] overflow-hidden shadow-sm mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-subtle)] border-b border-[var(--border-control)]">
                <th className="px-6 py-4 text-[0.75rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Attendee</th>
                <th className="px-6 py-4 text-[0.75rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Code</th>
                <th className="px-6 py-4 text-[0.75rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Ticket</th>
                <th className="px-6 py-4 text-[0.75rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">UTR / Payment</th>
                <th className="px-6 py-4 text-[0.75rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Wishlist</th>
                <th className="px-6 py-4 text-[0.75rem] font-bold uppercase tracking-widest text-[var(--text-muted)] text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-control)]">
              {bookings.map(booking => (
                <tr key={booking.id} className="hover:bg-[var(--bg-subtle)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[var(--ink)]">{booking.name}</div>
                    <div className="text-[0.875rem] text-[var(--text-muted)]">{booking.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono bg-[var(--gray-100)] px-2 py-1 rounded text-[0.875rem] font-bold text-[var(--ink)]">{booking.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="capitalize font-medium text-[var(--ink)]">{booking.ticketType}</div>
                    <div className="text-[0.875rem] text-[var(--text-muted)]">{booking.paxCount} {booking.paxCount === 1 ? 'person' : 'people'}</div>
                  </td>
                  <td className="px-6 py-4">
                    {booking.utrNumber ? (
                      <div>
                        <span className="font-mono bg-[var(--success-100)] text-[var(--success)] px-2 py-1 rounded text-[0.8125rem] font-bold tracking-wider">
                          {booking.utrNumber}
                        </span>
                        <div className="text-[0.75rem] text-[var(--success)] font-semibold mt-1">✓ UPI Paid</div>
                      </div>
                    ) : (
                      <span className="text-[0.8125rem] text-[var(--warning)] font-semibold bg-[var(--warning-100)] px-2 py-1 rounded">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 max-w-[200px]">
                    <div className="flex flex-wrap gap-1">
                      {booking.wishlist.map(pid => {
                        const plantName = mockPlants.find(p => p.id === pid)?.name || pid;
                        return (
                          <span key={pid} className="bg-white border border-[var(--border-control)] px-1.5 py-0.5 rounded text-[0.75rem] text-[var(--text-muted)] truncate max-w-[120px]">
                            {plantName}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {booking.checkedIn ? (
                      <button 
                        onClick={() => toggleCheckIn(booking.id)}
                        className="inline-flex items-center gap-1.5 bg-[var(--green-100)] text-[var(--green-800)] px-3 py-1.5 rounded-full text-[0.75rem] font-bold uppercase tracking-wider hover:bg-[var(--green-200)] transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--green-500)]"></span>
                        Checked In
                      </button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => toggleCheckIn(booking.id)}
                        className="text-[0.75rem] h-8 uppercase tracking-widest font-semibold text-[var(--orange-600)] border-[var(--orange-200)] hover:bg-[var(--orange-50)] hover:text-[var(--orange-700)]"
                      >
                        Check In
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
            <div className="p-12 text-center text-[var(--text-muted)]">
              No bookings for this session yet.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
