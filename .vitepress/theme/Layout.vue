<script setup>
    import {useData} from "vitepress";
    import Footer from "../../src/widgets/Footer.vue";
    import Header from "../../src/widgets/Header.vue";

    // https://vitepress.dev/reference/runtime-api#usedata
    const {site, frontmatter} = useData();

    // <div v-if="frontmatter.home">do something special</div>
</script>

<template>
    <div class="theme-container">
        <Header v-if="frontmatter.header !== false" />

        <main class="markdown" :class="frontmatter.layout || 'normal'">
            <Content />
        </main>

        <Footer v-if="frontmatter.footer !== false" />
    </div>
</template>
