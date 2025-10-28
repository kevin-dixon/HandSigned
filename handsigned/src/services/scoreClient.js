const API_URL = process.env.REACT_APP_SCORE_API_URL;

export async function getAuthenticityScore({ title, description, imageUrl }) {
  if (!API_URL) throw new Error('SCORE_API_URL_NOT_CONFIGURED');
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, imageUrl })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Score API failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  const score = Number(data?.score);
  if (Number.isNaN(score)) throw new Error('INVALID_SCORE_RESPONSE');
  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    provider: data?.provider || 'unknown',
    model: data?.model || 'unknown',
    usedImage: Boolean(data?.usedImage),
  };
}

export function isScoreApiConfigured() {
  return Boolean(API_URL);
}

export async function getScoreApiInfo() {
  if (!API_URL) return { available: false };
  // Derive base URL from /score endpoint if present
  let base = API_URL.replace(/\/score\/?$/, '');
  try {
    const res = await fetch(`${base}/health`);
    if (!res.ok) return { available: false };
    const data = await res.json();
    return { available: true, ...data };
  } catch {
    return { available: false };
  }
}
