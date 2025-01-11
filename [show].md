---
title: Show Details
page: show-details
footer: light
---

<script setup>
    import ShowPage from "/src/pages/ShowPage.vue";
    import { useData } from 'vitepress'
    const { params } = useData();
    let showSlug = params.value.show;
</script>

<ShowPage :slug="showSlug" />
