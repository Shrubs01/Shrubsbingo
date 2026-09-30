import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

async function run() {
  console.log('Connecting to Supabase PostgreSQL...');
  
  // Option 1: Direct pooler connection
  const client = new Client({
    host: 'aws-0-ap-northeast-2.pooler.supabase.com',
    port: 5432,
    user: 'postgres.hggegtvadqairesrvezf',
    password: 'Shrubsbingo@_02',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Successfully connected to Supabase PostgreSQL!');

    const sqlPath = path.resolve('supabase', 'complete_setup.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing complete_setup.sql...');
    await client.query(sql);
    console.log('complete_setup.sql executed successfully!');

    // Verify tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('Public tables created:', res.rows.map(r => r.table_name));

    // Verify row counts
    for (const table of ['venues', 'hosts', 'plants', 'sessions', 'bookings', 'faqs', 'quiz_questions']) {
      try {
        const countRes = await client.query(`SELECT COUNT(*) FROM "${table}"`);
        console.log(`Table "${table}" row count:`, countRes.rows[0].count);
      } catch (err) {
        console.log(`Could not query table "${table}":`, err.message);
      }
    }

    await client.end();
    console.log('Done!');
  } catch (err) {
    console.error('Connection/Execution failed:', err);
    await client.end().catch(() => {});
    process.exit(1);
  }
}

run();
