import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { dayLimitFor, isPlanExpired, PlanId } from '@/lib/plans';

interface ProgressRow { day_number: number }
interface UserRow { is_paid: boolean; plan: PlanId | null; plan_expires_at: string | null }

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { day } = await req.json();
  if (!day || day < 1 || day > 42) {
    return NextResponse.json({ error: 'Invalid day' }, { status: 400 });
  }

  const users = await query<UserRow>(`SELECT is_paid, plan, plan_expires_at FROM users WHERE id=$1`, [session.userId]);
  if (!users.length || !users[0].is_paid || isPlanExpired(users[0].plan_expires_at)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (day > dayLimitFor(users[0].plan)) {
    return NextResponse.json({ error: 'यह दिन आपके प्लान में शामिल नहीं है' }, { status: 403 });
  }

  const existing = await query<ProgressRow>(
    `SELECT day_number FROM daily_progress WHERE user_id=$1 AND day_number=$2`,
    [session.userId, day]
  );

  if (existing.length) {
    return NextResponse.json({ success: true, alreadyDone: true });
  }

  await query(
    `INSERT INTO daily_progress (user_id, day_number) VALUES ($1, $2)`,
    [session.userId, day]
  );

  const progress = await query<ProgressRow>(
    `SELECT day_number FROM daily_progress WHERE user_id=$1`,
    [session.userId]
  );

  return NextResponse.json({ success: true, totalCompleted: progress.length });
}
