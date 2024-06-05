import utils from "./utils.js";
import axios from "axios";

let currentShows;

export async function fetchShows() {
    if (currentShows == undefined) {
        let response = await axios.get("https://confirmed.show/api/v1/rgb-monster/shows.json", {withCredentials: true});
        currentShows = (response.data || []).map(show => ({
            ...show,
            ts: utils.parseTS(show.ts),
        }));
    }

    return currentShows;
}
