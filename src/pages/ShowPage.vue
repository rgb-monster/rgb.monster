<script>
    import {useStore} from "../stores/shows.js";
    import showMetas from "/src/scripts/metas.js";
    // import Cover from "../widgets/Cover.vue";

    export default {
        name: "ShowPage",
        props: {
            // these are optional props for if your button has a linkable state
            id: String,
        },
        components: {
            // Cover,
        },
        data() {
            return {
                store: useStore(),
                loaded: false,
            };
        },
        computed: {
            // we'll render link that looks like a button if button has state; otherwise it's just your regular button
            metas() {
                let bySlug = Object.fromEntries(
                    Object.entries(showMetas).map(([title, meta]) => [meta.slug, {title, ...meta}])
                );
                return bySlug[this.id];
            },

            shows() {
                let showType = this.store.showTypes.find(type => type.slug == this.id);
                return showType.shows;
            },

            showDescription() {
                let description = this.metas.description;
                description = description.replace(/\n/g, "<br />");
                return description;
            },
        },

        async mounted() {
            await this.store.fetchShows();
            this.loaded = true;
        },
    };
</script>

<template>
    <div class="show-page">
        <section class="banner">
            <div class="container">
                <Cover :show="metas" />
            </div>
        </section>

        <section class="title">
            <div class="container">
                <h1>
                    {{ metas.title }}
                </h1>

                <div class="location">
                    <div>
                        <Icon name="calendar_month" />
                        Aug 2-35
                    </div>

                    <div>
                        <Icon name="location_on" />
                        Hoots@Potterrow
                    </div>

                    <div>
                        <Icon name="schedule" />
                        <div>14:00</div>
                    </div>
                </div>
            </div>
        </section>

        <section class="cta">
            <div class="container">
                <button>
                    <Icon name="local_activity" />
                    Get tickets
                </button>
            </div>
        </section>

        <section>
            <div class="container">
                <p v-html="showDescription" />
            </div>
        </section>

        <section v-if="metas.video" class="video">
            <div class="container">
                <div class="player">
                    <video playsinline>
                        <source :src="metas.video" type="video/mp4" />
                    </video>
                    <button><Icon name="play_arrow" /></button>
                </div>
            </div>
        </section>

        <section class="social-proof" v-if="metas.quotes">
            <div class="container">
                <QuotesCarousel :quotes="metas.quotes" />
            </div>
        </section>

        <section class="tickets" v-if="loaded">
            <div class="container">
                <h2>Show dates ({{ shows.length }} shows)</h2>

                <div v-for="show in shows">
                    {{ show.ts.strftime("%d %b, %H:%M") }}
                </div>
            </div>
        </section>
    </div>
</template>

<style lang="scss">
    main.markdown .show-page {
        padding-bottom: 3em;
        margin: 0 auto;

        & > * {
            max-width: var(--page-max);
        }

        section {
            max-width: none;

            .container {
                max-width: var(--page-max);
                margin: 0 auto;
                //padding: 1em 0;
                text-align: center;
            }
        }

        section.banner {
            //padding: 0;

            // background: var(--base);
            // border-bottom: 10px solid var(--accent-burgundy);
        }

        .cover {
            transition: all 300ms;
            overflow: hidden;
            border-radius: 0;
        }

        section.title {
            text-align: center;

            .location {
                font-family: var(--rgb-font);
                color: #999;
                font-size: 1.25em;
                font-weight: 400;
                margin-top: 1em;

                display: flex;
                flex-wrap: wrap;

                align-items: center;
                gap: 0.5em;
                justify-content: center;

                & > div {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .icon {
                    // color: #000;
                    font-size: 1.25em;
                }
            }
        }

        section.cta {
            button {
                background: var(--accent-burgundy);
                padding: 10px 35px;
                font-size: 1.25em;
                border-radius: 15px;
                font-weight: 600;
                color: var(--accent-burgundy);

                //text-shadow: 1px 1px #666;
                box-shadow: 0px 6px #b28b8d;

                background: #fff;
                border: 5px solid var(--accent-burgundy);

                text-transform: uppercase;
                font-weight: 600;
                letter-spacing: 0.1em;

                display: inline-flex;
                gap: 10px;
                align-items: center;

                .icon {
                    font-size: 2em;
                }

                margin-bottom: 3px;

                &:active {
                    box-shadow: none;
                    margin-top: 3px;
                    margin-bottom: 0;
                }
            }
        }

        .tickets {
            margin: 2em 0;
        }

        .player {
            position: relative;

            --button-size: 5vw;

            button {
                position: absolute;
                left: 50%;
                top: 50%;
                height: var(--button-size);
                width: var(--button-size);
                margin-left: calc(var(--button-size) / 2 * -1);
                margin-top: calc(var(--button-size) / 2 * -1);

                border-radius: 50%;

                background: var(--accent-pink);
                display: flex;
                justify-content: center;
                align-items: center;

                outline: 10px solid #fff;

                .icon {
                    font-size: calc(var(--button-size) * 0.8);
                    color: #fff;
                }
            }

            video {
                border: 10px solid var(--accent-pink);
            }
        }

        p {
            line-height: 180%;
            font-size: 1.25em;
        }

        @media (min-width: 800px) {
            .cover {
                border-radius: 15px;
            }

            video {
                border-radius: 15px;
            }
        }

        @media (max-width: 800px) {
            section.banner {
                padding: 0;
            }
        }
    }
</style>
