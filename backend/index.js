const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const POSTGRES_HOST = process.env.POSTGRES_HOST || '';
const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'postgres';
const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || 'postgres';
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

if (!POSTGRES_HOST) {
  console.error('[Error] POSTGRES_HOST environment variable is not set. Exiting.');
  process.exit(1);
}

const POSTGRES_PORT = 5432;

const pool = new Pool({
  host: POSTGRES_HOST,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DATABASE,
  port: POSTGRES_PORT,
});

const initializePostgresClient = async () => {
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      const client = await pool.connect();
      console.log('[Initialization] Connected to PostgreSQL successfully.');
      client.release();
      return true;
    } catch (err) {
      console.error(`[Initialization] Attempt ${attempt}: Failed to connect. Retrying in 5 seconds...`);
      if (attempt === 10) {
        console.error('[Initialization] Exhausted retries. Exiting...');
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};
initializePostgresClient();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.REQUEST_ORIGIN }));

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// --- User Endpoints ---

app.post('/api/signup', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, hashedPassword, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to sign up' });
  }
});

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

// --- Expenses Endpoints ---

app.get('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, description, amount, date, category_id, notification_period FROM expenses WHERE user_id = $1',
      [req.user.id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

app.post('/api/expenses', authenticateToken, async (req, res) => {
  const { description, amount, date, category_id, notification_period } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO expenses (user_id, description, amount, date, category_id, notification_period) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.user.id, description, amount, date, category_id, notification_period]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

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

// --- Notification Endpoints ---

app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT email FROM users WHERE id = $1', [req.user.id]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notification settings' });
  }
});

app.put('/api/notifications', authenticateToken, async (req, res) => {
  const { email, notificationDays } = req.body;
  try {
    await pool.query('UPDATE users SET email = $1 WHERE id = $2', [email, req.user.id]);
    res.status(200).json({ message: 'Notification settings updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update notification settings' });
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
