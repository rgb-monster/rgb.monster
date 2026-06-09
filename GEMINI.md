# Instructions & Guidelines

## Architecture & Structure

- **Technology**: Nuxt 4, SSG-only. Source files are in the `app/` directory.
- **Data Flow**: The `app/modules/prerender.ts` module is critical. It caches external API data into local JSON files (`app/show-types-*.json`) during the build. This enables synchronous data fetching in components like `app/pages/[...slug].vue` to prevent hydration mismatches.
- **State Management**: `app/shows.js` is the Pinia store for handling show data.

## Core Conventions & Rules

### Naming & Style
1. **Variables**: Descriptive names. No single-letter names (except for coordinates/indices). Use `let`, not `const`.
2. **Language**: No technical jargon (e.g., use "enrich" not "hydrate"). No passive voice in UI text.
3. **Comments**: Avoid trivial or redundant comments.
4. **Logic**: No double negations (`!!`), use `Boolean()`. No strict comparisons (`===`/`!==`), use `==`/`!=` or truthiness. No single-line `if` statements.

### HTML, CSS & UI
5. **HTML**: Use semantic tags. Use `<button>` for actions, `<a>` for navigation.
6. **Modals**: No native JS `prompt()`/`confirm()`/`alert()`. Use custom UI components.
7. **CSS**: Never use `!important`.

### Component Architecture
8. **Vue**: Use Options API exclusively.
9. **File Structure**: Order blocks: `<script>` -> `<template>` -> `<style>`.
10. **Options Order**: `components` -> `props` -> `data` -> `computed` -> `watch` -> `methods` -> `hooks`. No `name` property.
11. **Global Filters**: Functions from `utils.filters` are available in templates. New filters can be added there.

### Workflow & Communication
12. **Verification**: Skip all verification/build steps post-modification. User handles all testing.
13. **Scope**: Edits must be focused on the user's request. Do not modify unrelated files.
14. **History**: Do not revert user's changes from previous prompts unless there is a direct conflict.
15. **Tone**: Matter-of-fact, direct communication. No filler, apologies, or excitement.

## Common Commands

- `npx nuxi prepare`: Re-registers local modules and regenerates TypeScript typings and local build-time JSON caches.
- `npm run dev`: Runs local development server with mkcert HTTPS.
- `npm run build`: Compiles, bundles, and pre-renders the static application.
