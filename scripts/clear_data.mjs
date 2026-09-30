import pg from 'pg';

const { Client } = pg;

async function clearDatabase() {
  console.log('Connecting to Supabase PostgreSQL to clear dummy data...');
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
    console.log('Connected!');

    console.log('Truncating tables with CASCADE...');
    await client.query(`
      TRUNCATE TABLE 
        payments, 
        attendees, 
        bookings, 
        session_ticket_types, 
        sessions, 
        events, 
        plants, 
        hosts, 
        faqs, 
        quiz_questions, 
        venues 
      CASCADE;
    `);

    console.log('All dummy data cleared from tables!');

    // Check counts
    const tables = ['bookings', 'sessions', 'plants', 'hosts', 'venues', 'faqs', 'quiz_questions'];
    for (const table of tables) {
      const res = await client.query(`SELECT COUNT(*) FROM "${table}"`);
      console.log(`Table "${table}" count:`, res.rows[0].count);
    }

    await client.end();
    console.log('Done!');
  } catch (err) {
    console.error('Error clearing data:', err);
    await client.end().catch(() => {});
    process.exit(1);
  }
}

clearDatabase();
