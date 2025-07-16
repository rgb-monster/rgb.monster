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
    <div class="border-box" :class="`border-${type}`">
        <div class="shadow" v-if="shadow" :class="shadow" />
        <div class="contents">
            <slot />
        </div>
    </div>
</template>

<style lang="scss">
    .border-box {
        position: relative;
        display: inline-block;
        width: 100%;
        --mask-url: url("/new/box-big.webp");

        &.border-square {
            --mask-url: url("/new/box-square.webp");
        }

        &.border-medium {
            --mask-url: url("/new/box-medium.webp");
        }

        &.border-long {
            --mask-url: url("/new/box-long.webp");
        }

        .contents {
            mask-image: var(--mask-url);
            mask-size: 100% 100%;
            mask-repeat: no-repeat;
        }

        .shadow {
            pointer-events: none;
            position: absolute;
            background: var(--mask-url);
            background-size: 100% 100%;
            height: 100%;
            width: 100%;
            top: 0px;
            left: 0px;
            filter: blur(2px);
            opacity: 0.8;

            &.faint {
                filter: blur(5px);
                opacity: 0.4;
            }
        }
    }
</style>
