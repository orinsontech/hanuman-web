import crypto from 'crypto';

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

interface PurchaseEventParams {
  phone: string;
  value: number;
  currency: string;
  eventId: string;
  ip?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  sourceUrl?: string;
}

export async function sendMetaPurchaseEvent(params: PurchaseEventParams) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return;

  const userData: Record<string, unknown> = {
    ph: [sha256(`91${params.phone}`)],
  };
  if (params.ip) userData.client_ip_address = params.ip;
  if (params.userAgent) userData.client_user_agent = params.userAgent;
  if (params.fbp) userData.fbp = params.fbp;
  if (params.fbc) userData.fbc = params.fbc;

  const body = {
    data: [
      {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: params.eventId,
        action_source: 'website',
        event_source_url: params.sourceUrl,
        user_data: userData,
        custom_data: {
          currency: params.currency,
          value: params.value,
        },
      },
    ],
  };

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error('Meta CAPI error', await res.text());
    }
  } catch (err) {
    console.error('Meta CAPI request failed', err);
  }
}
