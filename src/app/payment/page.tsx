'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: { name: string; contact: string };
  theme: { color: string };
  modal: { ondismiss: () => void };
}

interface RazorpayInstance { open(): void }
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface User { name: string | null; phone: string; is_paid: boolean }

const includes = [
  { icon: '🎵', text: '40 दिन की हनुमान चालीसा स्तुति' },
  { icon: '📅', text: 'रोज़ का प्रगति ट्रैकर' },
  { icon: '🏆', text: 'साधना सम्पन्न डिजिटल सर्टिफिकेट' },
  { icon: '🙏', text: 'मनोकामना पूर्ति की साधना विधि' },
  { icon: '📱', text: 'मोबाइल पर कहीं भी सुनें' },
  { icon: '♾️', text: 'एक बार भुगतान, जीवनभर का लाभ' },
];

export default function PaymentPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/auth/me').then(async (r) => {
      if (r.status === 401) { router.push('/login'); return; }
      const data = await r.json();
      if (data.user?.is_paid) { router.replace('/dashboard'); return; }
      setUser(data.user);
      setLoading(false);
    });
  }, [router]);

  function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function handlePay() {
    setError('');
    setPaying(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Razorpay load नहीं हो सका। Internet check करें।');

      const orderRes = await fetch('/api/payment/create-order', { method: 'POST' });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Order create नहीं हो सका');
      if (orderData.alreadyPaid) { router.replace('/dashboard'); return; }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'हनुमान स्तुति साधना',
        description: '40 दिन की साधना — मनोकामना पूर्ति',
        image: '/hanuman-hero.jpg',
        order_id: orderData.orderId,
        handler: async (response: RazorpayResponse) => {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            router.push('/dashboard?payment=success');
          } else {
            setError('Payment verify नहीं हो सका। Support से संपर्क करें।');
            setPaying(false);
          }
        },
        prefill: {
          name: user?.name || '',
          contact: user?.phone ? `+91${user.phone}` : '',
        },
        theme: { color: '#E85D04' },
        modal: { ondismiss: () => setPaying(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'कुछ गड़बड़ हुई');
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF8F0' }}>
        <div className="text-5xl animate-float">🙏</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#FFF8F0' }}>
      {/* Top gradient header */}
      <div className="hero-bg py-8 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 select-none text-[300px] flex items-center justify-center leading-none text-yellow-300">🙏</div>
        <p className="font-devanagari text-yellow-300 font-bold text-xl relative z-10 mb-1">॥ जय बजरंग बली ॥</p>
        <h1 className="text-2xl md:text-3xl font-bold text-white relative z-10">साधना में प्रवेश करें</h1>
        <p className="text-orange-200 text-sm relative z-10 mt-1">
          नमस्ते {user?.name || `+91 ${user?.phone}`} 🙏
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* Left — What you get */}
          <div>
            <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-6 mb-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src="/hanuman-hero.jpg" alt="हनुमान जी" width={56} height={56} className="object-cover w-full h-full" />
                </div>
                <div>
                  <h2 className="font-bold text-orange-900 text-lg leading-tight">हनुमान स्तुति साधना</h2>
                  <p className="text-amber-600 text-sm">40 दिन में मनोकामना पूर्ति</p>
                </div>
              </div>

              <p className="text-amber-800 text-sm mb-5 leading-relaxed">
                इस साधना पैकेज में आपको मिलेगा:
              </p>

              <ul className="space-y-3">
                {includes.map((item) => (
                  <li key={item.text} className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-lg">
                      {item.icon}
                    </span>
                    <span className="text-sm text-amber-800 font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Testimonial */}
            <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
              <div className="flex mb-2">{'★★★★★'.split('').map((s, i) => <span key={i} className="text-yellow-400">{s}</span>)}</div>
              <p className="text-amber-800 text-sm italic mb-3">
                "40 दिन की साधना के बाद सच में चमत्कार हुआ। ₹199 में इतना सब कुछ मिला — यह तो बस हनुमान जी की कृपा है!"
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg,#E85D04,#F48C06)' }}>र</div>
                <div>
                  <p className="text-xs font-bold text-orange-900">रमेश कुमार यादव</p>
                  <p className="text-xs text-amber-500">वाराणसी</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Payment card */}
          <div className="sticky top-6">
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-orange-200 overflow-hidden">
              {/* Price header */}
              <div className="text-center py-7 px-6 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg,#1A0500,#7C2D12,#C2410C)' }}>
                <div className="absolute inset-0 opacity-10 text-[100px] flex items-center justify-center leading-none select-none">🚩</div>
                <p className="text-orange-200 text-sm mb-2 relative z-10">40 दिन की पूरी साधना सिर्फ</p>
                <div className="relative z-10">
                  <div className="flex items-start justify-center gap-1">
                    <span className="text-yellow-300 font-bold text-2xl mt-2">₹</span>
                    <span className="text-white font-bold text-7xl leading-none">199</span>
                  </div>
                  <p className="text-orange-300 text-xs mt-1">एकमुश्त भुगतान — कोई मासिक शुल्क नहीं</p>
                </div>
              </div>

              <div className="p-6">
                {/* Value callout */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-5 flex items-center gap-2">
                  <span className="text-green-600 text-lg flex-shrink-0">✅</span>
                  <p className="text-green-800 text-sm font-medium">
                    40 दिन × ₹5 से भी कम — एक चाय की कीमत पर जीवन बदलें
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-red-700 text-sm flex items-start gap-2">
                    <span>⚠️</span><span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handlePay}
                  disabled={paying}
                  className="w-full text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed mb-4"
                  style={{ background: paying ? '#9CA3AF' : 'linear-gradient(135deg,#E85D04,#F48C06)' }}
                >
                  {paying ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Payment खुल रही है...
                    </span>
                  ) : '🚩 ₹199 में साधना शुरू करें'}
                </button>

                {/* Payment methods */}
                <div className="text-center mb-4">
                  <p className="text-xs text-amber-500 mb-2">सभी तरीकों से भुगतान करें</p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {['UPI', 'GPay', 'PhonePe', 'Paytm', 'Card', 'NetBanking'].map((m) => (
                      <span key={m} className="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2 py-1 rounded-md font-medium">{m}</span>
                    ))}
                  </div>
                </div>

                {/* Trust */}
                <div className="border-t border-orange-100 pt-4 space-y-2">
                  {[
                    '🔒 100% सुरक्षित Razorpay द्वारा',
                    '📞 कोई समस्या? Support से संपर्क करें',
                    '✅ तुरंत एक्सेस — Payment के बाद',
                  ].map((t) => (
                    <p key={t} className="text-xs text-amber-600 flex items-center gap-1.5">{t}</p>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-amber-500 mt-4 font-devanagari">
              ॥ हनुमान जी की कृपा से सब कार्य सिद्ध होंगे ॥
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
