import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { sendMetaPurchaseEvent } from '@/lib/meta-capi';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const eventId =
      typeof body.eventId === 'string' && body.eventId
        ? body.eventId
        : `claim_${session.userId}_${Date.now()}`;

    await sendMetaPurchaseEvent({
      phone: session.phone,
      value: 199,
      currency: 'INR',
      eventId,
      ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
      userAgent: req.headers.get('user-agent') || undefined,
      fbp: req.cookies.get('_fbp')?.value,
      fbc: req.cookies.get('_fbc')?.value,
      sourceUrl: req.headers.get('referer') || undefined,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
