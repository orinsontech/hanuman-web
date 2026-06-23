declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackPixelEvent(
  eventName: string,
  params?: Record<string, unknown>,
  options?: { eventID: string }
) {
  if (typeof window === 'undefined' || !window.fbq) return;
  if (options) {
    window.fbq('track', eventName, params, options);
  } else {
    window.fbq('track', eventName, params);
  }
}
