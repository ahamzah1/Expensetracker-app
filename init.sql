-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL -- Added email for notification system
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

-- Notification preferences table
CREATE TABLE notification_preferences (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  notification_period INT NOT NULL, -- Time period in days before expense due date
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
