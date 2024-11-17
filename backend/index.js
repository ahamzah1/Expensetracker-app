const express = require('express');
const { Pool } = require('pg');
require('dotenv').config(); // Optional if using environment variables directly in Docker Compose

// Default values for environment variables
const POSTGRES_HOST = process.env.POSTGRES_HOST || '';
const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'postgres';
const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || 'postgres';

// Check if POSTGRES_HOST is provided
if (!POSTGRES_HOST) {
  console.error(
    '[Error] POSTGRES_HOST environment variable is not set. Exiting.'
  );
  process.exit(1);
}

const POSTGRES_PORT = 5432;
const POSTGRES_ADDR = `${POSTGRES_HOST}:${POSTGRES_PORT}`;

console.log(`[Initialization] Configuring PostgreSQL connection with:
  POSTGRES_HOST:      ${POSTGRES_HOST}
  POSTGRES_USER:      ${POSTGRES_USER}
  POSTGRES_PASSWORD:  ${POSTGRES_PASSWORD}
  POSTGRES_DATABASE:  ${POSTGRES_DATABASE}
  POSTGRES_PORT:      ${POSTGRES_PORT}
`);

// Create the PostgreSQL client
const pool = new Pool({
  host: POSTGRES_HOST,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DATABASE,
  port: POSTGRES_PORT,
});

// Function to initialize PostgreSQL connection with retries
const initializePostgresClient = async () => {
  console.log(`[Initialization] Attempting to connect to PostgreSQL at ${POSTGRES_ADDR}`);
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      const client = await pool.connect();
      console.log('[Initialization] Connected to PostgreSQL successfully.');
      client.release();
      return true;
    } catch (err) {
      console.error(`[Initialization] Attempt ${attempt}: Failed to connect to PostgreSQL. Retrying in 5 seconds...`);
      if (attempt === 10) {
        console.error('[Initialization] Exhausted all retry attempts. Exiting...');
        console.error(err);
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

// Initialize the database connection
initializePostgresClient();

// Initialize Express
const app = express();
app.use(express.json());

// Test database connection
pool.connect((err) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
  } else {
    console.log('Connected to the PostgreSQL database.');
  }
});

// Routes
app.get('/api/expenses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM expenses');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

app.post('/api/expenses', async (req, res) => {
  const { description, amount, date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO expenses (description, amount, date) VALUES ($1, $2, $3) RETURNING *',
      [description, amount, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM expenses WHERE id = $1', [id]);
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
