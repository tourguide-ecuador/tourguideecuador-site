import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/*
  Content model — Tour Guide Ecuador.
  Locale-aware (en + es). Slugs are preserved for SEO continuity.
*/

// Keystatic saves an untouched new array row as `null`; drop those instead of
// failing the whole build.
const dropNulls = (v: unknown) => (Array.isArray(v) ? v.filter((x) => x != null) : v);

const seo = {
  metaTitle: z.string(),
  metaDescription: z.string(),
  noindex: z.boolean().default(false),
};

// ≈27 day tours → Bokun experiences
const tours = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tours' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(), // preserved old slug for 301s
      destination: reference('destinations'),
      type: reference('tourTypes'),
      secondaryTypes: z.preprocess(dropNulls, z.array(reference('tourTypes')).default([])),
      months: z.array(z.string()).default([]), // best-season metadata only — no archive pages
      durationHours: z.number().optional(),
      durationLabel: z.string().optional(), // e.g. "Full day"
      priceFrom: z.number().optional(), // DB prices EMPTY → set later via Bokun
      sharedAndPrivate: z.boolean().default(false),
      bokunExperienceId: z.string().optional(), // ⏳ filled when client creates experiences
      heroImage: image(),
      heroImageAlt: z.string().optional(),
      gallery: z.preprocess(dropNulls, z.array(image()).default([])),
      excerpt: z.string(),
      featured: z.boolean().default(false),
      order: z.number().default(0),
      ...seo,
    }),
});

// ~13 Galápagos cruise pages → inquiry-based (SEO showpieces)
const cruises = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/cruises' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      vesselClass: z
        .enum(['Luxury', 'First Class', 'Tourist Superior', 'Tourist', 'Diving'])
        .optional(),
      vesselType: z.string().optional(), // Catamaran, Motor Yacht, Expedition Ship…
      cabins: z.number().optional(),
      capacity: z.number().optional(),
      itineraryDays: z.array(z.string()).default([]), // e.g. ["4D/3N", "5D/4N"]
      departures: z.string().optional(),
      specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      itinerary: z
        .array(z.object({ day: z.string(), title: z.string(), body: z.string() }))
        .default([]),
      heroImage: image(),
      heroImageAlt: z.string().optional(),
      gallery: z.preprocess(dropNulls, z.array(image()).default([])),
      excerpt: z.string(),
      featured: z.boolean().default(false),
      order: z.number().default(0),
      ...seo,
    }),
});

// 11 → KEEP, landing pages (primary SEO architecture)
const destinations = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/destinations' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      excerpt: z.string(),
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      order: z.number().default(0),
      featured: z.boolean().default(false),
      ...seo,
    }),
});

// 7 kept tour types
const tourTypes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tourTypes' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      excerpt: z.string(),
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      order: z.number().default(0),
      ...seo,
    }),
});

// ~39 static/content pages
const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      draft: z.boolean().default(false),
      ...seo,
    }),
});

// 9 real testimonials (2019). The testimonial text is the file body.
const reviews = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/reviews' }),
  schema: z.object({
    author: z.string(),
    location: z.string().optional(),
    date: z.string().optional(),
    rating: z.number().min(1).max(5).default(5),
    tour: z.string().optional(),
    featured: z.boolean().default(false),
    oldSlug: z.string().optional(), // for 301 of /reviews-page/<slug>/
  }),
});

// FAQs (V2) — grouped Q&A with FAQPage schema
const faqs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/faqs' }),
  schema: z.object({
    question: z.string(),
    category: z.enum(['cruises', 'tours', 'amazon', 'booking', 'practical']).default('cruises'),
    order: z.number().default(0),
  }),
});

export const collections = { tours, cruises, destinations, tourTypes, pages, reviews, faqs };
