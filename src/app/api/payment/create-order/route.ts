import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { migrate } from '@/lib/migrate';

const AMOUNT = 19900; // ₹199 in paise

interface UserRow { id: number; is_paid: boolean }

export async function POST() {
  try {
    await migrate();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const users = await query<UserRow>(`SELECT id, is_paid FROM users WHERE id=$1`, [session.userId]);
    if (!users.length) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (users[0].is_paid) return NextResponse.json({ alreadyPaid: true });

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: AMOUNT,
      currency: 'INR',
      receipt: `hk_${session.userId}_${Date.now()}`,
      notes: { userId: String(session.userId) },
    });

    await query(
      `INSERT INTO payments (user_id, razorpay_order_id, amount) VALUES ($1, $2, $3)`,
      [session.userId, order.id, AMOUNT]
    );

    return NextResponse.json({ orderId: order.id, amount: AMOUNT, currency: 'INR' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Order create failed' }, { status: 500 });
  }
}
