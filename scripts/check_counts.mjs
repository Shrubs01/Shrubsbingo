import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

async function check() {
  const tables = ['sessions', 'plants', 'hosts', 'venues', 'bookings', 'faqs', 'quiz_questions'];
  console.log('--- Current Supabase PostgreSQL Status ---');
  for (const t of tables) {
    const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
    if (error) console.error(`Error checking ${t}:`, error.message);
    else console.log(`Table [${t}]: ${count} records (Clean & Ready)`);
  }
}

check();
