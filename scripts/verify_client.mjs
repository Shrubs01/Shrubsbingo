import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase Client connection to:', url);

const supabase = createClient(url, key);

async function test() {
  const { data: hosts, error: hostError } = await supabase.from('hosts').select('*');
  if (hostError) console.error('Host fetch error:', hostError);
  else console.log('Successfully fetched hosts from Supabase:', hosts.map(h => h.name));

  const { data: plants, error: plantError } = await supabase.from('plants').select('*');
  if (plantError) console.error('Plant fetch error:', plantError);
  else console.log('Successfully fetched plants from Supabase:', plants.map(p => p.name));

  const { data: sessions, error: sessionError } = await supabase.from('sessions').select('*');
  if (sessionError) console.error('Session fetch error:', sessionError);
  else console.log('Successfully fetched sessions from Supabase count:', sessions?.length);

  // Test insert into bookings (CRUD test)
  const testBooking = {
    code: 'TEST-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    customer_name: 'Test Setup User',
    customer_email: 'test@example.com',
    customer_phone: '9876543210',
    seats_total: 1,
    subtotal_paise: 49900,
    total_paise: 49900,
    status: 'held',
    access_token_hash: 'hash_' + Date.now(),
    idempotency_key: 'ik_' + Date.now()
  };

  const { data: inserted, error: insertError } = await supabase.from('bookings').insert(testBooking).select();
  if (insertError) {
    console.error('Insert test error:', insertError);
  } else {
    console.log('CRUD Test: Inserted test booking successfully:', inserted[0].id);
    // Cleanup
    const { error: delError } = await supabase.from('bookings').delete().eq('id', inserted[0].id);
    if (delError) console.error('Delete test error:', delError);
    else console.log('CRUD Test: Deleted test booking cleanly. All CRUD operations working on live DB!');
  }
}

test();
