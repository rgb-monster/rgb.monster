<script setup>
    defineProps({blok: Object});
</script>

<template>
    <h1 class="ink-header" v-editable="blok" :style="{'text-align': blok.align || 'inherit'}">
        <div class="ink-header-contents">{{ blok.title }}</div>
    </h1>
</template>

<style lang="css">
    h1.ink-header {
        position: relative;
        font-size: var(--font-size-3xl);
        width: 100%;
        color: var(--foreground);
    }
</style>
