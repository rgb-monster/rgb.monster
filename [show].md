---
title: Show details
page: whats-on
---

<script setup>
    import ShowPage from "/src/pages/ShowPage.vue";
    import { useData } from 'vitepress'
    const { params } = useData();
    let showSlug = params.value.show;
</script>

<ShowPage :id="showSlug" />
