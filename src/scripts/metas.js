let byShowType = null;

export async function loadShowTypes() {
    if (byShowType) {
        return byShowType;
    }

    try {
        let metasSources = [
            "https://storage.googleapis.com/confirmed-static-api/rgb-monster/show-types.json",
            "https://storage.googleapis.com/confirmed-static-api/rgb-presents/show-types.json",
        ];

        let allShowTypes = [];

        for (let src of metasSources) {
            const response = await fetch(`${src}?rnd=${Math.round(Math.random() * 999999)}`, {credentials: "omit"});
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let showTypes = await response.json();

            showTypes = showTypes.map(showType => {
                // flatten metas into the main record
                let showTypeInfo = {...showType, ...showType.meta};
                delete showTypeInfo.meta;

                showTypeInfo.tags = (showTypeInfo.tags || []).map(tag => tag.tag);
                showTypeInfo.slug = showTypeInfo.slug || showTypeInfo.id;

                // we have bit of an ID confused here
                showTypeInfo.type = showTypeInfo.id;
                delete showTypeInfo.id;

                showTypeInfo.overrides = (showTypeInfo.overrides || []).map(rec =>
                    // filter out empty overrides
                    Object.fromEntries(Object.entries(rec).filter(([_field, val]) => val))
                );

                // prefer title over the name field
                // (title is the override while name is what we have in confirmed by default)
                showTypeInfo.title = showTypeInfo.title || showTypeInfo.name;
                delete showTypeInfo.name;

                return showTypeInfo;
            });

            allShowTypes = [...allShowTypes, ...showTypes];
        }

        byShowType = Object.fromEntries(allShowTypes.map(showType => [showType.type, showType]));
    } catch (e) {
        console.error(`Failed to fetch remote data: ${e.message}`);
        byShowType = {};
    }

    return byShowType;
}
