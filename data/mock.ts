export const mockEvent = {
  venue: "HoshiSasa Cafe",
  city: "Madhapur",
  dates: "Oct – Nov 2026",
};

// ─── Session type ──────────────────────────────────────────────
export type Venue = {
  id: string;
  name: string;
  address: string;
  city: string;
  image: string;
  images: string[];
  mapsLink: string;
};

export type Session = {
  id: string;
  dateISO: string;           // "2026-10-03"  ← real date for comparisons
  day: string;               // "SAT"
  date: string;              // "3 Oct"        ← display only
  time: string;              // "4:00 PM – 5:30 PM"
  venueId: string;           // "v1"           ← foreign key to mockVenues
  venue: string;             // "HoshiSasa Cafe, Madhapur"
  capacity: number;          // Max headcount limit (default 30)
  isFeatured?: boolean;      // ⭐ Highlight on website homepage & sessions header
  status: "available" | "almost_full" | "sold_out" | "closed" | "coming_soon" | "cancelled";
  prices: { solo: number; couple: number };
};

// Helper to compute automatic status, remaining seats, and pill styling dynamically
export function getSessionAvailability(session: Session, bookedPax: number) {
  const capacity = session.capacity || 30;
  const spotsLeft = Math.max(0, capacity - bookedPax);
  const isSoldOut = spotsLeft === 0;

  let label = "AVAILABLE";
  let shortLabel = "AVAILABLE";
  let style = "bg-[#EAF5EA] text-[#2E7D32] border border-[#C8E6C9]";
  let isUrgent = false;

  if (session.status === "coming_soon") {
    label = "COMING SOON";
    shortLabel = "COMING SOON";
    style = "bg-[#EBF3FE] text-[#1E62D0] border border-[#BBDEFB]";
  } else if (session.status === "closed" || session.status === "cancelled") {
    label = session.status.toUpperCase();
    shortLabel = session.status.toUpperCase();
    style = "bg-[#F5F5F5] text-[#616161] border border-[#E0E0E0]";
  } else if (isSoldOut || session.status === "sold_out") {
    label = "SOLD OUT";
    shortLabel = "SOLD OUT";
    style = "bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]";
  } else if (spotsLeft <= 5) {
    label = `LAST CHANCE (${spotsLeft} LEFT)`;
    shortLabel = `${spotsLeft} LEFT`;
    style = "bg-[#FFEBEE] text-[#D32F2F] border border-[#FFCDD2] animate-pulse";
    isUrgent = true;
  } else if (spotsLeft <= 10 || session.status === "almost_full") {
    label = `FAST SEATS CLOSING (${spotsLeft} LEFT)`;
    shortLabel = "FILLING FAST";
    style = "bg-[#FFF4E5] text-[#B76E00] border border-[#FFE0B2]";
    isUrgent = true;
  } else {
    label = `AVAILABLE (${spotsLeft} SEATS)`;
    shortLabel = "AVAILABLE";
    style = "bg-[#EAF5EA] text-[#2E7D32] border border-[#C8E6C9]";
  }

  return {
    capacity,
    spotsLeft,
    isSoldOut,
    label,
    shortLabel,
    style,
    isUrgent
  };
}

// ─── All sessions (one unified list) ──────────────────────────
export const mockSessions: Session[] = [];

// Kept for backwards-compat but now computed from mockSessions
export const mockUpcomingSessions: Session[] = [];

export type Plant = {
  id: string;
  name: string;
  tag: string;
  image: string;
};

export type Host = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
};

export const mockPlants: Plant[] = [];

export const mockHosts: Host[] = [];

export const mockVenue: Venue = {
  id: "default",
  name: "Venue To Be Announced",
  address: "Madhapur, Hyderabad",
  city: "Hyderabad",
  image: "/Hoshina%20cafe.webp",
  images: ["/Hoshina%20cafe.webp"],
  mapsLink: "https://maps.google.com/?q=Madhapur+Hyderabad",
};

export const mockVenues: Venue[] = [];

export function getSessionVenue(session: { venueId?: string; venue?: string }): Venue {
  if (session.venueId) {
    const found = mockVenues.find(v => v.id === session.venueId);
    if (found) return found;
  }
  if (session.venue) {
    const found = mockVenues.find(v => session.venue?.toLowerCase().includes(v.name.toLowerCase()));
    if (found) return found;
  }
  return mockVenues[0] || mockVenue;
}

export type Faq = {
  id: string;
  question: string;
  answer: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
};

export const mockFaqs: Faq[] = [];

export const mockQuizQuestions: QuizQuestion[] = [];

// Bookings are added in real-time via the createBooking server action (app/actions.ts).
// This array starts empty — no fake/demo data.
export const mockBookings: Array<{
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
  paymentVerified?: boolean;
}> = [];

// ─── Editable Legal Policies ──────────────────────────────────
export type LegalDoc = {
  title: string;
  lastUpdated: string;
  content: string;
};

export const mockLegalDocs: {
  privacyPolicy: LegalDoc;
  termsAndConditions: LegalDoc;
} = {
  privacyPolicy: {
    title: "Privacy Policy",
    lastUpdated: "October 2026",
    content: `Welcome to Shrubs Bingo ("we", "our", or "us"). We respect your privacy and are committed to protecting the personal information you share with us when registering, booking tickets, or interacting with our website.

1. Information We Collect
When you book a session or participate in our plant bingo events, we collect:
• Contact Details: Your full name, email address, and mobile phone number for sending booking confirmations, session reminders, and digital game access.
• Booking & Ticket Details: Ticket selection (Solo or Duo/Couple), number of attendees, session date, and selected plant wishlists.
• Payment & Verification Data: 12-digit UPI Transaction ID (UTR number) submitted for payment verification. We do not store credit/debit card numbers or UPI PINs.

2. How We Use Your Information
We use your information exclusively to:
• Process and verify your seat reservation and generate your unique booking code.
• Communicate essential session updates, venue arrival directions, and timing changes.
• Coordinate live plant giveaways and verify winner allocations.
• Respond to your questions via email (hello@shrubsbingo.com) or Instagram.

3. Sharing and Disclosure
We do NOT sell, rent, or trade your personal information to third parties. Your details are only accessible to authorized Shrubs Bingo event hosts for on-site check-in and session operations.

4. Photography and Media
Our sessions are community-driven social gatherings. We may take candid photos and short video clips during events for our Instagram (@shrubsbingo) and community recaps. If you prefer not to be photographed, simply notify your host upon arrival.

5. Data Security & Retention
We maintain administrative and technical safeguards to keep your contact information secure. Booking details are retained only as long as necessary for administrative, legal, and operational purposes.

6. Contact Us
For any privacy questions or requests to update or delete your contact details, contact us at:
Email: hello@shrubsbingo.com
Location: Hyderabad, Telangana, India`,
  },
  termsAndConditions: {
    title: "Terms and Conditions",
    lastUpdated: "October 2026",
    content: `Please read these Terms and Conditions carefully before purchasing a ticket or participating in any Shrubs Bingo session or meeting. By completing a booking, you agree to be bound by these terms.

1. The Experience & Inclusions
• Shrubs Bingo is a plant-themed social bingo experience hosted at curated partner venues (e.g., HoshiSasa Cafe, Madhapur, Hyderabad).
• Every valid ticket includes admission to the scheduled session, an official game card and marker, a welcome beverage, and a guaranteed live potted plant to take home.
• Numbers are not used in our game — cards feature plant names, illustrations, and characteristics called out by the host.

2. Headcount Limits & Seat Capacity
• To maintain an intimate, high-quality social atmosphere, each session has a strict headcount limit (typically 15 to 50 seats).
• Applications and bookings automatically close once a session reaches capacity. Walk-ins cannot be guaranteed entry once a session is marked "Sold Out".

3. Payment Verification & Confirmation
• Ticket payments are processed via UPI. Your seat reservation is confirmed once the 12-digit UTR/transaction reference is submitted and verified by our hosts.
• Unverified bookings or invalid transaction references may result in ticket cancellation and release of seats back to the public pool.

4. Cancellation and Ticket Transfer Policy
• All ticket purchases are non-refundable once confirmed.
• If you are unable to attend, you may transfer your ticket to a friend or family member at no extra cost, provided you notify us via email or Instagram at least 24 hours prior to session start.

5. Venue Rules & Outside Food/Beverages
• Attendees must respect the guidelines of our partner cafes and venues.
• Outside food and alcoholic beverages are strictly prohibited. The host venue offers artisan coffee, snacks, and meals available for purchase.
• Please arrive 15 minutes before the scheduled start time to check in, grab your welcome beverage, and select your seats.

6. Code of Conduct
• Shrubs Bingo is an inclusive, welcoming community for plant lovers of all experience levels.
• Disruptive behavior, harassment, cheating, or disrespect toward hosts, venue staff, or fellow attendees will result in immediate removal without refund.

7. Liability
• While we take every care in hosting a safe and enjoyable event, attendees participate at their own risk. Shrubs Bingo and partner venues are not responsible for lost or damaged personal belongings.

8. Inquiries
If you have any questions regarding these Terms, please reach out to hello@shrubsbingo.com.`,
  },
};


