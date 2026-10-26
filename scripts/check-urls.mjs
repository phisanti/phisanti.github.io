import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const paths = readFileSync('tests/fixtures/legacy-urls.txt', 'utf8').split('\n').map((line) => line.trim()).filter(Boolean);

const isFile = (file) => existsSync(file) && statSync(file).isFile();

// Returns the built file serving a URL path, or null.
function pageFor(path) {
  const clean = path.replace(/[#?].*$/, '');
  const candidates = [join(dist, clean, 'index.html'), join(dist, clean + '.html'), join(dist, clean)];
  return candidates.find(isFile) ?? null;
}

function resolves(path) {
  const file = pageFor(path);
  if (!file) return 'missing from dist/';
  const html = readFileSync(file, 'utf8');
  if (!/\.html?$/.test(file)) return null;
  const refresh = html.match(/<meta[^>]+http-equiv=["']refresh["'][^>]*>/i);
  if (!refresh) return null;
  const target = refresh[0].match(/url=([^"'>\s]+)/i)?.[1];
  if (!target) return 'refresh without target';
  const local = target.replace(/^https?:\/\/[^/]+/, '');
  const page = pageFor(local);
  if (!page) return `redirect target missing: ${target}`;
  const anchor = local.match(/#(.+)$/)?.[1];
  if (anchor && !readFileSync(page, 'utf8').includes(`id="${anchor}"`)) return `anchor missing: ${target}`;
  return null;
}

const failures = paths.map((path) => ({ path, reason: resolves(path) })).filter((row) => row.reason);
if (failures.length) {
  console.table(failures);
  console.error(`${failures.length} of ${paths.length} legacy URLs do not resolve`);
  process.exit(1);
}
console.log(`all ${paths.length} legacy URLs resolve`);
