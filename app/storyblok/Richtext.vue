<script setup>
    import {computed} from "vue";
    import {renderRichText} from "@storyblok/vue";

    let props = defineProps({blok: Object});
    let resolvedRichText = computed(() => {
        return renderRichText(props.blok.contents);
    });
</script>

<template>
    <div class="richtext-block" v-editable="blok" :style="{'text-align': blok.align}" v-html="resolvedRichText" />
</template>

<style lang="css">
    .richtext-block {
        p {
            padding-top: 0.5em;
            padding-bottom: 0.5em;
            line-height: 150%;

            &:first-child {
                padding-top: 0;
            }

            &:last-child {
                padding-bottom: 0;
            }
        }

        h1,
        h2 {
            color: var(--header-color);
            font-family: var(--header-font);
            font-weight: 600;

            text-transform: uppercase;
            text-align: center;
            letter-spacing: 0.025em;
            line-height: 90%;
        }

        h2 {
            font-size: var(--font-size-2xl);
            margin-top: 2em;
        }
    }
</style>
