CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- Expenses table with a user reference
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  description TEXT NOT NULL,
  amount FLOAT NOT NULL,
  date DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
