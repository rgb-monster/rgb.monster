import showMetas from "../scripts/metas.js";

let slugs = Object.values(showMetas).map(meta => meta.slug);

export default {
    paths() {
        return slugs.map(slug => ({params: {show: slug}}));
    },
};
