<script setup>
    import {useData} from "vitepress";
    const {theme, page, frontmatter} = useData();
</script>

<template>
    <header class="site">
        <a href="/whats-on" :class="{current: frontmatter.page == 'whats-on'}">What's On</a>
        <a href="/kids" :class="{current: frontmatter.page == 'kids'}">Kids</a>
        <a href="/card" :class="{current: frontmatter.page == 'card'}">Card</a>
        <a href="/fringe" :class="{current: frontmatter.page == 'fringe'}">Fringe</a>
    </header>
</template>

<style>
    header.site {
        display: flex;
        gap: 5px;

        background: var(--chrome);

        position: sticky;
        top: 0;

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
                color: red;
            }
        }
    }
</style>
