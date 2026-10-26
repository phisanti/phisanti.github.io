import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const writing = defineCollection({
  // One folder per post, images beside its index.md; the id is the folder name.
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/writing',
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      excerpt: z.string(),
      tags: z.array(z.string()).min(1),
      permalink: z
        .string()
        .regex(/^\/posts\/.*\/$/, 'permalink must start with /posts/ and end with /')
        .optional(),
      draft: z.boolean().default(false),
      cover: image().optional(),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    kind: z.string(),
    year: z.number(),
    summary: z.string(),
    repo: z.url().optional(),
    post: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().optional(),
  }),
});

const papers = defineCollection({
  // The id is the exact file name: it is the `#anchor` that legacy /publication/ URLs redirect to.
  loader: glob({
    pattern: '*.md',
    base: './src/content/papers',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    venue: z.string(),
    citation: z.string(),
    url: z.url(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.looseObject({}),
});

export const collections = { writing, projects, papers, pages };
