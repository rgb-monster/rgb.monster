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
    <section class="banner">
        <main>
            <img :src="metas.coverImage" />
        </main>
    </section>
</template>

<style lang="css">
    .banner {
        padding: 20px 0;
        main {
            max-width: var(--within-curtains);
            padding-bottom: 0;

            img {
                border-radius: 15px;
            }
        }
    }
</style>
