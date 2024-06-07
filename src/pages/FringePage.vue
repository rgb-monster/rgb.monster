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
            display: grid;
            grid-template-columns: repeat(4, 1fr);

            gap: 1em;

            padding: 2em var(--content-horiz-padding);
        }
    }
</style>
