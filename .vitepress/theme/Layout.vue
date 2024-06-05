<script setup>
    import {useData} from "vitepress";

    // https://vitepress.dev/reference/runtime-api#usedata
    const {site, frontmatter} = useData();

    // <div v-if="frontmatter.home">do something special</div>
</script>

<template>
    <Content />
</template>
