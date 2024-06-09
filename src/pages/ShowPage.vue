<script>
    import {useStore} from "../stores/shows.js";
    import showMetas from "/src/scripts/metas.js";
    // import Cover from "../widgets/Cover.vue";

    export default {
        name: "ShowPage",
        props: {
            // these are optional props for if your button has a linkable state
            id: String,
        },
        components: {
            // Cover,
        },
        data() {
            return {
                store: useStore(),
                loaded: false,
            };
        },
        computed: {
            // we'll render link that looks like a button if button has state; otherwise it's just your regular button
            metas() {
                let bySlug = Object.fromEntries(
                    Object.entries(showMetas).map(([title, meta]) => [meta.slug, {title, ...meta}])
                );
                return bySlug[this.id];
            },

            shows() {
                let showType = this.store.showTypes.find(type => type.slug == this.id);
                return showType.shows;
            },
        },

        async mounted() {
            await this.store.fetchShows();
            this.loaded = true;
        },
    };
</script>

<template>
    <div class="show-page">
        <Cover :show="metas" />

        <h1 class="standalone">
            {{ metas.title }}
        </h1>

        <p>
            {{ metas.description }}
        </p>

        <section class="tickets" v-if="loaded">
            <h2>Get tickets ({{ shows.length }} shows)</h2>

            <div v-for="show in shows">
                {{ show.ts.strftime("%d %b, %H:%M") }}
            </div>
        </section>
    </div>
</template>

<style lang="scss">
    .show-page {
        padding-bottom: 3em;

        .tickets {
            margin: 2em 0;
        }
    }
</style>
