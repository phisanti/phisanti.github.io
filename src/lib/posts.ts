import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from './slug';

export type Post = CollectionEntry<'writing'>;

/** Published posts, newest first. Drafts appear in dev only. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('writing', ({ data }) => !(import.meta.env.PROD && data.draft));
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || b.id.localeCompare(a.id));
}

/** The post folder name without its `YYYY-MM-DD-` prefix. */
const undated = (post: Post) => post.id.replace(/^\d{4}-\d{2}-\d{2}-/, '');

/** The front-matter permalink, else `/posts/YYYY/MM/<folder name without its date>/`. */
export function postUrl(post: Post): string {
  if (post.data.permalink) return post.data.permalink;
  const year = post.data.date.getUTCFullYear();
  const month = String(post.data.date.getUTCMonth() + 1).padStart(2, '0');
  return `/posts/${year}/${month}/${undated(post)}/`;
}

/** Whole minutes at 160 words per minute, never less than one. */
export function readTime(body = ''): number {
  const words = body.match(/\S+/g)?.length ?? 0;
  return Math.max(1, Math.round(words / 160));
}

/** The next older post; `all` must be newest first, as `getPosts()` returns. */
export function prevPost(post: Post, all: Post[]): Post | undefined {
  const index = all.findIndex((p) => p.id === post.id);
  return index === -1 ? undefined : all[index + 1];
}

/** The newest other post sharing a tag; `all` must be newest first. */
export function relatedPost(post: Post, all: Post[]): Post | undefined {
  return all.find((p) => p.id !== post.id && p.data.tags.some((tag) => post.data.tags.includes(tag)));
}

/** Tags differing only in case or accents share one page. A tag with no ASCII letters or digits fails the build. */
export function tagUrl(tag: string): string {
  const slug = slugify(tag);
  if (!slug) throw new Error(`tag "${tag}" needs at least one ASCII letter or digit`);
  return `/writing/tags/${slug}/`;
}

/** Inline Markdown (emphasis, code, links) reduced to its text, for excerpts. */
export function plainText(markdown: string): string {
  return markdown
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/(\*\*|\*|`)(.+?)\1/g, '$2')
    .replace(/(?<!\w)(__|_)(.+?)\1(?!\w)/g, '$2')
    .trim();
}

export const longDate = (date: Date) =>
  date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** `27 Apr 2026`, for the home writing rows. */
export const shortDate = (date: Date) =>
  date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });

/** `27 Apr`, for lists already grouped by year. */
export const monthDay = (date: Date) =>
  date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'UTC' });

/** `2026-04-27`, for `<time datetime>`. */
export const isoDay = (date: Date) => date.toISOString().slice(0, 10);
