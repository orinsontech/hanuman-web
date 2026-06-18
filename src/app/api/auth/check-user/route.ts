import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { migrate } from '@/lib/migrate';

interface UserRow { is_paid: boolean }

export async function POST(req: NextRequest) {
  try {
    await migrate();

    const { phone } = await req.json();
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    const users = await query<UserRow>(`SELECT is_paid FROM users WHERE phone=$1`, [phone]);
    return NextResponse.json({ isPaid: users[0]?.is_paid ?? false });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
