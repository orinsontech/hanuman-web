import Link from 'next/link';
import Image from 'next/image';

/* ─────────────────────────────────────────── data ── */

const manokamnayein = [
  {
    icon: '💼',
    color: '#FEF3C7',
    border: '#F59E0B',
    title: 'नौकरी & करियर',
    who: 'बेरोज़गार, नौकरी बदलना चाहते हैं, प्रमोशन चाहिए',
    detail:
      'हनुमान जी महाबली हैं। उनकी स्तुति से बुद्धि तेज़ होती है, अवसर खुलते हैं और नौकरी में तरक्की मिलती है। सरकारी या प्राइवेट — हर क्षेत्र में लाभ।',
    count: '12,400+ भक्तों को नौकरी मिली',
  },
  {
    icon: '💍',
    color: '#FDF2F8',
    border: '#EC4899',
    title: 'विवाह & प्रेम',
    who: 'विवाह में देरी, मनपसंद जीवनसाथी की इच्छा',
    detail:
      'हनुमान जी की कृपा से विवाह के योग बनते हैं। 40 दिन की साधना से जीवनसाथी मिलता है, रिश्तों में प्रेम और विश्वास बढ़ता है।',
    count: '8,200+ भक्तों की शादी हुई',
  },
  {
    icon: '👶',
    color: '#F0FDF4',
    border: '#22C55E',
    title: 'संतान सुख',
    who: 'संतान की इच्छा, बच्चे की चाहत',
    detail:
      'हनुमान चालीसा का पाठ संतान सुख दिलाने में अत्यंत प्रभावशाली है। निःसंतान दंपती को संतान की प्राप्ति होती है।',
    count: '3,800+ परिवारों में खुशी आई',
  },
  {
    icon: '💰',
    color: '#FFFBEB',
    border: '#D97706',
    title: 'धन & व्यापार',
    who: 'कर्ज़, आर्थिक तंगी, व्यापार में नुकसान',
    detail:
      'हनुमान जी लक्ष्मी जी के प्रिय हैं। उनकी स्तुति से रुका हुआ धन आता है, व्यापार में बरकत होती है और कर्ज़ से मुक्ति मिलती है।',
    count: '9,600+ भक्तों की आर्थिक स्थिति सुधरी',
  },
  {
    icon: '🎓',
    color: '#EFF6FF',
    border: '#3B82F6',
    title: 'परीक्षा & पढ़ाई',
    who: 'Exam में सफलता, Competition crack करना',
    detail:
      'हनुमान जी विद्यावान गुनी हैं। उनकी स्तुति से बच्चों की एकाग्रता बढ़ती है, परीक्षा में सफलता मिलती है और प्रतियोगी परीक्षाओं में सफलता मिलती है।',
    count: '15,000+ विद्यार्थियों को सफलता मिली',
  },
  {
    icon: '🏥',
    color: '#FFF1F2',
    border: '#F43F5E',
    title: 'स्वास्थ्य & रोग मुक्ति',
    who: 'लंबी बीमारी, अस्पताल के चक्कर, परिवार की सेहत',
    detail:
      'हनुमान जी सेहत के रक्षक हैं। उनकी नियमित स्तुति से पुरानी बीमारियों में राहत मिलती है और परिवार स्वस्थ रहता है।',
    count: '7,100+ भक्तों को राहत मिली',
  },
  {
    icon: '🏠',
    color: '#F5F3FF',
    border: '#7C3AED',
    title: 'घर & संपत्ति',
    who: 'अपना घर खरीदना है, प्रॉपर्टी विवाद',
    detail:
      'हनुमान जी की कृपा से घर-जमीन के विवाद सुलझते हैं, अपने घर का सपना पूरा होता है और परिवार में सुख-शांति आती है।',
    count: '5,300+ भक्तों का घर का सपना पूरा हुआ',
  },
  {
    icon: '👨‍👩‍👧‍👦',
    color: '#FFF7ED',
    border: '#EA580C',
    title: 'पारिवारिक सुख',
    who: 'घर में झगड़े, रिश्तों में दरार',
    detail:
      'हनुमान जी प्रेम और एकता के प्रतीक हैं। साधना से घर में शांति आती है, परिवार में प्रेम बढ़ता है और दुश्मन से रक्षा होती है।',
    count: '11,200+ परिवारों में शांति आई',
  },
  {
    icon: '✈️',
    color: '#ECFDF5',
    border: '#059669',
    title: 'विदेश यात्रा & वीज़ा',
    who: 'Visa Rejection, विदेश जाने की इच्छा',
    detail:
      'हनुमान जी बाधाओं को हरने वाले हैं। उनकी कृपा से रुके हुए वीज़ा मिलते हैं, विदेश के अवसर खुलते हैं और यात्रा सुरक्षित होती है।',
    count: '4,600+ भक्तों को विदेश के अवसर मिले',
  },
];

const journey = [
  {
    day: 'दिन 1–7',
    title: 'मन की शांति',
    desc: 'पहले हफ्ते में आप महसूस करेंगे कि मन शांत हो रहा है, बेचैनी कम हो रही है। नींद अच्छी आने लगती है।',
    icon: '🌙',
  },
  {
    day: 'दिन 8–14',
    title: 'नकारात्मकता दूर',
    desc: 'दूसरे हफ्ते नकारात्मक विचार कम होते हैं। आत्मविश्वास बढ़ने लगता है और मन में उम्मीद जागती है।',
    icon: '☀️',
  },
  {
    day: 'दिन 15–21',
    title: 'रास्ते खुलने लगते हैं',
    desc: 'तीसरे हफ्ते में आपको नए अवसर दिखने लगते हैं। जो काम रुका था वो आगे बढ़ने लगता है।',
    icon: '🌟',
  },
  {
    day: 'दिन 22–40',
    title: 'मनोकामना पूर्ति',
    desc: 'अंतिम 18 दिनों में हनुमान जी की पूर्ण कृपा बरसती है। यही वो समय है जब मनोकामनाएं पूरी होती हैं।',
    icon: '🏆',
  },
];

const testimonials = [
  {
    name: 'रामप्रसाद शर्मा',
    city: 'लखनऊ',
    wish: 'नौकरी',
    text: '3 साल से नौकरी नहीं मिल रही थी। 40 दिन की साधना के बाद 35वें दिन कंपनी का call आया और नौकरी मिल गई। जय हनुमान!',
    stars: 5,
  },
  {
    name: 'सुनीता देवी',
    city: 'पटना',
    wish: 'विवाह',
    text: 'बेटे की शादी में 4 साल से देरी हो रही थी। साधना पूरी करने के 15 दिन बाद अच्छे परिवार से रिश्ता आया।',
    stars: 5,
  },
  {
    name: 'अजय कुमार',
    city: 'वाराणसी',
    wish: 'व्यापार',
    text: '₹8 लाख का कर्ज़ था, व्यापार बंद होने की कगार पर था। साधना के बाद एक बड़ा contract मिला जिससे सब सुधर गया।',
    stars: 5,
  },
  {
    name: 'प्रिया सिंह',
    city: 'दिल्ली',
    wish: 'संतान',
    text: '7 साल की शादी के बाद भी संतान नहीं थी। Doctor ने उम्मीद छोड़ दी थी। साधना के 2 महीने बाद खुशखबरी मिली।',
    stars: 5,
  },
  {
    name: 'महेश गुप्ता',
    city: 'इंदौर',
    wish: 'घर',
    text: 'Flat के लिए 5 बैंकों ने loan reject किया था। 40 दिन की साधना पूरी की और 6वें बैंक से loan पास हो गया।',
    stars: 5,
  },
  {
    name: 'अनिता यादव',
    city: 'जयपुर',
    wish: 'स्वास्थ्य',
    text: 'पति को 2 साल से घुटने का दर्द था। दवाइयाँ काम नहीं कर रही थीं। साधना के बाद धीरे-धीरे दर्द कम हुआ और अब बिल्कुल ठीक हैं।',
    stars: 5,
  },
];

const faqs = [
  {
    q: 'क्या रोज़ाना सुनना ज़रूरी है?',
    a: 'हाँ, 40 दिन की साधना में हर दिन स्तुति सुनना ज़रूरी है। यही नियमितता साधना को प्रभावशाली बनाती है। सिर्फ 10 मिनट रोज़ देने होंगे।',
  },
  {
    q: 'अगर एक दिन छूट जाए तो?',
    a: 'साधना में नियमितता सबसे ज़रूरी है। अगर कोई दिन छूट जाए तो उसे count नहीं किया जाएगा। लेकिन घबराएं नहीं — आप वहीं से जारी रख सकते हैं।',
  },
  {
    q: 'स्तुति कब सुननी चाहिए?',
    a: 'सुबह सूर्योदय के समय या शाम को संध्या काल में सुनना सबसे उत्तम है। लेकिन अगर संभव न हो तो दिन में किसी भी समय सुन सकते हैं।',
  },
  {
    q: 'क्या मोबाइल पर सुन सकते हैं?',
    a: 'बिल्कुल! हमारी website पूरी तरह mobile-friendly है। आप कहीं भी, कभी भी — घर में, ऑफिस में, सफर में — अपने मोबाइल पर सुन सकते हैं।',
  },
  {
    q: 'Payment सुरक्षित है?',
    a: 'हाँ, 100% सुरक्षित। भुगतान सीधे UPI के ज़रिए होता है — QR कोड स्कैन करें या किसी भी UPI App (GPay, PhonePe, Paytm) से Pay करें।',
  },
  {
    q: 'सर्टिफिकेट कब मिलेगा?',
    a: '40 दिन की साधना पूरी करने के तुरंत बाद आप Certificate page पर जाकर अपना digital certificate download कर सकते हैं। इसे print भी कर सकते हैं।',
  },
  {
    q: 'कीमत क्या है?',
    a: '₹189 में 3-दिन का ट्रायल शुरू करें — पहले 3 दिन की स्तुति और progress tracker मुफ्त आज़माएं। पूरी 40-दिन साधना ₹299 में, और Lifetime access (जब चाहें दोबारा साधना करें) ₹499 में उपलब्ध है। Digital certificate 40 दिन पूरे करने पर मिलता है। कोई hidden charge नहीं।',
  },
  {
    q: 'क्या ये सच में काम करता है?',
    a: 'हज़ारों भक्त इसके गवाह हैं। हनुमान जी की कृपा पर विश्वास और नियमित साधना — यही दो चीज़ें मिलकर चमत्कार करती हैं। श्रद्धा और निष्ठा से करें, परिणाम ज़रूर मिलेगा।',
  },
];

const steps = [
  {
    num: '01',
    icon: '📱',
    title: 'रजिस्टर करें',
    desc: 'मोबाइल नंबर डालें, OTP से लॉगिन करें — बस 30 सेकंड में',
  },
  {
    num: '02',
    icon: '💳',
    title: '₹189 में ट्रायल शुरू करें',
    desc: 'UPI, Card या Netbanking से Pay करें — कोई छुपा शुल्क नहीं',
  },
  {
    num: '03',
    icon: '🎵',
    title: 'रोज़ स्तुति सुनें',
    desc: 'हर रोज़ 10 मिनट। 40 दिन की साधना अपने आप track होगी',
  },
  {
    num: '04',
    icon: '🏆',
    title: 'मनोकामना & सर्टिफिकेट',
    desc: '40 दिन पूरे होने पर digital certificate और हनुमान जी की कृपा',
  },
];

/* ─────────────────────────────────────────── page ── */

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: '#FFF8F0' }}>
      {/* ══ NAVBAR ══ */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚩</span>
            <div>
              <span className="font-bold text-orange-800 text-lg leading-none block">
                हनुमान स्तुति
              </span>
              <span className="text-[10px] text-orange-500 tracking-widest">
                <span className="font-devanagari">जय बजरंग बली</span> · by BhaktiAmrit
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full font-semibold">
              ₹189 से शुरू
            </span>
            <Link
              href="/login"
              className="text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#E85D04,#F48C06)' }}
            >
              अभी शुरू करें
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="hero-bg relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
            style={{
              background: 'radial-gradient(circle,#FBBF24,transparent 70%)',
              transform: 'translate(30%,-30%)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
            style={{
              background: 'radial-gradient(circle,#F48C06,transparent 70%)',
              transform: 'translate(-30%,30%)',
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-4">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-14">
            {/* IMAGE — left */}
            <div className="flex-shrink-0 flex justify-center lg:w-[50%] order-1 w-full">
              <div className="relative w-full max-w-[260px] lg:max-w-[300px] mx-auto">
                <div
                  className="absolute inset-[-28px] rounded-full opacity-25 animate-spin-slow"
                  style={{
                    background:
                      'conic-gradient(from 0deg,#FBBF24,#F48C06,#EF4444,#F48C06,#FBBF24)',
                  }}
                />
                <div className="absolute inset-[-10px] rounded-[2rem] animate-glow" />
                <div
                  className="relative w-full rounded-[2rem] overflow-hidden animate-float"
                  style={{
                    border: '5px solid rgba(251,191,36,0.95)',
                    boxShadow:
                      '0 0 0 3px rgba(232,93,4,0.5), 0 40px 100px rgba(0,0,0,0.7)',
                  }}
                >
                  <Image
                    src="/hanuman-hero22.png"
                    alt="श्री हनुमान जी — हनुमान स्तुति"
                    width={300}
                    height={380}
                    priority
                    className="w-full object-cover"
                    style={{ maxHeight: 380 }}
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pt-14 pb-4 px-4 text-center">
                    <p className="font-devanagari text-yellow-300 font-bold text-lg tracking-wide animate-flicker">
                      ॥ राम काज कीन्हे बिनु मोहि कहाँ बिश्राम ॥
                    </p>
                  </div>
                </div>
                <div
                  className="absolute -top-5 -right-5 text-white text-sm font-bold px-4 py-2.5 rounded-full shadow-xl border border-yellow-400 animate-float"
                  style={{
                    animationDelay: '.4s',
                    background: 'linear-gradient(135deg,#B45309,#D97706)',
                  }}
                >
                  🪔 40 दिन की साधना
                </div>
                <div
                  className="absolute -bottom-4 -left-4 text-white text-sm font-bold px-4 py-2.5 rounded-full shadow-xl animate-float"
                  style={{
                    animationDelay: '.9s',
                    background: 'linear-gradient(135deg,#C2410C,#E85D04)',
                  }}
                >
                  🏆 सर्टिफिकेट मिलेगा
                </div>
              </div>
            </div>

            {/* TEXT — right */}
            <div className="flex-1 text-center lg:text-left order-2 text-white">
              {/* Live badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm text-yellow-200 mb-4">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                50,000+ भक्त जुड़ चुके हैं
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl xl:text-[3.2rem] font-bold leading-tight mb-4">
                <span className="font-devanagari text-yellow-300 block text-xl md:text-2xl mb-2">
                  ॥ श्री हनुमान चालीसा ॥
                </span>
                <span className="text-white">40 दिन की </span>
                <span className="shimmer-text">हनुमान स्तुति</span>
                <br />
                <span className="text-orange-300">साधना</span>
              </h1>

              {/* Tagline */}
              <p className="text-orange-100 text-base md:text-lg mb-5 leading-relaxed max-w-xl">
                रोज़ सिर्फ <strong className="text-yellow-300">10 मिनट</strong> हनुमान जी की स्तुति सुनें।
                हनुमान जी की कृपा से आपकी हर मनोकामना पूरी होती है —
              </p>

              {/* Manokamna tags */}
              <div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start">
                {[
                  { icon: '💼', label: 'नौकरी' },
                  { icon: '🏢', label: 'व्यापार' },
                  { icon: '💍', label: 'विवाह' },
                  { icon: '👶', label: 'संतान' },
                  { icon: '💰', label: 'धन-समृद्धि' },
                  { icon: '🏥', label: 'स्वास्थ्य' },
                  { icon: '🏠', label: 'घर-जमीन' },
                  { icon: '✈️', label: 'विदेश वीज़ा' },
                  { icon: '🎓', label: 'परीक्षा' },
                ].map((m) => (
                  <span key={m.label}
                    className="inline-flex items-center gap-1.5 bg-white/10 border border-yellow-400/40 text-yellow-200 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
                    {m.icon} {m.label}
                  </span>
                ))}
              </div>

              {/* Price box */}
              <div className="inline-flex items-center gap-4 bg-white/10 border border-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl mb-6">
                <div>
                  <p className="text-orange-300 text-xs">बस</p>
                  <p className="text-white font-bold text-3xl leading-none">₹189</p>
                  <p className="text-orange-300 text-xs">से 3-दिन ट्रायल शुरू करें</p>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <ul className="text-left space-y-1">
                  <li className="text-yellow-300 text-sm">✅ 3-दिन ट्रायल स्तुति</li>
                  <li className="text-yellow-300 text-sm">✅ रोज़ Progress Tracker</li>
                  <li className="text-yellow-300 text-sm">✅ बाद में 40-दिन/Lifetime में अपग्रेड करें</li>
                  <li className="text-orange-300 text-xs">❌ कोई छुपा शुल्क नहीं</li>
                </ul>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-5">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 text-white px-8 py-4 rounded-full text-lg font-bold shadow-2xl transition-all hover:scale-105 animate-glow"
                  style={{ background: 'linear-gradient(135deg,#F48C06,#E85D04)' }}
                >
                  🚩 ₹189 में ट्रायल शुरू करें
                </Link>
                <Link
                  href="#manokamna"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all"
                >
                  मनोकामनाएं देखें ↓
                </Link>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center lg:justify-start text-sm text-orange-200">
                <span>🔒 100% सुरक्षित UPI भुगतान</span>
                <span>⚡ तुरंत एक्सेस मिलेगा</span>
                <span>📱 मोबाइल पर चलेगा</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ lineHeight: 0 }}>
          <svg
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
            style={{ display: 'block', width: '100%', height: 60 }}
          >
            <path
              d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z"
              fill="#FFF8F0"
            />
          </svg>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <div className="bg-white border-b border-orange-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 divide-x divide-orange-100">
          {[
            { num: '50,000+', label: 'भक्त जुड़े' },
            { num: '40 दिन', label: 'की साधना' },
            { num: '9 तरह', label: 'की मनोकामनाएं' },
            { num: '₹189', label: 'से शुरू' },
          ].map((s) => (
            <div key={s.label} className="text-center px-4 py-2">
              <div className="text-xl md:text-2xl font-bold text-orange-600">
                {s.num}
              </div>
              <div className="text-xs text-amber-700 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ MARQUEE ══ */}
      <div
        className="overflow-hidden py-4"
        style={{ background: 'linear-gradient(90deg,#C2410C,#E85D04,#C2410C)' }}
      >
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2].map((k) => (
            <span
              key={k}
              className="font-devanagari text-white text-lg tracking-widest px-8"
            >
              🚩 जय हनुमान ज्ञान गुण सागर &nbsp;•&nbsp; ॥ राम काज कीन्हे बिनु
              मोहि कहाँ बिश्राम ॥ &nbsp;•&nbsp; 🙏 मनोजवं मारुततुल्यवेगम्
              &nbsp;•&nbsp; जय श्री राम &nbsp;•&nbsp; हनुमान की जय &nbsp;•&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ══ MANOKAMNA SECTION ══ */}
      <section id="manokamna" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-orange-100 text-orange-700 text-xs font-bold tracking-widest px-4 py-1.5 rounded-full mb-3">
              मनोकामनाएं
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-orange-900 mb-3">
              आपकी कौन सी मनोकामना है?
            </h2>
            <p className="text-amber-700 max-w-2xl mx-auto leading-relaxed">
              हनुमान जी संकट मोचन हैं — हर समस्या का समाधान उनके पास है। 40 दिन
              की स्तुति से ये सभी मनोकामनाएं पूरी होती हैं।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {manokamnayein.map((m) => (
              <div
                key={m.title}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border"
                style={{ borderColor: m.border + '40' }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                    style={{
                      background: m.color,
                      border: `2px solid ${m.border}40`,
                    }}
                  >
                    {m.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-orange-900 text-base mb-0.5">
                      {m.title}
                    </h3>
                    <p className="text-xs text-amber-500 leading-snug">
                      {m.who}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-amber-800 leading-relaxed mb-4">
                  {m.detail}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                  <span className="text-xs text-green-700 font-medium">
                    {m.count}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#E85D04,#F48C06)' }}
            >
              🙏 अपनी मनोकामना पूरी करें — ₹189 में ट्रायल शुरू करें
            </Link>
          </div>
        </div>
      </section>

      {/* ══ SPIRITUAL SIGNIFICANCE ══ */}
      <section
        className="py-20 px-4"
        style={{
          background: 'linear-gradient(135deg,#1A0500,#3B0F02,#7C2D12)',
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-white/10 text-yellow-300 text-xs font-bold tracking-widest px-4 py-1.5 rounded-full mb-3">
              आध्यात्मिक महत्व
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              क्यों काम करती है ये साधना?
            </h2>
            <p className="text-orange-200 max-w-2xl mx-auto">
              हनुमान जी को कलियुग का सबसे जाग्रत देवता माना जाता है
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {[
              {
                icon: '📖',
                title: 'हनुमान चालीसा की शक्ति',
                text: 'गोस्वामी तुलसीदास जी द्वारा रचित हनुमान चालीसा में 40 चौपाइयाँ हैं। प्रत्येक चौपाई में अपार शक्ति है। 40 दिन = 40 चौपाइयों का सम्पूर्ण प्रभाव।',
              },
              {
                icon: '⚡',
                title: 'कलियुग के जाग्रत देवता',
                text: 'शास्त्रों के अनुसार कलियुग में हनुमान जी सबसे जल्दी प्रसन्न होते हैं। उनकी भक्ति से सभी पापों का नाश होता है और मनोकामनाएं पूरी होती हैं।',
              },
              {
                icon: '🔄',
                title: '40 दिन का नियम',
                text: 'वैज्ञानिक रूप से भी 40 दिन किसी भी आदत या बदलाव के लिए ज़रूरी हैं। आध्यात्मिक रूप से 40 दिन की साधना "संस्कार" बनाती है जो जीवन बदल देता है।',
              },
              {
                icon: '🛡️',
                title: 'नकारात्मकता से रक्षा',
                text: 'हनुमान जी की स्तुति एक कवच की तरह काम करती है। बुरी शक्तियाँ, नज़र, और नकारात्मक ऊर्जा से रक्षा होती है। घर में सुख-शांति आती है।',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-sm"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-yellow-300 text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-orange-200 text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* Shloka highlight */}
          <div className="bg-white/10 border border-yellow-400/30 rounded-2xl p-8 text-center">
            <p className="font-devanagari text-yellow-300 text-2xl font-bold mb-3">
              ॥ भूत पिशाच निकट नहिं आवैं। महावीर जब नाम सुनावैं ॥
            </p>
            <p className="text-orange-200 text-sm">
              — हनुमान चालीसा, तुलसीदास जी
            </p>
          </div>
        </div>
      </section>

      {/* ══ 40-DAY JOURNEY ══ */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-orange-100 text-orange-700 text-xs font-bold tracking-widest px-4 py-1.5 rounded-full mb-3">
              40 दिन की यात्रा
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-orange-900">
              हर हफ्ते क्या होता है?
            </h2>
            <p className="text-amber-700 mt-3">
              साधना के दौरान आप इन बदलावों को खुद महसूस करेंगे
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-400 to-amber-200 hidden md:block" />
            <div className="space-y-6">
              {journey.map((j, i) => (
                <div key={j.day} className="flex gap-6 items-start">
                  <div
                    className="flex-shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-2xl shadow-lg z-10"
                    style={{
                      background: 'linear-gradient(135deg,#FEF3C7,#FBBF24)',
                    }}
                  >
                    {j.icon}
                  </div>
                  <div className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-orange-100">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                        {j.day}
                      </span>
                      <h3 className="font-bold text-orange-900 text-base">
                        {j.title}
                      </h3>
                    </div>
                    <p className="text-sm text-amber-700 leading-relaxed">
                      {j.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section
        id="kaise-kaam"
        className="py-20 px-4"
        style={{ background: 'linear-gradient(180deg,#FFF7ED,#FFFBF0)' }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-orange-100 text-orange-700 text-xs font-bold tracking-widest px-4 py-1.5 rounded-full mb-3">
              कैसे काम करता है
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-orange-900">
              सिर्फ 4 आसान कदम
            </h2>
          </div>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`relative flex gap-5 items-start bg-white rounded-2xl p-5 shadow-sm border border-orange-100 ${i < steps.length - 1 ? 'step-line' : ''}`}
              >
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md"
                  style={{
                    background: 'linear-gradient(135deg,#FEF3C7,#FBBF24)',
                  }}
                >
                  {step.icon}
                </div>
                <div>
                  <span className="text-xs font-bold text-orange-400">
                    STEP {step.num}
                  </span>
                  <h3 className="font-bold text-orange-900 text-base mt-0.5">
                    {step.title}
                  </h3>
                  <p className="text-sm text-amber-700 mt-0.5 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TRUST SECTION ══ */}
      <section className="py-14 px-4 bg-white border-y border-orange-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-orange-900">
              आप सुरक्षित हाथों में हैं
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              {
                icon: '🔒',
                title: '100% सुरक्षित',
                desc: 'Direct UPI Transfer',
              },
              {
                icon: '⚡',
                title: 'तुरंत एक्सेस',
                desc: 'Payment के बाद instantly',
              },
              {
                icon: '📱',
                title: 'मोबाइल फ्रेंडली',
                desc: 'Android & iOS दोनों पर',
              },
              {
                icon: '🎯',
                title: 'एकमुश्त भुगतान',
                desc: 'कोई subscription नहीं',
              },
            ].map((t) => (
              <div
                key={t.title}
                className="p-5 rounded-2xl"
                style={{ background: '#FFF8F0' }}
              >
                <div className="text-4xl mb-2">{t.icon}</div>
                <h3 className="font-bold text-orange-900 text-sm mb-1">
                  {t.title}
                </h3>
                <p className="text-xs text-amber-600">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-3xl overflow-hidden shadow-2xl"
            style={{ border: '3px solid #F59E0B' }}
          >
            <div
              className="text-center py-8 px-6 text-white relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg,#1A0500,#7C2D12,#C2410C)',
              }}
            >
              <div className="absolute inset-0 opacity-10 text-[200px] flex items-center justify-center leading-none select-none">
                🚩
              </div>
              <p className="font-devanagari text-yellow-300 text-xl font-bold mb-2 relative z-10">
                ॥ साधना पैकेज ॥
              </p>
              <div className="flex items-end justify-center gap-1 relative z-10">
                <span className="text-orange-300 text-2xl font-bold mb-1">
                  ₹
                </span>
                <span className="text-white text-7xl font-bold leading-none">
                  189
                </span>
              </div>
              <p className="text-orange-300 text-sm mt-1 relative z-10">
                3-दिन ट्रायल — बिना किसी जोखिम के शुरू करें
              </p>
            </div>
            <div className="bg-white p-8">
              <div className="grid grid-cols-2 gap-3 mb-7">
                {[
                  '3 दिन की हनुमान स्तुति',
                  'रोज़ का प्रगति ट्रैकर',
                  'मोबाइल पर कहीं भी',
                  'तुरंत एक्सेस',
                  '9 तरह की मनोकामना',
                  'जब चाहें अपग्रेड करें',
                  '40-दिन प्लान ₹299 में',
                  'Lifetime प्लान ₹499 में',
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg,#E85D04,#F48C06)',
                      }}
                    >
                      ✓
                    </span>
                    <span className="text-sm text-amber-800 font-medium">
                      {f}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                href="/login"
                className="block w-full text-center text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg,#E85D04,#F48C06)',
                }}
              >
                🚩 अभी ₹189 में ट्रायल शुरू करें
              </Link>
              <p className="text-center text-xs text-amber-500 mt-3">
                🔒 100% सुरक्षित भुगतान • UPI, Card, Netbanking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section
        className="py-20 px-4"
        style={{ background: 'linear-gradient(180deg,#FFF7ED,#FFF8F0)' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-orange-100 text-orange-700 text-xs font-bold tracking-widest px-4 py-1.5 rounded-full mb-3">
              भक्तों के अनुभव
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-orange-900">
              उनकी साधना, उनकी कहानी
            </h2>
            <p className="text-amber-600 mt-3">
              50,000+ भक्तों में से कुछ के अनुभव
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl p-6 shadow-md border-l-4 border-orange-500"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-medium border border-orange-200">
                    {t.wish}
                  </span>
                </div>
                <p className="text-amber-800 text-sm leading-relaxed mb-4">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{
                      background: 'linear-gradient(135deg,#F48C06,#E85D04)',
                    }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-orange-900 text-sm">
                      {t.name}
                    </p>
                    <p className="text-xs text-amber-500">
                      {t.city} • ✅ Verified
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-orange-100 text-orange-700 text-xs font-bold tracking-widest px-4 py-1.5 rounded-full mb-3">
              सवाल & जवाब
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-orange-900">
              आपके मन में सवाल हैं?
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="font-semibold text-orange-900 pr-4">
                    {faq.q}
                  </span>
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-orange-600 font-bold text-lg transition-transform group-open:rotate-45"
                    style={{
                      background: '#FFF7ED',
                      border: '2px solid #FED7AA',
                    }}
                  >
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-amber-700 text-sm leading-relaxed border-t border-orange-50 pt-4">
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section
        className="py-20 px-4 text-white text-center"
        style={{
          background: 'linear-gradient(135deg,#1A0500,#7C2D12,#C2410C)',
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-5 animate-float inline-block">🙏</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            देर मत करें — आज से शुरू करें!
          </h2>
          <p className="text-orange-200 mb-2 text-lg">
            हर दिन सिर्फ 10 मिनट। 40 दिन की साधना।
          </p>
          <p className="font-devanagari text-yellow-300 text-xl mb-8">
            ॥ राम काज कीन्हे बिनु, मोहि कहाँ बिश्राम ॥
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-3 bg-white text-orange-700 px-10 py-4 rounded-full text-xl font-bold shadow-2xl hover:shadow-orange-500/30 transition-all hover:scale-105"
          >
            🚩 ₹189 में ट्रायल शुरू करें
          </Link>
          <p className="text-orange-300 text-sm mt-6">
            🔒 सुरक्षित भुगतान &nbsp;•&nbsp; ⚡ तुरंत एक्सेस &nbsp;•&nbsp; 📱
            मोबाइल पर चलेगा
          </p>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer
        style={{ background: '#1A0500' }}
        className="text-amber-300 py-10 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-devanagari text-2xl text-yellow-300 mb-2">
            ॥ जय बजरंग बली ॥
          </p>
          <p className="text-orange-400 font-devanagari text-lg mb-4">
            हनुमान जी की कृपा से सबका मंगल हो
          </p>
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-xs text-amber-500 mb-4">
            <a href="mailto:seva@bhaktiamrit.com" className="hover:text-yellow-300 transition-colors underline underline-offset-2">
              📧 seva@bhaktiamrit.com
            </a>
            <span className="text-amber-700">•</span>
            <a href="https://wa.me/919776307793" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition-colors underline underline-offset-2">
              💬 +91 97763 07793 (WhatsApp only)
            </a>
          </div>
          <div className="flex justify-center gap-6 text-xs text-amber-600 mb-4">
            <Link href="/privacy-policy" className="hover:text-yellow-300 transition-colors underline underline-offset-2">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-yellow-300 transition-colors underline underline-offset-2">Terms & Conditions</Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-yellow-300 transition-colors underline underline-offset-2">Refund Policy</Link>
          </div>
          <p className="text-xs text-amber-700">
            © 2024 हनुमान स्तुति साधना। सबका मंगल हो।
          </p>
          <p className="text-xs text-amber-700 mt-1">Powered by BhaktiAmrit</p>
        </div>
      </footer>
    </div>
  );
}
