# phisanti.github.io

Personal site of Santiago Cano-Muniz: writing, projects and publications.
Built with [Astro](https://astro.build) and deployed to GitHub Pages.

## Run locally

```bash
make install && make dev
```

Open http://localhost:4321.

## Write a post

```bash
make new-post TITLE="My title"
```

This creates `src/content/writing/YYYY-MM-DD-my-title/index.md`. Fill in the
front matter (`title`, `date`, `excerpt`, `tags`), write the body, and put
images in the same folder. Figures use
`![alt](./x.png "Figure 1. caption")`. New posts start with `draft: true`, so
they show in `make dev` but not on the live site; set `draft: false` to publish.

Projects: `make new-project NAME="..."`.

## Check and deploy

```bash
make check
```

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds the site
and publishes it to GitHub Pages. Pull requests run `make check`.

See `AGENTS.md` for content layout, front-matter schema and design rules.
