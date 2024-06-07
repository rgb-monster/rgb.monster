import axios from "axios";
import dt from "py-datetime";

import {defineStore} from "pinia";

import utils from "../scripts/utils.js";

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
                    name: show.name,
                    emoji: show.emoji,
                    duration: show.duration,
                    description: show.public_description,
                    shows: [],
                };

                byType[show.name].shows.push(show);
            });

            return utils.sort(Object.values(byType), showType => showType.name);
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

                this.shows = [...(rgb.data || []), ...(presents.data || [])].map(show => ({
                    ...show,
                    ts: utils.parseTS(show.ts),
                }));
            }
        },
    },
});
