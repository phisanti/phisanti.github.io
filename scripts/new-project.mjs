#!/usr/bin/env node
// Scaffold a project entry: src/content/projects/<slug>.md
import { existsSync, writeFileSync } from 'node:fs';
import { slugify } from '../src/lib/slug.ts';

const name = (process.argv[2] ?? '').trim();
if (!name) {
  console.error('usage: node scripts/new-project.mjs "<Name>"');
  process.exit(2);
}

const slug = slugify(name);
if (!slug) {
  console.error('name has no ASCII letters or digits');
  process.exit(2);
}

const file = `src/content/projects/${slug}.md`;
if (existsSync(file)) {
  console.error(`refusing to overwrite ${file}`);
  process.exit(1);
}

writeFileSync(
  file,
  `---
title: ${JSON.stringify(name)}
kind: ""
year: ${new Date().getFullYear()}
summary: "TODO"
featured: false
---
`,
);
console.log(file);
