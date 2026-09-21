'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'लॉगिन नहीं हो सका');
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'कुछ गड़बड़ हुई');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#1A0500' }}>
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-xl font-bold text-orange-900 mb-1">🔐 Admin Panel</h1>
        <p className="text-sm text-amber-600 mb-6">हनुमान स्तुति साधना — Payments Dashboard</p>

        <label className="block text-sm font-semibold text-orange-900 mb-2">User ID</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          autoFocus
          required
          className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 focus:border-orange-400 focus:outline-none text-orange-900 mb-4"
        />

        <label className="block text-sm font-semibold text-orange-900 mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 focus:border-orange-400 focus:outline-none text-orange-900 mb-4"
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm mb-4">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full text-white py-3 rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02] disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg,#E85D04,#F48C06)' }}
        >
          {loading ? 'लॉगिन हो रहा है...' : 'लॉगिन करें'}
        </button>
      </form>
    </div>
  );
}
