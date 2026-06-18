'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Step = 'phone' | 'name' | 'otp';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  async function sendOtpRequest() {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'OTP नहीं भेजा जा सका');
      setStep('otp');
      setCountdown(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'कुछ गड़बड़ हुई, दोबारा कोशिश करें');
    }
  }

  async function submitPhone(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('सही 10 अंकों का मोबाइल नंबर डालें');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'कुछ गड़बड़ हुई');
      if (data.isPaid) {
        await sendOtpRequest();
      } else {
        setStep('name');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'कुछ गड़बड़ हुई, दोबारा कोशिश करें');
    } finally {
      setLoading(false);
    }
  }

  async function submitName(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('कृपया अपना नाम डालें');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'कुछ गड़बड़ हुई');
      router.push('/payment');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'कुछ गड़बड़ हुई, दोबारा कोशिश करें');
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    setError('');
    setOtp(['', '', '', '', '', '']);
    setLoading(true);
    await sendOtpRequest();
    setLoading(false);
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length < 6) {
      setError('6 अंकों का OTP डालें');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'OTP गलत है');
      router.push('/payment');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'कुछ गड़बड़ हुई');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FFF8F0' }}>
      {/* Header */}
      <div className="hero-bg py-10 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 text-[200px] flex items-center justify-center leading-none select-none text-yellow-300">
          🙏
        </div>
        <Link href="/" className="inline-flex items-center gap-1 text-orange-200 hover:text-white text-sm mb-6 relative z-10 transition-colors">
          ← वापस जाएं
        </Link>
        <div className="text-5xl animate-float mb-3 relative z-10">🚩</div>
        <p className="font-devanagari text-yellow-300 text-lg font-bold relative z-10">॥ जय बजरंग बली ॥</p>
        <h1 className="text-2xl font-bold text-white mt-1 relative z-10">
          {step === 'phone' && 'साधना में प्रवेश करें'}
          {step === 'name' && 'अपना नाम बताएं'}
          {step === 'otp' && 'OTP सत्यापित करें'}
        </h1>
        <p className="text-orange-200 text-sm mt-1 relative z-10">
          {step === 'phone' && 'मोबाइल नंबर डालें'}
          {step === 'name' && 'साधना ट्रैकिंग के लिए आपका नाम चाहिए'}
          {step === 'otp' && `OTP भेजा गया: +91 ${phone}`}
        </p>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 pb-16 -mt-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100">
            <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#E85D04,#F48C06,#FBBF24)' }} />

            <div className="p-8">
              {step === 'phone' ? (
                <form onSubmit={submitPhone} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-orange-900 mb-2">
                      मोबाइल नंबर <span className="text-red-500">*</span>
                    </label>
                    <div className="flex shadow-sm rounded-xl overflow-hidden border-2 border-orange-100 focus-within:border-orange-400 transition-colors">
                      <span className="flex items-center px-4 bg-orange-50 text-orange-800 font-semibold text-sm border-r border-orange-100">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="9876543210"
                        maxLength={10}
                        required
                        autoFocus
                        className="flex-1 px-4 py-3.5 text-orange-900 bg-white focus:outline-none text-xl tracking-[0.2em]"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
                      <span className="flex-shrink-0 mt-0.5">⚠️</span>
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg,#E85D04,#F48C06)' }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        जाँच की जा रही है...
                      </span>
                    ) : '🚩 आगे बढ़ें'}
                  </button>

                  <p className="text-center text-xs text-amber-600">
                    🔒 आपका नंबर सिर्फ साधना ट्रैकिंग के लिए उपयोग होगा
                  </p>
                </form>
              ) : step === 'name' ? (
                <form onSubmit={submitName} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-orange-900 mb-2">
                      आपका नाम <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="जैसे: राम प्रसाद शर्मा"
                      required
                      autoFocus
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-orange-100 focus:border-orange-400 focus:outline-none text-orange-900 bg-orange-50/30 transition-colors placeholder-orange-200"
                    />
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
                      <span className="flex-shrink-0 mt-0.5">⚠️</span>
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg,#E85D04,#F48C06)' }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        शुरू किया जा रहा है...
                      </span>
                    ) : '🚩 साधना शुरू करें'}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setStep('phone'); setError(''); }}
                    className="w-full text-center text-orange-600 font-semibold text-sm hover:underline"
                  >
                    ← नंबर बदलें
                  </button>
                </form>
              ) : (
                <form onSubmit={verifyOtp} className="space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-amber-700 mb-1">
                      <strong>+91 {phone}</strong> पर OTP भेजा गया है
                    </p>
                    <p className="text-xs text-amber-500">6 अंकों का कोड डालें</p>
                  </div>

                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-12 h-14 text-center text-2xl font-bold border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:outline-none text-orange-900 bg-orange-50/30 transition-colors"
                      />
                    ))}
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm text-center">
                      <span>⚠️ {error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || otp.join('').length < 6}
                    className="w-full text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all hover:scale-[1.02] disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg,#E85D04,#F48C06)' }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Verify हो रहा है...
                      </span>
                    ) : '✅ Verify करें और साधना शुरू करें'}
                  </button>

                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-amber-600 text-sm">
                        दोबारा भेजें: <strong className="text-orange-600">{countdown}s</strong>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={resendOtp}
                        disabled={loading}
                        className="text-orange-600 font-semibold text-sm hover:underline disabled:opacity-60"
                      >
                        दोबारा OTP भेजें
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
