<script>
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
        <h1>RGB Kids!</h1>
    </header>
</template>

<style lang="scss">
    .kids-header {
        display: grid;
        justify-content: center;
        align-items: center;
        text-align: center;

        padding: 2em 0;

        img {
            height: 200px;
        }
    }
</style>
