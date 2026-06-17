import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

interface UserRow { id: number; name: string | null; phone: string; created_at: string }
interface ProgressRow { day_number: number; completed_at: string }

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const users = await query<UserRow>(`SELECT * FROM users WHERE id=$1`, [session.userId]);
  if (!users.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const progress = await query<ProgressRow>(
    `SELECT day_number, completed_at FROM daily_progress WHERE user_id=$1 ORDER BY day_number`,
    [session.userId]
  );

  if (progress.length < 40) {
    return NextResponse.json({ error: 'Not yet completed 40 days', completed: progress.length }, { status: 403 });
  }

  const completedOn = progress[progress.length - 1].completed_at;
  return NextResponse.json({ user: users[0], completedOn });
}
