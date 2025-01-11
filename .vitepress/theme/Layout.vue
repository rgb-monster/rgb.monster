<script setup>
    import {useData} from "vitepress";
    import Footer from "../../src/widgets/Footer.vue";
    import Header from "../../src/widgets/Header.vue";

    // https://vitepress.dev/reference/runtime-api#usedata
    const {site, page, frontmatter} = useData();
</script>

<template>
    <div id="popups" />
    <div class="theme-container" :class="`md-${page.relativePath.split('.')[0]}`">
        <Header v-if="frontmatter.header !== false" />

        <main class="markdown" :class="frontmatter.layout || 'normal'">
            <Content />
        </main>

        <Footer v-if="frontmatter.footer !== false" />
    </div>
</template>
