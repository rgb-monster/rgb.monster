import {bySlug} from "./src/scripts/metas.js";

export default {
    paths() {
        return Object.keys(bySlug).map(slug => ({params: {show: slug, ...bySlug[slug]}}));
    },
};
