import { config, fields, collection, singleton } from '@keystatic/core';
import { RESERVED_ROOT_SLUGS } from './src/lib/slugs';

/*
  Keystatic — content editor for Tour Guide Ecuador.

  STORAGE — driven by PUBLIC_ env vars (this config also runs in the browser, so only
  import.meta.env PUBLIC_ vars are available; never use process.env here):
    • dev (npm run dev)                       → local (edits files on disk)
    • prod + PUBLIC_KEYSTATIC_CLOUD_PROJECT    → Keystatic Cloud (client email login)
    • prod + PUBLIC_KEYSTATIC_GITHUB_REPO      → GitHub mode (GitHub login)

  IMAGES: stored in src/assets/<collection>/ with a relative publicPath
  (../../assets/<collection>/) so Astro's content `image()` resolves & optimizes
  them to WebP — and the client just drag-drops in the editor.
*/

const CLOUD_PROJECT = import.meta.env.PUBLIC_KEYSTATIC_CLOUD_PROJECT as string | undefined;
const GH_REPO = import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO as `${string}/${string}` | undefined;

const storage = import.meta.env.DEV
  ? ({ kind: 'local' } as const)
  : GH_REPO
    ? ({ kind: 'github', repo: GH_REPO } as const)
    : CLOUD_PROJECT
      ? ({ kind: 'cloud' } as const)
      : ({ kind: 'local' } as const);

// URL slugs feed the routes: a "/" or a space breaks the build. Cruises and pages sit at
// the site root, so they also can't reuse a built-in page's name.
const slugPattern = (reserved: string[] = []) => ({
  regex: new RegExp(`^${reserved.length ? `(?!(?:${reserved.join('|')})$)` : ''}[a-z0-9]+(?:-[a-z0-9]+)*$`),
  message: reserved.length
    ? 'Lowercase letters, numbers and hyphens only (e.g. grand-majestic), and not a built-in page name such as "tours" or "reviews".'
    : 'Lowercase letters, numbers and hyphens only (e.g. cotopaxi). No spaces or slashes.',
});
const urlSlug = (reserved?: string[], description?: string) =>
  fields.text({
    label: 'URL slug (preserve old)',
    ...(description ? { description } : {}),
    validation: { length: { min: 1 }, pattern: slugPattern(reserved) },
  });
const title = (label = 'Title') => fields.slug({ name: { label, validation: { isRequired: true } } });

// Astro can only process these formats — anything else (e.g. iPhone HEIC) fails the build.
const IMAGE_HINT = "JPG, PNG or WebP. iPhone HEIC photos won't work — export them as JPG first.";

// Images inserted into a body are stored next to the entry's hero/gallery photos so Astro
// can resolve and optimise them (without this, the first body image breaks the build).
const body = (dir: string | null, label = 'Body') =>
  fields.mdx({
    label,
    options: { image: dir ? { directory: `src/assets/${dir}`, publicPath: `../../assets/${dir}/` } : false },
  });

const seoFields = {
  metaTitle: fields.text({ label: 'Meta title', validation: { length: { min: 1 } }, description: 'SEO <title> (carried from old site).' }),
  metaDescription: fields.text({
    label: 'Meta description',
    multiline: true,
    validation: { length: { min: 1 } },
    description: 'SEO meta description — keep ≤ 160 characters. Never leave blank.',
  }),
};

const heroFields = (dir: string, required = false) => ({
  heroImage: fields.image({
    label: 'Hero image',
    description: IMAGE_HINT,
    directory: `src/assets/${dir}`,
    publicPath: `../../assets/${dir}/`,
    validation: { isRequired: required },
  }),
  heroImageAlt: fields.text({ label: 'Hero image alt text', description: 'Describe the photo for accessibility & SEO.' }),
});

const gallery = (dir: string) =>
  fields.array(
    fields.image({ label: 'Photo', description: IMAGE_HINT, directory: `src/assets/${dir}`, publicPath: `../../assets/${dir}/` }),
    { label: 'Gallery', itemLabel: (props) => props.value?.filename ?? 'Photo' },
  );

export default config({
  storage,
  ...(storage.kind === 'cloud' && CLOUD_PROJECT ? { cloud: { project: CLOUD_PROJECT } } : {}),
  ui: {
    brand: { name: 'Tour Guide Ecuador' },
    navigation: {
      'Site': ['settings'],
      'Catalogue': ['tours', 'cruises', 'destinations', 'tourTypes'],
      'Content': ['pages', 'reviews', 'faqs'],
    },
  },
  singletons: {
    settings: singleton({
      label: 'Site settings',
      path: 'src/data/settings',
      format: { data: 'json' },
      schema: {
        name: fields.text({ label: 'Business name', validation: { length: { min: 1 } } }),
        tagline: fields.text({ label: 'Tagline' }),
        email: fields.text({ label: 'Contact email', validation: { length: { min: 1 }, pattern: { regex: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Enter a valid email address.' } } }),
        whatsappNumber: fields.text({ label: 'WhatsApp number', description: 'Digits only, country code first (e.g. 593991946532).', validation: { pattern: { regex: /^\d{8,15}$/, message: 'Digits only, country code first — no spaces or +.' } } }),
        address: fields.text({ label: 'Address', validation: { length: { min: 1 } } }),
        city: fields.text({ label: 'City' }),
        country: fields.text({ label: 'Country' }),
        nytQuote: fields.text({ label: 'Press / trust line', description: 'e.g. "Recommended by The New York Times".' }),
        licenseNumber: fields.text({ label: 'Tourism licence # (MINTUR)', description: 'Shown in the credibility strip & footer.' }),
        tripadvisorUrl: fields.url({ label: 'TripAdvisor URL' }),
        instagramUrl: fields.url({ label: 'Instagram URL' }),
        facebookUrl: fields.url({ label: 'Facebook URL' }),
        bokunChannelId: fields.text({
          label: 'Bókun booking channel UUID',
          description: 'Turns on live booking for tours that have a Bókun experience ID. Find it in Bókun → Sales tools → Booking channels (your website channel). Leave empty to show "Request to book" instead.',
          validation: {
            pattern: {
              regex: /^$|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
              message: 'Paste the UUID exactly as Bókun shows it, e.g. 1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d.',
            },
          },
        }),
        hero: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow' }),
            heading: fields.text({ label: 'Heading', multiline: true, validation: { length: { min: 1 } } }),
            subheading: fields.text({ label: 'Subheading', multiline: true, validation: { length: { min: 1 } } }),
            ctaPrimaryLabel: fields.text({ label: 'Primary button label', validation: { length: { min: 1 } } }),
            ctaPrimaryHref: fields.text({ label: 'Primary button link', validation: { length: { min: 1 } } }),
            ctaSecondaryLabel: fields.text({ label: 'Secondary button label' }),
            ctaSecondaryHref: fields.text({ label: 'Secondary button link' }),
          },
          { label: 'Homepage hero' },
        ),
      },
    }),
  },
  collections: {
    tours: collection({
      label: 'Day Tours',
      slugField: 'title',
      path: 'src/content/tours/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'destination'],
      schema: {
        title: title(),
        slug: urlSlug(undefined, 'Old WordPress slug for 301s.'),
        destination: fields.relationship({ label: 'Destination', collection: 'destinations', validation: { isRequired: true } }),
        type: fields.relationship({ label: 'Primary tour type', collection: 'tourTypes', validation: { isRequired: true } }),
        secondaryTypes: fields.array(
          fields.relationship({ label: 'Secondary tour type', collection: 'tourTypes' }),
          { label: 'Secondary tour types', itemLabel: (props) => props.value ?? 'Type' },
        ),
        durationLabel: fields.text({ label: 'Duration label' }),
        priceFrom: fields.number({ label: 'Price from (USD) — optional, via Bokun' }),
        bokunExperienceId: fields.text({
          label: 'Bókun experience ID',
          description: 'The number from Bókun → Experiences (e.g. 1286086), without the #. The booking box goes live as soon as the experience is Active in Bókun and in the website booking channel.',
          validation: { pattern: { regex: /^\d*$/, message: 'Digits only, e.g. 1286086 (no # or spaces).' } },
        }),
        featured: fields.checkbox({ label: 'Featured on homepage' }),
        excerpt: fields.text({ label: 'Excerpt', multiline: true, validation: { length: { min: 1 } } }),
        ...heroFields('tours', true),
        gallery: gallery('tours'),
        ...seoFields,
        content: body('tours'),
      },
    }),
    cruises: collection({
      label: 'Galápagos Cruises',
      slugField: 'title',
      path: 'src/content/cruises/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'vesselClass'],
      schema: {
        title: title(),
        slug: urlSlug(RESERVED_ROOT_SLUGS),
        vesselClass: fields.select({
          label: 'Vessel class',
          options: [
            { label: 'Luxury', value: 'Luxury' },
            { label: 'First Class', value: 'First Class' },
            { label: 'Tourist Superior', value: 'Tourist Superior' },
            { label: 'Tourist', value: 'Tourist' },
            { label: 'Diving', value: 'Diving' },
          ],
          defaultValue: 'First Class',
        }),
        vesselType: fields.text({ label: 'Vessel type', description: 'e.g. Motor Catamaran, Expedition Ship.' }),
        cabins: fields.number({ label: 'Cabins' }),
        capacity: fields.number({ label: 'Guests' }),
        featured: fields.checkbox({ label: 'Featured on homepage' }),
        excerpt: fields.text({ label: 'Excerpt', multiline: true, validation: { length: { min: 1 } } }),
        ...heroFields('cruises', true),
        gallery: gallery('cruises'),
        ...seoFields,
        content: body('cruises'),
      },
    }),
    destinations: collection({
      label: 'Destinations',
      slugField: 'title',
      path: 'src/content/destinations/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: title(),
        slug: urlSlug(),
        excerpt: fields.text({ label: 'Excerpt', multiline: true, validation: { length: { min: 1 } } }),
        featured: fields.checkbox({ label: 'Featured on homepage' }),
        ...heroFields('destinations'),
        ...seoFields,
        content: body('destinations'),
      },
    }),
    tourTypes: collection({
      label: 'Tour Types',
      slugField: 'title',
      path: 'src/content/tourTypes/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: title(),
        slug: urlSlug(),
        excerpt: fields.text({ label: 'Excerpt', multiline: true, validation: { length: { min: 1 } } }),
        ...heroFields('tourTypes'),
        ...seoFields,
        content: body('tourTypes'),
      },
    }),
    pages: collection({
      label: 'Pages',
      slugField: 'title',
      path: 'src/content/pages/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: title(),
        slug: urlSlug(RESERVED_ROOT_SLUGS),
        ...heroFields('pages'),
        ...seoFields,
        content: body('pages'),
      },
    }),
    reviews: collection({
      label: 'Reviews',
      slugField: 'author',
      path: 'src/content/reviews/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['author', 'location'],
      schema: {
        author: title('Author'),
        location: fields.text({ label: 'Location' }),
        date: fields.text({ label: 'Date' }),
        rating: fields.number({ label: 'Rating (1–5)', defaultValue: 5, validation: { isRequired: true, min: 1, max: 5 } }),
        tour: fields.text({ label: 'Tour (optional)' }),
        featured: fields.checkbox({ label: 'Featured' }),
        oldSlug: fields.text({ label: 'Old review slug (for 301)' }),
        content: body(null, 'Testimonial'),
      },
    }),
    faqs: collection({
      label: 'FAQs',
      slugField: 'question',
      path: 'src/content/faqs/*',
      format: { contentField: 'content' },
      columns: ['question', 'category'],
      schema: {
        question: title('Question'),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Galápagos cruises', value: 'cruises' },
            { label: 'Ecuador tours', value: 'tours' },
            { label: 'Booking & payment', value: 'booking' },
            { label: 'Travel & practical', value: 'practical' },
          ],
          defaultValue: 'cruises',
        }),
        order: fields.number({ label: 'Order', defaultValue: 0 }),
        content: body(null, 'Answer'),
      },
    }),
  },
});
