<script>
    export default {
        name: "Btn",
        props: {
            // these are optional props for if your button has a linkable state
            route: String,
            params: Object,
            query: Object,
            keep: Array,
            icon: String,
            filled: Boolean,
        },
        computed: {
            // we'll render link that looks like a button if button has state; otherwise it's just your regular button
            element: state => (state.route ? "Link" : "button"),
        },
    };
</script>

<template>
    <component
        :is="element"
        :route="route"
        :params="params"
        :query="query"
        :keep="keep"
        class="btn"
        :class="icon ? 'btn-icon' : ''"
    >
        <div class="button-contents">
            <Icon v-if="icon" :name="icon" :filled="filled" />
            <slot />
        </div>
    </component>
</template>

<style lang="scss">
    a.btn,
    button.btn {
        display: inline-block;
        user-select: none;
        padding: 10px 20px;

        cursor: pointer;

        /* we add a 1px margin by default as the filled style creates a halo of size
        remove the margin when your button is using a border instead; */
        margin: 1px 0;

        text-align: center;
        border: none;
        transition: background 200ms;
        color: var(--button-text);
        background: var(--button-bg);
        --button-text: var(--chrome-btn-text);
        --button-bg: var(--chrome-btn);
        --outline: var(--base);

        & > * {
            /* button itself is clickable and we do not allow any interaction within it */
            pointer-events: none;
        }

        &:hover,
        &:visited {
            /* for links make sure the visited selector doesn't override our wishes */
            color: var(--button-text);
            background: var(--button-bg);
        }

        .button-contents {
            /* the padding here is bit wonky - it has been tweaked so that input, filtered dropdown and buttons
            are all the same height */
            padding: 4.5px 20px;
            font-size: 0.75em;
            text-transform: uppercase;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        &:focus-visible {
            outline: none;

            .button-contents {
                outline: 1px dashed var(--outline);
            }
        }

        &.destructive {
            --button-bg: var(--destructive);
        }

        &.action {
            --button-bg: var(--control);
        }

        &.cancel {
            --button-bg: hsl(218, 10%, 50%);
        }

        &.outline {
            --button-text: var(--base-text);
            --button-bg: var(--input-base);
            --outline: var(--base-6);

            border: 1px solid var(--base-text);
            margin: 0;

            &:disabled,
            &.disabled {
                pointer-events: none;
                background: var(--input-base);
                opacity: 0.3;
            }

            &.destructive {
                border: 1px solid var(--destructive);
                color: var(--destructive);
            }
        }

        &.blank {
            --button-text: var(--base-text);
            --button-bg: var(--base);
            --outline: var(--base-6);

            &:focus-visible {
                outline: 1px dashed var(--outline);

                .button-contents {
                    outline: none;
                }
            }
        }

        &.link {
            display: inline-grid;
            padding: 0;
            margin: 0;
            border: none;
            color: var(--control);
            text-decoration: underline;
            background: none;
        }

        &:disabled,
        &.disabled {
            pointer-events: none;
            --button-text: var(--base-text-2);
            --button-bg: var(--base-2);
        }

        &.btn-icon {
            --button-text: var(--base-text);
            --button-bg: var(--base);
            --outline: var(--base-6);
            display: flex;
            width: auto;
            height: auto;
            padding: 0;
            border-radius: 50%;
            align-items: center;
            justify-content: center;
            background: none;

            .button-contents {
                display: flex;
                padding: 0;
                align-items: center;
                justify-content: center;
                padding: 5px;
                border-radius: 50%;
                border: 1px dashed transparent;
                font-size: 1em;
            }

            &:hover {
                background: var(--base-1);
            }

            &:focus-visible {
                .button-contents {
                    outline: none;
                    border: 1px dashed var(--base-text);
                }
            }

            &:disabled {
                opacity: 0.3;
            }
        }
    }

    button.link {
        padding: 0;

        &:disabled {
            color: var(--label);
            pointer-events: none;
        }
    }
</style>
