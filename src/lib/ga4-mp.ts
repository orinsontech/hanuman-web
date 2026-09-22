// GA4's client_id lives in the _ga cookie as `GA1.<version>.<part1>.<part2>`;
// the Measurement Protocol wants it back as `<part1>.<part2>`.
export function parseGaClientId(gaCookie: string | undefined): string | undefined {
  if (!gaCookie) return undefined;
  const parts = gaCookie.split('.');
  if (parts.length < 4) return undefined;
  return `${parts[2]}.${parts[3]}`;
}

interface PurchaseEventParams {
  clientId: string | undefined;
  value: number;
  currency: string;
  eventId: string;
}

export async function sendGooglePurchaseEvent(params: PurchaseEventParams) {
  const measurementId = process.env.GA_MEASUREMENT_ID;
  const apiSecret = process.env.GA_API_SECRET;
  if (!measurementId || !apiSecret || !params.clientId) return;

  const body = {
    client_id: params.clientId,
    events: [
      {
        name: 'purchase',
        params: {
          currency: params.currency,
          value: params.value,
          transaction_id: params.eventId,
        },
      },
    ],
  };

  try {
    const res = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) {
      console.error('GA4 Measurement Protocol error', await res.text());
    }
  } catch (err) {
    console.error('GA4 Measurement Protocol request failed', err);
  }
}
