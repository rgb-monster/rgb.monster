import {loadShowTypes} from "./src/scripts/metas.js";

export default {
    async paths() {
        let allShowTypes = Object.values(await loadShowTypes());

        // need to retrieve full metas (from local config) so that we can populate the right headers
        // this does mean that 5 headliners for $25 might end up with £10 title
        return allShowTypes.map(showType => {
            return {
                params: {
                    showSlug: showType.slug,
                    showInfo: showType,
                },
            };
        });
    },
};
