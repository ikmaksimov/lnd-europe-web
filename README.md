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

4. **Theme** — the palette is a file: `themes/<name>.css`, activated by one
   import in `app/globals.css`. `npx trencadis theme list` shows what ships;
   `npx trencadis theme add sand` copies one in. Re-colour by editing the values
   in that file — blocks re-theme with zero code changes.

## Deploy

Deploy like any Next.js app (e.g. Vercel). Set the production URL in
`site.config.ts` first so canonical URLs, the sitemap, and OG tags are correct.

## Updating

You own this code, so library improvements do not arrive on their own — nothing
we release can break this site, and nothing we improve reaches it until you ask:

```bash
npx trencadis status          # what has moved on in the library?
npx trencadis update          # a plan — changes nothing
npx trencadis update --apply  # performs exactly that plan
```

`trencadis.json` records what this site was copied from and a hash per file, so
a block **you edited is never overwritten** (it is reported, and updates only
with `--force <block>`). Sidecars, the theme and the `trencadis:css` region in
`globals.css` are always refreshed together with any block, because a new block
against an old token layer does not work. Inside `globals.css` only the marked
region is replaced — your own imports and overrides stay put; the one thing
`update` may add is the `@import '../themes/<name>.css';` line, if the file has
none, since without it no colour token resolves.

Keep client content in **props in `app/page.tsx`**, not in edits to block files —
that is what keeps updates free.
