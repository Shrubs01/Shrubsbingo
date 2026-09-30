"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createSessionAction } from "@/app/actions";
import { mockVenues } from "@/data/mock";

export default function CreateSessionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    day: "SAT",
    date: "",
    time: "4:00 PM – 5:30 PM",
    venueId: mockVenues[0]?.id || "v1",
    venue: mockVenues[0] ? `${mockVenues[0].name}, ${mockVenues[0].city}` : "HoshiSasa Cafe, Madhapur",
    capacity: 30,
    isFeatured: false,
    soloPrice: 499,
    couplePrice: 899,
    status: "available" as "available" | "almost_full" | "sold_out" | "closed" | "coming_soon" | "cancelled",
  });

  const selectedVenue = mockVenues.find(v => v.id === formData.venueId) || mockVenues[0];

  const handleVenueChange = (venueId: string) => {
    const v = mockVenues.find(x => x.id === venueId);
    setFormData({
      ...formData,
      venueId,
      venue: v ? `${v.name}, ${v.city}` : formData.venue,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createSessionAction(formData);
      alert(`Session Created at ${formData.venue} with ${formData.capacity} Seats Limit!`);
      router.push("/admin");
    } catch (err) {
      console.error(err);
      alert("Failed to create session. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const presetCapacities = [15, 20, 25, 30, 40, 50];

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/admin" className="text-[0.875rem] text-[var(--orange-600)] hover:underline font-semibold tracking-wider uppercase">
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-[2rem] font-serif font-medium text-[var(--heading)] mb-2">
        Create New Session
      </h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">
        Set the schedule, pricing, and exact attendee seat limit for automatic application closing.
      </p>

      <form onSubmit={handleSave} className="bg-white border border-[var(--border)] rounded-[16px] p-6 md:p-8 shadow-sm flex flex-col gap-6">
        
        {/* Date & Day */}
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Day of Week</label>
            <select 
              value={formData.day}
              onChange={(e) => setFormData({...formData, day: e.target.value})}
              className="w-full px-4 py-3 rounded-[10px] border border-[var(--border-control)] bg-white text-[var(--ink)] text-[0.9375rem] font-medium focus:outline-none focus:border-[var(--orange-500)] focus:ring-2 focus:ring-[var(--orange-500)]/20 transition-all"
            >
              <option value="FRI">Friday (FRI)</option>
              <option value="SAT">Saturday (SAT)</option>
              <option value="SUN">Sunday (SUN)</option>
              <option value="MON">Monday (MON)</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Session Date</label>
            <input 
              type="text" 
              placeholder="e.g. 10 Oct"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-4 py-3 rounded-[10px] border border-[var(--border-control)] bg-white text-[var(--ink)] text-[0.9375rem] font-medium focus:outline-none focus:border-[var(--orange-500)] focus:ring-2 focus:ring-[var(--orange-500)]/20 transition-all placeholder:text-[var(--text-muted)]/50"
              required
            />
          </div>
        </div>

        {/* Time Slot */}
        <div className="flex flex-col gap-2">
          <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Time Slot</label>
          <input 
            type="text" 
            placeholder="e.g. 4:00 PM – 5:30 PM"
            value={formData.time}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
            className="w-full px-4 py-3 rounded-[10px] border border-[var(--border-control)] bg-white text-[var(--ink)] text-[0.9375rem] font-medium focus:outline-none focus:border-[var(--orange-500)] focus:ring-2 focus:ring-[var(--orange-500)]/20 transition-all"
            required
          />
        </div>

        {/* Interlinked Venue Selection */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Select Venue (Interlinked)
            </label>
            <Link 
              href="/admin/venues/new" 
              className="text-xs text-[var(--orange-600)] hover:underline font-semibold"
            >
              + Add New Venue in Directory
            </Link>
          </div>

          <select 
            value={formData.venueId}
            onChange={(e) => handleVenueChange(e.target.value)}
            className="w-full px-4 py-3 rounded-[10px] border border-[var(--border-control)] bg-white text-[var(--ink)] text-[0.9375rem] font-medium focus:outline-none focus:border-[var(--orange-500)] focus:ring-2 focus:ring-[var(--orange-500)]/20 transition-all"
          >
            {mockVenues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} — {v.city || v.address}
              </option>
            ))}
          </select>

          {/* Selected Venue Live Preview */}
          {selectedVenue && (
            <div className="mt-1 p-3 rounded-[10px] bg-gray-50 border border-gray-200/80 flex items-center gap-3">
              <div className="w-12 h-12 rounded-[8px] bg-gray-200 overflow-hidden shrink-0 border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedVenue.image} alt={selectedVenue.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-[var(--ink)] truncate">{selectedVenue.name}</div>
                <div className="text-[11px] text-[var(--text-muted)] truncate">{selectedVenue.address}</div>
              </div>
              <a 
                href={selectedVenue.mapsLink} 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md shrink-0 hover:bg-emerald-100"
              >
                Maps ↗
              </a>
            </div>
          )}
        </div>

        {/* ─── DEDICATED SEAT LIMIT & APPLICATION CLOSING SECTION ─── */}
        <div className="p-5 rounded-[12px] bg-[#F7FAF8] border-2 border-[#D8ECD9] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[0.875rem] font-bold text-[#1C3B27] uppercase tracking-wider flex items-center gap-2">
                <span>🪑 Total Seat Limit (Max Capacity)</span>
              </div>
              <p className="text-xs text-[#3E6B4A] mt-0.5">
                Maximum number of attendees this session can accommodate before closing.
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-[#1C3B27]">{formData.capacity}</span>
              <span className="text-xs text-[#3E6B4A] font-semibold ml-1">Seats</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">
                Enter Seat Limit Count
              </label>
              <input 
                type="number" 
                min={1}
                max={500}
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: Math.max(1, Number(e.target.value))})}
                className="w-full px-4 py-3 rounded-[10px] border border-[#BCE1C0] bg-white text-[var(--ink)] text-base font-bold focus:outline-none focus:border-[var(--orange-500)] focus:ring-2 focus:ring-[var(--orange-500)]/20"
                required
              />
            </div>

            {/* Quick preset selector buttons */}
            <div>
              <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">
                Quick Presets
              </label>
              <div className="flex flex-wrap gap-1.5">
                {presetCapacities.map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setFormData({...formData, capacity: preset})}
                    className={`px-3 py-2 rounded-[8px] text-xs font-bold transition-all border ${
                      formData.capacity === preset
                        ? "bg-[#2D5A3A] text-white border-[#2D5A3A]"
                        : "bg-white text-[var(--ink)] border-[#D8ECD9] hover:bg-[#EFF7F2]"
                    }`}
                  >
                    {preset} Seats
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Automated Closing Rules Notice */}
          <div className="mt-2 pt-3 border-t border-[#D8ECD9] text-xs text-[#2A4E35] flex flex-col gap-1.5 leading-relaxed">
            <div className="flex items-center gap-1.5 font-semibold">
              <span>🔒 Automatic Closing:</span>
              <span className="font-normal">Applications will automatically stop & close once {formData.capacity} seats are booked.</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold">
              <span>⚡ Live Urgency Tags:</span>
              <span className="font-normal">Tags automatically change to &quot;Fast Seats Closing&quot; (&le; 10 left) and &quot;Last Chance&quot; (&le; 5 left).</span>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Solo Ticket (₹)</label>
            <input 
              type="number" 
              value={formData.soloPrice}
              onChange={(e) => setFormData({...formData, soloPrice: Number(e.target.value)})}
              className="w-full px-4 py-3 rounded-[10px] border border-[var(--border-control)] bg-white text-[var(--ink)] text-[0.9375rem] font-medium focus:outline-none focus:border-[var(--orange-500)] focus:ring-2 focus:ring-[var(--orange-500)]/20 transition-all"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Couple Ticket (₹)</label>
            <input 
              type="number" 
              value={formData.couplePrice}
              onChange={(e) => setFormData({...formData, couplePrice: Number(e.target.value)})}
              className="w-full px-4 py-3 rounded-[10px] border border-[var(--border-control)] bg-white text-[var(--ink)] text-[0.9375rem] font-medium focus:outline-none focus:border-[var(--orange-500)] focus:ring-2 focus:ring-[var(--orange-500)]/20 transition-all"
              required
            />
          </div>
        </div>

        {/* Session Status */}
        <div className="flex flex-col gap-2">
          <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Session Status</label>
          <select 
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value as typeof formData.status})}
            className="w-full px-4 py-3 rounded-[10px] border border-[var(--border-control)] bg-white text-[var(--ink)] text-[0.9375rem] font-medium focus:outline-none focus:border-[var(--orange-500)] focus:ring-2 focus:ring-[var(--orange-500)]/20 transition-all"
          >
            <option value="available">Available (Accepting Applications)</option>
            <option value="almost_full">Almost Full</option>
            <option value="sold_out">Sold Out (Applications Closed)</option>
            <option value="closed">Closed</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </div>

        {/* ─── HIGHLIGHT / FEATURE ON WEBSITE TOGGLE ─── */}
        <div 
          onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})}
          className={`p-4 rounded-[12px] border transition-all cursor-pointer flex items-center justify-between ${
            formData.isFeatured 
              ? "bg-amber-50/90 border-amber-300 ring-2 ring-amber-200" 
              : "bg-gray-50 border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
              formData.isFeatured ? "bg-amber-400 text-white shadow-sm" : "bg-gray-200 text-gray-400"
            }`}>
              ⭐
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--ink)] flex items-center gap-2">
                <span>Highlight this Session on the Website</span>
                {formData.isFeatured && (
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                    Featured Event
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
                Positions this session prominently at the very top of the homepage and public sessions page with a special &quot;⭐ Featured / Host&apos;s Pick&quot; badge and glowing outline.
              </p>
            </div>
          </div>
          <input 
            type="checkbox" 
            checked={formData.isFeatured} 
            onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
            className="w-5 h-5 accent-amber-500 rounded cursor-pointer shrink-0 ml-4"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-6 pt-4 border-t border-[var(--border-control)]">
          <Link href="/admin" className="flex-1">
            <Button type="button" variant="outline" className="w-full h-12 rounded-[10px] text-[0.75rem] font-bold uppercase tracking-wider border-[var(--border-control)]">
              Cancel
            </Button>
          </Link>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 h-12 rounded-[10px] text-[0.75rem] font-bold uppercase tracking-wider bg-[var(--green-700)] hover:bg-[var(--green-800)] text-white shadow-sm"
          >
            {isSubmitting ? "Creating..." : "Create Session & Activate Limit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
