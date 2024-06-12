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
});
