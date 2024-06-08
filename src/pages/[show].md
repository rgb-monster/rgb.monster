---
title: Show details
page: whats-on
---

<script setup>
    import { useData } from 'vitepress'
    const { params } = useData()

    import showMetas from "../scripts/metas.js";
    let bySlug = Object.fromEntries(Object.entries(showMetas).map(([title, meta]) => [meta.slug, {title, ...meta}]));
    let meta = bySlug[params.value.show];
</script>

<Cover :show="meta" />

::: section

# {{ meta.title }}

{{ meta.description }}

:::
