// Live Tripadvisor rating + latest reviews for the site, via the Terra API.
//
// Tripadvisor's terms shape this function:
//  - The API key stays server-side (Netlify env var TRIPADVISOR_API_KEY), sent as X-API-Key.
//  - Review content may not be cached or stored, and may not appear in page HTML: the
//    browser loads it from here on demand, responses are never cached, and robots.txt
//    blocks /api/ so crawlers don't index the review text.
const LOCATION_ID = 10438426; // tripadvisor.com/Attraction_Review-g294308-d10438426
const API = 'https://terra.tripadvisor.com/api';
const MAX_REVIEWS = 3;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex',
    },
  });

// Terra returns localized strings as [{ language, value, primary }].
const pick = (items = []) => {
  const item = items.find((i) => i.primary) ?? items[0];
  return item ? { value: item.value, translated: !item.primary } : { value: '', translated: false };
};

export default async (req) => {
  const key = process.env.TRIPADVISOR_API_KEY;
  if (!key) return json({ error: 'not configured' }, 503);

  const lang = new URL(req.url).searchParams.get('lang') === 'es' ? 'es' : 'en';
  const get = async (path) => {
    const res = await fetch(`${API}${path}`, {
      headers: { 'X-API-Key': key, accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Tripadvisor ${res.status} for ${path.split('?')[0]}`);
    return res.json();
  };

  try {
    const [place, reviews] = await Promise.all([
      get(`/locations/${LOCATION_ID}?version=1`),
      get(`/locations/${LOCATION_ID}/reviews?language=${lang}&sort_by=MOST_RECENT&page=1&size=${MAX_REVIEWS}`),
    ]);
    const overall = place.traveler_ratings?.overall ?? {};
    return json({
      rating: overall.rating ?? null,
      count: overall.count ?? null,
      ratingImage: overall.icon_url ?? null,
      url: place.urls?.tripadvisor?.main ?? null,
      reviews: (reviews.data ?? []).slice(0, MAX_REVIEWS).map((r) => {
        const title = pick(r.title);
        const text = pick(r.text);
        return {
          title: title.value,
          text: text.value,
          translated: text.translated,
          rating: r.rating,
          ratingImage: r.rating_icon_url?.url ?? null,
          published: r.publish_ts,
          author: r.user?.username ?? '',
          url: r.url,
        };
      }),
    });
  } catch (err) {
    console.error(String(err));
    return json({ error: 'unavailable' }, 502);
  }
};

export const config = { path: '/api/tripadvisor' };
