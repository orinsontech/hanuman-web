'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { dayLimitFor, isPlanExpired, PlanId } from '@/lib/plans';
import stutiData from '@/data/hanuman_40_day_stuti.json';
import { isTester } from '@/lib/testers';

// Saare audio aur lyrics is JSON se aate hain — naya audio/lyric jodna ho to sirf JSON badlo
type Track = { src: string; label: string; lyrics: string | null };
type LyricLine = { time: number; text: string };
type StutiDay = { day: number; pre: Track[]; main: Track; post: Track[] };

const DAYS = stutiData.days as StutiDay[];
const LYRICS = stutiData.lyrics as Record<string, LyricLine[]>;

// Track ke lyrics me se wo line jo time t par chal rahi hai
function getLyricLine(track: Track, t: number) {
  const lines = track.lyrics ? LYRICS[track.lyrics] : undefined;
  if (!lines?.length) return null;
  let text = lines[0].text;
  for (const line of lines) {
    if (t >= line.time) text = line.text;
  }
  return text;
}

function buildPlaylist(day: number) {
  const entry = DAYS.find((d) => d.day === day) ?? DAYS[0];
  return { tracks: [...entry.pre, entry.main, ...entry.post], mainIndex: entry.pre.length };
}

const COOLDOWN_MS = 12 * 60 * 60 * 1000;

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

// key={day} se mount hota hai taaki din badalte hi player/listened/marked state fresh ho jaaye
function DayPractice({ day, alreadyDone }: { day: number; alreadyDone: boolean }) {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [listened, setListened] = useState(false);
  const [marked, setMarked] = useState(false);
  const [marking, setMarking] = useState(false);

  const { tracks: playlist, mainIndex } = useMemo(() => buildPlaylist(day), [day]);
  const currentTrack = playlist[trackIndex] ?? playlist[0];
  // Main track (chalisa) sunne par hi din complete ho sakta hai
  const isMainTrack = trackIndex === mainIndex;
  const lyricLine = getLyricLine(currentTrack, currentTime);

  // Track badalne par, agar pehle se play ho raha tha to agla track khud chalao
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && playing) audio.play().catch(() => {});
  }, [trackIndex, playing]);

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
    if (isMainTrack && !listened && audio.currentTime >= Math.min(30, audio.duration * 0.7))
      setListened(true);
  }

  function handleTrackEnded() {
    if (isMainTrack) setListened(true);
    if (trackIndex < playlist.length - 1) {
      setTrackIndex((i) => i + 1);
    } else {
      setPlaying(false);
    }
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const t = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = t;
    setCurrentTime(t);
  }

  function goToTrack(index: number) {
    if (index < 0 || index >= playlist.length) return;
    setCurrentTime(0);
    setDuration(0);
    setTrackIndex(index);
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

  return (
    <>
      {/* Verse */}
      <div
        className="rounded-2xl p-6 mb-5 text-white text-center min-h-[90px] flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg,#C2410C,#E85D04,#F48C06)',
        }}
      >
        <p className="font-devanagari text-xl md:text-2xl font-medium leading-relaxed">
          {lyricLine ?? currentTrack.label}
        </p>
      </div>

      {/* Player */}
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-amber-700 font-medium">
            {currentTrack.label}
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

        {playlist.length > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-orange-100">
            <button
              onClick={() => goToTrack(trackIndex - 1)}
              disabled={trackIndex === 0}
              className="text-xs font-semibold text-amber-600 hover:text-orange-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-left"
            >
              ← {playlist[trackIndex - 1]?.label ?? ''}
            </button>
            <span className="text-[10px] text-amber-400 flex-shrink-0 px-2">
              {trackIndex + 1} / {playlist.length}
            </span>
            <button
              onClick={() => goToTrack(trackIndex + 1)}
              disabled={trackIndex === playlist.length - 1}
              className="text-xs font-semibold text-amber-600 hover:text-orange-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-right"
            >
              {playlist[trackIndex + 1]?.label ?? ''} →
            </button>
          </div>
        )}

        <audio
          ref={audioRef}
          src={currentTrack.src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => {
            if (audioRef.current) setDuration(audioRef.current.duration);
          }}
          onEnded={handleTrackEnded}
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
    </>
  );
}

export default function StutiPage() {
  const router = useRouter();
  const params = useParams();
  const dayParam = Number(params.day);
  const day = isNaN(dayParam) || dayParam < 1 || dayParam > 42 ? 1 : dayParam;

  const [authChecked, setAuthChecked] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then((r) => {
      if (r.status === 401) {
        router.push('/login');
        return;
      }
      r.json().then((data) => {
        // Tester ke liye koi bhi din seedhe khulta hai
        if (isTester(data.user?.phone)) {
          setAlreadyDone((data.progress || []).some((p: { day_number: number }) => p.day_number === day));
          setAuthChecked(true);
          return;
        }

        if (!data.user?.is_paid || isPlanExpired(data.user?.plan_expires_at)) {
          router.replace('/payment');
          return;
        }

        const dayLimit = dayLimitFor(data.user.plan as PlanId | null);
        if (day > dayLimit) {
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

        const nextDay = Array.from({ length: dayLimit }, (_, i) => i + 1).find((d) => !completedMap.has(d)) ?? 41;
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

        <DayPractice key={day} day={day} alreadyDone={alreadyDone} />

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
