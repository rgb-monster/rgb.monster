<script setup>
    import {useStore} from "@/shows.js";
    const currentYear = new Date().getFullYear();
    const store = useStore();
</script>
<template>
    <slot></slot>
    <footer v-if="!store.loading" class="swoosh">
        <div class="container">&copy; {{ currentYear }} RGB Monster</div>
    </footer>
</template>

<style lang="css">
    footer.swoosh {
        position: relative;
        background: var(--dark);
        color: var(--light);
        text-align: center;
        font-family: var(--header-font);
        text-transform: uppercase;

        .container {
            padding: 1.25em;
        }

        &::before {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            height: 1em;
            transform: translateY(-50%);
            background: var(--dark);
            mask-image: url(/new/ink-swipe-top.webp);
            mask-size: cover;
            mask-position: center;
            z-index: 20;
        }
    }
</style>
