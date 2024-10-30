<script>
    import {useStore} from "/src/stores/shows.js";
    import {Sieve} from "/src/scripts/sieve.js";

    import ShowTypeTile from "/src/widgets/ShowTypeTile.vue";

    export default {
        name: "ShowTypesListing",
        props: {
            filter: String,
        },
        components: {
            ShowTypeTile,
        },
        data() {
            return {
                store: useStore(),
            };
        },

        computed: {
            showTypesSieve() {
                return new Sieve(
                    this.store.showTypes.map(showType => {
                        let shows = showType.shows;
                        return {
                            ...showType,
                            shows: null, // reset shows so we don't go traversing
                            id: showType.slug,
                            cities: shows.map(show => show.venue.city),
                            venues: shows.map(show => show.venue.name),
                            acts: [...new Set(shows.map(show => show.acts.map(act => act.name)).flat())],
                            ts: shows.map(show => show.ts.strftime("%A %B %d %Y %H:%M").split(" ")).flat(),
                            ts_str: shows.map(show => show.ts.strftime("%A %b %d %Y %H:%M")),
                        };
                    })
                );
            },

            showTypes() {
                let showTypes = this.store.showTypes;
                if (this.filter) {
                    let slugs = this.showTypesSieve.filter(this.filter);
                    showTypes = showTypes.filter(showType => slugs.includes(showType.slug));
                }
                return showTypes;
            },
        },

        mounted() {
            this.store.fetchShows();
        },
    };
</script>

<template>
    <section>
        <div class="contents show-types-listing">
            <ShowTypeTile v-for="showType in showTypes" :key="showType.type" :showType="showType" :filter="filter" />
        </div>
    </section>
</template>

<style lang="scss">
    .show-types-listing {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1em;
        padding: 2em var(--content-horiz-padding);

        @media (max-width: 1000px) {
            grid-template-columns: repeat(3, 1fr);
        }

        @media (max-width: 800px) {
            grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width: 600px) {
            grid-template-columns: repeat(1, 1fr);
        }
    }
</style>
