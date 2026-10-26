import type { APIRoute, GetStaticPaths } from 'astro';
import { getPosts } from '../../lib/posts';
import { ogKey, renderCard } from '../../lib/og';

export const getStaticPaths = (async () => {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { slug: ogKey(post) }, props: { post } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await renderCard(props.post)).buffer as ArrayBuffer, { headers: { 'Content-Type': 'image/png' } });
