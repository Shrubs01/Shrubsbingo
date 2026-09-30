"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mockPlants, mockBookings } from "@/data/mock";
import { LegalModal } from "@/components/patterns/legal-modal";

interface Session {
  id: string;
  day: string;
  date: string;
  time: string;
  venue: string;
  capacity?: number;
  prices: {
    solo: number;
    couple: number;
  };
}

const detailsSchema = z.object({
  name: z.string().min(2, "Name is required (at least 2 characters)").max(80),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"),
  agreed: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms & Refund Policy",
  }),
});

type DetailsFormValues = z.infer<typeof detailsSchema>;

export function BookingForm({ session }: { session: Session }) {
  const [step, setStep] = useState(1);
  const [ticketType, setTicketType] = useState<"solo" | "couple" | null>(null);
  const [ticketCount, setTicketCount] = useState(1);
  
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");

  const capacity = session.capacity || 30;
  const bookedPax = mockBookings.filter(b => b.sessionId === session.id).reduce((sum, b) => sum + b.paxCount, 0);
  const spotsLeft = Math.max(0, capacity - bookedPax);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<DetailsFormValues>({
    resolver: zodResolver(detailsSchema),
    mode: "onChange",
  });

  const total = ticketType ? session.prices[ticketType] * ticketCount : 0;
  const paxCount = ticketType === "couple" ? ticketCount * 2 : ticketCount;
  const emailValue = watch("email");
  const nameValue = watch("name");
  const phoneValue = watch("phone");

  const togglePlant = (id: string) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(p => p !== id));
    } else if (wishlist.length < 3) {
      setWishlist([...wishlist, id]);
    }
  };

  const onSubmitDetails = () => {
    setStep(3); // Go to Wishlist
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const { createBooking } = await import('@/app/actions');
      const res = await createBooking({
        sessionId: session.id,
        name: nameValue,
        email: emailValue,
        phone: phoneValue,
        ticketType: ticketType as "solo" | "couple",
        paxCount: paxCount,
        wishlist: wishlist,
        utrNumber: utrNumber,
      });
      setBookingCode(res.booking.code);
      setIsConfirmed(true);
    } catch (error) {
      console.error(error);
      alert("Booking failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isConfirmed) {
    return (
      <div className="bg-white border border-[var(--border)] rounded-[12px] p-8 md:p-12 shadow-sm text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-16 h-16 bg-[var(--green-50)] text-[var(--green-600)] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          ✓
        </div>
        <h2 className="text-[2rem] font-serif font-medium text-[var(--heading)] mb-4">You're on the list!</h2>
        <p className="text-[1rem] text-[var(--text-muted)] mb-8">
          We've sent your tickets to <strong>{emailValue}</strong>. Get ready to yell BINGO.
        </p>
        
        <div className="bg-[var(--bg-subtle)] p-6 rounded-[8px] text-left mb-8 border border-[var(--border-control)]">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-[var(--border-control)]">
            <span className="text-[0.875rem] text-[var(--text-muted)]">Booking Code</span>
            <span className="font-mono font-bold text-[var(--ink)] tracking-widest">{bookingCode}</span>
          </div>
          <div className="space-y-3 text-[0.9375rem]">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">When</span>
              <span className="font-medium text-[var(--ink)]">{session.date} • {session.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Where</span>
              <span className="font-medium text-[var(--ink)] text-right">{session.venue}</span>
            </div>
          </div>
        </div>

        <Button size="lg" className="w-full uppercase tracking-widest font-semibold bg-[var(--green-600)] hover:bg-[var(--green-700)] text-white">
          Add to Calendar
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[var(--border)] rounded-[12px] p-6 md:p-10 shadow-sm">
      
      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex-1 flex flex-col gap-2">
            <div 
              className={cn(
                "h-1.5 rounded-full w-full transition-colors", 
                s <= step ? "bg-[var(--orange-500)]" : "bg-[var(--gray-200)]"
              )}
            />
            <span className={cn(
              "text-[0.625rem] md:text-[0.6875rem] font-bold uppercase tracking-wider",
              s <= step ? "text-[var(--orange-600)]" : "text-[var(--gray-400)]"
            )}>
              {s === 1 ? "Tickets" : s === 2 ? "Details" : s === 3 ? "Wishlist" : "Payment"}
            </span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[1.75rem] font-serif font-medium text-[var(--heading)]">Choose your tickets</h2>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] bg-gray-100 px-3 py-1 rounded-full">
              Limit: {capacity} Pax
            </span>
          </div>

          {/* Seat Capacity Urgency Banner */}
          <div className={`p-4 rounded-[10px] mb-6 flex items-center justify-between text-xs font-semibold border ${
            spotsLeft === 0 ? "bg-red-50 text-red-700 border-red-200" :
            spotsLeft <= 5 ? "bg-orange-50 text-orange-800 border-orange-200 animate-pulse" :
            spotsLeft <= 10 ? "bg-amber-50 text-amber-800 border-amber-200" :
            "bg-emerald-50 text-emerald-800 border-emerald-200"
          }`}>
            <span>
              {spotsLeft === 0 ? "⚠️ This session is currently Sold Out." :
               spotsLeft <= 5 ? `⚡ Fast seats closing! Only ${spotsLeft} spots left for this session.` :
               spotsLeft <= 10 ? `🔥 Almost full: ${spotsLeft} seats remaining out of ${capacity}.` :
               `✓ ${spotsLeft} seats available (Headcount limit: ${capacity})`}
            </span>
            <span className="font-bold tracking-wider uppercase text-[11px]">
              {bookedPax} Booked
            </span>
          </div>
          
          <div className="flex flex-col gap-4 mb-8">
            <button
              onClick={() => {
                setTicketType("solo");
                if (ticketCount > spotsLeft) setTicketCount(Math.max(1, spotsLeft));
              }}
              disabled={spotsLeft < 1}
              className={cn(
                "flex items-center justify-between p-6 rounded-[12px] border transition-all text-left",
                spotsLeft < 1 ? "opacity-50 cursor-not-allowed border-gray-200" :
                ticketType === "solo" 
                  ? "border-[var(--orange-500)] bg-[var(--orange-50)]" 
                  : "border-[var(--border-control)] hover:border-[var(--orange-300)]"
              )}
            >
              <div>
                <h3 className="font-semibold text-[1.125rem] text-[var(--ink)] mb-1">Solo Ticket</h3>
                <p className="text-[0.9375rem] text-[var(--text-muted)]">One game card, one drink, one plant.</p>
              </div>
              <div className="text-right">
                <span className="text-[1.25rem] font-semibold text-[var(--ink)]">₹{session.prices.solo}</span>
              </div>
            </button>

            <button
              onClick={() => {
                setTicketType("couple");
                if (ticketCount * 2 > spotsLeft) setTicketCount(Math.max(1, Math.floor(spotsLeft / 2)));
              }}
              disabled={spotsLeft < 2}
              className={cn(
                "flex items-center justify-between p-6 rounded-[12px] border transition-all text-left",
                spotsLeft < 2 ? "opacity-50 cursor-not-allowed border-gray-200" :
                ticketType === "couple" 
                  ? "border-[var(--orange-500)] bg-[var(--orange-50)]" 
                  : "border-[var(--border-control)] hover:border-[var(--orange-300)]"
              )}
            >
              <div>
                <h3 className="font-semibold text-[1.125rem] text-[var(--ink)] mb-1">Duo Pass</h3>
                <p className="text-[0.9375rem] text-[var(--text-muted)]">Two game cards, two drinks, two plants.</p>
              </div>
              <div className="text-right">
                <span className="text-[1.25rem] font-semibold text-[var(--ink)]">₹{session.prices.couple}</span>
              </div>
            </button>
          </div>

          {ticketType && (
            <div className="flex items-center justify-between py-6 border-t border-[var(--border)] mb-8">
              <div>
                <span className="font-semibold text-[var(--ink)] block">Quantity</span>
                <span className="text-xs text-[var(--text-muted)]">
                  Total Attendees: {paxCount} {paxCount === 1 ? "person" : "people"}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                  className="w-8 h-8 rounded-full border border-[var(--border-control)] flex items-center justify-center hover:bg-[var(--bg-subtle)] transition-colors"
                >
                  -
                </button>
                <span className="font-semibold w-4 text-center">{ticketCount}</span>
                <button 
                  onClick={() => {
                    const nextPax = ticketType === "couple" ? (ticketCount + 1) * 2 : ticketCount + 1;
                    if (nextPax <= spotsLeft) {
                      setTicketCount(ticketCount + 1);
                    }
                  }}
                  disabled={ticketType === "couple" ? (ticketCount + 1) * 2 > spotsLeft : ticketCount + 1 > spotsLeft}
                  className="w-8 h-8 rounded-full border border-[var(--border-control)] flex items-center justify-center hover:bg-[var(--bg-subtle)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {paxCount > spotsLeft && spotsLeft > 0 && (
            <div className="text-xs text-red-600 font-semibold mb-4 text-center">
              ⚠️ Selected {paxCount} seats, but only {spotsLeft} seats are remaining!
            </div>
          )}

          <Button 
            size="lg" 
            fullWidth 
            className="uppercase tracking-widest font-semibold"
            disabled={!ticketType || spotsLeft === 0 || paxCount > spotsLeft}
            onClick={() => setStep(2)}
          >
            {spotsLeft === 0 ? "Session Sold Out" : `Continue ${total > 0 ? `— ₹${total}` : ""}`}
          </Button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit(onSubmitDetails)} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-[1.75rem] font-serif font-medium text-[var(--heading)] mb-6">Your Details</h2>
          
          <div className="flex flex-col gap-5 mb-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-[0.875rem] font-medium text-[var(--ink)]">Full Name</label>
              <input 
                {...register("name")}
                id="name" 
                className={cn(
                  "px-4 py-3 rounded-[6px] border bg-white focus:outline-none focus:ring-1 transition-all",
                  errors.name ? "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]" : "border-[var(--border-control)] focus:border-[var(--orange-500)] focus:ring-[var(--orange-500)]"
                )}
                placeholder="Name as it appears on your ID"
              />
              {errors.name && <span className="text-xs text-[var(--error)]">{errors.name.message}</span>}
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[0.875rem] font-medium text-[var(--ink)]">Email Address</label>
              <input 
                {...register("email")}
                type="email" 
                id="email" 
                className={cn(
                  "px-4 py-3 rounded-[6px] border bg-white focus:outline-none focus:ring-1 transition-all",
                  errors.email ? "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]" : "border-[var(--border-control)] focus:border-[var(--orange-500)] focus:ring-[var(--orange-500)]"
                )}
                placeholder="Where we'll send your tickets"
              />
              {errors.email && <span className="text-xs text-[var(--error)]">{errors.email.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-[0.875rem] font-medium text-[var(--ink)]">WhatsApp Number</label>
              <input 
                {...register("phone")}
                type="tel" 
                id="phone" 
                className={cn(
                  "px-4 py-3 rounded-[6px] border bg-white focus:outline-none focus:ring-1 transition-all",
                  errors.phone ? "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]" : "border-[var(--border-control)] focus:border-[var(--orange-500)] focus:ring-[var(--orange-500)]"
                )}
                placeholder="+91"
              />
              {errors.phone && <span className="text-xs text-[var(--error)]">{errors.phone.message}</span>}
            </div>
          </div>

          <label className="flex items-start gap-3 mb-2 cursor-pointer group">
            <div className="mt-1 flex-shrink-0">
              <input 
                {...register("agreed")}
                type="checkbox" 
                className="w-4 h-4 text-[var(--orange-500)] border-[var(--border-control)] rounded focus:ring-[var(--orange-500)] cursor-pointer" 
              />
            </div>
            <span className="text-[0.875rem] text-[var(--text-muted)] group-hover:text-[var(--ink)] transition-colors">
              I agree to the <a href="#" className="underline underline-offset-2 hover:text-[var(--orange-600)]">Terms & Conditions</a> and the Refund Policy (No refunds within 72 hours).
            </span>
          </label>
          <div className="mb-10 pl-7">
            {errors.agreed && <span className="text-xs text-[var(--error)]">{errors.agreed.message}</span>}
          </div>

          <div className="flex gap-4">
            <Button 
              type="button"
              variant="outline" 
              size="lg" 
              onClick={() => setStep(1)}
              className="px-4 md:px-8"
            >
              Back
            </Button>
            <Button 
              type="submit"
              size="lg" 
              className="flex-1 uppercase tracking-widest font-semibold"
              disabled={!isValid}
            >
              Continue
            </Button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6">
            <h2 className="text-[1.75rem] font-serif font-medium text-[var(--heading)] mb-2">Plant Wishlist <span className="text-[1rem] text-[var(--text-muted)] font-sans italic">(Optional)</span></h2>
            <p className="text-[0.9375rem] text-[var(--text-muted)]">
              Rank up to 3 plants you'd love to take home. We'll try our best to bring them!
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-10">
            {mockPlants.map((plant) => (
              <button
                key={plant.id}
                onClick={() => togglePlant(plant.id)}
                className={cn(
                  "relative flex flex-col text-left rounded-[8px] overflow-hidden border-2 transition-all",
                  wishlist.includes(plant.id) 
                    ? "border-[var(--green-500)] shadow-sm" 
                    : "border-transparent bg-[var(--bg-subtle)] hover:bg-[var(--gray-100)]"
                )}
              >
                <div className="aspect-square bg-gray-200 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={plant.image} alt={plant.name} className="w-full h-full object-cover" />
                  {wishlist.includes(plant.id) && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[var(--green-500)] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                      {wishlist.indexOf(plant.id) + 1}
                    </div>
                  )}
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="font-medium text-[0.875rem] text-[var(--ink)] line-clamp-1">{plant.name}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setStep(2)}
              className="px-4 md:px-8"
            >
              Back
            </Button>
            <Button 
              size="lg" 
              className="flex-1 uppercase tracking-widest font-semibold"
              onClick={() => setStep(4)}
            >
              Review Order
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-[1.75rem] font-serif font-medium text-[var(--heading)] mb-6">Review & Pay</h2>
          
          <div className="bg-[var(--bg-subtle)] p-6 rounded-[8px] mb-8 border border-[var(--border)]">
            <h3 className="text-[0.75rem] font-bold tracking-widest uppercase text-[var(--text-muted)] mb-4">Order Summary</h3>
            
            <div className="flex justify-between items-start mb-4 pb-4 border-b border-[var(--border-control)]">
              <div>
                <p className="font-semibold text-[var(--ink)]">{ticketCount}x {ticketType === "solo" ? "Solo Ticket" : "Duo Pass"}</p>
                <p className="text-[0.875rem] text-[var(--text-muted)] mt-1">{paxCount} {paxCount === 1 ? 'person' : 'people'} total</p>
              </div>
              <p className="font-semibold text-[var(--ink)]">₹{total}</p>
            </div>
            
            {wishlist.length > 0 && (
              <div className="mb-4 pb-4 border-b border-[var(--border-control)]">
                <p className="text-[0.875rem] text-[var(--text-muted)] mb-2">Wishlist</p>
                <div className="flex gap-2 text-[0.875rem] text-[var(--ink)] font-medium flex-wrap">
                  {wishlist.map((id, index) => {
                    const p = mockPlants.find(pl => pl.id === id);
                    return p ? (
                      <span key={id} className="bg-white border border-[var(--border-control)] px-2 py-1 rounded-md shadow-sm text-xs">
                        {index + 1}. {p.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center text-[1.125rem] font-semibold text-[var(--ink)]">
              <p>Total</p>
              <p>₹{total}</p>
            </div>
          </div>

          <div className="bg-white border-2 border-[var(--orange-500)] p-6 rounded-[8px] mb-8 text-center shadow-sm">
            <h3 className="text-[1.125rem] font-bold text-[var(--heading)] mb-2">Pay via UPI</h3>
            <p className="text-[0.875rem] text-[var(--text-muted)] mb-6">
              Please pay exactly <strong>₹{total}</strong> to the UPI ID below, then enter your 12-digit UTR/Transaction ID to confirm your booking.
            </p>
            
            <div className="bg-[var(--gray-100)] p-4 rounded-[8px] mb-6 inline-block w-full max-w-[240px]">
              {/* Fake QR Placeholder */}
              <div className="aspect-square bg-white border border-[var(--border-control)] rounded-[4px] flex items-center justify-center mb-3">
                <span className="text-[var(--text-muted)] text-sm font-medium">QR CODE HERE</span>
              </div>
              <div className="flex items-center justify-between bg-white px-3 py-2 rounded border border-[var(--border-control)]">
                <span className="text-[0.875rem] font-mono font-bold text-[var(--ink)]">shrubsbingo@ybl</span>
                <button className="text-[var(--orange-600)] text-[0.75rem] font-bold uppercase hover:underline" onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText('shrubsbingo@ybl'); alert('UPI ID Copied!'); }}>Copy</button>
              </div>
            </div>

            <div className="text-left">
              <label htmlFor="utr" className="text-[0.875rem] font-medium text-[var(--ink)] block mb-2">12-Digit UTR / Transaction ID <span className="text-[var(--error)]">*</span></label>
              <input 
                id="utr" 
                type="text"
                maxLength={12}
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-[6px] border border-[var(--border-control)] bg-white focus:outline-none focus:border-[var(--orange-500)] focus:ring-1 focus:ring-[var(--orange-500)] transition-all font-mono"
                placeholder="e.g. 312345678901"
              />
            </div>
          </div>
          
          <Button 
            size="lg" 
            fullWidth 
            className="uppercase tracking-widest font-semibold bg-[var(--green-600)] hover:bg-[var(--green-700)] text-white shadow-sm"
            onClick={handlePayment}
            disabled={isProcessing || utrNumber.length < 8}
          >
            {isProcessing ? "Verifying..." : `I have paid ₹${total}`}
          </Button>

          <p className="text-[11px] text-[var(--text-muted)] text-center mt-3 leading-relaxed">
            By confirming, you agree to our{" "}
            <LegalModal docType="termsAndConditions">
              <button type="button" className="text-[var(--orange-600)] underline font-semibold hover:text-[var(--orange-700)] cursor-pointer">
                Terms &amp; Conditions
              </button>
            </LegalModal>{" "}
            and{" "}
            <LegalModal docType="privacyPolicy">
              <button type="button" className="text-[var(--orange-600)] underline font-semibold hover:text-[var(--orange-700)] cursor-pointer">
                Privacy Policy
              </button>
            </LegalModal>.
          </p>
          
          <div className="mt-6 text-center">
            <button onClick={() => setStep(3)} className="text-[0.875rem] text-[var(--text-muted)] underline underline-offset-4 hover:text-[var(--ink)]">
              Wait, I need to change something
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
