import dt from "py-datetime";
import {defineStore} from "pinia";

import utils from "./utils.js";

let _showsPromise = null;

export const useStore = defineStore("shows", {
    state: () => {
        return {
            loaded: false,
            loading: true,
            shows: [], // all shows, including those without any ticket data
            allShowTypes: null, // includes archived
            filter: {},
            currentShowSlug: null,
        };
    },

    getters: {
        showTypesByID: state =>
            Object.fromEntries((state.allShowTypes || []).map(showType => [showType.type, showType])),
        showTypesBySlug: state =>
            Object.fromEntries((state.allShowTypes || []).map(showType => [showType.slug || showType.type, showType])),

        showsWithTickets: state => state.shows.filter(show => Boolean(show.tickets)),

        filteredShows() {
            let shows = this.shows;

            if (utils.isEmpty(this.filter)) {
                return shows;
            }

            let filterFuncs = {
                from: val => show => show.date >= val,
                to: val => show => show.date <= val,
                city: val => show => (show.venue?.city || "").toLowerCase() == (val || "").toLowerCase(),
            };

            let filters = Object.entries(this.filter).map(([field, val]) => {
                if (field == "slug") {
                    return () => true;
                }
                return filterFuncs[field](val);
            });

            shows = shows.filter(show => {
                for (let filterFunc of filters) {
                    if (!filterFunc(show)) {
                        return false;
                    }
                }
                return true;
            });

            return shows;
        },

        filteredShowsByType() {
            // all the shows matching the criteria, grouped by show type
            let res = {};
            for (let show of this.filteredShows) {
                let rec = utils.setDefault(res, show.type, {
                    details: {...show.metas},
                    shows: [],
                });
                rec.shows.push(show);
            }

            let byType = {};

            Object.values(res).forEach(({details, shows}) => {
                let byDate = {};
                shows.forEach(show => {
                    byDate[show.date.strftime("%Y-%m-%d")] = show.date;
                });
                let dates = utils.sort(Object.values(byDate));

                details.from = dt.datetime(Math.min(...dates));
                details.to = dt.datetime(Math.max(...dates));

                if (dates.length < 3) {
                    details.dates = dates.map(ts => utils.humanDate(ts)).join(", ");
                } else {
                    let [start, end] = [dates[0], dates[dates.length - 1]];
                    details.dates = `${start.strftime("%d %b").replace(/^0/, "")} - ${end.strftime("%d %b").replace(/^0/, "")}`;
                }

                let byTime = {};
                shows.forEach(show => {
                    byTime[show.ts.strftime("%H:%M")] = show.ts;
                });
                details.times = utils
                    .sort(Object.values(byTime), ts => ts.time())
                    .map(ts => ts.strftime("%I:%M%p").toLowerCase().replace(/^(0)/, ""));

                byType[details.type] = {details, shows};
            });

            return byType;
        },

        currentDetails: state => state.filteredShowsByType[state.showTypesBySlug[state.currentShowSlug]?.type],
        currentShows: state => state.currentDetails?.shows || [],
        currentMetas: state => state.currentDetails?.details || {},
    },

    actions: {
        setFilter(filter) {
            let filterParsers = {
                from: field => utils.parseTS((filter[field] || "").split(" ")[0]),
                to: field => utils.parseTS((filter[field] || "").split(" ")[0]),
                default: field => filter[field],
            };

            let res = {};
            for (let field of ["from", "to", "city", "show_types"]) {
                if (!utils.isEmpty(filter[field])) {
                    res[field] = (filterParsers[field] || filterParsers.default)(field);
                }
            }
            this.filter = res;
        },

        setCurrentShow(slug) {
            this.currentShowSlug = slug;
        },

        async fetchShows() {
            if (!this.loading) {
                return;
            }

            if (_showsPromise) {
                await _showsPromise;
                return;
            }

            const showTypesPromise = _getPreloadedPromise("showTypesPromise");
            const showsPromise = _getPreloadedPromise("showsPromise");

            if (!showTypesPromise || !showsPromise) {
                return;
            }

            _showsPromise = Promise.all([showTypesPromise, showsPromise])
                .then(([showTypes, showsData]) => {
                    if (typeof window !== "undefined" && window.__PRELOADED_DATA__) {
                        delete window.__PRELOADED_DATA__.showTypesPromise;
                        delete window.__PRELOADED_DATA__.showsPromise;
                    }

                    // 1. Process Show Types
                    const processedShowTypes = showTypes.map(showType => {
                        let showTypeInfo = {...showType, ...showType.meta};
                        delete showTypeInfo.meta;
                        showTypeInfo.tags = (showTypeInfo.tags || []).map(tag => tag.tag);
                        showTypeInfo.slug = showTypeInfo.slug || showTypeInfo.id;
                        showTypeInfo.type = showTypeInfo.id;
                        delete showTypeInfo.id;
                        showTypeInfo.overrides = (showTypeInfo.overrides || []).map(rec =>
                            Object.fromEntries(Object.entries(rec).filter(([_field, val]) => val))
                        );
                        showTypeInfo.title = showTypeInfo.title || showTypeInfo.name;
                        delete showTypeInfo.name;
                        return showTypeInfo;
                    });
                    this.allShowTypes = processedShowTypes;

                    // 2. Process Shows
                    let shows = showsData.map(show => {
                        show = {...show};
                        show.ts = dt.datetime.strptime(show.ts, "%Y-%m-%d %H:%M:%S");
                        if (show.ts_utc) {
                            show.ts_utc = dt.datetime.strptime(show.ts_utc, "%Y-%m-%dT%H:%M:%SZ", true);
                        } else {
                            show.ts_utc = show.ts;
                        }
                        show.date = dt.datetime.combine(show.ts, dt.time());
                        if (show.ts.hour <= 5) {
                            show.date = dt.datetime(show.date - dt.timedelta({days: 1}));
                        }
                        let showMetas = _getShowMetas(this.showTypesByID[show.show_type], show);
                        show.title = showMetas.title || show.name;
                        delete show.name;
                        let acts = [...show.acts];
                        if (show.total_act_spots > acts.length) {
                            acts.push({empty: true, count: show.total_act_spots - acts.length});
                        }
                        return {...show, ...showMetas, metas: showMetas, acts};
                    });
                    shows = utils.sort(shows, rec => rec.ts);
                    this.shows = shows;
                })
                .catch(e => {
                    this.shows = [];
                    this.allShowTypes = [];
                    console.error("Failed to resolve preloaded data:", e);
                })
                .finally(() => {
                    this.loading = false;
                });

            await _showsPromise;
        },
    },
});

function _getPreloadedPromise(key) {
    if (typeof window !== "undefined" && window.__PRELOADED_DATA__) {
        return window.__PRELOADED_DATA__[key];
    }
    return null;
}

function _getShowMetas(metas, show) {
    metas = JSON.parse(JSON.stringify(metas || {}));
    let overrides = metas.overrides;
    delete metas.overrides;
    if ((overrides || []).length) {
        // find the override that matches our situation best
        let currentScore = 0;
        let matched = {};

        let mappings = {
            city: show.venue?.city,
            venue: show.venue?.name,
            time: show.ts.strftime("%H:%M"),
        };
        for (let override of overrides) {
            let matches = Object.entries(override)
                .map(([field, val]) => (mappings[field] || show[field]) == val)
                .filter(match => match);
            if (matches.length > currentScore) {
                matched = override;
                currentScore = matches.length;
            }
        }
        Object.keys(mappings).forEach(key => {
            // make sure we don't overwrite city, venue, and time with the filter stuff
            delete matched[key];
        });

        metas = {...metas, ...matched};
    }
    return metas;
}
