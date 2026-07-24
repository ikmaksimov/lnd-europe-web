# Trencadís site

A website scaffolded from the [Trencadís](https://trencadis.digitalforms.es)
Starter — a Next.js + Tailwind shell with the token layer, the Motion layer, and
the SEO baseline already wired up. Add sections from the Trencadís library and
compose your pages.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you'll see the placeholder home.

## Make it yours

1. **Brand & metadata** — edit `site.config.ts`: `name`, `tagline`,
   `description`, `url` (your production domain), `organization`, and the
   `smoothScroll` flag. This one file drives `<title>`, Open Graph, the sitemap,
   the manifest, and the generated OG image.

2. **Add sections** — copy blocks from the library with the Trencadís CLI:

   ```bash
   npx trencadis list                 # see available blocks
   npx trencadis add hero-01          # copies blocks/hero/hero-01/ into this repo
   npx trencadis add cta-01 footer-01
   ```

   Each block lands in `blocks/<category>/<variant>/` and imports only from
   `@/lib/animations` (already present) and Tailwind tokens (already in
   `app/globals.css`). Blocks that use decorative gradients (`bg-mesh`) or the
   marquee utility rely on CSS already shipped in `globals.css`.

3. **Compose the page** — import the blocks into `app/page.tsx` and arrange them
   (keep a single `<h1>` per page). Or paste the `page.tsx` exported from the
   Trencadís Page Editor.

4. **Theme** — re-colour the whole site by editing the token values in
   `:root` in `app/globals.css`. Blocks re-theme with zero code changes.

## Deploy

Deploy like any Next.js app (e.g. Vercel). Set the production URL in
`site.config.ts` first so canonical URLs, the sitemap, and OG tags are correct.

## Updating blocks

Re-run `npx trencadis add <block> --force` to pull the latest version of a block
from the library into this repo.
