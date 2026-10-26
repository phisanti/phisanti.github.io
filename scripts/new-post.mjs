#!/usr/bin/env node
// Scaffold a draft post: src/content/writing/<date>-<slug>/index.md
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { slugify } from '../src/lib/slug.ts';

const title = (process.argv[2] ?? '').trim();
if (!title) {
  console.error('usage: node scripts/new-post.mjs "<Title>"');
  process.exit(2);
}

const slug = slugify(title);
if (!slug) {
  console.error('title has no ASCII letters or digits');
  process.exit(2);
}

const today = new Date().toISOString().slice(0, 10);
const dir = `src/content/writing/${today}-${slug}`;
if (existsSync(dir)) {
  console.error(`refusing to overwrite ${dir}`);
  process.exit(1);
}

mkdirSync(dir, { recursive: true });
const file = `${dir}/index.md`;
writeFileSync(
  file,
  `---
title: ${JSON.stringify(title)}
date: ${today}
draft: true
excerpt: "TODO"
tags: [draft]
---

<!-- ![alt](./figure.png "Figure 1. Caption") -->

Write here.
`,
);
console.log(file);
