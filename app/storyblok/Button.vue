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
    <a :href="href" :target="target" :class="['button', `${blok.size}`, `${blok.style}`, `${blok.color}`]">
        {{ blok.label }}
    </a>
</template>

<style>
    a.button {
        --btn-color: var(--header-color);
        --btn-hover: var(--bg);
        --text-color: var(--bg);

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

        /* Color Mappings */
        &.yellow {
            --btn-color: var(--accent-yellow);
            --btn-hover: var(--accent-yellow-light);
            --text-color: #111;
        }
        &.pink {
            --btn-color: var(--accent-pink);
            --btn-hover: var(--accent-pink-light);
            --text-color: #111;
        }
        &.red {
            --btn-color: var(--accent-red);
            --btn-hover: var(--accent-red-light);
            --text-color: #fff;
        }
        &.blue {
            --btn-color: var(--accent-blue);
            --btn-hover: var(--accent-blue-light);
            --text-color: #fff;
        }
        &.green {
            --btn-color: var(--accent-green);
            --btn-hover: var(--accent-green-light);
            --text-color: #fff;
        }
        &.burgundy {
            --btn-color: var(--accent-burgundy);
            --btn-hover: var(--accent-burgundy-light);
            --text-color: #fff;
        }

        /* Styles */
        &.solid {
            background: var(--btn-color);
            color: var(--text-color);
            border-color: var(--btn-color);

            &:hover {
                background: var(--btn-hover);
                border-color: var(--btn-hover);
                color: var(--text-color);
            }
        }

        &.outline {
            background-color: transparent;
            color: var(--btn-color);
            border-color: var(--btn-color);

            &:hover {
            }
        }

        &.text {
            background-color: transparent;
            color: var(--btn-color);
            border-color: transparent;
            padding-left: 0;
            padding-right: 0;

            &:hover {
            }
        }
    }
</style>
