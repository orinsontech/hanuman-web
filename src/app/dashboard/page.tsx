'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User { id: number; phone: string; name: string | null; is_paid: boolean }
interface Progress { day_number: number; completed_at: string }

const COOLDOWN_MS = 12 * 60 * 60 * 1000;

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

function SankalpNiyam() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying(!playing);
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-5 mb-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="w-12 h-12 flex-shrink-0 text-white rounded-full flex items-center justify-center text-lg shadow-md hover:scale-110 transition-all"
          style={{ background: 'linear-gradient(135deg,#E85D04,#F48C06)' }}
        >
          {playing ? '⏸' : '▶'}
        </button>
        <div className="flex-1">
          <p className="text-sm font-bold text-orange-900">संकल्प का नियम</p>
          <p className="text-xs text-amber-500">
            {fmt(currentTime)} / {duration ? fmt(duration) : '--:--'}
          </p>
        </div>
      </div>
      <p className="text-xs text-red-600 font-semibold mt-3">
        ⚠️ पहला दिन का पाठ करने से पहले यह नियम ज़रूर सुनें
      </p>
      <audio
        ref={audioRef}
        src="/audio/sankalp_ka_nam_jane.mp3"
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => { if (r.status === 401) { router.push('/login'); return null; } return r.json(); })
      .then((data) => {
        if (!data) return;
        if (!data.user?.is_paid) { router.replace('/payment'); return; }
        setUser(data.user);
        setProgress(data.progress);
      })
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF8F0' }}>
        <div className="text-center">
          <div className="text-5xl animate-float mb-3">🙏</div>
          <p className="text-amber-700 font-devanagari">जय श्री राम...</p>
        </div>
      </div>
    );
  }

  const completedMap = new Map(progress.map((p) => [p.day_number, p.completed_at]));
  const completedDays = new Set(completedMap.keys());
  const totalCompleted = completedDays.size;
  const isComplete = totalCompleted >= 40;
  const nextDay = isComplete ? null : Array.from({ length: 40 }, (_, i) => i + 1).find((d) => !completedDays.has(d));
  const progressPct = Math.round((totalCompleted / 40) * 100);

  const prevCompletedAt = nextDay && nextDay > 1 ? completedMap.get(nextDay - 1) : null;
  const unlockAt = prevCompletedAt ? new Date(prevCompletedAt).getTime() + COOLDOWN_MS : 0;
  const isNextDayLocked = !!nextDay && unlockAt > now;
  const msRemaining = Math.max(0, unlockAt - now);
  const hoursRemaining = Math.floor(msRemaining / 3600000);
  const minutesRemaining = Math.floor((msRemaining % 3600000) / 60000);

  return (
    <div className="min-h-screen" style={{ background: '#FFF8F0' }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚩</span>
            <span className="font-bold text-orange-800">हनुमान स्तुति</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-amber-700 hidden sm:block font-medium">
              🙏 {user?.name || `+91 ${user?.phone}`}
            </span>
            {isComplete && (
              <Link href="/certificate"
                className="text-white px-4 py-2 rounded-full text-sm font-bold hover:shadow-lg transition-all"
                style={{ background: 'linear-gradient(135deg,#F59E0B,#E85D04)' }}>
                🏆 सर्टिफिकेट
              </Link>
            )}
            <button onClick={logout} className="text-sm text-amber-600 hover:text-red-600 transition-colors font-medium">
              लॉगआउट
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Greeting */}
        <div className="text-center mb-8">
          <p className="font-devanagari text-orange-600 text-lg">॥ जय हनुमान ज्ञान गुण सागर ॥</p>
          <h1 className="text-2xl md:text-3xl font-bold text-orange-900 mt-1">
            जय श्री राम, {user?.name || 'भक्त'}! 🙏
          </h1>
          <p className="text-amber-600 mt-1 text-sm">आपकी 40 दिन की साधना का हाल</p>
        </div>

        <SankalpNiyam />

        {/* Progress Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-orange-100 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Circle */}
            <div className="relative flex-shrink-0">
              <svg className="w-36 h-36" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#FEF3C7" strokeWidth="10" />
                <circle cx="60" cy="60" r="54" fill="none" stroke="url(#pg)" strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 54}`}
                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - progressPct / 100)}`}
                  className="progress-ring transition-all duration-1000" />
                <defs>
                  <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#EF4444" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-orange-600">{totalCompleted}</span>
                <span className="text-xs text-amber-600">/ 40 दिन</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-orange-900 mb-2">
                {isComplete ? '🎉 40 दिन पूरे!' : `${totalCompleted} दिन हो गए`}
              </h2>
              <p className="text-amber-700 mb-4">
                {isComplete
                  ? 'हनुमान जी की कृपा आप पर सदा बनी रहे। सर्टिफिकेट डाउनलोड करें!'
                  : `सिर्फ ${40 - totalCompleted} दिन और। हर दिन की स्तुति ज़रूर सुनें।`}
              </p>
              {!isComplete && nextDay && !isNextDayLocked && (
                <Link href={`/stuti/${nextDay}`}
                  className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg,#E85D04,#F48C06)' }}>
                  ▶ आज की स्तुति सुनें — दिन {nextDay}
                </Link>
              )}
              {!isComplete && nextDay && isNextDayLocked && (
                <div className="inline-flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 px-6 py-3 rounded-full font-bold">
                  🔒 दिन {nextDay} — {hoursRemaining} घंटे {minutesRemaining} मिनट बाद खुलेगा
                </div>
              )}
              {isComplete && (
                <Link href="/certificate"
                  className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg,#F59E0B,#E85D04)' }}>
                  🏆 सर्टिफिकेट डाउनलोड करें
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 40-day Grid */}
        <div className="bg-white rounded-3xl shadow-lg border border-orange-100 p-6 md:p-8">
          <h2 className="text-xl font-bold text-orange-900 mb-6 flex items-center gap-2">
            📅 40 दिन का चार्ट
          </h2>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {Array.from({ length: 40 }, (_, i) => i + 1).map((day) => {
              const done = completedDays.has(day);
              const isNext = day === nextDay;
              const locked = !done && (!isNext || isNextDayLocked);

              const cell = (
                <>
                  <span className="text-base">{done ? '✓' : locked ? '🔒' : day}</span>
                  {done && <span className="text-[9px] opacity-80">दिन {day}</span>}
                </>
              );

              if (locked) {
                return (
                  <div key={day}
                    className="flex flex-col items-center justify-center rounded-xl p-2 h-14 text-xs font-bold day-cell-pending opacity-50 cursor-not-allowed">
                    {cell}
                  </div>
                );
              }

              return (
                <Link key={day} href={`/stuti/${day}`}
                  className={`flex flex-col items-center justify-center rounded-xl p-2 h-14 text-xs font-bold transition-all hover:scale-110 ${done ? 'day-cell-completed shadow-md' : 'day-cell-today'}`}>
                  {cell}
                </Link>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-4 mt-5 text-xs text-amber-700">
            <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded day-cell-completed inline-block" /> पूरी हो गई</span>
            <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded day-cell-today inline-block" /> आज का दिन</span>
            <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded day-cell-pending inline-block" /> बाकी है</span>
            <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded day-cell-pending opacity-50 inline-block" /> 🔒 लॉक है</span>
          </div>
        </div>

        {/* Shloka */}
        <div className="mt-6 text-white text-center py-5 px-6 rounded-2xl"
          style={{ background: 'linear-gradient(135deg,#1A0500,#7C2D12,#C2410C)' }}>
          <p className="font-devanagari text-xl font-bold mb-1">
            ॥ राम काज कीन्हे बिनु, मोहि कहाँ बिश्राम ॥
          </p>
          <p className="text-orange-200 text-sm">हर दिन की स्तुति आपको एक कदम और पास ले जाती है</p>
        </div>
      </div>
    </div>
  );
}
