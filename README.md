## Quick Start

1. **Configure Environment**: Create a `.env` file at the root:
    ```bash
    STORYBLOK_DELIVERY_API_TOKEN=your_storyblok_token_here
    STORYBLOK_REGION=eu # Optional, defaults to "eu"
    ```
2. **Install & Launch**:
    ```bash
    npm install
    npm run dev
    ```

## 🚀 Key Commands

- `npm run dev`: Starts local HTTPS development server.
- `npx nuxi prepare`: Regenerates TypeScript typings and syncs local static caches.
- `npm run build`: Bundles, compiles, and pre-renders static pages into `.output/public`.

## 🌐 Deployments

The website is deployed on netlify (pre-configured via `netlify.toml`), and builds trigger automatically on push as well as through webhooks from storyblok on publish. So, in order to deploy, just

```git push```

