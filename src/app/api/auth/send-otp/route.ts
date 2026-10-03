import { randomUUID } from 'crypto';
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

    const smsRes = await fetch('https://meraotp.in/api/v1/otp/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MERAOTP_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `login_${phone}_${randomUUID()}`,
      },
      body: JSON.stringify({
        mobile: phone,
        purpose: 'login',
        otp_length: 6,
        reference: `login_${phone}`,
      }),
    });
    const smsData = await smsRes.json().catch(() => ({}));
    const messageId: string | undefined = smsData?.data?.message_id;

    if (!smsRes.ok || !smsData.success || !messageId) {
      console.error('MeraOTP send failed', smsRes.status, smsData);
      return NextResponse.json({ error: 'Failed to send OTP' }, { status: 502 });
    }

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await query(
      `INSERT INTO otp_codes (phone, message_id, expires_at) VALUES ($1, $2, $3)`,
      [phone, messageId, expiresAt]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
