import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { migrate } from '@/lib/migrate';
import { signToken, setSessionCookie } from '@/lib/auth';

interface UserRow { id: number; phone: string; is_paid: boolean }

export async function POST(req: NextRequest) {
  try {
    await migrate();

    const { phone, name } = await req.json();
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name required' }, { status: 400 });
    }

    let users = await query<UserRow>(`SELECT * FROM users WHERE phone=$1`, [phone]);
    if (users.length && users[0].is_paid) {
      return NextResponse.json({ error: 'OTP verification required' }, { status: 409 });
    }

    if (!users.length) {
      users = await query<UserRow>(
        `INSERT INTO users (phone, name) VALUES ($1, $2) RETURNING *`,
        [phone, name]
      );
    } else {
      await query(`UPDATE users SET name=$1 WHERE id=$2`, [name, users[0].id]);
    }

    const user = users[0];
    const token = signToken({ userId: user.id, phone: user.phone });
    await setSessionCookie(token);

    return NextResponse.json({ success: true, userId: user.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
