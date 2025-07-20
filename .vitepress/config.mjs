import {defineConfig} from "vitepress";
import markdownItContainer from "markdown-it-container";
import svgLoader from "vite-svg-loader"; // 1. Import the plugin

import {useStore} from "../src/stores/shows.js";
import utils from "../src/scripts/utils.js";
import {loadShowTypes} from "../src/scripts/metas.js";

// https://vitepress.dev/reference/site-config
export default async () => {
    let showTypes = await loadShowTypes();

    return defineConfig({
        title: "RGB Monster",
        titleTemplate: ":title - RGB Monster",
        description: "Unusual Comedy Production",
        themeConfig: {
            showTypes,
        },

        head: [
            ["link", {rel: "icon", href: "/favicon.png"}],

            ["link", {rel: "preconnect", href: "https://fonts.googleapis.com"}],
            ["link", {rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: ""}],
            [
                "link",
                {href: "https://fonts.googleapis.com/css2?family=Hammersmith+One&display=swap", rel: "stylesheet"},
            ],
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

            [
                "script",
                {},
                `!function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '9489847254392109');
        fbq('track', 'PageView');`,
            ],
        ],

        vite: {
            css: {
                preprocessorOptions: {
                    scss: {
                        additionalData: `@use "/src/theme/mixins.scss";`,
                        api: "modern-compiler",
                    },
                },
            },
        },
        plugins: [
            svgLoader(), // 3. Add the plugin to the plugins array
        ],

        //srcDir: "./src/md",
        cleanUrls: true,

        markdown: {
            config: md => {
                md.use(markdownItContainer, "section", {
                    render: function (tokens, idx) {
                        var m = tokens[idx].info.trim().match(/^section\s+(.*)$/);

                        if (tokens[idx].nesting === 1) {
                            // opening tag
                            return `<section class="markdown-contents ${
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

        async transformHead({pageData}) {
            let store = useStore();
            await store.fetchShows();

            let extra = [];
            if (pageData.frontmatter.page == "show-details") {
                let show = pageData.params.showInfo;
                let scheduled = store.showTypes.find(rec => rec.id == show.id);
                let description;
                if (scheduled) {
                    let td = extractTimesDates(scheduled?.shows || []);
                    description = `${td.topShow.ts.strftime("%H:%M")} ${td.topShow.venue.name}, ${td.dates}`;
                } else {
                    description = show.shortDescription;
                }

                extra.push(["meta", {name: "og:title", content: show.title}]);
                extra.push(["meta", {name: "og:description", content: description}]);

                extra.push(["meta", {name: "og:image", content: show?.coverThumb || ""}]);
                extra.push(["meta", {name: "og:image:type", content: "image/webp"}]);
                extra.push(["meta", {name: "og:image:width", content: "600"}]);
                extra.push(["meta", {name: "og:image:height", content: "300"}]);
            } else {
                extra.push(["meta", {name: "og:title", content: pageData.title}]);
            }

            if (pageData.card) {
                extra.push(["meta", {name: "og:image", content: pageData.card}]);
            }

            // <meta property="og:title" content="Confirmed: book your shows in minutes!" />

            // <meta property="og:url" content="https://confirmed.show" />
            // <meta property="twitter:card" content="summary_large_image" />

            return extra;
        },
    });
};

function extractTimesDates(shows) {
    let topShow = () => {
        let byVenueTime = {};
        shows.forEach(show => {
            utils.setDefault(byVenueTime, `${show.venue.name}-${show.ts.strftime("%H:%M")}`, {
                show: show,
                shows: 0,
            }).shows += 1;
        });

        let topShows = utils.sort(Object.values(byVenueTime), rec => -rec.shows);

        return topShows[0].show;
    };

    let dates = () => {
        let byDate = {};
        shows.forEach(show => {
            byDate[show.ts.strftime("%Y-%m-%d")] = show.ts;
        });

        let dates = utils.sort(Object.values(byDate));
        if (dates.length < 3) {
            return dates.map(ts => utils.humanDate(ts)).join(", ");
        } else {
            let [start, end] = [dates[0], dates[dates.length - 1]];
            return `${utils.humanDate(start)}-${utils.humanDate(end)}`;
        }
    };

    return {
        topShow: topShow(),
        dates: dates(),
    };
}
