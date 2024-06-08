<script>
    import {useStore} from "../stores/shows.js";

    import ShowTypeTile from "../widgets/ShowTypeTile.vue";

    export default {
        name: "FringePage",
        components: {
            ShowTypeTile,
        },
        data() {
            return {
                store: useStore(),
            };
        },

        computed: {
            showTypes: state => state.store.showTypes,
        },

        mounted() {
            this.store.fetchShows();
        },
    };
</script>

<template>
    <header class="fringe-page">
        <h1>Edinburgh Fringe 2024</h1>
        <div class="all-shows">
            <template v-for="showType in showTypes" :key="showType.type">
                <ShowTypeTile :showType="showType" />
            </template>
        </div>
    </header>
</template>

<style lang="scss">
    .fringe-page {
        display: grid;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 2em 0;

        .all-shows {
            display: grid;
            grid-template-columns: repeat(4, 1fr);

            gap: 1em;

            padding: 2em var(--content-horiz-padding);
        }

        @media (max-width: 1200px) {
            .all-shows {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        @media (max-width: 900px) {
            .all-shows {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 600px) {
            .all-shows {
                grid-template-columns: repeat(1, 1fr);
            }
        }
    }
</style>
