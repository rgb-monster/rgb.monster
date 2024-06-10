import axios from "axios";
import dt from "py-datetime";

import {defineStore} from "pinia";

import utils from "../scripts/utils.js";
import showMetas from "/src/scripts/metas.js";

export const useStore = defineStore("shows", {
    state: () => {
        return {
            loaded: false,
            shows: [],
        };
    },

    getters: {
        showTypes() {
            // groups shows by type
            let byType = {};
            this.shows.forEach(show => {
                byType[show.name] = byType[show.name] || {
                    ...showMetas[show.name],
                    title: show.name,
                    name: show.name,
                    emoji: show.emoji,
                    duration: show.duration,
                    description: show.public_description,
                    shows: [],
                };

                byType[show.name].shows.push(show);
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
        async fetchShows() {
            if (!this.loaded) {
                let rgb = await axios.get("https://confirmed.show/api/v1/rgb-monster/shows.json", {
                    withCredentials: true,
                });
                let presents = await axios.get("https://confirmed.show/api/v1/rgb-presents/shows.json", {
                    withCredentials: true,
                });

                this.shows = [...(rgb.data || []), ...(presents.data || [])].map(show => {
                    let ts = utils.parseTS(show.ts);
                    let metas = showMetas[show.name];
                    let tickets = metas.tickets;
                    if (typeof tickets != "string") {
                        // we have ourselves something more convoluted
                        tickets = tickets.filter(
                            rec =>
                                (!rec.venue || rec.venue == show.venue.name) &&
                                (!rec.time || rec.time == ts.strftime("%H:%M"))
                        );
                        if (tickets.length == 1) {
                            tickets = tickets[0].url;
                            if (tickets.includes("tickets.edfringe.com")) {
                                tickets = `${tickets}?day=${ts.strftime('%d-%m-%Y')}`
                            }
                        } else {
                            tickets = null;
                            console.error(
                                "Could not find ticket url for show",
                                show.venue.name,
                                ts.strftime("%H:%M")
                            );
                        }
                    }

                    return {...show, ts, tickets};
                });
            }
        },
    },
});
