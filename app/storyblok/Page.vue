<script setup>
    defineProps({blok: Object});
</script>

<template>
    <main v-editable="blok" class="page" :class="`theme-${blok.colour}`">
        <StoryblokComponent v-for="currentBlok in blok.body" :key="currentBlok._uid" :blok="currentBlok" />
    </main>
</template>
