<script setup>
    import Header from "./Header.vue";
    defineProps({blok: Object});
</script>

<template>
    <section class="toplevel" :class="[`theme-${blok.colour}`, blok.swoosh ? 'swoosh' : 'no-swoosh']" v-editable="blok">
        <div
            class="container"
            :style="{
                'text-align': blok.align || 'inherit',
                'padding-top': ![undefined, null, ''].includes(blok.padding_top) ? `${blok.padding_top}px` : null,
                'padding-bottom': ![undefined, null, ''].includes(blok.padding_bottom) ? `${blok.padding_bottom}px` : null,
            }"
        >
            <Header v-if="blok.header" :blok="{title: blok.header}" />
            <StoryblokComponent v-for="currentBlok in blok.contents" :key="currentBlok._uid" :blok="currentBlok" />
            <slot />
        </div>
    </section>
</template>

<style lang="css">
    section.toplevel {
        color: var(--color);
        background-color: var(--bg);
        position: relative;
        &:first-child {
            padding-top: 1em;
        }

        &.swoosh {
            min-height: 0em;

            &::before {
                /* top swoosh */
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                height: 1em; /* Same height as before */
                transform: translateY(-80%);
                background: var(--bg);
                mask-image: url(/new/ink-swipe-top.webp);
                mask-size: cover;
                mask-position: center;
                z-index: 1; /* Make sure it's on top of previous section's content */
            }

            &::after {
                /* bottom swoosh */
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                height: 1.25em; /* Same height as before */
                transform: translateY(30%);
                background: var(--bg);
                mask-image: url(/new/ink-swipe-bottom.webp);
                mask-size: cover;
                mask-position: center;
                z-index: 10;
            }
        }

        /* prose links only. this used to apply to every <a> in the section, which
           meant it also repainted links that are whole components - buttons, show
           tiles, ticket actions - and beat their own hover styles on specificity */
        .richtext-block a {
            font-weight: 600;
            padding: 0.1em 0.3em;
            background: var(--accent);
            color: var(--accent-text);

            transition:
                background 200ms ease,
                color 200ms ease;

            &:hover {
                background: var(--color);
                color: var(--bg);
            }
        }

        .container {
            padding: 0.625em 1.25em;
            max-width: var(--page-width);
            margin: 0 auto;
        }

        &.swoosh .container {
            padding-top: 1.5em;
            padding-bottom: 1.5em;
        }

        &.no-swoosh .container {
            padding: 1.25em;
        }

        .richtext-block {
            max-width: 45em;
            padding: 1em 0;
            margin: 0 auto;
        }
    }
</style>
