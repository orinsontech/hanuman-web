import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { query } from '@/lib/db';

interface PaymentRow {
  id: number;
  amount: number;
  status: string;
  plan: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  created_at: string;
  name: string | null;
  phone: string;
}

interface SummaryRow {
  status: string;
  count: string;
  total: string;
}

export async function GET(req: NextRequest) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const phone = searchParams.get('phone');

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (status && status !== 'all') {
    params.push(status);
    conditions.push(`p.status = $${params.length}`);
  }
  if (from) {
    params.push(from);
    conditions.push(`p.created_at >= $${params.length}::date`);
  }
  if (to) {
    params.push(to);
    conditions.push(`p.created_at < ($${params.length}::date + interval '1 day')`);
  }
  if (phone) {
    params.push(`%${phone}%`);
    conditions.push(`u.phone LIKE $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const payments = await query<PaymentRow>(
    `SELECT p.id, p.amount, p.status, p.plan, p.razorpay_order_id, p.razorpay_payment_id, p.created_at,
            u.name, u.phone
     FROM payments p
     JOIN users u ON u.id = p.user_id
     ${where}
     ORDER BY p.created_at DESC
     LIMIT 500`,
    params
  );

  const summary = await query<SummaryRow>(
    `SELECT status, COUNT(*)::text AS count, COALESCE(SUM(amount), 0)::text AS total
     FROM payments p
     JOIN users u ON u.id = p.user_id
     ${where}
     GROUP BY status`,
    params
  );

  const todayRevenue = await query<{ total: string }>(
    `SELECT COALESCE(SUM(amount), 0)::text AS total
     FROM payments
     WHERE status = 'success' AND created_at >= CURRENT_DATE`
  );

  return NextResponse.json({ payments, summary, todayRevenue: todayRevenue[0]?.total ?? '0' });
}
