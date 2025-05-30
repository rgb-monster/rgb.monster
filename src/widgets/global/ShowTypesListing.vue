<script>
    import {useStore} from "/src/stores/shows.js";
    import utils from "/src/scripts/utils.js";
    import {getShowMetas} from "/src/scripts/metas.js";

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
            shows() {
                let shows = this.store.shows;
                if (this.filter) {
                    let ids = this.store.showsSieve.filter(this.filter);
                    shows = shows.filter(show => ids.includes(show.id));
                }
                return shows;
            },

            showTypes() {
                // groups shows by type
                let byType = {};
                this.shows.forEach(show => {
                    byType[show.show_type] = byType[show.show_type] || {
                        ...getShowMetas(show),
                        title: show.title,
                        emoji: show.emoji,
                        duration: show.duration,
                        description: show.public_description,
                        shows: [],
                    };

                    byType[show.show_type].shows.push(show);
                });

                return utils.sort(
                    Object.values(byType).map(rec => ({
                        ...rec,
                        shows: utils.sort(rec.shows, show => show.ts),
                    })),
                    showType => showType.title.toLowerCase().trim()
                );
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
