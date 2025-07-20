let byShowType = null;

export async function loadShowTypes() {
    if (byShowType) {
        return byShowType;
    }

    try {
        const response = await fetch(
            "https://storage.googleapis.com/confirmed-static-api/rgb-monster/show-types.json",
            {credentials: "omit"}
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let showTypes = await response.json();

        showTypes = showTypes
            .filter(showType => Object.keys(showType.meta).length > 0)
            .map(showType => {
                let meta = {...showType, ...showType.meta};
                delete meta.meta;

                meta.tags = (meta.tags || []).map(tag => tag.tag);
                meta.slug = meta.slug || meta.id;
                meta.title = meta.title || meta.name;
                delete meta.name;
                return meta;
            });

        byShowType = Object.fromEntries(showTypes.map(showType => [showType.slug, showType]));
    } catch (e) {
        console.error(`Failed to fetch remote data: ${e.message}`);
        byShowType = {};
    }

    return byShowType;
}

export function getShowMetas(byShowType, show) {
    // based on show's venue and time match it with the right metas

    let meta = byShowType[show.show_type] || {};

    let overrides = meta.overrides;
    delete meta.meta;
    delete meta.overrides;

    if (overrides) {
        // find the override that matches our situation best
        let currentScore = 0;
        let matched = null;

        let mappings = {
            city: show.venue?.city,
            venue: show.venue?.name,
            time: show.ts.strftime("%H:%M"),
        };
        for (let override of overrides) {
            let matches = Object.entries(override)
                .map((field, val) => (mappings[field] || show[field]) == val)
                .filter(match => match);
            if (matches.length > currentScore) {
                matched = override;
                currentScore = matches.length;
            }
        }

        if (matched) {
            meta = {...meta, ...matched};
        }
    }

    let ticketsURL = meta.tickets || "";
    if (ticketsURL && ticketsURL.includes("tickets.edfringe.com")) {
        // fringe has brokeneth the ability to deep-link
        // ticketsURL = `${ticketsURL}?day=${show.date.strftime("%d-%m-%Y")}`;
        // metas.tickets = ticketsURL;
    }

    return meta;
}
