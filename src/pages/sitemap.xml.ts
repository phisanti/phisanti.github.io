import type { APIRoute } from 'astro';

/**
 * Jekyll served /sitemap.xml; @astrojs/sitemap writes /sitemap-index.xml and
 * /sitemap-0.xml. This keeps the old address valid for crawlers that saved it.
 * The site fits in one sitemap file, so the index lists sitemap-0.xml only.
 */
export const GET: APIRoute = ({ site }) =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${new URL('/sitemap-0.xml', site)}</loc></sitemap></sitemapindex>
`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
