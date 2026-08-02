# rgb.monster

Marketing site for RGB Monster. Nuxt 4, SSG-only, content managed in Storyblok, show data pulled from
the Confirmed Show API.

## Commands

- `npm run dev` — local dev server over HTTPS (mkcert, certs in `.cert/`).
- `npm run build` — bundles and pre-renders into `.output/public` (symlinked as `dist/`).
- `npx nuxi prepare` — regenerates typings and the build-time JSON caches in `app/generated/`.
- `npm run lint` / `npm run lint:fix`.

Deploys happen on `git push` (Netlify), and Storyblok publish webhooks trigger rebuilds too.

## Architecture

Source lives in `app/`. Nuxt 4 defaults apply, so `app/` is the srcDir and `@/` resolves to it.

**Data flow.** There are two paths, both fed by the same upstream APIs:

1. **Build time** — `app/modules/prerender.ts` fetches show types plus Storyblok links, writes
   `app/generated/show-types-*.json`, and registers every show-type and Storyblok route for
   pre-rendering. In dev it puts the same data on `runtimeConfig.public` instead.
2. **Run time** — `nuxt.config.ts` inlines a `<script>` that kicks off `fetch()` calls into
   `window.__PRELOADED_DATA__.sources` before the app boots. `DATA_SOURCES` in `nuxt.config.ts` is the
   single source of truth for that list; each entry is tagged `show-types` or `shows`.

`app/shows.js` is the Pinia store (`useStore`). `fetchShows()` resolves the preloaded promises, merges
show-type metadata into each show, and exposes `shows`, `filteredShows`, `filteredShowsByType`,
`showTypesByID` / `showTypesBySlug`, and the `current*` getters driven by `setCurrentShow(slug)`.

Because the store only fills in on the client, anything that renders show data must be guarded by
`v-if="!loading"` — otherwise the pre-rendered HTML and the hydrated DOM disagree.

**Show records.** After the store merges them, every show carries both its own fields (`ts`, `ts_utc`,
`venue`, `acts`, `hosts`, `tickets_available`, `total_act_spots`) and the show type's metadata
(`title`, `slug`, `type`, `tags`, `tickets`, `payment`, `coverImage`, `coverThumb`, `see_also`).

- `ts` is naive **venue-local** time — use it for display.
- `ts_utc` is a real UTC timestamp — use it for any comparison against now
  (`dt.datetime.utcnow()`), since shows run in several cities.
- `date` is the *programming* date: shows starting at or before 5am count as the previous night.

**Storyblok.** Components in `app/storyblok/*.vue` map to Storyblok bloks by name — Vue resolves a blok
named `catalog` to `Catalog.vue`, `up-next` to `UpNext.vue`. Bloks in subfolders (e.g.
`app/storyblok/showpage/Shows.vue`) are registered globally as `showpage-shows` by
`app/plugins/storyblok-components.ts` and used via `<component is="showpage-shows" />`; files prefixed
with `_` are skipped. Blok field schemas themselves are defined in the Storyblok UI, not in this repo,
so a new blok means both a `.vue` file here and a matching component definition there.

`app/widgets/global/` holds globally registered widgets (`Icon`, `Headshot`, `BorderBox`, …).
`utils.filters` from `app/utils.js` are exposed as global properties, so `isEmpty`, `humanDate`,
`pluralize`, `ordinal` etc. can be called directly in any template.

## Conventions

### Naming & style
1. Descriptive variable names, no single letters (coordinates and indices excepted). Use `let`, never
   `const`.
2. No technical jargon in prose or UI text (say "enrich", not "hydrate"). No passive voice in UI text.
3. No trivial or redundant comments.
4. No double negation (`!!`) — use `Boolean()`. No strict comparisons (`===` / `!==`) — use `==` / `!=`
   or truthiness. No single-line `if` statements.

### HTML & CSS
5. Semantic tags. `<button>` for actions, `<a>` for navigation.
6. No native `prompt()` / `confirm()` / `alert()` — build the UI.
7. Never `!important`.
8. Breakpoints are the postcss custom media queries `--break1` … `--break-mob` declared in
   `nuxt.config.ts`.

### Theming

Every section carries a `theme-*` class (`base`, `white`, `light`, `beige`, `yellow`, `pink`, `blue`,
`brown`, `dark`), chosen by the editor in Storyblok. Each theme in `assets/styles.css` answers the same
ten questions, and **components style against these tokens, never against the raw palette** — that is
what lets a blok drop into any section without knowing which one it landed in.

| | | |
|---|---|---|
| surfaces | `--bg` | the section itself |
| | `--bg-1` | raised off it: cards, tiles, inputs |
| | `--bg-2` | raised again: borders, dividers, wells |
| text | `--color` | body copy |
| | `--color-muted` | captions, meta, disabled |
| | `--color-heading` | h1–h3, applied globally |
| intent | `--accent` / `--accent-text` | complementary highlight: links, `em`, the thing to look at |
| | `--cta` / `--cta-text` | the one strong action in a view |

Light themes step their surfaces darker and dark themes step them lighter, so `--bg-1` always reads as
nearer the viewer whichever way round the theme is.

The raw palette (`--pink`, `--brown`, `--beige`, `--base`, …) only feeds the theme tokens — don't reach
for it in a component. Two things are deliberately outside the themes because they mean the same thing
on any background: the categorical accents (`--accent-pink`, `--accent-red`, … — used for tag kinds and
ticket status, see the global `.tags` rule) and `--chrome*`, which is the fixed site chrome behind the
floating header. Both name their own text colour rather than inheriting one.

### Components
9. Options API exclusively (`<script setup>` only in the handful of trivial existing bloks).
10. Block order: `<script>` → `<template>` → `<style>`.
11. Options order: `components` → `props` → `data` → `computed` → `watch` → `methods` → hooks. No
    `name` property.
12. Bloks take a single `blok: Object` prop and put `v-editable="blok"` on their root element.

### Workflow
13. Skip build and verification steps after edits — the user tests everything.
14. Keep edits focused on what was asked; don't touch unrelated files.
15. Don't revert the user's earlier changes unless they directly conflict.
16. Matter-of-fact tone. No filler, apologies, or excitement.
