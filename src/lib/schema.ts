// JSON-LD schema builders (SEO). Plain objects -> rendered by JsonLd.astro.
import { SITE } from './site';

const ORG_ID = `${SITE.url}/#organization`;

export function travelAgencySchema(rating?: { value: number; count: number }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': ORG_ID,
    name: SITE.name,
    url: SITE.url,
    email: SITE.email,
    telephone: SITE.whatsappDisplay,
    image: `${SITE.url}/favicon.svg`,
    description:
      'Quito-based travel agency for Galápagos cruises, island hopping and tailor-made Ecuador tours.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Versalles y Pérez Guerrero',
      addressLocality: 'Quito',
      addressCountry: 'EC',
    },
    areaServed: ['Galápagos Islands', 'Ecuador'],
    sameAs: [SITE.whatsappHref, SITE.tripadvisorUrl, SITE.instagramUrl, SITE.facebookUrl].filter(Boolean),
    ...(rating && rating.count
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: rating.value,
            reviewCount: rating.count,
            bestRating: 5,
          },
        }
      : {}),
  };
}

export function productSchema(opts: {
  name: string; description: string; image?: string; url: string; priceFrom?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: opts.name,
    description: opts.description,
    ...(opts.image ? { image: opts.image } : {}),
    url: opts.url,
    brand: { '@type': 'Brand', name: SITE.name },
    ...(opts.priceFrom
      ? {
          offers: {
            '@type': 'Offer',
            price: opts.priceFrom,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: opts.url,
            seller: { '@id': ORG_ID },
          },
        }
      : {}),
  };
}

export function touristTripSchema(opts: {
  name: string; description: string; image?: string; url: string; touristType?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: opts.name,
    description: opts.description,
    ...(opts.image ? { image: opts.image } : {}),
    url: opts.url,
    provider: { '@id': ORG_ID },
    ...(opts.touristType ? { touristType: opts.touristType } : {}),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url.startsWith('http') ? it.url : `${SITE.url}${it.url}`,
    })),
  };
}

export function reviewsSchema(
  reviews: { author: string; body: string; rating: number }[],
  rating: { value: number; count: number },
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': ORG_ID,
    name: SITE.name,
    url: SITE.url,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.value,
      reviewCount: rating.count,
      bestRating: 5,
    },
    review: reviews.map((r) => ({
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      author: { '@type': 'Person', name: r.author },
      reviewBody: r.body,
    })),
  };
}
