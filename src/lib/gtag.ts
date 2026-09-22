declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackGtagEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', eventName, params);
}

// GA4's client_id lives in the _ga cookie as `GA1.<version>.<part1>.<part2>`;
// the Measurement Protocol wants it back as `<part1>.<part2>`.
export function getGaClientId(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(/(?:^|; )_ga=([^;]+)/);
  if (!match) return undefined;
  const parts = decodeURIComponent(match[1]).split('.');
  if (parts.length < 4) return undefined;
  return `${parts[2]}.${parts[3]}`;
}
