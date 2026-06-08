<script setup>
    defineProps({blok: Object});
</script>

<template>
    <section class="toplevel" :class="[`theme-${blok.colour}`, blok.swoosh ? 'swoosh' : 'no-swoosh']" v-editable="blok">
        <div class="container" :style="{'text-align': blok.align}">
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

        a {
            font-weight: 600;
            padding: 0.1em 0.3em;
            background: var(--accent-yellow);
            color: var(--dark);

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
