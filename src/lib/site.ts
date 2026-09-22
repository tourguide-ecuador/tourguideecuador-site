// Central site config. Editable values come from src/data/settings.json (managed
// in Keystatic by the client); this module derives the rest and keeps a stable API.
import settingsData from '../data/settings.json';

// Keystatic omits empty optional fields when it saves, so the JSON shape varies by
// what the client has filled in. Model the optional fields as optional here so this
// module stays type-safe regardless. Consumers already guard on these being absent.
interface Settings {
  name: string;
  tagline: string;
  email: string;
  whatsappNumber: string;
  address: string;
  city: string;
  country: string;
  nytQuote: string;
  licenseNumber?: string | null;
  tripadvisorUrl?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  bokunChannelId?: string | null;
  hero: {
    eyebrow: string;
    heading: string;
    subheading: string;
    ctaPrimaryLabel: string;
    ctaPrimaryHref: string;
    ctaSecondaryLabel: string;
    ctaSecondaryHref: string;
  };
}
const settings = settingsData as Settings;

const num = (settings.whatsappNumber || '593991946532').replace(/\D/g, '');
const display = `+${num.slice(0, 3)} ${num.slice(3, 5)} ${num.slice(5, 8)} ${num.slice(8)}`.trimEnd();

// Only a well-formed UUID switches live booking on — a stray space or newline pasted into
// the Netlify env var would otherwise produce a broken widget URL.
const rawChannel = (settings.bokunChannelId || import.meta.env.PUBLIC_BOKUN_CHANNEL_ID || '').trim();
const bokunChannel = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawChannel) ? rawChannel : '';

export const SITE = {
  name: settings.name,
  tagline: settings.tagline,
  url: 'https://tourguideecuador.com',
  email: settings.email,
  whatsappNumber: num,
  whatsappDisplay: display, // e.g. "+593 99 194 6532"
  whatsappHref: `https://wa.me/${num}`,
  address: settings.address,
  city: settings.city,
  country: settings.country,
  nytQuote: settings.nytQuote,
  licenseNumber: settings.licenseNumber,
  tripadvisorUrl: settings.tripadvisorUrl,
  instagramUrl: settings.instagramUrl,
  facebookUrl: settings.facebookUrl,
  // Bókun booking channel: Site settings first, env var as a fallback.
  bokunChannelId: bokunChannel,
  hero: settings.hero,
} as const;

export const whatsappLink = (text?: string) =>
  text ? `${SITE.whatsappHref}?text=${encodeURIComponent(text)}` : SITE.whatsappHref;
