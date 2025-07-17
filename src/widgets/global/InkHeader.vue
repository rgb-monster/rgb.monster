<script>
    export default {
        name: "BorderBox",
        props: {
            // these are optional props for if your button has a linkable state
            type: {
                type: String,
                default: "normal",
            },
            shadow: [Boolean, String],
        },
    };
</script>

<template>
    <div class="ink-header-container">
        <div class="ink-header"><slot /></div>
    </div>
</template>

<style lang="scss">
    .ink-header-container {
        position: relative;
        font-size: var(--h2-sizing);
        height: min(3.5em, 12vw);
        width: 100%;

        .ink-header {
            position: absolute;
            left: 0;
            right: 0;
            top: -30px;

            background: var(--beige);
            mask-image: url(/new/ink-swipe.webp);
            mask-size: cover;
            mask-position: center;

            font-family: var(--header-font);
            padding: 0.7em;
            text-align: center;
            text-transform: uppercase;
        }

        @media (min-width: 1000px) {
            .ink-header {
                mask-size: 100% 100%;
            }
        }
    }
</style>
