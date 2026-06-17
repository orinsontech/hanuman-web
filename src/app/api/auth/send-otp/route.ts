import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { migrate } from '@/lib/migrate';

export async function POST(req: NextRequest) {
  try {
    await migrate();

    const { phone } = await req.json();
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await query(
      `INSERT INTO otp_codes (phone, code, expires_at) VALUES ($1, $2, $3)`,
      [phone, code, expiresAt]
    );

    const smsRes = await fetch('https://ninzasms.in.net/auth/send_sms', {
      method: 'POST',
      headers: {
        Authorization: process.env.NINZA_SMS_AUTH!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender_id: process.env.NINZA_SMS_SENDER_ID,
        numbers: phone,
        rout: 'sms',
        variables_values: code,
      }),
    });

    if (!smsRes.ok) {
      return NextResponse.json({ error: 'Failed to send OTP' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
