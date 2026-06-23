'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import { trackPixelEvent } from '@/lib/fbq';

interface User { name: string | null; phone: string; is_paid: boolean }

const WHATSAPP_LINK = 'https://wa.me/919776307793';

function buildUpiParams(phone: string) {
  return `pa=9090525328-2@ybl&pn=SOCIAL%20SCALAR&mc=0000&mode=02&purpose=00&am=199&cu=INR&tn=${phone}`;
}

function buildUpiApps(params: string) {
  return [
    { name: 'Google Pay', link: `tez://upi/pay?${params}`, logo: '/upi/gpay.png' },
    { name: 'PhonePe', link: `phonepe://pay?${params}`, logo: '/upi/phonepe.png' },
    { name: 'Paytm', link: `paytmmp://pay?${params}`, logo: '/upi/paytm.png' },
    { name: 'BHIM UPI', link: `bhim://upi/pay?${params}`, logo: '/upi/bhim.png' },
  ];
}

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
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then(async (r) => {
      if (r.status === 401) { router.push('/login'); return; }
      const data = await r.json();
      if (data.user?.is_paid) { router.replace('/dashboard'); return; }
      setUser(data.user);
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

  async function handleChangeDetails() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  const upiParams = buildUpiParams(user.phone);
  const upiLink = `upi://pay?${upiParams}`;
  const upiApps = buildUpiApps(upiParams);

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

              {claimed ? (
                <div className="text-center px-6 pb-6">
                  <div className="text-5xl mb-4">🙏</div>
                  <h3 className="font-bold text-white text-lg mb-2">जानकारी मिल गई है!</h3>
                  <p className="text-orange-200/80 text-sm leading-relaxed mb-5">
                    आपका अकाउंट <strong className="text-white">2 घंटे के अंदर</strong> activate हो जाएगा। हम आपसे जल्द ही contact करेंगे।
                    <br /><br />
                    <strong className="text-red-400">कृपया दोबारा Payment न करें।</strong>
                  </p>
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-green-600 transition-colors"
                  >
                    💬 WhatsApp करें: +91 97763 07793
                  </a>
                </div>
              ) : (
                <>
                  {/* Amount */}
                  <div className="mx-6 mb-5 rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="text-orange-300/70 text-[10px] tracking-widest font-semibold mb-1">कुल राशि</p>
                    <div className="flex items-end gap-1">
                      <span className="text-yellow-300 text-xl font-bold">₹</span>
                      <span className="text-white text-4xl font-bold leading-none">199</span>
                    </div>
                    <p className="text-orange-300/70 text-xs mt-1">UPI से भुगतान</p>
                  </div>

                  {/* QR code */}
                  <div className="flex flex-col items-center px-6 mb-4">
                    <div className="bg-white p-3 rounded-2xl shadow-lg mb-3">
                      <QRCodeSVG value={upiLink} size={200} level="M" />
                    </div>
                    <p className="text-orange-200/60 text-xs text-center">Google Pay, PhonePe या किसी भी UPI App से Scan करें</p>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 px-6 mb-4">
                    <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
                    <span className="text-orange-300/50 text-[10px] tracking-widest font-semibold">या App में खोलें</span>
                    <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
                  </div>

                  {/* App rows */}
                  <div className="px-6 grid grid-cols-2 gap-2 mb-2">
                    {upiApps.map((app) => (
                      <a
                        key={app.name}
                        href={app.link}
                        className="flex items-center gap-2.5 rounded-xl p-3 transition-colors hover:bg-white/5"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <span className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-white flex items-center justify-center">
                          <Image src={app.logo} alt={app.name} width={36} height={36} className="object-contain w-full h-full" />
                        </span>
                        <span>
                          <p className="text-white text-xs font-semibold leading-tight">{app.name}</p>
                          <p className="text-white/40 text-[10px] leading-tight">खोलने के लिए Tap करें</p>
                        </span>
                      </a>
                    ))}
                  </div>

                  {/* Any UPI app */}
                  <div className="px-6 mb-5">
                    <a
                      href={upiLink}
                      className="flex items-center gap-2.5 rounded-xl p-3 transition-colors hover:bg-white/5"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <span className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-white flex items-center justify-center">
                        <Image src="/upi/upi-other.jpg" alt="किसी भी UPI App" width={36} height={36} className="object-contain w-full h-full" />
                      </span>
                      <span className="flex-1">
                        <p className="text-white text-xs font-semibold leading-tight">कोई भी UPI App</p>
                        <p className="text-white/40 text-[10px] leading-tight">App चुनने का विकल्प खुलेगा</p>
                      </span>
                      <span className="text-white/40">→</span>
                    </a>
                  </div>

                  {/* Divider */}
                  <div className="mx-6 mb-4 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />

                  {/* I have paid */}
                  <div className="px-6 mb-5">
                    <button
                      onClick={() => {
                        setClaimed(true);
                        const eventId = `purchase_${Date.now()}_${Math.random().toString(36).slice(2)}`;
                        trackPixelEvent('Purchase', { value: 199, currency: 'INR' }, { eventID: eventId });
                        fetch('/api/meta/purchase', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ eventId }),
                        }).catch(() => {});
                      }}
                      className="w-full text-white py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all hover:scale-[1.02]"
                      style={{ background: 'linear-gradient(135deg,#E85D04,#F48C06)' }}
                    >
                      ✓ मैंने Payment कर दिया है
                    </button>
                  </div>

                  {/* Footer */}
                  <p className="text-center text-white/30 text-[10px] tracking-widest font-semibold pb-5">
                    🔒 सुरक्षित · UPI द्वारा संचालित
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
