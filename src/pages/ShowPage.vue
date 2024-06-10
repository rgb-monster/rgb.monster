<script>
    import {useStore} from "../stores/shows.js";
    import showMetas from "/src/scripts/metas.js";
    import utils from "/src/scripts/utils.js";

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

                videoPlaying: false,
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

            showsByDate() {
                let byDate = {};

                this.shows.forEach(show => {
                    utils.setDefault(byDate, show.ts.strftime("%Y-%m-%d"), {date: show.ts, shows: []}).shows.push(show);
                });

                return utils.sort(Object.values(byDate), date => date.date);
            },

            showDescription() {
                let description = this.metas.description;
                description = description.replace(/\n/g, "<br />");
                return description;
            },

            dates() {
                let byDate = {};
                this.shows.forEach(show => {
                    byDate[show.ts.strftime("%Y-%m-%d")] = show.ts;
                });

                let dates = utils.sort(Object.values(byDate));
                if (dates.length < 3) {
                    return dates.map(ts => utils.humanDate(ts)).join(", ");
                } else {
                    let [start, end] = [dates[0], dates[dates.length - 1]];
                    return `${utils.humanDate(start)} - ${utils.humanDate(end)}`;
                }
            },

            times() {
                let byTime = {};
                this.shows.forEach(show => {
                    byTime[show.ts.strftime("%H:%M")] = show.ts;
                });
                return utils.sort(Object.values(byTime), ts => ts.time()).map(ts => ts.strftime("%H:%M"));
            },
        },

        methods: {
            togglePlayback() {
                let video = this.$refs.video;
                if (video.paused || video.ended) {
                    video.play();
                    this.videoPlaying = true;

                    plausible("video-playback", {props: {video: this.metas.title}});
                } else {
                    video.pause();
                    this.videoPlaying = false;
                }
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
            <div class="contents">
                <Cover :show="metas" />
            </div>
        </section>

        <section class="title">
            <div class="contents">
                <h1 v-html="metas.formatted_title || metas.title" />

                <div class="location" :class="{'not-ready': !loaded}">
                    <div>
                        <Icon name="calendar_month" />
                        <div v-if="loaded">{{ dates }}</div>
                    </div>

                    <div>
                        <Icon name="location_on" />
                        <div v-if="loaded">Hoots@Potterrow</div>
                    </div>

                    <div>
                        <Icon name="schedule" />
                        <div v-if="loaded">{{ times[0] }}</div>
                    </div>
                </div>

                <div class="tags">
                    <div v-for="tag in metas.tags" :key="tag" :class="tag">{{ tag }}</div>
                </div>
            </div>
        </section>

        <section class="cta">
            <div class="contents">
                <button>
                    <Icon name="local_activity" />
                    Get tickets
                </button>
            </div>
        </section>

        <section class="show-description">
            <div class="contents">
                <p v-html="showDescription" />
            </div>
        </section>

        <section v-if="metas.video" class="video">
            <div class="contents">
                <button class="player" :class="{playing: videoPlaying}" @click="togglePlayback">
                    <video playsinline ref="video">
                        <source :src="metas.video" type="video/mp4" />
                    </video>
                    <button class="play-controls">
                        <div class="play-icon"><Icon name="play_arrow" /></div>
                    </button>
                </button>
            </div>
        </section>

        <section class="social-proof" v-if="metas.quotes">
            <div class="contents">
                <QuotesCarousel :quotes="metas.quotes" />
            </div>
        </section>

        <section class="dates" v-if="loaded">
            <div class="contents">
                <h2>Show dates</h2>

                <div class="date-listing">
                    <div v-for="date in showsByDate" :key="date.date">
                        <h2>{{ humanDate(date.date) }}</h2>
                        <div class="shows">
                            <div class="show-tile" v-for="show in date.shows">
                                <div class="time">{{ show.ts.strftime("%H:%M") }}</div>
                                <div class="venue">{{ show.venue.name }}</div>

                                <div class="action">Get Tickets</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style lang="scss">
    main.markdown .show-page {
        padding-bottom: 3em;
        margin: 0 auto;

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

                opacity: 1;
                transition: opacity 300ms ease;

                &.not-ready {
                    opacity: 0;
                }

                & > div {
                    display: flex;
                    align-items: end;
                    gap: 5px;
                }

                .icon {
                    // color: #000;
                    font-size: 1.25em;
                    display: flex;
                }
            }

            .tags {
                font-family: var(--rgb-font);
                color: var(--accent-pink);
                font-size: 1.25em;
                font-weight: 400;
                margin-top: 1em;

                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 20px;

                .kids {
                    color: var(--accent-yellow);
                }

                .format {
                    color: var(--accent-green);
                }

                .unique {
                    color: var(--accent-red);
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

        section.dates {
            margin: 2em 0;

            .date-listing {
                display: grid;

                gap: 1em;

                margin-top: 1em;
                text-align: left;

                h2 {
                    //background: var(--chrome-x2);
                    color: var(--chrome);
                    border-bottom: 2px solid var(--chrome);
                    text-align: left;
                    padding: 5px;
                    text-transform: uppercase;
                    margin-top: 1em;
                }

                .shows {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-top: 10px;
                }

                .show-tile {
                    background: #fff;
                    display: inline-block;
                    padding: 10px;
                    border-radius: 10px;
                    border: 1px solid var(--shadow);

                    display: grid;
                    justify-items: start;
                    gap: 10px;

                    .time {
                        font-weight: 600;
                        font-size: 2em;
                    }

                    .action {
                        color: var(--chrome-x1);
                        border: 2px solid var(--chrome-x2);
                        border-radius: 5px;
                        padding: 5px;
                    }
                }
            }
        }

        .player {
            position: relative;
            cursor: pointer;

            --button-size: min(60px, 15vw);

            .play-controls {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;

                .play-icon {
                    height: var(--button-size);
                    width: var(--button-size);

                    border-radius: 50%;

                    background: var(--accent-pink);
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    outline: min(10px, 2.5vw) solid #fff;

                    opacity: 1;
                    transition: opacity 300ms ease;

                    .icon {
                        font-size: calc(var(--button-size) * 0.8);
                        color: #fff;
                    }
                }
            }

            &.playing .play-icon {
                opacity: 0;
            }

            video {
                border-radius: 15px;

                outline: min(10px, 2.5vw) solid var(--accent-pink);
                z-index: 0;
                position: relative;
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
        }

        @media (max-width: 800px) {
            section.banner {
                padding: 0;
            }
        }
    }
</style>
