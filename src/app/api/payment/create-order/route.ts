import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { getRazorpay } from '@/lib/razorpay';
import { PLANS, PlanId, isValidPlan, planRank } from '@/lib/plans';

interface UserRow { id: number; is_paid: boolean; plan: PlanId | null }

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const planId = body.planId;
  if (!isValidPlan(planId)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const users = await query<UserRow>(`SELECT id, is_paid, plan FROM users WHERE id=$1`, [session.userId]);
  if (!users.length) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  const currentPlan = users[0].plan;

  if (planRank(planId) <= planRank(currentPlan)) {
    return NextResponse.json({ error: 'यह प्लान आपके पास पहले से है' }, { status: 409 });
  }

  const amount = currentPlan
    ? PLANS[planId].pricePaise - PLANS[currentPlan].pricePaise
    : PLANS[planId].pricePaise;

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
