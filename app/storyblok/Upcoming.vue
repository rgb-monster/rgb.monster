<script>
    import dt from "py-datetime";

    import utils from "@/utils.js";
    import {useStore} from "@/shows.js";

    export default {
        props: {
            blok: Object,
        },
        data() {
            return {
                store: useStore(),
                now: dt.datetime.utcnow(),
                ticker: null,
            };
        },

        computed: {
            loading: state => state.store.loading,

            leadMinutes: state => parseInt(state.blok.lead_time) || 30,
            wantedCount: state => parseInt(state.blok.count) || 3,
            tags: state => (state.blok.tags || []).map(tag => utils.normalize(tag)).filter(tag => tag),
            city: state => (state.blok.city || "").trim().toLowerCase(),

            // shows starting no sooner than the lead time, so there is still time to get there
            startingFrom() {
                return dt.datetime.utc(this.now + dt.timedelta({minutes: this.leadMinutes}));
            },

            candidates() {
                return this.store.shows.filter(show => {
                    if (!show.slug || show.ts_utc < this.startingFrom) {
                        return false;
                    }

                    if (!this.blok.show_unticketed && !show.tickets) {
                        return false;
                    }

                    if (this.city && (show.venue?.city || "").toLowerCase() != this.city) {
                        return false;
                    }

                    if (this.tags.length) {
                        let showTags = (show.tags || []).map(tag => utils.normalize(tag));
                        if (!showTags.some(tag => this.tags.includes(tag))) {
                            return false;
                        }
                    }

                    return true;
                });
            },

            // the soonest occurrence of each distinct show, earliest first
            upcoming() {
                let sorted = utils.sort(this.candidates, show => show.ts_utc);
                return utils.dedupe(sorted, show => show.type).slice(0, this.wantedCount);
            },
        },

        methods: {
            minutesAway(show) {
                return Math.round((show.ts_utc - this.now) / 60000);
            },

            whenLabel(show) {
                let minutes = this.minutesAway(show);
                if (minutes < 90) {
                    return `in ${utils.pluralize(minutes, "minute", "minutes")}`;
                }

                let time = show.ts.strftime("%I:%M%p").toLowerCase().replace(/^0/, "");
                let today = dt.datetime.now().date();
                let days = Math.round((show.date - dt.datetime.combine(today, dt.time())) / 86400000);

                if (days < 1) {
                    return `today, ${time}`;
                } else if (days < 2) {
                    return `tomorrow, ${time}`;
                } else {
                    return `${show.date.strftime("%a")}, ${utils.humanDate(show.date)}, ${time}`;
                }
            },

            soldOut(show) {
                return show.tickets_available != undefined && show.tickets_available <= 0;
            },

            runningLow(show) {
                return show.tickets_available != undefined && show.tickets_available > 0 && show.tickets_available < 20;
            },

            trackTickets(show) {
                if (typeof window != "undefined" && window.fbq) {
                    window.fbq("track", "InitiateCheckout", {content_name: show.slug});
                }
            },
        },

        mounted() {
            this.store.fetchShows();
            this.ticker = setInterval(() => {
                this.now = dt.datetime.utcnow();
            }, 30000);
        },

        beforeUnmount() {
            clearInterval(this.ticker);
        },
    };
</script>

<template>
    <section class="upcoming-shows" v-editable="blok" v-if="!loading && (upcoming.length || blok.empty_message)">
        <main>
            <h2 v-if="blok.title">{{ blok.title }}</h2>

            <div class="empty" v-if="!upcoming.length">{{ blok.empty_message }}</div>

            <div class="cards" v-else>
                <div class="upcoming-card panel" v-for="show in upcoming" :key="show.id">
                    <NuxtLink class="body" :href="`/${show.slug}`">
                        <div class="cover-image" v-if="show.coverThumb">
                            <img :src="show.coverThumb" alt="" />
                        </div>

                        <div class="details">
                            <div class="when">
                                {{ whenLabel(show) }}
                                <Icon name="nights_stay" class="late-night-icon" v-if="show.ts.hour <= 5" />
                            </div>

                            <div class="title" v-html="show.title" />

                            <div class="venue" v-if="show.venue">
                                <Icon name="place" />
                                {{ show.venue.name }}
                            </div>

                            <div class="tags" v-if="!isEmpty(show.tags)">
                                <div v-for="tag in show.tags.slice(0, 2)" :key="tag" :class="tag">{{ tag }}</div>
                            </div>
                        </div>
                    </NuxtLink>

                    <div class="tickets sold-out" v-if="soldOut(show)">
                        <Icon name="confirmation_number" />
                        Sold out
                    </div>

                    <a
                        class="action"
                        :href="show.tickets"
                        target="blank"
                        v-else-if="show.tickets"
                        @click="trackTickets(show)"
                    >
                        <Icon name="local_activity" />
                        {{ show.payment == "unticketed" ? "More details" : "Get tickets" }}
                        <span class="running-low" v-if="runningLow(show)">— last few left</span>
                    </a>
                </div>
            </div>
        </main>
    </section>
</template>

<style lang="css">
    .upcoming-shows {
        background: var(--bg);
        color: var(--color);

        main {
            max-width: var(--page-width);
            margin: 0 auto;
            padding: 1.5em 1.25em;
        }

        h2 {
            margin: 0 0 0.5em;
        }

        .empty {
            color: var(--color-muted);
        }

        .cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
            gap: 1em;
        }

        /* surface, border and every token inside come from .panel */
        .upcoming-card {
            border-radius: 8px;
            overflow: hidden;

            display: flex;
            flex-direction: column;
            text-align: left;

            transition: border-color 300ms ease;

            &:hover {
                border-color: var(--accent-pink);
            }

            .body {
                display: flex;
                flex-direction: column;
                flex-grow: 1;
                color: inherit;
            }

            .cover-image {
                display: flex;

                img {
                    width: 100%;
                    aspect-ratio: 16 / 9;
                    object-fit: cover;
                    object-position: center;
                }
            }

            .details {
                display: grid;
                gap: 5px;
                padding: 1rem;
                flex-grow: 1;
                align-content: start;
            }

            .when {
                font-family: var(--header-font);
                font-weight: 600;
                color: var(--color-heading);
                text-transform: uppercase;
                letter-spacing: 0.05em;
                font-size: var(--font-size-sm);

                display: flex;
                align-items: center;
                gap: 5px;
            }

            .late-night-icon {
                color: color-mix(in srgb, var(--accent-pink) 70%, var(--color));
            }

            .title {
                font-size: var(--font-size-lg);
                font-weight: 600;
                line-height: 120%;
            }

            .venue {
                color: var(--color-muted);
                font-size: var(--font-size-sm);

                display: flex;
                align-items: center;
                gap: 3px;

                .icon {
                    font-size: var(--font-size-base);
                }
            }

            .tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                font-size: var(--font-size-sm);
            }

            .action {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;

                padding: 10px;
                background: var(--cta);
                color: var(--cta-text);
                font-weight: 600;

                .running-low {
                    opacity: 0.8;
                    font-weight: 400;
                }

                &:hover {
                    filter: brightness(1.15);
                }
            }

            .tickets {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;

                padding: 10px;
                color: var(--color-muted);
                font-weight: 600;
            }
        }

        /* On a phone three stacked tiles fill the whole viewport and read as the
           end of the page. Lay each one out as a single short row instead, so all
           three plus the start of what follows are visible at once. */
        @media --break3 {
            main {
                padding: 1em;
            }

            .cards {
                grid-template-columns: 1fr;
                gap: 0.5em;
            }

            .upcoming-card {
                flex-direction: row;
                align-items: stretch;

                .body {
                    flex-direction: row;
                    align-items: stretch;
                    min-width: 0;
                }

                /* a square sliver alongside the text, rather than a band above it */
                .cover-image {
                    flex: none;
                    width: 4.5rem;

                    img {
                        height: 100%;
                        aspect-ratio: 1;
                    }
                }

                .details {
                    padding: 0.6rem 0.75rem;
                    gap: 1px;
                    min-width: 0;
                }

                .when {
                    font-size: var(--font-size-xs);
                }

                .title {
                    font-size: var(--font-size-base);
                }

                .venue {
                    font-size: var(--font-size-xs);
                }

                /* the tag is the first thing worth losing when space is short */
                .tags {
                    display: none;
                }

                .action,
                .tickets {
                    flex-direction: column;
                    gap: 2px;
                    padding: 0 0.75rem;
                    min-width: 5.5em;
                    text-align: center;
                    font-size: var(--font-size-xs);
                    line-height: 1.2;
                }

                .running-low {
                    display: none;
                }
            }
        }
    }
</style>
