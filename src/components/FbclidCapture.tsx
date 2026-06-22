'use client';

import { useEffect } from 'react';

export default function FbclidCapture() {
  useEffect(() => {
    const fbclid = new URLSearchParams(window.location.search).get('fbclid');
    if (!fbclid) return;

    const hasFbc = document.cookie.split('; ').some((c) => c.startsWith('_fbc='));
    if (hasFbc) return;

    const value = `fb.1.${Date.now()}.${fbclid}`;
    const maxAge = 60 * 60 * 24 * 90; // 90 days, matches Meta's _fbc lifetime
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `_fbc=${value}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
  }, []);

  return null;
}
