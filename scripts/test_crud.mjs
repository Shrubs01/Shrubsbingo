import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

async function testCrud() {
  console.log('Testing CRUD on Plants...');
  // 1. Create
  const { data: newPlant, error: createError } = await supabase
    .from('plants')
    .insert({
      name: 'Calathea Orbifolia',
      blurb: 'Dramatic foliage.',
      image_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b',
      in_giveaway: true,
      in_bingo_pool: true
    })
    .select()
    .single();

  if (createError) throw createError;
  console.log('Created plant:', newPlant.id, newPlant.name);

  // 2. Read
  const { data: fetched, error: readError } = await supabase
    .from('plants')
    .select('*')
    .eq('id', newPlant.id)
    .single();
  if (readError) throw readError;
  console.log('Read plant:', fetched.name, 'blurb:', fetched.blurb);

  // 3. Update
  const { data: updated, error: updateError } = await supabase
    .from('plants')
    .update({ blurb: 'Loves high humidity and indirect light.' })
    .eq('id', newPlant.id)
    .select()
    .single();
  if (updateError) throw updateError;
  console.log('Updated plant:', updated.name, 'new blurb:', updated.blurb);

  // 4. Delete
  const { error: deleteError } = await supabase
    .from('plants')
    .delete()
    .eq('id', newPlant.id);
  if (deleteError) throw deleteError;
  console.log('Deleted plant successfully!');

  console.log('Testing CRUD on Hosts...');
  // 1. Create Host
  const { data: newHost, error: hostCreateError } = await supabase
    .from('hosts')
    .insert({
      name: 'Rahul',
      role: 'Plant Doctor',
      bio: 'Diagnoses root rot from 10 feet away.',
      image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2'
    })
    .select()
    .single();
  if (hostCreateError) throw hostCreateError;
  console.log('Created host:', newHost.id, newHost.name);

  // 2. Read & Update Host
  const { data: updatedHost, error: hostUpdateError } = await supabase
    .from('hosts')
    .update({ role: 'Lead Botanist' })
    .eq('id', newHost.id)
    .select()
    .single();
  if (hostUpdateError) throw hostUpdateError;
  console.log('Updated host:', updatedHost.name, 'role:', updatedHost.role);

  // 3. Delete Host
  const { error: hostDeleteError } = await supabase
    .from('hosts')
    .delete()
    .eq('id', newHost.id);
  if (hostDeleteError) throw hostDeleteError;
  console.log('Deleted host successfully!');

  console.log('ALL CRUD TESTS PASSED!');
}

testCrud().catch(console.error);
