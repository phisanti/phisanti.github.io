import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, plainText, postUrl } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: 'Santiago Cano-Muniz',
    description: 'Notes on biology, data and code by Santiago Cano-Muniz.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: plainText(post.data.excerpt),
      link: postUrl(post),
    })),
  });
}
