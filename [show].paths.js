import showMetas from "./src/scripts/metas.js";

let bySlug = Object.fromEntries(Object.entries(showMetas).map(([title, meta]) => [meta.slug, {title, ...meta}]));

export default {
    paths() {
        return Object.keys(bySlug).map(slug => ({params: {show: slug, ...bySlug[slug]}}));
    },
};
