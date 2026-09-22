import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { SITE } from './site';

/** Absolute URL of a 1200px JPEG of `src` — used for link previews (WhatsApp,
 *  Facebook, X) and JSON-LD `image`. Undefined when the entry has no hero. */
export async function shareImage(src?: ImageMetadata) {
  if (!src) return undefined;
  const img = await getImage({ src, width: 1200, format: 'jpg', quality: 80 });
  return new URL(img.src, SITE.url).href;
}
