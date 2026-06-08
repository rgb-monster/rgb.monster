<script setup>
    defineProps({blok: Object});
</script>

<template>
    <img v-if="blok.image?.url" class="section-image" v-editable="blok" :src="blok.image.url" :alt="blok.alt" />
</template>
