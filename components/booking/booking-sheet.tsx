"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function BookingSheet({ 
  isOpen, 
  onClose, 
  session,
  selectedType = "solo",
  plants = []
}: { 
  isOpen: boolean; 
  onClose: () => void;
  session: any | null;
  selectedType?: "solo" | "couple";
  plants?: any[];
}) {
  const [step, setStep] = useState(1);
  const [ticketType, setTicketType] = useState<"solo" | "couple">(selectedType);
  const [quantity, setQuantity] = useState(1);
  
  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [whatsappOptIn, setWhatsappOptIn] = useState(false);
  
  // Wishlist state (just an array of selected plant IDs for simplicity here)
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!session) return null;

  const total = (session.prices?.[ticketType] || 0) * quantity;
  const seats = ticketType === "couple" ? quantity * 2 : quantity;

  const toggleWishlist = (id: string) => {
    setWishlist(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const handleNext = async () => {
    if (step === 2) {
      if (!name || !phone || !email) {
        alert("Please fill in all details.");
        return;
      }
    }
    if (step === 4) {
      if (!termsAccepted) {
        alert("Please accept the terms and refund policy.");
        return;
      }
      
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/create-booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: session.id,
            ticketType,
            quantity,
            customer: { name, phone, email, whatsapp_opt_in: whatsappOptIn },
            wishlist,
          })
        });
        
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error?.message || 'Failed to create booking hold');
        }
        
        alert(`Success! Seats held. Booking Code: ${data.bookingCode}\nSimulated Razorpay Order: ${data.razorpayOrderId}`);
        onClose(); // In a real flow, redirect to a waiting/payment page or open Razorpay checkout script here.
      } catch (err: any) {
        alert("Error: " + err.message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    setStep(s => s + 1);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        setTimeout(() => setStep(1), 300); // reset after close animation
      }
    }}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-white p-0 flex flex-col h-full border-l-0 sm:border-l sm:rounded-l-2xl">
        <SheetHeader className="p-6 border-b border-neutral-100 bg-neutral-50/50 shrink-0">
          <SheetTitle className="text-xl font-bold tracking-tight text-ink text-left">
            Book your spot
          </SheetTitle>
          <SheetDescription className="text-left text-neutral-600 mt-1">
            {session.date} {session.month}, {session.time}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
          {step === 1 && (
            <div className="space-y-6 fade-in">
              <h3 className="font-semibold text-ink text-lg tracking-tight">1. Choose Tickets</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setTicketType("solo")}
                  className={`w-full text-left flex items-center justify-between p-4 rounded-xl border ${
                    ticketType === "solo" ? "border-primary-500 bg-primary-50/50 ring-1 ring-primary-500/20" : "border-neutral-200 hover:border-neutral-300"
                  } transition-all`}
                >
                  <div>
                    <div className="font-semibold text-ink">Solo Ticket</div>
                    <div className="text-sm text-neutral-500 mt-0.5">1 seat, 1 plant</div>
                  </div>
                  <div className="font-semibold text-ink">₹{session.prices?.solo}</div>
                </button>

                <button
                  onClick={() => setTicketType("couple")}
                  className={`w-full text-left flex items-center justify-between p-4 rounded-xl border ${
                    ticketType === "couple" ? "border-primary-500 bg-primary-50/50 ring-1 ring-primary-500/20" : "border-neutral-200 hover:border-neutral-300"
                  } transition-all`}
                >
                  <div>
                    <div className="font-semibold text-ink">Couple Ticket</div>
                    <div className="text-sm text-neutral-500 mt-0.5">2 seats, 2 plants</div>
                  </div>
                  <div className="font-semibold text-ink">₹{session.prices?.couple}</div>
                </button>
              </div>

              <div className="space-y-3 pt-2">
                <Label className="text-neutral-700 font-medium">Quantity</Label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 text-neutral-600 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-4 text-center font-semibold text-ink">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => Math.min(4, q + 1))}
                    className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 text-neutral-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 fade-in">
              <h3 className="font-semibold text-ink text-lg tracking-tight">2. Your Details</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="E.g. Meenu" className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">WhatsApp Number</Label>
                  <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="+91" className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="h-12" />
                </div>
                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox id="whatsapp" checked={whatsappOptIn} onCheckedChange={(c) => setWhatsappOptIn(c as boolean)} />
                  <Label htmlFor="whatsapp" className="text-sm font-normal text-neutral-600 leading-snug">
                    Send me booking updates and event reminders on WhatsApp
                  </Label>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 fade-in">
              <div>
                <h3 className="font-semibold text-ink text-lg tracking-tight">3. Plant Wishlist (Optional)</h3>
                <p className="text-sm text-neutral-500 mt-1">Pick up to 3 plants you'd love to take home. Non-binding!</p>
              </div>
              <div className="space-y-3">
                {plants.length > 0 ? (
                  plants.map(p => {
                    const isSelected = wishlist.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => toggleWishlist(p.id)}
                        className={`w-full text-left flex flex-col p-3 rounded-xl border ${
                          isSelected ? "border-primary-500 bg-primary-50/50" : "border-neutral-200 hover:border-neutral-300"
                        } transition-all`}
                      >
                        <div className="font-medium text-ink flex items-center justify-between">
                          {p.name}
                          {isSelected && <span className="text-primary-600 text-xs font-semibold">SELECTED</span>}
                        </div>
                        <div className="text-sm text-neutral-500 mt-0.5">{p.blurb}</div>
                      </button>
                    )
                  })
                ) : (
                  <div className="text-sm text-neutral-500 italic">No plants available yet.</div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 fade-in">
              <h3 className="font-semibold text-ink text-lg tracking-tight">4. Review & Pay</h3>
              <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-100 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-600">{quantity}x {ticketType === 'solo' ? 'Solo' : 'Couple'} Ticket</span>
                  <span className="font-medium text-ink">₹{total}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-600">Convenience Fee</span>
                  <span className="font-medium text-ink">₹0</span>
                </div>
                <div className="border-t border-neutral-200 pt-4 flex justify-between items-center">
                  <span className="font-semibold text-ink">Total</span>
                  <span className="font-bold text-lg text-ink">₹{total}</span>
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(c) => setTermsAccepted(c as boolean)} />
                <Label htmlFor="terms" className="text-sm font-normal text-neutral-600 leading-snug">
                  I agree to the <a href="#" className="underline hover:text-ink">Terms</a> and understand the <a href="#" className="underline hover:text-ink">Refund Policy</a> (No refunds within 72 hours).
                </Label>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-neutral-100 bg-white shrink-0">
          <div className="flex gap-3">
            {step > 1 && (
              <Button variant="outline" className="w-1/3 h-14 rounded-xl font-semibold" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <Button 
              className={`h-14 rounded-xl font-semibold tracking-wide shadow-sm ${step > 1 ? 'w-2/3' : 'w-full'}`}
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : step === 4 ? `Pay ₹${total}` : 'Next'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
