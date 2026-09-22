import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export const tourUrl = (slug: string) => `/tours/${slug}`;
export const cruiseUrl = (slug: string) => `/${slug}`; // preserved top-level slug
export const destinationUrl = (slug: string) => `/destination/${slug}`;
export const tourTypeUrl = (slug: string) => `/tour-type/${slug}`;

const byOrderTitle = (a: any, b: any) =>
  (a.data.order ?? 0) - (b.data.order ?? 0) || a.data.title.localeCompare(b.data.title);

export const getTours = async () => (await getCollection('tours')).sort(byOrderTitle);
export const getCruises = async () => (await getCollection('cruises')).sort(byOrderTitle);
export const getDestinations = async () => (await getCollection('destinations')).sort(byOrderTitle);
export const getTourTypes = async () => (await getCollection('tourTypes')).sort(byOrderTitle);
export const getReviews = async () => getCollection('reviews');

export const featuredTours = async () => (await getTours()).filter((t) => t.data.featured);
export const featuredCruises = async () => (await getCruises()).filter((c) => c.data.featured);
export const featuredDestinations = async () => (await getDestinations()).filter((d) => d.data.featured);
/** Homepage testimonials: reviews ticked "Featured" in the editor first, then the rest. */
export const homeReviews = async (n = 3) => {
  const all = await getReviews();
  return [...all.filter((r) => r.data.featured), ...all.filter((r) => !r.data.featured)].slice(0, n);
};

export async function aggregateRating() {
  const reviews = await getReviews();
  const count = reviews.length;
  const avg = count ? reviews.reduce((s, r) => s + (r.data.rating ?? 5), 0) / count : 5;
  return { count, value: Math.round(avg * 10) / 10 };
}

export async function destinationName(slug: string) {
  const d = await getEntry('destinations', slug);
  return d?.data.title ?? slug;
}
export async function tourTypeName(slug: string) {
  const t = await getEntry('tourTypes', slug);
  return t?.data.title ?? slug;
}

export type Tour = CollectionEntry<'tours'>;
export type Cruise = CollectionEntry<'cruises'>;
export type Destination = CollectionEntry<'destinations'>;
export type Review = CollectionEntry<'reviews'>;
