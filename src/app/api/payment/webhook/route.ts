import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { PlanId } from '@/lib/plans';

interface PaymentRow { id: number; user_id: number; status: string; plan: PlanId }

interface RazorpayWebhookBody {
  event: string;
  payload: {
    payment: {
      entity: {
        id: string;
        order_id: string;
      };
    };
  };
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-razorpay-signature');
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 400 });
  }

  const expectedSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  if (expectedSignature !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const body = JSON.parse(rawBody) as RazorpayWebhookBody;

  if (body.event === 'payment.failed') {
    const { order_id: orderId } = body.payload.payment.entity;
    const payments = await query<PaymentRow>(
      `SELECT id, status FROM payments WHERE razorpay_order_id=$1`,
      [orderId]
    );
    const payment = payments[0];
    // Only downgrade a still-pending order — a later retry on the same order
    // may have already succeeded (payment.captured), which must win.
    if (payment && payment.status === 'pending') {
      await query(`UPDATE payments SET status='failed' WHERE id=$1`, [payment.id]);
    }
    return NextResponse.json({ success: true });
  }

  if (body.event !== 'payment.captured') {
    return NextResponse.json({ success: true });
  }

  const { id: paymentId, order_id: orderId } = body.payload.payment.entity;

  const payments = await query<PaymentRow>(
    `SELECT id, user_id, status, plan FROM payments WHERE razorpay_order_id=$1`,
    [orderId]
  );
  const payment = payments[0];
  if (!payment || payment.status === 'success') {
    return NextResponse.json({ success: true });
  }

  await query(
    `UPDATE payments SET razorpay_payment_id=$1, status='success' WHERE id=$2`,
    [paymentId, payment.id]
  );
  // Never downgrade: if the user already upgraded via another order in the meantime
  // (e.g. two orders created before either was paid), keep their higher plan.
  await query(
    `UPDATE users SET is_paid=TRUE, plan=$1 WHERE id=$2
     AND (plan IS NULL OR
          (CASE plan WHEN 'trial' THEN 0 WHEN 'full' THEN 1 WHEN 'lifetime' THEN 2 END)
          < (CASE $1 WHEN 'trial' THEN 0 WHEN 'full' THEN 1 WHEN 'lifetime' THEN 2 END))`,
    [payment.plan, payment.user_id]
  );

  return NextResponse.json({ success: true });
}
