import {defineNuxtConfig} from "nuxt/config";
import mkcert from "vite-plugin-mkcert";

// Single source of truth for the data fetched into window.__PRELOADED_DATA__.
// Edit this list to add/remove sources; each entry is tagged with its data type so the
// store can tell show types and shows apart. The preload script is generated from it.
const DATA_SOURCES = [
    {type: "show-types", url: "https://st.confirmed.show/api/rgb-monster/show-types.json"},
    {type: "shows", url: "https://confirmed.show/api/v1/rgb-monster/shows.json?future_shows_limit=360"},
    {type: "shows", url: "https://confirmed.show/api/v1/rgb-presents/shows.json?future_shows_limit=360"},
    {type: "shows", url: "https://confirmed.show/api/v1/bowtie/shows.json?future_shows_limit=360"},
];

// A fetch() that resolves to JSON, or [] on any failure.
const fetchJson = (url: string) =>
    `fetch('${url}', { mode: 'cors', credentials: 'same-origin' }).then(r => r.ok ? r.json() : []).catch(() => [])`;

export default defineNuxtConfig({
    compatibilityDate: "2026-01-13",
    devtools: {enabled: false},
    sourcemap: false,
    modules: ["~/modules/prerender", "@storyblok/nuxt", "@pinia/nuxt"],

    runtimeConfig: {
        public: {
            // Only populated dynamically in dev mode via the prerender module
            showTypeSlugs: [],
            showTypeMetadata: {},
        },
    },

    storyblok: {
        accessToken: process.env.STORYBLOK_DELIVERY_API_TOKEN,
        apiOptions: {
            region: process.env.STORYBLOK_REGION || "eu",
        },
    },

    // Global CSS/SCSS files
    css: [
        "@fontsource/hammersmith-one/index.css",
        "@fontsource/lato/400.css",
        "@fontsource/lato/700.css",
        "../assets/destyle.css",
        "../assets/styles.css",
    ],

    postcss: {
        plugins: {
            "postcss-custom-media": {
                customMedia: {
                    "--break1": "(max-width: 999px;)",
                    "--break2": "(max-width: 899px;)",
                    "--break3": "(max-width: 699px;)",
                    "--break-mob": "(max-width: 500px;)",
                },
            },
        },
    },

    app: {
        head: {
            meta: [
                {property: "og:site_name", content: "RGB Monster"},
                {property: "og:type", content: "website"},
            ],
            link: [
                {
                    href: "https://fonts.googleapis.com/icon?family=Material+Icons",
                    rel: "stylesheet",
                },
            ],
            script: [
                {
                    innerHTML: `window.__PRELOADED_DATA__ = { sources: [${DATA_SOURCES.map(s => `{ type: '${s.type}', data: ${fetchJson(s.url)} }`).join(", ")}] };`,
                },
                {
                    src: "https://plausible.io/js/script.tagged-events.outbound-links.js",
                    "data-domain": "rgb.monster",
                    defer: true,
                },
                {
                    src: "https://fast.bentonow.com?site_uuid=f89c78149bd78558e888710d5dba78c6",
                    defer: true,
                    async: true,
                },
                {
                    innerHTML: `!function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '9489847254392109');
        fbq('track', 'PageView');`,
                },
            ],
        },
    },

    ssr: true,

    devServer: {
        https: {
            key: "./.cert/dev.pem",
            cert: "./.cert/cert.pem",
        },
    },

    vite: {
        plugins: [
            mkcert({
                savePath: "./.cert",
            }),
        ],
        build: {
            modulePreload: false,
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes("/app/")) {
                            return "app-bundle";
                        }
                    },
                },
            },
        },
    },
});
