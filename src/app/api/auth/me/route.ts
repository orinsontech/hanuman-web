import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

interface UserRow { id: number; phone: string; name: string | null; is_paid: boolean; created_at: string }
interface ProgressRow { day_number: number; completed_at: string }

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const users = await query<UserRow>(`SELECT * FROM users WHERE id=$1`, [session.userId]);
  if (!users.length) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const progress = await query<ProgressRow>(
    `SELECT day_number, completed_at FROM daily_progress WHERE user_id=$1 ORDER BY day_number`,
    [session.userId]
  );

  return NextResponse.json({ user: users[0], progress });
}
