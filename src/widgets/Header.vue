<script setup>
    import {useData} from "vitepress";
    const {theme, page, frontmatter} = useData();
</script>

<template>
    <header class="site">
        <a href="/fringe" :class="{current: frontmatter.page == 'fringe'}">Edinburgh Fringe 2024</a>
        <a href="/kids" :class="{current: frontmatter.page == 'kids'}">Kids</a>
        <a href="/about-us" :class="{current: frontmatter.page == 'about-us'}">About RGB Monster</a>
    </header>
</template>

<style lang="scss">
    header.site {
        display: flex;
        gap: 5px;
        z-index: 500;

        background: var(--chrome);

        // position: sticky;
        // top: 0;

        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--chrome-text);

        a {
            padding: 10px;

            font-family: var(--rgb-font);
            text-decoration: none;
            font-weight: 400;
            font-size: 1.2em;

            &.current {
                color: var(--accent-yellow);
            }
        }
    }
</style>
