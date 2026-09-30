import { NextResponse } from 'next/server';
// @ts-ignore
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, ticketType, quantity, customer, attendees, wishlist } = body;

    if (!sessionId || !ticketType || !quantity || !customer) {
      return NextResponse.json({ error: { code: 'VALIDATION_FAILED', message: 'Missing required fields' } }, { status: 400 });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: { code: 'DATABASE_UNAVAILABLE', message: 'Database is not configured yet' } }, { status: 503 });
    }

    // The PRD mentions p_ticket_type_id as UUID, but the frontend passes a string like "solo".
    // We need to resolve the ticket type ID first.
    const { data: ticketData, error: ticketError } = await supabase
      .from('ticket_types')
      .select('id')
      .eq('code', ticketType)
      .single();
      
    if (ticketError || !ticketData) {
      return NextResponse.json({ error: { code: 'VALIDATION_FAILED', message: 'Invalid ticket type' } }, { status: 400 });
    }

    // Generate Idempotency Key and Token Hash
    const idempotencyKey = crypto.randomUUID();
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    // Call the RPC to hold seats
    const { data: booking, error: bookingError } = await supabase.rpc('create_booking_hold', {
      p_session_id: sessionId,
      p_ticket_type_id: ticketData.id,
      p_quantity: quantity,
      p_customer: customer,
      p_attendees: attendees || Array.from({ length: quantity * (ticketType === 'couple' ? 2 : 1) }).map(() => ({ full_name: customer.name })),
      p_idempotency_key: idempotencyKey,
      p_token_hash: tokenHash,
      p_attribution: {}
    });

    if (bookingError) {
      console.error('Booking Hold Error:', bookingError);
      return NextResponse.json({ error: { code: bookingError.message || 'INTERNAL_ERROR', message: 'Could not hold seats' } }, { status: 400 });
    }

    // TODO: Connect to actual Razorpay API here
    // For now, we simulate Razorpay Order Creation
    const mockRazorpayOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;

    return NextResponse.json({
      success: true,
      bookingCode: booking.code,
      razorpayOrderId: mockRazorpayOrderId,
      amountPaise: booking.total_paise,
      currency: booking.currency,
      token: rawToken // Send token back so client can access status page
    });

  } catch (error: any) {
    console.error('Create Booking Error:', error);
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' } }, { status: 500 });
  }
}
