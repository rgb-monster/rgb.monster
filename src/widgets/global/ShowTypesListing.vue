<script>
    import {getShowMetas} from "../../scripts/metas.js";
    import {useStore} from "/src/stores/shows.js";
    import utils from "/src/scripts/utils.js";

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
                activeTile: "",
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
                        ...getShowMetas(this.store.remoteShowTypes, show),
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

        methods: {
            onScroll() {
                let windowHeight = window.innerHeight;
                let visibleTiles = this.$refs.tiles.filter(tile => {
                    let box = tile.$el.getBoundingClientRect();
                    return box.y > 0 && box.y + box.height < windowHeight;
                });

                let lastTile = visibleTiles.length ? visibleTiles[0] : null;

                if (lastTile) {
                    this.activeTile = lastTile.showType.slug;
                }
            },
        },

        async mounted() {
            if (utils.isTouch()) {
                // for touch interfaces we'll set the active tile whichever one is the most bottomest
                window.addEventListener("scroll", this.onScroll);
            }
            await this.store.fetchShowTypes();
            this.store.fetchShows();
        },

        beforeUnmount() {
            window.removeEventListener("scroll", this.onScroll);
        },
    };
</script>

<template>
    <section>
        <div class="contents show-types-listing">
            <ShowTypeTile
                v-for="showType in showTypes"
                ref="tiles"
                :key="showType.slug"
                :showType="showType"
                :filter="filter"
                :active="activeTile == showType.slug"
                @mouseover="activeTile = showType.slug"
                @mouseout="activeTile = null"
            />
        </div>
    </section>
</template>

<style lang="scss">
    main.markdown section .contents.show-types-listing {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1em;
        padding: 2em var(--content-horiz-padding);
        padding-bottom: 8em;

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
