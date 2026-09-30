"use client";

import { useState } from "react";
import { mockBookings, mockSessions } from "@/data/mock";
import Link from "next/link";
import { verifyPayment } from "@/app/actions";

const PRICES: Record<string, number> = { solo: 499, couple: 899 };

type BookingRow = {
  id: string; sessionId: string; code: string; name: string; email: string;
  phone: string; ticketType: string; paxCount: number; checkedIn: boolean;
  wishlist: string[]; utrNumber?: string; paymentVerified?: boolean;
  session?: { day: string; date: string; time: string };
  amount: number;
};

function PaymentsClient({ initialRows }: { initialRows: BookingRow[] }) {
  const [rows, setRows] = useState<BookingRow[]>(initialRows);
  const [loading, setLoading] = useState<string | null>(null);

  const handleVerify = async (id: string) => {
    setLoading(id);
    const res = await verifyPayment(id);
    if (res.success) {
      setRows((prev) => prev.map(r => r.id === id ? { ...r, paymentVerified: true } : r));
    }
    setLoading(null);
  };

  const paidRows = rows.filter(r => r.paymentVerified);
  const pendingRows = rows.filter(r => !r.paymentVerified);
  const totalRevenue = paidRows.reduce((s, r) => s + r.amount, 0);
  const pendingRevenue = pendingRows.reduce((s, r) => s + r.amount, 0);
  const rate = rows.length > 0 ? Math.round((paidRows.length / rows.length) * 100) : 0;

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-serif font-medium" style={{ color: "var(--heading)" }}>Payments</h1>
        <p className="mt-1" style={{ color: "var(--text-muted)" }}>Verify UPI payments before confirming customer bookings.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-white border rounded-xl p-6 shadow-sm" style={{ borderColor: "var(--border)" }}>
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Verified Revenue</div>
          <div className="text-3xl font-bold text-green-800">Rs.{totalRevenue.toLocaleString("en-IN")}</div>
          <div className="text-xs font-semibold mt-1 text-green-600">{paidRows.length} confirmed</div>
        </div>
        <div className="bg-white border rounded-xl p-6 shadow-sm" style={{ borderColor: "var(--border)" }}>
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Pending Verification</div>
          <div className="text-3xl font-bold text-amber-600">Rs.{pendingRevenue.toLocaleString("en-IN")}</div>
          <div className="text-xs font-semibold mt-1 text-amber-600">{pendingRows.length} to verify</div>
        </div>
        <div className="bg-white border rounded-xl p-6 shadow-sm" style={{ borderColor: "var(--border)" }}>
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Total Bookings</div>
          <div className="text-3xl font-bold" style={{ color: "var(--ink)" }}>{rows.length}</div>
          <div className="text-xs font-semibold mt-1" style={{ color: "var(--text-muted)" }}>across all sessions</div>
        </div>
        <div className="bg-white border rounded-xl p-6 shadow-sm" style={{ borderColor: "var(--border)" }}>
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Verified Rate</div>
          <div className="text-3xl font-bold" style={{ color: "var(--ink)" }}>{rate}%</div>
          <div className="text-xs font-semibold mt-1" style={{ color: "var(--text-muted)" }}>payment confirmed</div>
        </div>
      </div>

      {/* Alert Banner */}
      {pendingRows.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-4 mb-6 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
            {pendingRows.length} booking{pendingRows.length !== 1 ? "s" : ""} waiting — open PhonePe / GPay, verify the UTR, then click &quot;Mark as Paid&quot;.
          </p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm" style={{ borderColor: "var(--border)" }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--ink)" }}>All Transactions</h2>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{rows.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b" style={{ borderColor: "var(--border-control)" }}>
                {["Attendee", "Session", "Code", "Ticket", "Amount", "UTR Number", "Action"].map((h, i) => (
                  <th key={h} className={"px-6 py-4 text-xs font-bold uppercase tracking-widest" + (i === 6 ? " text-right" : "")} style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border-control)" }}>
              {rows.map(b => (
                <tr key={b.id} className={b.paymentVerified ? "hover:bg-gray-50 transition-colors" : "bg-amber-50 hover:bg-amber-100 transition-colors"}>
                  <td className="px-6 py-4">
                    <div className="font-semibold" style={{ color: "var(--ink)" }}>{b.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{b.email}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>{b.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    {b.session ? (
                      <div>
                        <Link href={"/admin/sessions/" + b.sessionId} className="font-semibold text-sm hover:text-orange-600 transition-colors" style={{ color: "var(--ink)" }}>
                          {b.session.day}, {b.session.date}
                        </Link>
                        <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{b.session.time}</div>
                      </div>
                    ) : <span style={{ color: "var(--text-muted)" }}>-</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm font-bold" style={{ color: "var(--ink)" }}>{b.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="capitalize font-medium text-sm" style={{ color: "var(--ink)" }}>{b.ticketType}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>{b.paxCount} {b.paxCount === 1 ? "person" : "people"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-lg font-bold" style={{ color: "var(--ink)" }}>Rs.{b.amount.toLocaleString("en-IN")}</div>
                  </td>
                  <td className="px-6 py-4">
                    {b.utrNumber
                      ? <span className="font-mono text-sm bg-green-100 text-green-700 px-2 py-1 rounded font-bold tracking-wider">{b.utrNumber}</span>
                      : <span className="text-xs italic" style={{ color: "var(--text-muted)" }}>Not submitted</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {b.paymentVerified ? (
                      <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        ✓ Confirmed
                      </span>
                    ) : b.utrNumber ? (
                      <button
                        onClick={() => handleVerify(b.id)}
                        disabled={loading === b.id}
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                      >
                        {loading === b.id ? "Sending..." : "Mark as Paid"}
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        No UTR
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <div className="p-16 text-center" style={{ color: "var(--text-muted)" }}>
              <p className="text-4xl mb-4">💳</p>
              <p className="font-semibold mb-1" style={{ color: "var(--ink)" }}>No payments yet</p>
              <p className="text-sm">Bookings will appear here once customers complete checkout.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  type RawBooking = {
    id: string; sessionId: string; code: string; name: string; email: string;
    phone: string; ticketType: string; paxCount: number; checkedIn: boolean;
    wishlist: string[]; utrNumber?: string; paymentVerified?: boolean;
  };
  const rows = (mockBookings as RawBooking[]).map(b => ({
    ...b,
    session: mockSessions.find(s => s.id === b.sessionId),
    amount: PRICES[b.ticketType] ?? 0,
  }));
  return <PaymentsClient initialRows={rows} />;
}
