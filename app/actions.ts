"use server";

import { mockBookings, mockSessions, Session, Faq, QuizQuestion, mockFaqs, mockQuizQuestions, mockLegalDocs, LegalDoc, Host, Plant, mockHosts, mockPlants } from "@/data/mock";
import { Resend } from "resend";
import { cookies } from "next/headers";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@shrubsbingo.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const PRICES: Record<string, number> = { solo: 499, couple: 899 };

async function getSupabase() {
  try {
    return await createSupabaseServerClient();
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Step 1: Customer submits UTR → Save booking (pending) + alert admin
// Enforces headcount limit: automatically rejects if capacity is reached!
// ─────────────────────────────────────────────────────────────
export async function createBooking(data: {
  sessionId: string;
  name: string;
  email: string;
  phone: string;
  ticketType: "solo" | "couple";
  paxCount: number;
  wishlist: string[];
  utrNumber: string;
}) {
  const session = mockSessions.find(s => s.id === data.sessionId);
  const currentPax = mockBookings
    .filter(b => b.sessionId === data.sessionId)
    .reduce((sum, b) => sum + b.paxCount, 0);

  const capacityLimit = session?.capacity || 30;

  if (currentPax + data.paxCount > capacityLimit) {
    throw new Error(`This session has reached its full limit of ${capacityLimit} attendees. Applications are now closed.`);
  }

  const code = "SB-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const amount = PRICES[data.ticketType] ?? 0;

  const newBooking = {
    id: "b" + (mockBookings.length + 1),
    sessionId: data.sessionId,
    code,
    name: data.name,
    email: data.email,
    phone: data.phone,
    ticketType: data.ticketType,
    paxCount: data.paxCount,
    checkedIn: false,
    wishlist: data.wishlist,
    utrNumber: data.utrNumber,
    paymentVerified: false, // ← Starts as unverified
  };

  mockBookings.push(newBooking);

  // If session is now completely full, automatically update status to sold_out
  if (session && currentPax + data.paxCount >= capacityLimit) {
    session.status = "sold_out";
  }

  // Persist to Supabase if connected
  const supabase = await getSupabase();
  if (supabase) {
    try {
      await supabase.from("bookings").insert({
        code,
        status: "held",
        customer_name: data.name,
        customer_phone: data.phone,
        customer_email: data.email,
        seats_total: data.paxCount,
        subtotal_paise: amount * 100,
        total_paise: amount * 100,
        access_token_hash: code,
        idempotency_key: "ik_" + code,
        attribution: { utr: data.utrNumber, wishlist: data.wishlist },
      });
    } catch (e) {
      console.error("Supabase booking insert error:", e);
    }
  }

  // Alert admin to verify the UTR in their UPI app
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: [ADMIN_EMAIL],
    subject: `🔔 Verify Payment: ${data.name} — ${code}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #92400E; margin-bottom: 4px;">⚠️ Payment Verification Required</h2>
        <p style="color: #475569; margin-top: 0;">
          A customer has submitted a UPI payment. <strong>Please verify the UTR in your UPI app before confirming.</strong>
          Their booking confirmation email will only send after you mark it as paid.
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 14px;">
          <tr style="background: #FEF3C7;">
            <td style="padding: 10px 14px; font-weight: bold; color: #92400E; width: 40%;">Booking Code</td>
            <td style="padding: 10px 14px; font-family: monospace; font-weight: bold; font-size: 16px;">${code}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; color: #475569;">Name</td>
            <td style="padding: 10px 14px;">${data.name}</td>
          </tr>
          <tr style="background: #FAFAF8;">
            <td style="padding: 10px 14px; font-weight: bold; color: #475569;">Phone</td>
            <td style="padding: 10px 14px;">${data.phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; color: #475569;">Ticket</td>
            <td style="padding: 10px 14px; text-transform: capitalize;">${data.ticketType} &times; ${data.ticketType === "couple" ? data.paxCount / 2 : data.paxCount}</td>
          </tr>
          <tr style="background: #FAFAF8;">
            <td style="padding: 10px 14px; font-weight: bold; color: #475569;">Amount</td>
            <td style="padding: 10px 14px; font-weight: bold; font-size: 18px;">&#8377;${amount}</td>
          </tr>
          <tr style="background: #DCFCE7;">
            <td style="padding: 10px 14px; font-weight: bold; color: #16A34A;">UTR to Verify</td>
            <td style="padding: 10px 14px; font-family: monospace; font-weight: bold; color: #16A34A; font-size: 18px; letter-spacing: 0.08em;">${data.utrNumber}</td>
          </tr>
        </table>

        <div style="margin-top: 28px; padding: 16px; background: #FEF3C7; border-radius: 8px; border-left: 4px solid #F59E0B;">
          <strong style="color: #92400E;">Action Required:</strong>
          <p style="margin: 6px 0 0; color: #78350F; font-size: 14px;">
            Open PhonePe / GPay / your bank app and search for UTR <strong>${data.utrNumber}</strong>.
            If &#8377;${amount} is credited, click the button below to confirm the booking.
          </p>
        </div>

        <div style="margin-top: 24px; text-align: center;">
          <a href="${APP_URL}/admin/payments"
             style="display: inline-block; background: #16A34A; color: #ffffff; font-weight: bold; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-size: 15px; letter-spacing: 0.05em;">
            ✓ Open Payments — Mark as Paid
          </a>
        </div>

        <p style="color: #94A3B8; font-size: 12px; text-align: center; margin-top: 24px;">
          Do NOT confirm if you cannot find this UTR in your UPI app.
        </p>
      </div>
    `,
  }).catch(console.error);

  return { success: true, booking: newBooking };
}

// ─────────────────────────────────────────────────────────────
// Step 2: Admin clicks "Mark as Paid" → payment verified
// NOW the customer gets their booking confirmation email.
// ─────────────────────────────────────────────────────────────
export async function verifyPayment(bookingId: string) {
  const booking = (mockBookings as Array<typeof mockBookings[0] & { paymentVerified?: boolean }>)
    .find((b) => b.id === bookingId);

  if (!booking) {
    return { success: false, error: "Booking not found" };
  }

  // Mark as verified
  (booking as typeof booking & { paymentVerified: boolean }).paymentVerified = true;

  const amount = PRICES[booking.ticketType] ?? 0;

  // NOW send the customer their confirmation email
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: [booking.email],
    subject: `Your Shrubs Bingo Booking is Confirmed — ${booking.code}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #1F4E3A; font-size: 28px;">You're on the list! 🌿</h1>
        <p style="color: #475569; font-size: 16px;">
          Hi <strong>${booking.name}</strong>, your payment has been confirmed.
          Your spot at Shrubs Bingo is officially secured. Get ready to yell BINGO!
        </p>

        <div style="background: #F1F8E9; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; border: 1px solid #CDE4B3;">
          <div style="color: #6B8F52; font-size: 12px; font-weight: bold; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 6px;">Your Booking Code</div>
          <div style="font-family: monospace; font-size: 32px; font-weight: bold; color: #1F4E3A; letter-spacing: 0.12em;">${booking.code}</div>
          <div style="color: #6B8F52; font-size: 12px; margin-top: 6px;">Show this at the venue entrance</div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 10px 0; color: #475569; border-bottom: 1px solid #E2E8F0; font-weight: 600;">Ticket Type</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; text-align: right; text-transform: capitalize;">${booking.ticketType}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #475569; border-bottom: 1px solid #E2E8F0; font-weight: 600;">Attendees</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; text-align: right;">${booking.paxCount} ${booking.paxCount === 1 ? "person" : "people"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #475569; font-weight: 600;">Amount Paid</td>
            <td style="padding: 10px 0; text-align: right; font-weight: bold; font-size: 18px;">&#8377;${amount}</td>
          </tr>
        </table>

        <div style="background: #FFFBEB; border-radius: 8px; padding: 16px; font-size: 14px; color: #78350F; border: 1px solid #FDE68A;">
          <strong>What to bring:</strong> Just yourself and your love for plants. We'll handle everything else — bingo cards, welcome drinks, and a live plant to take home! 🌱
        </div>

        <p style="color: #94A3B8; font-size: 12px; margin-top: 32px; text-align: center;">
          Shrubs Bingo &bull; HoshiSasa Cafe, Madhapur, Hyderabad<br>
          Questions? DM us on Instagram @shrubsbingo
        </p>
      </div>
    `,
  }).catch(console.error);

  // Persist confirmed status to Supabase if connected
  const supabase = await getSupabase();
  if (supabase) {
    try {
      await supabase
        .from("bookings")
        .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
        .eq("code", booking.code);
    } catch (e) {
      console.error("Supabase payment verify error:", e);
    }
  }

  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// Admin Session Management Actions
// ─────────────────────────────────────────────────────────────
export async function createSessionAction(data: {
  day: string;
  date: string;
  time: string;
  venueId?: string;
  venue: string;
  capacity: number;
  isFeatured?: boolean;
  soloPrice: number;
  couplePrice: number;
  status: "available" | "almost_full" | "sold_out" | "closed" | "coming_soon" | "cancelled";
}) {
  const newId = "s" + (mockSessions.length + 1);
  const now = new Date();
  const dateISO = now.toISOString().split("T")[0];

  const session: Session = {
    id: newId,
    dateISO,
    day: data.day,
    date: data.date,
    time: data.time,
    venueId: data.venueId || "v1",
    venue: data.venue,
    capacity: Number(data.capacity) || 30,
    isFeatured: Boolean(data.isFeatured),
    status: data.status,
    prices: {
      solo: Number(data.soloPrice),
      couple: Number(data.couplePrice),
    },
  };

  mockSessions.push(session);

  const supabase = await getSupabase();
  if (supabase) {
    try {
      await supabase.from("sessions").insert({
        starts_at: session.dateISO + "T10:30:00Z",
        ends_at: session.dateISO + "T12:00:00Z",
        booking_cutoff_at: session.dateISO + "T09:30:00Z",
        capacity: session.capacity,
        status: session.status === "available" ? "published" : session.status,
        notes: `${session.time} | ${session.venue}`,
      });
    } catch (e) {
      console.error("Supabase session insert error:", e);
    }
  }

  return { success: true, session };
}

export async function updateSessionAction(id: string, data: Partial<Session>) {
  const session = mockSessions.find((s) => s.id === id);
  if (!session) return { success: false, error: "Session not found" };

  Object.assign(session, data);

  const supabase = await getSupabase();
  if (supabase) {
    try {
      await supabase
        .from("sessions")
        .update({
          capacity: data.capacity,
          status: data.status === "available" ? "published" : data.status,
        })
        .eq("id", id);
    } catch (e) {
      console.error("Supabase session update error:", e);
    }
  }

  return { success: true, session };
}

export async function toggleFeaturedSessionAction(id: string) {
  const session = mockSessions.find((s) => s.id === id);
  if (!session) return { success: false, error: "Session not found" };

  session.isFeatured = !session.isFeatured;
  return { success: true, isFeatured: session.isFeatured };
}

export async function deleteSessionAction(id: string) {
  const index = mockSessions.findIndex((s) => s.id === id);
  if (index !== -1) {
    mockSessions.splice(index, 1);
  }

  const supabase = await getSupabase();
  if (supabase) {
    try {
      await supabase.from("sessions").delete().eq("id", id);
    } catch (e) {
      console.error("Supabase session delete error:", e);
    }
  }

  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// Admin FAQ Management Actions
// ─────────────────────────────────────────────────────────────
export async function createFaqAction(data: { question: string; answer: string }) {
  const newId = "f" + (mockFaqs.length + 1);
  const newFaq: Faq = {
    id: newId,
    question: data.question.trim(),
    answer: data.answer.trim(),
  };
  mockFaqs.push(newFaq);
  return { success: true, faq: newFaq };
}

export async function updateFaqAction(id: string, data: Partial<Faq>) {
  const faq = mockFaqs.find(f => f.id === id);
  if (!faq) return { success: false, error: "FAQ not found" };

  if (data.question) faq.question = data.question.trim();
  if (data.answer) faq.answer = data.answer.trim();

  return { success: true, faq };
}

export async function deleteFaqAction(id: string) {
  const index = mockFaqs.findIndex(f => f.id === id);
  if (index !== -1) {
    mockFaqs.splice(index, 1);
  }
  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// Admin Quiz Question Management Actions
// ─────────────────────────────────────────────────────────────
export async function createQuizQuestionAction(data: {
  question: string;
  options: string[];
  answerIndex: number;
}) {
  const newId = "q" + (mockQuizQuestions.length + 1);
  const newQ: QuizQuestion = {
    id: newId,
    question: data.question.trim(),
    options: data.options.map(o => o.trim()),
    answerIndex: Number(data.answerIndex) || 0,
  };
  mockQuizQuestions.push(newQ);
  return { success: true, question: newQ };
}

export async function updateQuizQuestionAction(id: string, data: Partial<QuizQuestion>) {
  const q = mockQuizQuestions.find(item => item.id === id);
  if (!q) return { success: false, error: "Quiz question not found" };

  if (data.question) q.question = data.question.trim();
  if (data.options) q.options = data.options.map(o => o.trim());
  if (data.answerIndex !== undefined) q.answerIndex = Number(data.answerIndex);

  return { success: true, question: q };
}

export async function deleteQuizQuestionAction(id: string) {
  const index = mockQuizQuestions.findIndex(item => item.id === id);
  if (index !== -1) {
    mockQuizQuestions.splice(index, 1);
  }
  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// Admin Legal Documents & Policies Management Actions
// ─────────────────────────────────────────────────────────────
export async function updateLegalDocAction(
  type: "privacyPolicy" | "termsAndConditions",
  data: { title?: string; lastUpdated?: string; content: string }
) {
  if (!mockLegalDocs[type]) {
    return { success: false, error: "Document type not found" };
  }

  if (data.title) mockLegalDocs[type].title = data.title.trim();
  if (data.lastUpdated) mockLegalDocs[type].lastUpdated = data.lastUpdated.trim();
  if (data.content) mockLegalDocs[type].content = data.content.trim();

  return { success: true, doc: mockLegalDocs[type] };
}

// ─────────────────────────────────────────────────────────────
// Data Fetch Actions (Supabase with in-memory fallback)
// ─────────────────────────────────────────────────────────────
export async function getHostsAction(): Promise<Host[]> {
  const supabase = await getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("hosts")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((h: any) => ({
          id: h.id,
          name: h.name,
          role: h.role,
          bio: h.bio || "",
          image: h.image_url || "/placeholder-host.jpg",
        }));
      }
    } catch (e) {
      console.error("Supabase getHosts error:", e);
    }
  }
  return mockHosts;
}

export async function getPlantsAction(): Promise<Plant[]> {
  const supabase = await getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("plants")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((p: any) => ({
          id: p.id,
          name: p.name,
          tag: p.blurb || "",
          image: p.image_url || "/placeholder-plant.jpg",
        }));
      }
    } catch (e) {
      console.error("Supabase getPlants error:", e);
    }
  }
  return mockPlants;
}

// ─────────────────────────────────────────────────────────────
// Admin Hosts Management Actions
// ─────────────────────────────────────────────────────────────
export async function createHostAction(data: {
  name: string;
  role: string;
  bio: string;
  image: string;
}): Promise<{ success: true; host: Host } | { success: false; error: string }> {
  if (!data.name.trim()) return { success: false, error: "Host name is required" };
  const newId = "h" + (mockHosts.length + 1);
  const newHost: Host = {
    id: newId,
    name: data.name.trim(),
    role: data.role.trim(),
    bio: data.bio.trim(),
    image: data.image.trim(),
  };
  mockHosts.push(newHost);

  const supabase = await getSupabase();
  if (supabase) {
    try {
      const { data: inserted } = await supabase.from("hosts").insert({
        name: newHost.name,
        role: newHost.role,
        bio: newHost.bio,
        image_url: newHost.image,
        is_active: true,
      }).select().single();
      if (inserted?.id) {
        newHost.id = inserted.id;
      }
    } catch (e) {
      console.error("Supabase host insert error:", e);
    }
  }

  return { success: true, host: newHost };
}

export async function updateHostAction(
  id: string, 
  data: Partial<Host>
): Promise<{ success: true; host: Host } | { success: false; error: string }> {
  let host = mockHosts.find((h) => h.id === id || h.name === data.name);
  if (!host) {
    host = {
      id,
      name: data.name || "",
      role: data.role || "",
      bio: data.bio || "",
      image: data.image || ""
    };
    mockHosts.push(host);
  }

  const oldName = host.name;
  if (data.name) host.name = data.name.trim();
  if (data.role) host.role = data.role.trim();
  if (data.bio) host.bio = data.bio.trim();
  if (data.image) host.image = data.image.trim();

  const supabase = await getSupabase();
  if (supabase) {
    try {
      const query = id.includes("-")
        ? supabase.from("hosts").update({
            name: host.name,
            role: host.role,
            bio: host.bio,
            image_url: host.image,
          }).eq("id", id)
        : supabase.from("hosts").update({
            name: host.name,
            role: host.role,
            bio: host.bio,
            image_url: host.image,
          }).eq("name", oldName);
      await query;
    } catch (e) {
      console.error("Supabase host update error:", e);
    }
  }

  return { success: true, host };
}

export async function deleteHostAction(id: string) {
  const host = mockHosts.find((h) => h.id === id);
  const index = mockHosts.findIndex((h) => h.id === id);
  if (index !== -1) {
    mockHosts.splice(index, 1);
  }

  const supabase = await getSupabase();
  if (supabase) {
    try {
      if (id.includes("-")) {
        await supabase.from("hosts").delete().eq("id", id);
      } else if (host) {
        await supabase.from("hosts").delete().eq("name", host.name);
      }
    } catch (e) {
      console.error("Supabase host delete error:", e);
    }
  }

  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// Admin Plants Inventory Management Actions
// ─────────────────────────────────────────────────────────────
export async function createPlantAction(data: {
  name: string;
  tag: string;
  image: string;
}): Promise<{ success: true; plant: Plant } | { success: false; error: string }> {
  if (!data.name.trim()) return { success: false, error: "Plant name is required" };
  const newId = "p" + (mockPlants.length + 1);
  const newPlant: Plant = {
    id: newId,
    name: data.name.trim(),
    tag: data.tag.trim(),
    image: data.image.trim(),
  };
  mockPlants.push(newPlant);

  const supabase = await getSupabase();
  if (supabase) {
    try {
      const { data: inserted } = await supabase.from("plants").insert({
        name: newPlant.name,
        blurb: newPlant.tag,
        image_url: newPlant.image,
        in_giveaway: true,
        in_bingo_pool: true,
      }).select().single();
      if (inserted?.id) {
        newPlant.id = inserted.id;
      }
    } catch (e) {
      console.error("Supabase plant insert error:", e);
    }
  }

  return { success: true, plant: newPlant };
}

export async function updatePlantAction(
  id: string, 
  data: Partial<Plant>
): Promise<{ success: true; plant: Plant } | { success: false; error: string }> {
  let plant = mockPlants.find((p) => p.id === id || p.name === data.name);
  if (!plant) {
    plant = {
      id,
      name: data.name || "",
      tag: data.tag || "",
      image: data.image || ""
    };
    mockPlants.push(plant);
  }

  const oldName = plant.name;
  if (data.name) plant.name = data.name.trim();
  if (data.tag) plant.tag = data.tag.trim();
  if (data.image) plant.image = data.image.trim();

  const supabase = await getSupabase();
  if (supabase) {
    try {
      const query = id.includes("-")
        ? supabase.from("plants").update({
            name: plant.name,
            blurb: plant.tag,
            image_url: plant.image,
          }).eq("id", id)
        : supabase.from("plants").update({
            name: plant.name,
            blurb: plant.tag,
            image_url: plant.image,
          }).eq("name", oldName);
      await query;
    } catch (e) {
      console.error("Supabase plant update error:", e);
    }
  }

  return { success: true, plant };
}

export async function deletePlantAction(id: string) {
  const plant = mockPlants.find((p) => p.id === id);
  const index = mockPlants.findIndex((p) => p.id === id);
  if (index !== -1) {
    mockPlants.splice(index, 1);
  }

  const supabase = await getSupabase();
  if (supabase) {
    try {
      if (id.includes("-")) {
        await supabase.from("plants").delete().eq("id", id);
      } else if (plant) {
        await supabase.from("plants").delete().eq("name", plant.name);
      }
    } catch (e) {
      console.error("Supabase plant delete error:", e);
    }
  }

  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// Admin Authentication Actions (Email & Password)
// ─────────────────────────────────────────────────────────────
export async function adminLoginAction(data: { email: string; password: string }) {
  const email = (data.email || "").trim().toLowerCase();
  const password = (data.password || "").trim();

  if (!email || !password) {
    return { success: false, error: "Please enter both email and password." };
  }

  const adminEmail = (process.env.ADMIN_EMAIL || "shrubsbingo@gmail.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "Shrubsbingo@_02";

  let isAuthenticated = false;
  let userEmail = "";

  // Strategy 1: Check admin credentials from env (.env.local)
  if (email === adminEmail && password === adminPassword) {
    isAuthenticated = true;
    userEmail = adminEmail;
  }

  // Strategy 2: Check via Supabase Auth
  if (!isAuthenticated) {
    try {
      const supabase = await getSupabase();
      if (supabase) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (!authError && authData?.user) {
          isAuthenticated = true;
          userEmail = authData.user.email || email;
        }
      }
    } catch (err) {
      console.error("Supabase auth login check:", err);
    }
  }

  if (!isAuthenticated) {
    return { 
      success: false, 
      error: "Invalid email or password. Please verify your credentials." 
    };
  }

  // Set secure auth session cookie
  const cookieStore = await cookies();
  const sessionPayload = JSON.stringify({ email: userEmail, time: Date.now() });
  const sessionToken = Buffer.from(sessionPayload).toString("base64");

  cookieStore.set("sb_admin_auth", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return { success: true, email: userEmail };
}

export async function adminLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("sb_admin_auth");

  try {
    const supabase = await getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
  } catch (err) {
    console.error("Supabase signOut error:", err);
  }

  return { success: true };
}

export async function getAdminSessionAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sb_admin_auth")?.value;
  if (!token) return null;

  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    return decoded as { email: string; time: number };
  } catch {
    return null;
  }
}
