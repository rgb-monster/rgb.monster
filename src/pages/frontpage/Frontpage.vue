<script>
    import Stage from "./Stage.vue";

    export default {
        name: "Frontpage",
        props: {
            // these are optional props for if your button has a linkable state
            slug: String,
        },
        components: {
            Stage,
        },
        data() {
            return {};
        },
    };
</script>

<template>
    <div class="frontpage">
        <Stage />

        <section class="current-festival blue with-confetti">
            <InkHeader>Edinburgh Fringe 2025</InkHeader>
            <ShowTypesListing filter="Edinburgh 2025" />

            <main style="max-width: 1200px; margin: 0 auto">
                <BorderBox type="long" shadow="faint">
                    <button class="cta">
                        <BorderBox type="long">
                            <div class="cta-inner">Click Here to See All Our Shows</div>
                        </BorderBox>
                    </button>
                </BorderBox>
            </main>
        </section>



        <section class="monster-vision yellow with-confetti">
            <InkHeader>Photo Gallery</InkHeader>
            <main>
                <img src="/new/monstervision.webp" />
            </main>
        </section>
    </div>
</template>

<style lang="scss">
    main.markdown .frontpage {
        font-family: var(--rgb-font);

        section {
            main {
                max-width: 1200px;
                position: relative;
                margin: 0 auto;
                padding-bottom: 80px;
            }

            &.yellow {
                background-color: var(--yellow);
            }

            &.blue {
                background-color: var(--blue);
            }

            &.ping {
                background-color: var(--blue);
            }

            &.with-confetti {
                @include mixins.confetti;
            }
        }

        section.current-festival {
            padding-bottom: 50px;
            gap: 30px;

            h2 {
                background: var(--beige);
                color: var(--blue);
            }

            main {
                padding: 50px 0;
            }

            .cta {
                background: var(--beige);
                padding: 7px;
                width: 100%;
                text-align: center;

                .cta-inner {
                    background: var(--pink);
                    font-size: 2em;
                    text-transform: uppercase;
                    font-weight: 400;
                    padding: 20px 50px;
                    color: var(--beige);

                    font-family: var(--rgb-font);
                }
            }
        }
    }
</style>
