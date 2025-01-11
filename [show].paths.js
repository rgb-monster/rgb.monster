import {slugs} from "./src/scripts/metas.js";
export default {
    paths() {
        return slugs.map(slug => ({params: {show: slug}}));
    },
};
