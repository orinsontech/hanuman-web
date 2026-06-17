'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const VERSES = [
  'श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि। बरनउँ रघुबर बिमल जसु, जो दायकु फल चारि॥',
  'बुद्धिहीन तनु जानिके, सुमिरौं पवन-कुमार। बल बुद्धि विद्या देहु मोहिं, हरहु कलेस बिकार॥',
  'जय हनुमान ज्ञान गुन सागर। जय कपीस तिहुँ लोक उजागर॥',
  'राम दूत अतुलित बल धामा। अंजनि-पुत्र पवनसुत नामा॥',
  'महाबीर बिक्रम बजरंगी। कुमति निवार सुमति के संगी॥',
  'कंचन बरन बिराज सुबेसा। कानन कुंडल कुंचित केसा॥',
  'हाथ बज्र औ ध्वजा बिराजे। काँधे मूँज जनेउ साजे॥',
  'शंकर सुवन केसरीनंदन। तेज प्रताप महा जग बंदन॥',
  'विद्यावान गुनी अति चातुर। राम काज करिबे को आतुर॥',
  'प्रभु चरित्र सुनिबे को रसिया। राम लखन सीता मन बसिया॥',
  'सूक्ष्म रूप धरि सियहिं दिखावा। बिकट रूप धरि लंक जरावा॥',
  'भीम रूप धरि असुर सँहारे। रामचंद्र के काज सँवारे॥',
  'लाय सजीवन लखन जियाये। श्रीरघुबीर हरषि उर लाये॥',
  'रघुपति कीन्ही बहुत बड़ाई। तुम मम प्रिय भरतहि सम भाई॥',
  'सहस बदन तुम्हरो जस गावैं। अस कहि श्रीपति कंठ लगावैं॥',
  'सनकादिक ब्रह्मादि मुनीसा। नारद सारद सहित अहीसा॥',
  'जम कुबेर दिगपाल जहाँ ते। कबि कोबिद कहि सके कहाँ ते॥',
  'तुम उपकार सुग्रीवहिं कीन्हा। राम मिलाय राज पद दीन्हा॥',
  'तुम्हरो मंत्र बिभीषन माना। लंकेश्वर भए सब जग जाना॥',
  'जुग सहस्र जोजन पर भानु। लील्यो ताहि मधुर फल जानू॥',
  'प्रभु मुद्रिका मेलि मुख माहीं। जलधि लांघि गये अचरज नाहीं॥',
  'दुर्गम काज जगत के जेते। सुगम अनुग्रह तुम्हरे तेते॥',
  'राम दुआरे तुम रखवारे। होत न आज्ञा बिनु पैसारे॥',
  'सब सुख लहै तुम्हारी सरना। तुम रक्षक काहू को डर ना॥',
  'आपन तेज सम्हारो आपै। तीनों लोक हाँक तें काँपै॥',
  'भूत पिशाच निकट नहिं आवै। महाबीर जब नाम सुनावै॥',
  'नासै रोग हरै सब पीरा। जपत निरंतर हनुमत बीरा॥',
  'संकट तें हनुमान छुड़ावै। मन क्रम बचन ध्यान जो लावै॥',
  'सब पर राम तपस्वी राजा। तिन के काज सकल तुम साजा॥',
  'और मनोरथ जो कोई लावै। सोइ अमित जीवन फल पावै॥',
  'चारों जुग परताप तुम्हारा। है परसिद्ध जगत उजियारा॥',
  'साधु संत के तुम रखवारे। असुर निकंदन राम दुलारे॥',
  'अष्ट सिद्धि नौ निधि के दाता। अस बर दीन जानकी माता॥',
  'राम रसायन तुम्हरे पासा। सदा रहो रघुपति के दासा॥',
  'तुम्हरे भजन राम को पावै। जनम जनम के दुख बिसरावै॥',
  'अंतकाल रघुबर पुर जाई। जहाँ जन्म हरिभक्त कहाई॥',
  'और देवता चित्त न धरई। हनुमत सेइ सर्ब सुख करई॥',
  'संकट कटै मिटै सब पीरा। जो सुमिरै हनुमत बलबीरा॥',
  'जय जय जय हनुमान गोसाईं। कृपा करहु गुरुदेव की नाईं॥',
  'जो सत बार पाठ कर कोई। छूटहि बंदि महा सुख होई॥',
  'जो यह पढ़े हनुमान चालीसा। होय सिद्धि साखी गौरीसा॥',
  'तुलसीदास सदा हरि चेरा। कीजै नाथ हृदय महँ डेरा॥',
  'पवनतनय संकट हरन, मंगल मूरति रूप। राम लखन सीता सहित, हृदय बसहु सुर भूप॥',
];

// Start second (in the audio) for each verse above, confirmed one-by-one. Extend as more are given.
const VERSE_TIMES = [
  0, 23, 49, 65, 78, 92, 103, 114, 125, 140, 151, 161, 177, 188, 198, 210, 220,
  235, 245, 257, 268, 283, 294, 305, 316, 331, 341, 352, 363, 379, 390, 400,
  412, 426, 437, 447, 459, 474, 484, 495, 505, 521, 539,
];

function getVerseIndex(t: number) {
  let idx = 0;
  for (let i = 0; i < VERSE_TIMES.length; i++) {
    if (t >= VERSE_TIMES[i]) idx = i;
  }
  return idx;
}

const COOLDOWN_MS = 12 * 60 * 60 * 1000;

export default function StutiPage() {
  const router = useRouter();
  const params = useParams();
  const dayParam = Number(params.day);
  const day = isNaN(dayParam) || dayParam < 1 || dayParam > 40 ? 1 : dayParam;

  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [listened, setListened] = useState(false);
  const [marked, setMarked] = useState(false);
  const [marking, setMarking] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);

  const verse = getVerseIndex(currentTime);

  useEffect(() => {
    fetch('/api/auth/me').then((r) => {
      if (r.status === 401) {
        router.push('/login');
        return;
      }
      r.json().then((data) => {
        if (!data.user?.is_paid) {
          router.replace('/payment');
          return;
        }

        const completedMap = new Map<number, string>(
          (data.progress || []).map(
            (p: { day_number: number; completed_at: string }) => [p.day_number, p.completed_at],
          ),
        );

        if (completedMap.has(day)) {
          setAlreadyDone(true);
          setAuthChecked(true);
          return;
        }

        const nextDay = Array.from({ length: 40 }, (_, i) => i + 1).find((d) => !completedMap.has(d)) ?? 41;
        if (day !== nextDay) {
          router.replace('/dashboard');
          return;
        }

        const prevCompletedAt = day > 1 ? completedMap.get(day - 1) : null;
        const unlockAt = prevCompletedAt ? new Date(prevCompletedAt).getTime() + COOLDOWN_MS : 0;
        if (Date.now() < unlockAt) {
          router.replace('/dashboard');
          return;
        }

        setAuthChecked(true);
      });
    });
  }, [router, day]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying(!playing);
  }

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    if (!listened && audio.currentTime >= Math.min(30, audio.duration * 0.7))
      setListened(true);
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const t = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = t;
    setCurrentTime(t);
  }

  async function markComplete() {
    setMarking(true);
    try {
      const res = await fetch('/api/progress/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day }),
      });
      if ((await res.json()).success) {
        setMarked(true);
        setTimeout(() => router.push('/dashboard'), 2000);
      }
    } finally {
      setMarking(false);
    }
  }

  function fmt(s: number) {
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  }

  if (!authChecked) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#FFF8F0' }}
      >
        <div className="text-5xl animate-float">🙏</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#FFF8F0' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-orange-700 hover:text-orange-900 font-medium text-sm"
          >
            ← डैशबोर्ड
          </Link>
          <span className="font-bold text-orange-800">दिन {day} / 40</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl animate-float mb-3 inline-block">🙏</div>
          <h1 className="text-2xl font-bold text-orange-900">
            दिन {day} — हनुमान स्तुति
          </h1>
          <p className="font-devanagari text-orange-500 mt-1">
            ॥ जय श्री राम ॥
          </p>
        </div>

        {/* Verse */}
        <div
          className="rounded-2xl p-6 mb-5 text-white text-center min-h-[90px] flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg,#C2410C,#E85D04,#F48C06)',
          }}
        >
          <p className="font-devanagari text-xl md:text-2xl font-medium leading-relaxed">
            {VERSES[verse]}
          </p>
        </div>

        {/* Player */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-amber-700 font-medium">
              हनुमान चालीसा
            </span>
            <span className="text-sm text-amber-500">
              {fmt(currentTime)} / {duration ? fmt(duration) : '--:--'}
            </span>
          </div>

          <div className="mb-5">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right,#F48C06 ${(currentTime / (duration || 100)) * 100}%,#FDE68A ${(currentTime / (duration || 100)) * 100}%)`,
              }}
            />
          </div>

          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => {
                if (audioRef.current)
                  audioRef.current.currentTime = Math.max(0, currentTime - 10);
              }}
              className="w-10 h-10 flex items-center justify-center text-amber-700 hover:text-orange-600 transition-colors text-xl"
            >
              ⏮
            </button>

            <button
              onClick={togglePlay}
              className="w-16 h-16 text-white rounded-full flex items-center justify-center text-2xl shadow-lg hover:shadow-xl transition-all hover:scale-110 animate-glow"
              style={{ background: 'linear-gradient(135deg,#E85D04,#F48C06)' }}
            >
              {playing ? '⏸' : '▶'}
            </button>

            <button
              onClick={() => {
                if (audioRef.current)
                  audioRef.current.currentTime = Math.min(
                    duration,
                    currentTime + 10,
                  );
              }}
              className="w-10 h-10 flex items-center justify-center text-amber-700 hover:text-orange-600 transition-colors text-xl"
            >
              ⏭
            </button>
          </div>

          <audio
            ref={audioRef}
            src="/audio/hanuman-chalisa.mp3"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => {
              if (audioRef.current) setDuration(audioRef.current.duration);
            }}
            onEnded={() => {
              setPlaying(false);
              setListened(true);
            }}
          />
        </div>

        {/* Complete */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 text-center">
          {alreadyDone || marked ? (
            <>
              <div className="text-5xl mb-3">✅</div>
              <h3 className="text-xl font-bold text-green-700 mb-1">
                दिन {day} पूरी हो गई!
              </h3>
              <p className="text-amber-700 text-sm mb-4">
                हनुमान जी की कृपा आप पर बनी रहे
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full font-bold"
                style={{
                  background: 'linear-gradient(135deg,#E85D04,#F48C06)',
                }}
              >
                डैशबोर्ड पर जाएं →
              </Link>
            </>
          ) : (
            <>
              <div className="text-4xl mb-3">{listened ? '🎉' : '🎵'}</div>
              <h3 className="text-lg font-bold text-orange-900 mb-2">
                {listened
                  ? 'धन्यवाद! स्तुति सुनने के लिए शुक्रिया'
                  : 'स्तुति सुनें'}
              </h3>
              <p className="text-amber-600 text-sm mb-5">
                {listened
                  ? 'अब इस दिन को complete mark करें'
                  : 'पहले स्तुति सुनें, फिर complete mark कर सकेंगे'}
              </p>
              <button
                onClick={markComplete}
                disabled={!listened || marking}
                className="text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg,#E85D04,#F48C06)',
                }}
              >
                {marking ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    सेव हो रहा है...
                  </span>
                ) : (
                  `✅ दिन ${day} Complete करें`
                )}
              </button>
            </>
          )}
        </div>

        {/* Day nav */}
        <div className="flex justify-between mt-5 gap-4">
          {day > 1 && (
            <Link
              href={`/stuti/${day - 1}`}
              className="flex-1 text-center bg-white border-2 border-orange-200 text-orange-700 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all text-sm"
            >
              ← दिन {day - 1}
            </Link>
          )}
          {day < 40 && (
            <Link
              href={`/stuti/${day + 1}`}
              className="flex-1 text-center bg-white border-2 border-orange-200 text-orange-700 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all text-sm"
            >
              दिन {day + 1} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
