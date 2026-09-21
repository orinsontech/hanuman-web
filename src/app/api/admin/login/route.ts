import { NextRequest, NextResponse } from 'next/server';
import { signAdminToken, setAdminSessionCookie } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  const { userId, password } = await req.json().catch(() => ({}));

  if (!process.env.ADMIN_USER_ID || !process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Admin login configured नहीं है' }, { status: 500 });
  }
  if (userId !== process.env.ADMIN_USER_ID || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'गलत User ID या पासवर्ड' }, { status: 401 });
  }

  const token = signAdminToken();
  await setAdminSessionCookie(token);
  return NextResponse.json({ success: true });
}
