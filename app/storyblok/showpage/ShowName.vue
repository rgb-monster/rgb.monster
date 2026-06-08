<script>
    import {useStore} from "@/shows.js";

    export default {
        props: {
            blok: Object,
        },

        data() {
            return {
                store: useStore(),
            };
        },
        computed: {
            metas: state => state.store.currentMetas,
        },
    };
</script>

<template>
    <section class="show-name">
        <main>
            <h1>{{ blok?.title || metas.title }}</h1>
        </main>
    </section>
</template>

<style lang="css">
    .show-name {
    }
</style>
