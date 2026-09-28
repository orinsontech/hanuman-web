'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PLANS, PlanId } from '@/lib/plans';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

const WHATSAPP_LINK = 'https://wa.me/919776307793';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function param(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

// Pushes the GTM purchase event once per transaction, so a refresh or a
// revisit of the same URL doesn't count the sale twice.
function pushPurchaseOnce(transactionId: string, value: number, planId: PlanId | undefined) {
  const key = `gtm_purchase_${transactionId}`;
  try {
    if (localStorage.getItem(key)) return;
  } catch {}

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: 'purchase',
    ecommerce: {
      transaction_id: transactionId,
      value,
      currency: 'INR',
      items: planId
        ? [{ item_id: planId, item_name: PLANS[planId].label, price: value, quantity: 1 }]
        : [],
    },
  });

  try {
    localStorage.setItem(key, '1');
  } catch {}
}

export default function ThankYouPage({ searchParams }: { searchParams: SearchParams }) {
  const router = useRouter();
  const params = use(searchParams);
  const transactionId = param(params.txn);
  const value = Number(param(params.value)) || 0;
  const planParam = param(params.plan);
  const planId = planParam && planParam in PLANS ? (planParam as PlanId) : undefined;

  const [name, setName] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then(async (r) => {
      if (r.status === 401) { router.replace('/login'); return; }
      const data = await r.json();
      if (!data.user?.is_paid) { router.replace('/payment'); return; }
      setName(data.user.name);
      setReady(true);
      if (transactionId) pushPurchaseOnce(transactionId, value, planId);
    });
  }, [router, transactionId, value, planId]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF8F0' }}>
        <div className="text-5xl animate-float">🙏</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#FFF8F0' }}>
      <div className="hero-bg py-10 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 select-none text-[300px] flex items-center justify-center leading-none text-yellow-300">🙏</div>
        <p className="font-devanagari text-yellow-300 font-bold text-xl relative z-10 mb-1">॥ जय बजरंग बली ॥</p>
        <h1 className="text-2xl md:text-3xl font-bold text-white relative z-10">धन्यवाद{name ? `, ${name}` : ''}!</h1>
        <p className="text-orange-200 text-sm relative z-10 mt-1">आपका भुगतान सफलतापूर्वक हो गया है</p>
      </div>

      <div className="max-w-md mx-auto px-4 py-10">
        <div className="rounded-3xl shadow-2xl overflow-hidden text-center px-6 py-8" style={{ background: 'linear-gradient(165deg,#2B0B08,#1A0500)', border: '1px solid rgba(251,191,36,0.15)' }}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl text-white"
            style={{ background: 'linear-gradient(135deg,#E85D04,#F48C06)' }}>
            ✓
          </div>
          <h2 className="font-bold text-white text-lg mb-2">भुगतान सफल हुआ!</h2>
          <p className="text-orange-200/80 text-sm leading-relaxed mb-5">
            आपकी साधना अकाउंट activate हो गया है। अब आप साधना शुरू कर सकते हैं।
          </p>

          {(planId || value > 0 || transactionId) && (
            <div className="rounded-2xl p-4 mb-6 text-left text-sm space-y-1.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {planId && (
                <p className="flex justify-between gap-3 text-orange-200/70">प्लान <span className="text-white font-semibold">{PLANS[planId].label}</span></p>
              )}
              {value > 0 && (
                <p className="flex justify-between gap-3 text-orange-200/70">राशि <span className="text-white font-semibold">₹{value}</span></p>
              )}
              {transactionId && (
                <p className="flex justify-between gap-3 text-orange-200/70">Payment ID <span className="text-white font-mono text-xs break-all">{transactionId}</span></p>
              )}
            </div>
          )}

          <button
            onClick={() => router.replace('/dashboard')}
            className="w-full text-white py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg,#E85D04,#F48C06)' }}
          >
            साधना शुरू करें →
          </button>

          <p className="text-orange-200/50 text-[11px] mt-5">
            कोई समस्या? <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-200">WhatsApp पर सहायता लें</a>
          </p>
        </div>

        <p className="text-center text-xs text-amber-500 mt-4 font-devanagari">
          ॥ हनुमान जी की कृपा से सब कार्य सिद्ध होंगे ॥
        </p>
      </div>
    </div>
  );
}
