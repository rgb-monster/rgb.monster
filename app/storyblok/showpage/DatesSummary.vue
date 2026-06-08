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
    <section class="dates-summary">
        <main>
            {{ metas.dates }}
        </main>
    </section>
</template>

<style lang="css">
    .dates-summary {
        main {
            font-family: var(--rgb-font);
            color: #999;
            font-size: var(--font-size-xl);
            font-weight: 600;
            margin-top: 1em;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 0.5em;
            justify-content: center;
            opacity: 1;
        }
    }
</style>
