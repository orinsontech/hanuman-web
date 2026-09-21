'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PLANS, PlanId } from '@/lib/plans';

interface Payment {
  id: number;
  amount: number;
  status: string;
  plan: PlanId;
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

const STATUS_STYLES: Record<string, string> = {
  success: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  failed: 'bg-red-100 text-red-700 border-red-200',
};

function rupees(paise: number) {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<SummaryRow[]>([]);
  const [todayRevenue, setTodayRevenue] = useState('0');
  const [error, setError] = useState('');

  const [status, setStatus] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [phone, setPhone] = useState('');

  function loadPayments(overrides?: { status?: string; from?: string; to?: string; phone?: string }) {
    setLoading(true);
    setError('');
    const f = { status, from, to, phone, ...overrides };
    const params = new URLSearchParams();
    if (f.status !== 'all') params.set('status', f.status);
    if (f.from) params.set('from', f.from);
    if (f.to) params.set('to', f.to);
    if (f.phone) params.set('phone', f.phone);

    return fetch(`/api/admin/payments?${params.toString()}`)
      .then((res) => {
        if (res.status === 401) {
          router.push('/admin/login');
          return null;
        }
        return res.json().then((data) => ({ ok: res.ok, data }));
      })
      .then((result) => {
        if (!result) return;
        const { ok, data } = result;
        if (!ok) {
          setError(data.error || 'डेटा लोड नहीं हो सका');
          setLoading(false);
          return;
        }
        setPayments(data.payments);
        setSummary(data.summary);
        setTodayRevenue(data.todayRevenue);
        setLoading(false);
      });
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loadPayments sets a loading flag before its own fetch resolves; intentional immediate UI feedback
    loadPayments().finally(() => setChecking(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFilterSubmit(e: React.FormEvent) {
    e.preventDefault();
    loadPayments();
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  const successRow = summary.find((s) => s.status === 'success');
  const pendingRow = summary.find((s) => s.status === 'pending');
  const failedRow = summary.find((s) => s.status === 'failed');

  const totalRevenue = Number(successRow?.total ?? 0);
  const successCount = Number(successRow?.count ?? 0);
  const pendingCount = Number(pendingRow?.count ?? 0);
  const failedCount = Number(failedRow?.count ?? 0);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF8F0' }}>
        <div className="text-3xl animate-pulse">⏳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#FFF8F0' }}>
      <nav className="sticky top-0 z-10 bg-white border-b border-orange-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-bold text-orange-900">🔐 Admin — Payments</span>
          <button onClick={logout} className="text-sm text-amber-600 hover:text-red-600 font-medium">लॉगआउट</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-4">
            <p className="text-xs text-amber-600 mb-1">कुल Revenue (filtered)</p>
            <p className="text-2xl font-bold text-orange-900">{rupees(totalRevenue)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-4">
            <p className="text-xs text-amber-600 mb-1">आज का Revenue</p>
            <p className="text-2xl font-bold text-orange-900">{rupees(Number(todayRevenue))}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-4">
            <p className="text-xs text-amber-600 mb-1">✅ Success</p>
            <p className="text-2xl font-bold text-green-700">{successCount}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4">
            <p className="text-xs text-amber-600 mb-1">⏳ Pending</p>
            <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
            {failedCount > 0 && <p className="text-xs text-red-500 mt-0.5">❌ Failed: {failedCount}</p>}
          </div>
        </div>

        {/* Filters */}
        <form onSubmit={handleFilterSubmit} className="bg-white rounded-2xl shadow-sm border border-orange-100 p-4 mb-6 flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-semibold text-amber-700 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 rounded-lg border border-orange-200 text-sm text-orange-900">
              <option value="all">सभी</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-700 mb-1">From</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
              className="px-3 py-2 rounded-lg border border-orange-200 text-sm text-orange-900" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-700 mb-1">To</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
              className="px-3 py-2 rounded-lg border border-orange-200 text-sm text-orange-900" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-700 mb-1">Phone</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98765..."
              className="px-3 py-2 rounded-lg border border-orange-200 text-sm text-orange-900 w-32" />
          </div>
          <button type="submit"
            className="text-white px-5 py-2 rounded-lg text-sm font-bold"
            style={{ background: 'linear-gradient(135deg,#E85D04,#F48C06)' }}>
            फ़िल्टर करें
          </button>
          {(status !== 'all' || from || to || phone) && (
            <button type="button"
              onClick={() => {
                setStatus('all'); setFrom(''); setTo(''); setPhone('');
                loadPayments({ status: 'all', from: '', to: '', phone: '' });
              }}
              className="text-amber-600 text-sm font-medium hover:underline">
              Clear
            </button>
          )}
        </form>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm mb-4">{error}</div>}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-orange-100 text-left text-amber-600">
                <th className="px-4 py-3 font-semibold">दिनांक/समय</th>
                <th className="px-4 py-3 font-semibold">नाम / फ़ोन</th>
                <th className="px-4 py-3 font-semibold">प्लान</th>
                <th className="px-4 py-3 font-semibold">राशि</th>
                <th className="px-4 py-3 font-semibold">स्टेटस</th>
                <th className="px-4 py-3 font-semibold">Order ID</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-amber-500">लोड हो रहा है...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-amber-500">कोई payment नहीं मिला</td></tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="border-b border-orange-50 last:border-0">
                    <td className="px-4 py-3 text-amber-800 whitespace-nowrap">
                      {new Date(p.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="px-4 py-3 text-orange-900">
                      <div className="font-medium">{p.name || '—'}</div>
                      <div className="text-xs text-amber-500">+91 {p.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-amber-800">{PLANS[p.plan]?.label ?? p.plan}</td>
                    <td className="px-4 py-3 font-semibold text-orange-900">{rupees(p.amount)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[p.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-amber-500 font-mono">{p.razorpay_order_id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-amber-500 mt-3">नवीनतम 500 payments दिखाई गई हैं।</p>
      </div>
    </div>
  );
}
