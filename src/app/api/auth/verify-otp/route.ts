import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { signToken, setSessionCookie } from '@/lib/auth';

interface OtpRow { id: number; message_id: string | null; expires_at: string; used: boolean }
interface UserRow { id: number; phone: string }

export async function POST(req: NextRequest) {
  try {
    const { phone, code, name } = await req.json();
    if (!phone || !code) {
      return NextResponse.json({ error: 'Phone and code required' }, { status: 400 });
    }

    const otps = await query<OtpRow>(
      `SELECT * FROM otp_codes WHERE phone=$1 AND used=FALSE AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [phone]
    );

    if (!otps.length || !otps[0].message_id) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
    }

    const verifyRes = await fetch('https://meraotp.in/api/v1/otp/verify', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MERAOTP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message_id: otps[0].message_id, otp: String(code) }),
    });
    const verifyData = await verifyRes.json().catch(() => ({}));

    if (!verifyRes.ok || !verifyData.success || !verifyData.data?.verified) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
    }

    await query(`UPDATE otp_codes SET used=TRUE WHERE id=$1`, [otps[0].id]);

    let users = await query<UserRow>(`SELECT * FROM users WHERE phone=$1`, [phone]);
    if (!users.length) {
      users = await query<UserRow>(
        `INSERT INTO users (phone, name) VALUES ($1, $2) RETURNING *`,
        [phone, name || null]
      );
    } else if (name) {
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
