<script setup>
    import {computed} from "vue";

    const props = defineProps({
        blok: {
            type: Object,
            required: true,
        },
    });

    const isLink = computed(() => !!props.blok.link?.url || !!props.blok.link?.cached_url);
    const href = computed(() => {
        if (!isLink.value) return null;
        return props.blok.link.linktype === "url" ? props.blok.link.url : `/${props.blok.link.cached_url}`;
    });
    const target = computed(() => (props.blok.link?.target === "_blank" ? "_blank" : null));
</script>

<template>
    <NuxtLink :href="href" :target="target" :class="['button', `${blok.size}`, `${blok.style}`, `${blok.color}`]">
        {{ blok.label }}
    </NuxtLink>
</template>

<style>
    a.button {
        /* no colour picked in Storyblok: fall back to the section's own action */
        --btn-color: var(--cta);
        --text-color: var(--cta-text);

        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 2px solid transparent;
        border-radius: 4px;
        font-family: inherit;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.2s ease;

        /* Sizes */
        &.small {
            padding: 8px 16px;
            font-size: 14px;
        }
        &.medium {
            padding: 12px 24px;
            font-size: 16px;
        }
        &.large {
            padding: 16px 32px;
            font-size: 18px;
        }

        /* the editor picks one of the categorical accents; these mean the same
           thing on any background, so they do not follow the section theme */
        &.yellow {
            --btn-color: var(--accent-yellow);
            --text-color: var(--dark);
        }
        &.pink {
            --btn-color: var(--accent-pink);
            --text-color: var(--dark);
        }
        &.red {
            --btn-color: var(--accent-red);
            --text-color: var(--light);
        }
        &.blue {
            --btn-color: var(--accent-blue);
            --text-color: var(--light);
        }
        &.green {
            --btn-color: var(--accent-green);
            --text-color: var(--light);
        }
        &.burgundy {
            --btn-color: var(--accent-burgundy);
            --text-color: var(--light);
        }

        /* Styles */
        &.solid {
            background: var(--btn-color);
            color: var(--text-color);
            border-color: var(--btn-color);

            /* every hover states its own background: a button must not inherit one
               from whatever it happens to be sitting inside.
               hover darkens rather than lightens - four of the six colours carry
               light text, and brightening those washes the label out */
            &:hover {
                background: var(--btn-color);
                color: var(--text-color);
                border-color: var(--btn-color);
                filter: brightness(0.9);
            }
        }

        &.outline {
            background-color: transparent;
            color: var(--btn-color);
            border-color: var(--btn-color);

            &:hover {
                background: var(--btn-color);
                color: var(--text-color);
            }
        }

        &.text {
            background-color: transparent;
            color: var(--btn-color);
            border-color: transparent;
            padding-left: 0;
            padding-right: 0;

            &:hover {
                background: transparent;
                color: var(--btn-color);
                text-decoration: underline;
            }
        }
    }
</style>
