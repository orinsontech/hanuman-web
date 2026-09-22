import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { sendMetaPurchaseEvent } from '@/lib/meta-capi';
import { sendGooglePurchaseEvent, parseGaClientId } from '@/lib/ga4-mp';
import { PLANS, PlanId, planRankSqlCase } from '@/lib/plans';

interface PaymentRow { id: number; user_id: number; status: string; plan: PlanId; amount: number }

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body as Record<string, string>;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
  }

  const payments = await query<PaymentRow>(
    `SELECT id, user_id, status, plan, amount FROM payments WHERE razorpay_order_id=$1`,
    [razorpay_order_id]
  );
  const payment = payments[0];
  if (!payment || payment.user_id !== session.userId) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  if (payment.status === 'success') {
    return NextResponse.json({ success: true });
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    await query(`UPDATE payments SET status='failed' WHERE id=$1`, [payment.id]);
    return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 });
  }

  await query(
    `UPDATE payments SET razorpay_payment_id=$1, razorpay_signature=$2, status='success' WHERE id=$3`,
    [razorpay_payment_id, razorpay_signature, payment.id]
  );
  const durationDays = PLANS[payment.plan].durationDays;
  const expiresAt = durationDays ? new Date(Date.now() + durationDays * 86400000) : null;

  // Never downgrade: if the user already upgraded via another order in the meantime
  // (e.g. two orders created before either was paid), keep their higher plan. The
  // last clause allows renewing the same plan once it has already expired.
  await query(
    `UPDATE users SET is_paid=TRUE, plan=$1, plan_expires_at=$2 WHERE id=$3
     AND (plan IS NULL
          OR ${planRankSqlCase('plan')} < ${planRankSqlCase('$1')}
          OR (plan = $1 AND plan_expires_at IS NOT NULL AND plan_expires_at < NOW()))`,
    [payment.plan, expiresAt, session.userId]
  );

  sendMetaPurchaseEvent({
    phone: session.phone,
    value: payment.amount / 100,
    currency: 'INR',
    eventId: `purchase_${razorpay_payment_id}`,
    ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
    userAgent: req.headers.get('user-agent') || undefined,
    fbp: req.cookies.get('_fbp')?.value,
    fbc: req.cookies.get('_fbc')?.value,
    sourceUrl: req.headers.get('referer') || undefined,
  }).catch(() => {});

  sendGooglePurchaseEvent({
    clientId: parseGaClientId(req.cookies.get('_ga')?.value),
    value: payment.amount / 100,
    currency: 'INR',
    eventId: `purchase_${razorpay_payment_id}`,
  }).catch(() => {});

  return NextResponse.json({ success: true });
}
