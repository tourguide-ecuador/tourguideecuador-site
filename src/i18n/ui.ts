// Bilingual UI strings (English / Ecuadorian Spanish). EN is the default locale
// at `/`; ES lives under `/es/`. Page-specific copy is translated in the page files;
// this dictionary covers the site chrome and shared UI.

export const languages = { en: 'English', es: 'Español' } as const;
export const defaultLang = 'en';
export type Lang = keyof typeof languages;

export const ui = {
  en: {
    'nav.cruises': 'Galápagos Cruises',
    'nav.tours': 'Ecuador Tours',
    'nav.destinations': 'Destinations',
    'nav.whenToGo': 'When to go',
    'nav.reviews': 'Reviews',
    'nav.about': 'About',
    'nav.faq': 'FAQ',
    'cta.planTrip': 'Plan your trip',
    'cta.enquire': 'Enquire',
    'cta.viewCruise': 'View cruise',
    'cta.requestQuote': 'Request a quote',
    'cta.whatsapp': 'Chat on WhatsApp',
    'cta.askWhatsapp': 'Ask an expert on WhatsApp',
    'cta.browseCruises': 'Browse Galápagos cruises',
    'cta.browseTours': 'Browse Ecuador tours',
    'cta.allCruises': 'All vessels',
    'cta.allTours': 'All day tours',
    'cta.compare': 'Compare vessels side by side',
    'cta.readReviews': 'Read all reviews',
    'label.from': 'From',
    'label.onRequest': 'On request',
    'label.bookOnline': 'Book online',
    'label.dayTour': 'Day tour',
    'label.bestFor': 'Best for',
    'trust.reviews': 'reviews',
    'trust.nyt': 'Recommended by The New York Times',
    'trust.secure': 'Secure booking via Bókun',
    'trust.local': 'Quito-based local experts',
    'trust.licensed': 'Licensed operator · MINTUR',
    'footer.galapagos': 'Galápagos',
    'footer.tours': 'Ecuador tours',
    'footer.company': 'Company',
    'footer.newsletter': 'Travel ideas in your inbox',
    'footer.join': 'Join',
    'wa.default': "Hi! I'd like to ask about a Galápagos or Ecuador trip.",
    'lang.switch': 'Español',
    'banner.untranslated': 'This page is shown in English while we prepare the Spanish version.',
  },
  es: {
    'nav.cruises': 'Cruceros Galápagos',
    'nav.tours': 'Tours en Ecuador',
    'nav.destinations': 'Destinos',
    'nav.whenToGo': 'Cuándo ir',
    'nav.reviews': 'Opiniones',
    'nav.about': 'Nosotros',
    'nav.faq': 'Preguntas frecuentes',
    'cta.planTrip': 'Planifica tu viaje',
    'cta.enquire': 'Consultar',
    'cta.viewCruise': 'Ver crucero',
    'cta.requestQuote': 'Solicitar cotización',
    'cta.whatsapp': 'Escríbenos por WhatsApp',
    'cta.askWhatsapp': 'Pregunta a un experto por WhatsApp',
    'cta.browseCruises': 'Ver cruceros a Galápagos',
    'cta.browseTours': 'Ver tours en Ecuador',
    'cta.allCruises': 'Todas las embarcaciones',
    'cta.allTours': 'Todos los tours de día',
    'cta.compare': 'Comparar embarcaciones',
    'cta.readReviews': 'Ver todas las opiniones',
    'label.from': 'Desde',
    'label.onRequest': 'A consultar',
    'label.bookOnline': 'Reserva online',
    'label.dayTour': 'Tour de día',
    'label.bestFor': 'Ideal para',
    'trust.reviews': 'opiniones',
    'trust.nyt': 'Recomendado por The New York Times',
    'trust.secure': 'Reserva segura con Bókun',
    'trust.local': 'Expertos locales en Quito',
    'trust.licensed': 'Operadora con licencia · MINTUR',
    'footer.galapagos': 'Galápagos',
    'footer.tours': 'Tours en Ecuador',
    'footer.company': 'Empresa',
    'footer.newsletter': 'Ideas de viaje en tu correo',
    'footer.join': 'Suscribirme',
    'wa.default': 'Hola, me gustaría consultar sobre un viaje a Galápagos o Ecuador.',
    'lang.switch': 'English',
    'banner.untranslated': 'Esta página se muestra en inglés mientras preparamos la versión en español.',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];

/** Derive the active language from a URL pathname. */
export function getLangFromUrl(url: URL): Lang {
  const seg = url.pathname.split('/').filter(Boolean)[0];
  return seg === 'es' ? 'es' : 'en';
}

/** t() for the given language, falling back to English. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return (ui[lang] as Record<string, string>)[key] ?? ui.en[key];
  };
}

/** Prefix a root-relative path with the locale (es → /es/...; en → unchanged). */
export function localizePath(path: string, lang: Lang): string {
  if (lang === 'en') return path;
  if (path === '/') return '/es';
  return `/es${path.startsWith('/') ? '' : '/'}${path}`;
}

/** Strip a leading /es from a path (to find the EN equivalent). */
export function unlocalizePath(path: string): string {
  return path.replace(/^\/es(?=\/|$)/, '') || '/';
}
