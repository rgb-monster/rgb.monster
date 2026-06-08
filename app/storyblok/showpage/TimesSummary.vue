<script>
    import {useStore} from "@/shows.js";

    export default {
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
    <section class="times-summary">
        <main>
            {{ metas.times.join(", ") }}
        </main>
    </section>
</template>

<style lang="css">
    .times-summary {
    }
</style>
