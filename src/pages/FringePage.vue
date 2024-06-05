<script>
    import {fetchShows} from "../scripts/show-utils.js";
    import utils from "../scripts/utils.js";

    export default {
        name: "FringePage",
        data() {
            return {
                loaded: false,
                shows: [],
            };
        },

        async mounted() {
            let shows = await fetchShows();
            shows = shows.filter(show => show.venue?.city == "Edinburgh");
            this.shows = utils.sort(shows, show => show.ts);
        },
    };
</script>

<template>
    <header class="fringe-page">
        <h1>Edinburgh Fringe 2024</h1>
        <div class="all-shows">
            <template v-for="show in shows" :key="show.id">
                <div>
                    {{ show.ts.strftime("%b %d, %H:%M") }}
                    {{ show.name }}
                </div>
            </template>
        </div>
    </header>
</template>

<style type="text/scss">
    .fringe-page {
        display: grid;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 2em 0;

        img {
            height: 200px;
        }

        .all-shows {
            display: flex;
            flex-wrap: wrap;
            gap: 1em;

            padding: 2em var(--content-horiz-padding);

            & > div {
                border: 1px solid #ccc;
                padding: 5px;
            }
        }
    }
</style>
