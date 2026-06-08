# RGB Monster - Project Instructions & Guidelines

Welcome to the `rgb.monster` Nuxt project repository. This document serves as a shared guide for developers and AI agents (such as Gemini CLI) to maintain the architectural integrity, build efficiency, and styling conventions of the application.

---

## 🛠️ Architecture & Structure

This project uses **Nuxt 4** with the source files structured under the `app/` directory (the default `srcDir` for Nuxt v4).

### Key Files & Components

- **`nuxt.config.ts`**: The main configuration file, kept highly clean and declarative. Imports `defineNuxtConfig` explicitly from `nuxt/config`.
- **`app/modules/prerender.ts`**: A dedicated, local Nuxt module that handles:
    1.  Fetching and writing show type slugs to `app/show-types-generated.json`.
    2.  Fetching and writing show type title mappings to `app/show-types-titles.json`.
    3.  Hooking into Nitro's `prerender:routes` to register both show-type routes and standard published Storyblok content pages (`/about`, `/fringe`, etc.) for static site generation.
    4.  **Performance Optimization**: Employs module-level caching to guarantee that Storyblok and Google Storage APIs are fetched **exactly once** during the entire build process.
- **`app/pages/[...slug].vue`**: The dynamic router.
    - Loads `app/show-types-generated.json` and `app/show-types-titles.json` synchronously.
    - **SEO Titles**: Resolves page titles synchronously on both server and client (avoiding asynchronous store fetching during page initialization) to guarantee **zero hydration mismatches**.
- **`app/shows.js`**: The Pinia store, which resolves and processes shows and show-types in parallel using a unified `fetchShows` action.

---

## ⚠️ Core Conventions & Rules

To prevent regressions, please strictly follow these rules when modifying the codebase:

1. use descriptive variable names - avoid single letter vars, like x, y, etc, unless it really refers to, say window
   positions (x, y), or the item's ordinal number (i)
2. avoid using overly technical jargon like "hydrate", use "enrich" or a more descriptive word in these cases
3. avoid trivial code comments
4. avoid double negations like !!. For javascript use Boolean instead. Apply this same philosophy to all your thinking -
   a double negation is not easy to parse and harms readability
5. use let instead of const. do not use single line if statements. observe the coding practices from the codebase and
   adhere to them
6. never ever use CSS's !important
7. avoid strict comparisons in javascript
8. don't be too excited in your communication (using exclamation points etc) - be matter of fact. don't add unnecessary
   phrases like "let me know if you need anything else" etc
9. keep your edits focused and do not edit stuff you were not asked to. you can inform user if you spotted something
   though
10. avoid undoing changes i've made between prompts unless they are in contradiction to what i'm asking
11. This project never uses SSR. It only uses SSG and development. So you don't have to concern yourself with SSR.

---

## 🚀 Common Commands

- `npx nuxi prepare`: Re-registers local modules and regenerates TypeScript typings and local build-time JSON caches.
- `npm run dev`: Runs the local development server with mkcert HTTPS enabled.
- `npm run build`: Compiles, bundles, and pre-renders the entire static application (112+ routes).
