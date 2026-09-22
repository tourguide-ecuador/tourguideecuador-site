/** Built-in top-level routes. Cruises and pages share the site root, so their URL slug
 *  can't be one of these (keystatic.config.ts blocks it in the editor too). */
export const RESERVED_ROOT_SLUGS = [
  'es', 'api', 'keystatic', 'tours', 'cruises', 'destinations', 'destination', 'tour-type',
  'reviews', 'faqs', 'plan-my-trip', 'thank-you', 'galapagos-wildlife-calendar', '404',
];

/** Fail the build with a readable message instead of letting two entries silently
 *  fight over one URL (the loser's page just disappears). */
export function assertUniqueSlugs(
  entries: { collection: string; id: string; data: { slug: string } }[],
  reserved: string[] = [],
) {
  const seen = new Map<string, string>();
  for (const e of entries) {
    const who = `${e.collection}/${e.id}`;
    if (reserved.includes(e.data.slug)) {
      throw new Error(`URL slug "${e.data.slug}" (${who}) clashes with a built-in page. Change it in the editor.`);
    }
    const prev = seen.get(e.data.slug);
    if (prev) throw new Error(`URL slug "${e.data.slug}" is used by both ${prev} and ${who}. Change one of them in the editor.`);
    seen.set(e.data.slug, who);
  }
}
