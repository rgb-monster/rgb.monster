import axios from "axios";
import dt from "py-datetime";

import {defineStore} from "pinia";

import utils from "../scripts/utils.js";
import {loadShowTypes, getShowMetas} from "../scripts/metas.js";
import {Sieve} from "../scripts/sieve.js";

export const useStore = defineStore("shows", {
    state: () => {
        return {
            loaded: false,
            loading: false,
            allShows: [], // all shows, including those without any ticket data
            shows: [],
            remoteShowTypes: null,
        };
    },

    getters: {
        showsSieve() {
            let shows = this.shows;
            let serialized = shows.map(show => {
                return {
                    id: show.id,
                    city: show.venue.city,
                    venue: show.venue.name,
                    acts: show.acts.map(act => act.name),
                    ts: show.ts.strftime("%A %B %d %Y %H:%M").split(" "),
                    ts_str: show.ts.strftime("%A %b %d %Y %H:%M"),
                };
            });
            return new Sieve(serialized);
        },

        showTypes() {
            // groups shows by type
            let byType = {};
            this.shows.forEach(show => {
                if (!byType[show.show_type]) {
                    byType[show.show_type] = {
                        ...getShowMetas(this.remoteShowTypes, show),
                        title: show.title,
                        emoji: show.emoji,
                        duration: show.duration,
                        description: show.public_description,
                        shows: [],
                    };
                }

                byType[show.show_type].shows.push(show);
            });

            return utils.sort(
                Object.values(byType).map(rec => ({
                    ...rec,
                    shows: utils.sort(rec.shows, show => show.ts),
                })),
                showType => showType.name
            );
        },

        showsByTag() {
            let byTag = {};
            this.shows.forEach(show => {
                show.tags.forEach(tag => {
                    utils.setDefault(byTag, tag, []).push(show);
                });
            });

            return byTag;
        },
    },

    actions: {
        async fetchShowTypes() {
            if (this.remoteShowTypes) {
                return this.remoteShowTypes;
            }
            this.remoteShowTypes = await loadShowTypes();
        },

        async fetchShows() {
            if (!this.loaded && !this.loading) {
                this.loading = true;

                let sources = [
                    "https://confirmed.show/api/v1/rgb-monster/shows.json",
                    "https://confirmed.show/api/v1/rgb-presents/shows.json",
                    "https://confirmed.show/api/v1/bowtie/shows.json",
                ];

                await this.fetchShowTypes();

                let data = [];
                for (let source of sources) {
                    let response = await axios.get(source);
                    data = [...data, ...(response.data || [])];
                }

                this.shows = data.map(show => {
                    show.ts = dt.datetime.strptime(show.ts, "%Y-%m-%d %H:%M:%S");
                    if (show.ts_utc) {
                        show.ts_utc = dt.datetime.strptime(show.ts_utc, "%Y-%m-%d %H:%M:%S", true);
                    } else {
                        show.ts_utc = show.ts; // in absence of ts_utc (meaning we don't have a timezone, use ts as tsutc)
                    }

                    show.date = dt.datetime.combine(show.ts, dt.time());

                    if (show.ts.hour <= 5) {
                        show.date = dt.datetime(show.date - dt.timedelta({days: 1}));
                    }

                    let metas = getShowMetas(this.remoteShowTypes, show);

                    // name -> title (we have both of them and that then becomes awfully confusing)
                    // we want to use the metas one where available as that allows overriding act/production-facing
                    // title for cosmetic reasons
                    show.title = metas.title || show.name;
                    delete show.name;

                    if (!metas) {
                        return show;
                    }

                    let acts = show.acts;
                    if (show.total_act_spots > acts.length) {
                        acts.push({empty: true, count: show.total_act_spots - acts.length});
                    }

                    return {...show, ...metas, metas, acts};
                });

                this.allShows = [...this.shows];

                // filter shows down to only those that we have tickets for - otherwise we have a listing that's pointing to nothing
                this.shows = this.shows.filter(show => show.tickets);

                this.loaded = true;
                this.loading = false;
                return this.shows;
            } else if (this.loading) {
                // we sit here till shows have loaded, otherwise we can't fullfill the request
                while (this.loading) {
                    await utils.sleep(0.2);
                }

                return this.shows;
            }
        },
    },
});
