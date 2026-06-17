'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CertData { user: { name: string | null; phone: string }; completedOn: string }

export default function CertificatePage() {
  const router = useRouter();
  const certRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<CertData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/certificate').then(async (r) => {
      if (r.status === 401) { router.push('/login'); return; }
      const json = await r.json();
      if (!r.ok) { setError(json.error || 'Error'); return; }
      setData(json);
    }).finally(() => setLoading(false));
  }, [router]);

  const displayName = data?.user.name || `+91 ${data?.user.phone}`;
  const completedDate = data?.completedOn
    ? new Date(data.completedOn).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF8F0' }}>
      <div className="text-5xl animate-float">🙏</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#FFF8F0' }}>
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center border border-orange-100">
        <div className="text-5xl mb-4">⏳</div>
        <h2 className="text-xl font-bold text-orange-900 mb-2">अभी नहीं!</h2>
        <p className="text-amber-700 mb-6">{error}</p>
        <Link href="/dashboard"
          className="inline-flex gap-2 text-white px-6 py-3 rounded-full font-bold"
          style={{ background: 'linear-gradient(135deg,#E85D04,#F48C06)' }}>
          डैशबोर्ड पर वापस जाएं
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #certificate, #certificate * { visibility: visible !important; }
          #certificate { position: fixed; inset: 0; width: 100vw; height: 100vh; margin: 0; border-radius: 0 !important; box-shadow: none !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="min-h-screen" style={{ background: '#FFF8F0' }}>
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-sm no-print">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/dashboard" className="text-orange-700 font-medium text-sm">← डैशबोर्ड</Link>
            <button onClick={() => window.print()}
              className="text-white px-5 py-2 rounded-full font-bold text-sm hover:shadow-lg transition-all"
              style={{ background: 'linear-gradient(135deg,#E85D04,#F48C06)' }}>
              ⬇ डाउनलोड / प्रिंट
            </button>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="text-center mb-8 no-print">
            <div className="text-5xl mb-3 animate-float inline-block">🏆</div>
            <h1 className="text-3xl font-bold text-orange-900">बधाई हो!</h1>
            <p className="text-amber-700 mt-1">आपने 40 दिन की साधना पूरी की। नीचे आपका प्रमाणपत्र है।</p>
          </div>

          {/* Certificate */}
          <div id="certificate" ref={certRef} className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            style={{ border: '5px solid #F59E0B' }}>
            <div className="py-7 px-6 text-center text-white relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg,#1A0500,#7C2D12,#C2410C,#E85D04)' }}>
              <div className="absolute inset-0 opacity-10 text-[180px] flex items-center justify-center leading-none select-none">🚩</div>
              <p className="font-devanagari text-3xl font-bold mb-1 relative z-10">॥ जय श्री हनुमान ॥</p>
              <p className="text-orange-200 text-xs tracking-widest uppercase relative z-10">हनुमान स्तुति साधना प्रमाणपत्र</p>
            </div>

            <div className="p-8 md:p-12 text-center relative">
              <div className="absolute top-4 left-4 text-amber-200 text-4xl select-none">✦</div>
              <div className="absolute top-4 right-4 text-amber-200 text-4xl select-none">✦</div>
              <div className="absolute bottom-4 left-4 text-amber-200 text-4xl select-none">✦</div>
              <div className="absolute bottom-4 right-4 text-amber-200 text-4xl select-none">✦</div>

              <div className="text-6xl mb-4">🏅</div>
              <h2 className="text-lg text-amber-700 font-medium mb-2">यह प्रमाणपत्र प्रदान किया जाता है</h2>
              <h1 className="text-4xl md:text-5xl font-bold text-orange-900 my-4 pb-3" style={{ borderBottom: '2px solid #FDE68A' }}>
                {displayName}
              </h1>
              <p className="text-amber-700 text-lg mb-6 max-w-lg mx-auto leading-relaxed">
                को उनकी अनन्य निष्ठा एवं भक्ति के उपलक्ष्य में, जिन्होंने{' '}
                <strong className="text-orange-700">लगातार 40 दिन</strong> तक श्री हनुमान जी की स्तुति की और{' '}
                <strong className="text-orange-700">साधना सम्पन्न</strong> की।
              </p>

              <div className="bg-amber-50 rounded-2xl p-5 mb-8 border border-amber-200 max-w-sm mx-auto">
                <p className="font-devanagari text-orange-600 text-xl font-bold mb-1">
                  ॥ राम काज कीन्हे बिनु, मोहि कहाँ बिश्राम ॥
                </p>
                <p className="text-amber-600 text-sm">साधना सम्पन्न तिथि: {completedDate}</p>
              </div>

              <div className="flex justify-center gap-10 mb-8">
                {[['40', 'दिन की स्तुति'], ['100%', 'साधना पूरी'], ['🙏', 'हनुमान कृपा']].map(([n, l]) => (
                  <div key={l} className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{n}</div>
                    <div className="text-xs text-amber-600 mt-1">{l}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-amber-100 pt-5">
                <p className="font-devanagari text-amber-800 font-bold text-lg mb-1">
                  ॥ हनुमान जी की कृपा सदा आप पर बनी रहे ॥
                </p>
                <p className="text-xs text-amber-400">hanuman.kaama.online</p>
              </div>
            </div>
          </div>

          {/* Share */}
          <div className="mt-8 grid md:grid-cols-2 gap-4 no-print">
            <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-md">
              <div className="text-3xl mb-2">📤</div>
              <h3 className="font-bold text-orange-900 mb-1">Share करें</h3>
              <p className="text-sm text-amber-700 mb-3">अपने प्रियजनों के साथ share करें</p>
              <button
                onClick={() => navigator.share?.({ title: 'मैंने 40 दिन की हनुमान स्तुति साधना पूरी की!', text: `🙏 जय श्री राम! मैंने hanuman.kaama.online पर 40 दिन की साधना पूरी की। आप भी शुरू करें!` })}
                className="text-white px-4 py-2 rounded-full text-sm font-bold"
                style={{ background: 'linear-gradient(135deg,#E85D04,#F48C06)' }}>
                🚩 Share करें
              </button>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-md">
              <div className="text-3xl mb-2">🔄</div>
              <h3 className="font-bold text-orange-900 mb-1">दोबारा शुरू करें</h3>
              <p className="text-sm text-amber-700 mb-3">हर 40 दिन में साधना करें, कृपा बढ़ती रहेगी</p>
              <Link href="/dashboard"
                className="inline-block bg-amber-50 text-amber-800 px-4 py-2 rounded-full text-sm font-bold border border-amber-200">
                डैशबोर्ड →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
