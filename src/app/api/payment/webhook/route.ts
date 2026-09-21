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
  await query(`UPDATE users SET is_paid=TRUE, plan=$1 WHERE id=$2`, [payment.plan, payment.user_id]);

  return NextResponse.json({ success: true });
}
