import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

interface PaymentRow { id: number; user_id: number }

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    // Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSig !== razorpay_signature) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    // Update payment record
    const payments = await query<PaymentRow>(
      `SELECT id, user_id FROM payments WHERE razorpay_order_id=$1`,
      [razorpay_order_id]
    );

    if (!payments.length || payments[0].user_id !== session.userId) {
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }

    await query(
      `UPDATE payments SET razorpay_payment_id=$1, razorpay_signature=$2, status='success' WHERE id=$3`,
      [razorpay_payment_id, razorpay_signature, payments[0].id]
    );

    // Mark user as paid
    await query(`UPDATE users SET is_paid=TRUE WHERE id=$1`, [session.userId]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
