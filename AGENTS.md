# AGENTS.md

Personal site of Santiago Cano-Muniz. Astro static site, deployed to GitHub Pages from `master` by `.github/workflows/deploy.yml`.

## Stack
Astro + content collections (Markdown, zod schemas in `src/content.config.ts`), plain CSS, Playwright for checks. Node version in `.nvmrc`.

## Make interface
| Command | Does |
|---|---|
| `make install` | `npm ci` |
| `make dev` | dev server at http://localhost:4321 |
| `make build` | static build to `dist/` |
| `make preview` | serve `dist/` |
| `make check` | `astro check`, build, URL check, Playwright |
| `make new-post TITLE="..."` | scaffold `src/content/writing/YYYY-MM-DD-slug/index.md` |
| `make new-project NAME="..."` | scaffold `src/content/projects/<slug>.md` |

## Content layout
- `src/content/writing/<date-slug>/index.md`: one folder per post, images beside it.
- `src/content/projects/*.md`: project cards.
- `src/content/papers/*.md`: publications.
- `src/content/pages/*.md`: home, about, contact copy.
- `src/data/social.yml`: social links and email (read by `src/data/social.ts`); edit here, not in components.
- `src/data/nav.ts`: navigation.

## Figures
Put the image beside `index.md` and use the title as caption:
`![alt text](./x.png "Figure N. caption")`

## Front-matter schema
- writing: `title`, `date`, `excerpt`, `tags` (min 1), `permalink?` (`/posts/.../`), `draft` (default false), `cover?`
- projects: `title`, `kind`, `year`, `summary`, `repo?`, `post?`, `featured`, `order?`
- papers: `title`, `date`, `venue`, `citation`, `url`; the file name is the `#anchor` on /publications/, so never rename one
- pages: free-form.

Permalinks of published posts are frozen: never change a `permalink` or rename a published post's folder in a way that alters its URL. `make check` verifies URLs.

## Design rules
- Colour tokens live in `src/styles/tokens.css` (light on `:root`, dark on `html[data-theme="dark"]`). Use the variables; no hard-coded colours.
- Light is Everforest Light Medium with red punctuation: hero italic, eyebrows, contact dot, progress bar, figure numbers and code keywords. Dark is Everforest Dark Hard with green h1/h2 and yellow italic h3.
- `#f34e3f` (`--accent`, `--hero-em`) is for large text and UI only; small red text uses `--accent-ink` (`#c03b2c`).
- Code panels are cream in light and dark in dark: Shiki themes `src/lib/shiki-cream-light.ts` and `everforest-dark`.
- Text and UI meet WCAG AA contrast.
- Motion budget: small, purposeful transitions in `src/styles/motion.css`.
- Respect `prefers-reduced-motion`: all motion must be disabled or reduced.

## Discretion
No "for hire", "available for work" or similar copy anywhere on the site.

## Verification
Run `make check` before finishing. Preview visually at http://localhost:4321 via `make dev`.
