'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Script from 'next/script';
import { trackPixelEvent } from '@/lib/fbq';
import { PLAN_ORDER, PLANS, PlanId, planRank, isPlanExpired, DEFAULT_PLAN } from '@/lib/plans';

interface User { name: string | null; phone: string; is_paid: boolean; plan: PlanId | null; plan_expires_at: string | null }

const WHATSAPP_LINK = 'https://wa.me/919776307793';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const includes = [
  { icon: '🎵', text: 'हनुमान चालीसा स्तुति की रोज़ की सुनवाई' },
  { icon: '📅', text: 'रोज़ का प्रगति ट्रैकर' },
  { icon: '🏆', text: 'साधना सम्पन्न डिजिटल सर्टिफिकेट (40 दिन पूरे होने पर)' },
  { icon: '🙏', text: 'मनोकामना पूर्ति की साधना विधि' },
  { icon: '📱', text: 'मोबाइल पर कहीं भी सुनें' },
];

export default function PaymentPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [paying, setPaying] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(DEFAULT_PLAN);

  useEffect(() => {
    fetch('/api/auth/me').then(async (r) => {
      if (r.status === 401) { router.push('/login'); return; }
      const data = await r.json();
      if (data.user?.plan === 'lifetime') { router.replace('/dashboard'); return; }
      setUser(data.user);
      const expired = isPlanExpired(data.user?.plan_expires_at);
      const availablePlans = PLAN_ORDER.filter(
        (id) => planRank(id) > planRank(data.user?.plan) || (id === data.user?.plan && expired)
      );
      setSelectedPlan(availablePlans.includes(DEFAULT_PLAN) ? DEFAULT_PLAN : availablePlans[0]);
      setLoading(false);
    });
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF8F0' }}>
        <div className="text-5xl animate-float">🙏</div>
      </div>
    );
  }

  const currentPlan = user.plan;
  const currentPlanExpired = isPlanExpired(user.plan_expires_at);
  const isRenewal = (id: PlanId) => id === currentPlan && currentPlanExpired;
  const availablePlans = PLAN_ORDER.filter((id) => planRank(id) > planRank(currentPlan) || isRenewal(id));
  const priceFor = (id: PlanId) =>
    currentPlan && !isRenewal(id) ? PLANS[id].pricePaise - PLANS[currentPlan].pricePaise : PLANS[id].pricePaise;

  async function handleChangeDetails() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  async function handlePay() {
    setError('');
    if (!scriptLoaded || !window.Razorpay) {
      setError('भुगतान लोड हो रहा है, कृपया कुछ सेकंड में फिर कोशिश करें');
      return;
    }
    setPaying(true);
    try {
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlan }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) {
        setError(order.error || 'ऑर्डर बनाने में समस्या हुई');
        setPaying(false);
        return;
      }

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'हनुमान स्तुति साधना',
        description: PLANS[selectedPlan].label,
        prefill: {
          name: user?.name || undefined,
          contact: user?.phone,
        },
        theme: { color: '#E85D04' },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          if (!verifyRes.ok) {
            setError('भुगतान सत्यापन में समस्या हुई, कृपया सहायता के लिए WhatsApp करें');
            setPaying(false);
            return;
          }
          trackPixelEvent(
            'Purchase',
            { value: order.amount / 100, currency: 'INR' },
            { eventID: `purchase_${response.razorpay_payment_id}` }
          );
          setPaid(true);
          setPaying(false);
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      });
      razorpay.open();
    } catch {
      setError('कुछ गड़बड़ हो गई, कृपया फिर कोशिश करें');
      setPaying(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#FFF8F0' }}>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      {/* Top gradient header */}
      <div className="hero-bg py-8 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 select-none text-[300px] flex items-center justify-center leading-none text-yellow-300">🙏</div>
        <p className="font-devanagari text-yellow-300 font-bold text-xl relative z-10 mb-1">॥ जय बजरंग बली ॥</p>
        <h1 className="text-2xl md:text-3xl font-bold text-white relative z-10">साधना में प्रवेश करें</h1>
        <p className="text-orange-200 text-sm relative z-10 mt-1">
          नमस्ते {user?.name ? `${user.name} (+91 ${user.phone})` : `+91 ${user?.phone}`} 🙏
        </p>
        <button
          onClick={handleChangeDetails}
          className="text-orange-300 text-xs underline relative z-10 mt-1 hover:text-white transition-colors"
        >
          नंबर या नाम बदलें
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* Left — What you get */}
          <div className="order-2 md:order-1">
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
                "40 दिन की साधना के बाद सच में चमत्कार हुआ। इतनी कम कीमत में इतना सब कुछ मिला — यह तो बस हनुमान जी की कृपा है!"
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
          <div className="order-1 md:order-2 md:sticky md:top-6">
            <div className="rounded-3xl shadow-2xl overflow-hidden" style={{ background: 'linear-gradient(165deg,#2B0B08,#1A0500)', border: '1px solid rgba(251,191,36,0.15)' }}>
              {/* Brand header */}
              <div className="flex items-center gap-3 px-6 pt-6 pb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#E85D04,#F48C06)' }}>
                  🚩
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">हनुमान स्तुति</p>
                  <p className="text-orange-300 text-[10px] tracking-widest font-semibold">साधना पैकेज</p>
                </div>
              </div>

              {paid ? (
                <div className="text-center px-6 pb-6">
                  <div className="text-5xl mb-4">🙏</div>
                  <h3 className="font-bold text-white text-lg mb-2">भुगतान सफल हुआ!</h3>
                  <p className="text-orange-200/80 text-sm leading-relaxed mb-5">
                    आपकी साधना अकाउंट activate हो गया है। अब आप साधना शुरू कर सकते हैं।
                  </p>
                  <button
                    onClick={() => router.replace('/dashboard')}
                    className="w-full text-white py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all hover:scale-[1.02]"
                    style={{ background: 'linear-gradient(135deg,#E85D04,#F48C06)' }}
                  >
                    साधना शुरू करें →
                  </button>
                </div>
              ) : (
                <>
                  {/* Plan selector */}
                  {currentPlan && (
                    <p className="mx-6 mb-3 text-orange-200/70 text-xs">
                      {currentPlanExpired ? (
                        <>आपका <strong className="text-white">{PLANS[currentPlan].label}</strong> प्लान समाप्त हो गया है — नवीनीकरण करें:</>
                      ) : (
                        <>आपके पास अभी <strong className="text-white">{PLANS[currentPlan].label}</strong> है — अपग्रेड करें:</>
                      )}
                    </p>
                  )}
                  <div className="mx-6 mb-5 flex flex-col gap-2.5">
                    {availablePlans.map((id) => {
                      const plan = PLANS[id];
                      const price = priceFor(id);
                      const selected = selectedPlan === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setSelectedPlan(id)}
                          className="text-left rounded-2xl p-4 transition-all"
                          style={{
                            background: selected ? 'rgba(232,93,4,0.15)' : 'rgba(255,255,255,0.04)',
                            border: selected ? '2px solid #F48C06' : '2px solid rgba(255,255,255,0.08)',
                          }}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-white font-bold text-sm flex items-center gap-2">
                                {plan.label}
                                {id === DEFAULT_PLAN && (
                                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: '#E85D04' }}>
                                    लोकप्रिय
                                  </span>
                                )}
                              </p>
                              <p className="text-orange-200/60 text-xs mt-0.5">{plan.tagline}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-white font-bold text-xl leading-none">₹{price / 100}</p>
                              {currentPlan && !isRenewal(id) && <p className="text-orange-200/50 text-[10px] mt-1">अपग्रेड मूल्य</p>}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {error && (
                    <p className="mx-6 mb-4 text-red-400 text-xs text-center">{error}</p>
                  )}

                  {/* Pay now */}
                  <div className="px-6 mb-5">
                    <button
                      onClick={handlePay}
                      disabled={paying}
                      className="w-full text-white py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
                      style={{ background: 'linear-gradient(135deg,#E85D04,#F48C06)' }}
                    >
                      {paying ? 'कृपया प्रतीक्षा करें...' : `₹${priceFor(selectedPlan) / 100} का भुगतान करें`}
                    </button>
                    <p className="text-orange-300/50 text-[10px] text-center mt-2">UPI · Cards · Netbanking</p>
                  </div>

                  <p className="text-center text-orange-200/50 text-[11px] px-6 mb-5">
                    भुगतान में समस्या? <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-200">WhatsApp पर सहायता लें</a>
                  </p>

                  {/* Divider */}
                  <div className="mx-6 mb-4 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />

                  {/* Footer */}
                  <p className="text-center text-white/30 text-[10px] tracking-widest font-semibold pb-5">
                    🔒 सुरक्षित · Razorpay द्वारा संचालित · Powered by BhaktiAmrit
                  </p>
                </>
              )}
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
