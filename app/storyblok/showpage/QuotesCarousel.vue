<script>
    import {useStore} from "@/shows.js";

    export default {
        data() {
            return {
                store: useStore(),
                current: 0,
                nextTime: null,
            };
        },
        computed: {
            metas: state => state.store.currentMetas || {},
            quotes: state => state.metas.quotes || [],
        },

        methods: {
            proceed() {
                if (this.quotes.length <= 1) {
                    return;
                }

                this.current = (this.current + 1) % (this.quotes.length * 2);
                if (this.current % 2 == 1) {
                    setTimeout(() => this.proceed(), 700);
                }
            },
        },

        mounted() {
            this.nextTime = setInterval(this.proceed, 1000 * 10);
        },

        beforeUnmount() {
            clearInterval(this.nextTime);
        },
    };
</script>

<template>
    <section class="quotes-carousel" v-if="metas.quotes">
        <main>
            <div
                class="quote-container"
                ref="container"
                :class="{current: idx * 2 == current}"
                v-for="(quote, idx) in quotes"
                :key="idx"
            >
                <div class="quote">“{{ quote.quote }}”</div>
                <div class="author">
                    —{{ quote.author }}
                    <div style="display: flex; align-items: center; justify-content: end; color: var(--accent-yellow)">
                        <template v-for="star in Math.floor(quote.stars)" :key="star">★</template>
                        <span v-if="quote.stars % 1 !== 0" style="font-size: 1.5em">⯨</span>
                    </div>
                </div>
            </div>
        </main>
    </section>
</template>

<style lang="css">
    .quotes-carousel {
        font-size: 3em;
        gap: 5px;

        .inner {
            position: relative;
            display: flex;
            flex-direction: column;
        }

        .rating-stars {
            font-size: 2em;
        }

        .author {
            font-size: 0.5em;
            text-align: end;
        }

        .quote-container {
            position: absolute;
            top: 0;
            opacity: 0;
            min-width: 100%;

            transition: opacity 1000ms ease;

            &:first-child {
                position: relative;
            }

            &.current {
                opacity: 1;
            }
        }
    }
</style>
