<script>
    import {useStore} from "../stores/shows.js";

    export default {
        name: "KidsPage",
        props: {
            // these are optional props for if your button has a linkable state
            route: String,
            params: Object,
            query: Object,
            keep: Array,
            icon: String,
            filled: Boolean,
        },
        computed: {
            // we'll render link that looks like a button if button has state; otherwise it's just your regular button
            element: state => (state.route ? "Link" : "button"),
        },
    };
</script>

<template>
    <header class="kids-header">
        <img src="/rgb-kids.png" />
        <h1 class="standalone">RGB Monster Kids Shows of Edinburgh Fringe 2024</h1>
    </header>
</template>

<style lang="scss">
    header.kids-header {
        display: grid;
        align-items: center;
        justify-items: center;
        text-align: center;
        gap: 1em;

        padding: 2em 0;

        img {
            height: 200px;
        }

        h1 {
            font-size: 4em;
            line-height: 100%;
        }
    }
</style>
