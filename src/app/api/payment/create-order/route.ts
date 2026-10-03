import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { getRazorpay } from '@/lib/razorpay';
import { PlanId, isValidPlan, canPurchase, purchasePricePaise } from '@/lib/plans';

interface UserRow { id: number; is_paid: boolean; plan: PlanId | null; plan_expires_at: string | null }

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const planId = body.planId;
  if (!isValidPlan(planId)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const users = await query<UserRow>(`SELECT id, is_paid, plan, plan_expires_at FROM users WHERE id=$1`, [session.userId]);
  if (!users.length) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  const { plan: currentPlan, plan_expires_at: expiresAt } = users[0];

  if (!canPurchase(planId, currentPlan, expiresAt)) {
    return NextResponse.json({ error: 'यह प्लान आपके लिए उपलब्ध नहीं है' }, { status: 409 });
  }

  const amount = purchasePricePaise(planId, currentPlan, expiresAt);

  try {
    const order = await getRazorpay().orders.create({
      amount,
      currency: 'INR',
      receipt: `hk_${session.userId}_${Date.now()}`,
      notes: { userId: String(session.userId), phone: session.phone, plan: planId },
    });

    await query(
      `INSERT INTO payments (user_id, razorpay_order_id, amount, status, plan) VALUES ($1, $2, $3, 'pending', $4)`,
      [session.userId, order.id, amount, planId]
    );

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not create order' }, { status: 500 });
  }
}
