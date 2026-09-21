import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { PLANS, PlanId } from '@/lib/plans';

interface UserRow { plan: PlanId | null }
interface ProgressRow { day_number: number }

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const users = await query<UserRow>(`SELECT plan FROM users WHERE id=$1`, [session.userId]);
  const plan = users[0]?.plan;
  if (!plan || !PLANS[plan].canRestart) {
    return NextResponse.json({ error: 'यह सुविधा सिर्फ Lifetime प्लान में है' }, { status: 403 });
  }

  const progress = await query<ProgressRow>(
    `SELECT day_number FROM daily_progress WHERE user_id=$1`,
    [session.userId]
  );
  if (progress.length < PLANS[plan].dayLimit) {
    return NextResponse.json({ error: 'साधना पूरी होने के बाद ही दोबारा शुरू कर सकते हैं' }, { status: 403 });
  }

  await query(`DELETE FROM daily_progress WHERE user_id=$1`, [session.userId]);

  return NextResponse.json({ success: true });
}
