const express = require('express');
const { Pool } = require('pg');
require('dotenv').config(); // Optional if using environment variables directly in Docker Compose
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Default values for environment variables
const POSTGRES_HOST = process.env.POSTGRES_HOST || '';
const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'postgres';
const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || 'postgres';
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

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

app.use(cors({
    origin: 'http://localhost:3000', // Allow only your React app
  }));

// Test database connection
pool.connect((err) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
  } else {
    console.log('Connected to the PostgreSQL database.');
  }
});

// Utility function: Authenticate JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user; // Attach user info to the request
    next();
  });
};

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to sign up' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

// Get user-specific expenses
app.get('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, description, amount, date FROM expenses WHERE user_id = $1',
      [req.user.id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Add a new expense for the logged-in user
app.post('/api/expenses', authenticateToken, async (req, res) => {
  const { description, amount, date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO expenses (user_id, description, amount, date) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, description, amount, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// Delete an expense for the logged-in user
app.delete('/api/expenses/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM expenses WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
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
