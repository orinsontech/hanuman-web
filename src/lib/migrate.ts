import { query } from './db';

export async function migrate() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      phone VARCHAR(15) UNIQUE NOT NULL,
      name VARCHAR(100),
      is_paid BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // Add is_paid column if it doesn't exist (for existing installs)
  await query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT FALSE
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS otp_codes (
      id SERIAL PRIMARY KEY,
      phone VARCHAR(15) NOT NULL,
      code VARCHAR(6) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      razorpay_order_id VARCHAR(100) NOT NULL,
      razorpay_payment_id VARCHAR(100),
      razorpay_signature VARCHAR(300),
      amount INTEGER NOT NULL DEFAULT 19900,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS daily_progress (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 40),
      completed_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, day_number)
    )
  `);
}
