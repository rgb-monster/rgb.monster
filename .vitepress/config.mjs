import {defineConfig} from "vitepress";
import markdownItContainer from "markdown-it-container";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "RGB Monster",
    titleTemplate: ":title - RGB Monster",
    description: "Unusual Comedy Production",
    head: [
        ["link", {rel: "icon", href: "/favicon.png"}],
        ["link", {rel: "preconnect", href: "https://fonts.googleapis.com"}],
        ["link", {rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: ""}],
        ["link", {href: "https://fonts.googleapis.com/css2?family=Hammersmith+One&display=swap", rel: "stylesheet"}],
        ["link", {href: "https://fonts.googleapis.com/css2?family=Lato&display=swap", rel: "stylesheet"}],

        ["link", {href: "https://fonts.googleapis.com/icon?family=Material+Icons", rel: "stylesheet"}],

        [
            "script",
            {
                src: "https://plausible.io/js/script.tagged-events.outbound-links.js",
                "data-domain": "rgb.monster",
                defer: "defer",
            },
        ],

        ["meta", {property: "og:site_name", content: "RGB Monster"}],
        ["meta", {property: "og:type", content: "website"}],
    ],

    vite: {
        css: {
            preprocessorOptions: {
                scss: {additionalData: `@import "/src/theme/mixins.scss";`},
            },
        },
    },

    //srcDir: "./src/md",
    cleanUrls: true,

    markdown: {
        config: md => {
            md.use(markdownItContainer, "section", {
                render: function (tokens, idx) {
                    var m = tokens[idx].info.trim().match(/^section\s+(.*)$/);

                    if (tokens[idx].nesting === 1) {
                        // opening tag
                        return `<section class="contents ${
                            m ? md.utils.escapeHtml(m[1]) : ""
                        }"><div class="contents">\n`;
                    } else {
                        // closing tag
                        return "</div></section>\n";
                    }
                },
            });
        },
    },

    transformPageData(pageData) {
        pageData.frontmatter.head = pageData.frontmatter.head || [];

        if (pageData.frontmatter.page == "show-details") {
            let params = pageData.params;
            pageData.frontmatter.head.push(["meta", {name: "og:title", content: params.title}]);
            pageData.frontmatter.head.push(["meta", {name: "og:image", content: params.cover_thumb}]);
            pageData.frontmatter.head.push(["meta", {name: "og:image:type", content: "image/webp"}]);
            pageData.frontmatter.head.push(["meta", {name: "og:image:width", content: "600"}]);
            pageData.frontmatter.head.push(["meta", {name: "og:image:height", content: "300"}]);
        } else {
            pageData.frontmatter.head.push(["meta", {name: "og:title", content: pageData.title}]);
        }

        //console.log("zzzzzzzzzzz", pageData);
        if (pageData.card) {
            pageData.frontmatter.head.push(["meta", {name: "og:image", content: pageData.card}]);
        }

        // <meta property="og:title" content="Confirmed: book your shows in minutes!" />

        // <meta property="og:url" content="https://confirmed.show" />
        // <meta property="twitter:card" content="summary_large_image" />
    },
});
