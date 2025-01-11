import {slugs, metas} from "./src/scripts/metas.js";
export default {
    paths() {
        // need to retrieve full metas (from local config) so that we can populate the right headers
        // this does mean that 5 headliners for $25 might end up with £10 title
        let bySlug = {};
        metas.forEach(showMetas => {
            if (!bySlug[showMetas.slug]) {
                let sameSlugs = metas.filter(m => m.slug == showMetas.slug);
                let defaults =
                    sameSlugs.filter(m => m.default)[0] ||
                    sameSlugs.filter(m => !Array.isArray(m.tickets))[0] ||
                    sameSlugs[0];
                bySlug[showMetas.slug] = defaults;
            }
        });

        return slugs.map(slug => ({params: {show: slug, ...bySlug[slug]}}));
    },
};
