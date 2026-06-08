<script setup>
    defineProps({ blok: Object });
</script>

<template>
    <div class="grid-container" v-editable="blok" :class="{vertical: blok?.vertical}">
        <StoryblokComponent
            v-for="currentBlok in blok.columns"
            :key="currentBlok._uid"
            :blok="currentBlok"
        />
    </div>
</template>

<style lang="css">
    .grid-container {
        display: flex;
        align-items: center;

        &.vertical {
            flex-direction: column;

        }
    }
</style
