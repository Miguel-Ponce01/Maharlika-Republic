const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const pool = new Pool({
    connectionString: process.env.DIRECT_URL,
  });

  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Connected successfully:', res.rows[0]);
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    await pool.end();
  }
}
main();
