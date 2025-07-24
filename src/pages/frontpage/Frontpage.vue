<script>
    import MailingListBox from "/src/widgets/MailingListBox.vue";
    import Stage from "/src/widgets/Stage.vue";
    import {useStore} from "/src/stores/shows.js";

    export default {
        name: "Frontpage",
        props: {
            // these are optional props for if your button has a linkable state
            slug: String,
        },
        components: {
            MailingListBox,
            Stage,
        },
        data() {
            let store = useStore();
            console.log("rrrr", store.showTypes);
            return {
                store,
            };
        },

        computed: {
            showTypes: state => state.store.showTypes,
            items: state => [
                {
                    type: "video",
                    description: `We're a comedy production company that also makes software. We're producing over 20
                                shows in fringe festivals around the world. You can catch us next at Edinburgh Festival
                                Fringe in August!`,
                    webm: "https://storage.googleapis.com/rgb-monster-assets/main/sizzle-720.webm",
                    mp4: "https://storage.googleapis.com/rgb-monster-assets/main/sizzle-720.mp4",
                },
                ...state.showTypes
                    .filter(show => !show.archived)
                    .map(show => ({
                        type: "show",
                        image: show.coverImage,
                        description: show.description || show.shortDescription,
                    })),
            ],
        },
    };
</script>

<template>
    <div class="frontpage">
        <Stage :items="items" />

        <section class="current-festival blue with-confetti">
            <InkHeader>Edinburgh Fringe 2025</InkHeader>
            <ShowTypesListing filter="Edinburgh 2025" />

            <main>
                <MailingListBox list="edinburgh">
                    <template #details>
                        We produce lots of different comedy shows, and send occasional emails with ticket offers, show
                        recommendations, and insider tips. Subscribe to our
                        <em class="red">no-spam Edinburgh Fringe Festival</em>
                        comedy mailing list and don't miss a show!
                    </template>
                </MailingListBox>
            </main>
        </section>

        <!-- <section class="monster-vision yellow with-confetti">
            <InkHeader>Photo Gallery</InkHeader>
            <main>
                <div class="tv-container">
                    <img src="/new/monstervision.webp" class="tv" />
                </div>
            </main>
        </section> -->
    </div>
</template>

<style lang="scss">
    main.markdown .frontpage {
        section.current-festival {
            padding-bottom: 50px;
            gap: 30px;

            .ink-header {
                color: var(--blue);
            }

            .cta {
                background: var(--beige);
                padding: 7px;
                width: 100%;
                text-align: center;

                .cta-inner {
                    background: var(--pink);
                    font-size: var(--h2-sizing);
                    text-transform: uppercase;
                    font-weight: 400;
                    padding: 20px 50px;
                    color: var(--beige);

                    font-family: var(--header-font);
                }
            }
        }

        .monster-vision {
            .ink-header {
                color: var(--pink);
            }

            .tv-container {
                display: grid;
                justify-content: center;

                .tv {
                    max-height: 80vh;
                    max-width: 80vw;
                }
            }
        }
    }
</style>
