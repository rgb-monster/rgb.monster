<script>
    export default {
        name: "QuotesCarousel",
        props: {
            // these are optional props for if your button has a linkable state
            quotes: Array,
        },

        data() {
            return {
                current: 0,
                nextTime: null,
            };
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

                // -- in case i want a carousel after-all
                // let quote = this.$refs.container[this.current];
                // let carousel = this.$refs.carousel;
                // let x = quote.getBoundingClientRect().x - this.$refs.inner.getBoundingClientRect().x;
                // carousel.style.scrollBehavior = this.current == 0 ? "auto" : "smooth";
                // carousel.scrollTo(x, 0);
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
    <div class="quotes-carousel" ref="carousel">
        <div class="inner" ref="inner">
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
        </div>
    </div>
</template>

<style lang="scss">
    .quotes-carousel {
        //overflow: hidden;
        font-size: 3em;
        gap: 5px;

        //scroll-behavior: smooth;

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
            //color: var(--accent-blue);
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
