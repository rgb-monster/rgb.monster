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
            showDescription() {
                let description = this.metas.description || "";
                description = description.replace(/\n/g, "<br />");
                return description;
            },
        },
    };
</script>

<template>
    <section class="show-description">
        <main v-html="showDescription" />
    </section>
</template>

<style lang="css">
    .show-description {
    }
</style>
