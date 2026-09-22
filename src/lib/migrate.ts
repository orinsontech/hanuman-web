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
    ALTER TABLE users ADD COLUMN IF NOT EXISTS plan VARCHAR(10)
  `);

  // NULL = plan never expires (full/lifetime/legacy trial). Only time-limited
  // plans (e.g. yearly) get a real timestamp here.
  await query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMP
  `);

  // Grandfather pre-existing paid users (from before per-plan pricing) into the full 40-day plan
  await query(`
    UPDATE users SET plan='full' WHERE is_paid=TRUE AND plan IS NULL
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
    ALTER TABLE payments ADD COLUMN IF NOT EXISTS plan VARCHAR(10) NOT NULL DEFAULT 'full'
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

  // Widen day_number to 42 — gives 2 hidden buffer/makeup days beyond the
  // marketed 40. UI and the certificate (still >=40 completed) are unaffected.
  await query(`ALTER TABLE daily_progress DROP CONSTRAINT IF EXISTS daily_progress_day_number_check`);
  await query(`ALTER TABLE daily_progress ADD CONSTRAINT daily_progress_day_number_check CHECK (day_number BETWEEN 1 AND 42)`);
}
