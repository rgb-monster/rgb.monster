<script>
    import dt from "py-datetime";

    import {useStore} from "../stores/shows.js";
    import utils from "/src/scripts/utils.js";
    import {Sieve} from "/src/scripts/sieve.js";
    import {metas} from "/src/scripts/metas.js";

    export default {
        name: "ThanksPage",
        data() {
            return {
                store: useStore(),

                loaded: false,
                notFound: false,
                show: null,
            };
        },
        computed: {
            searchParams() {
                let windowHandle;
                try {
                    windowHandle = window;
                } catch (error) {
                    // pass
                }
                if (windowHandle) {
                    return new URLSearchParams(windowHandle.location.search);
                } else {
                    return new URLSearchParams("");
                }
            },
            slug: state => state.searchParams.get("show"),
            showID: state => state.searchParams.get("id"),

            shows: state => state.store.allShows,

            showsSieve() {
                let shows = this.store.shows.filter(show => show.slug == this.slug);
                let serialized = shows.map(show => {
                    return {
                        id: show.id,
                        city: show.venue.city,
                        venue: show.venue.name,
                        acts: show.acts.map(act => act.name),
                        ts: show.ts.strftime("%A %B %d %Y %H:%M").split(" "),
                        ts_str: show.ts.strftime("%A %b %d %Y %H:%M"),
                    };
                });
                return new Sieve(serialized);
            },
        },

        methods: {
            redirectToMostRecent() {
                // if we don't have a show id, we determine which show just ended (last 15 minutes?)
                // and then redirect to that;
                let now = dt.datetime.utcnow();

                // filter down to shows that have started already, as you can't have possibly seen a future show
                let shows = this.shows.filter(show => show.ts_utc < now);

                // sort by most recent first
                let mostRecent = utils.sort(shows, show => -show.ts_utc)[0];
                let elapsedHours = mostRecent ? dt.timedelta(now - mostRecent.ts_utc).totalSeconds() / 60 / 60 : null;

                if ((elapsedHours !== null && elapsedHours <= 5) || true) {
                    this.show = mostRecent;
                    window.history.replaceState(null, null, `${window.location.origin}/thanks?id=${this.show.id}`);
                }
            },
        },

        async mounted() {
            await this.store.fetchShows();
            if (!this.showID) {
                this.redirectToMostRecent();
            } else {
                this.show = this.shows.find(show => show.id == this.showID);
            }

            this.loaded = true;
        },

        beforeUnmount() {},
    };
</script>

<template>
    <div class="thanks-page">
        <template v-if="!loaded"> <h1>Loading...</h1></template>
        <template v-else-if="!show">
            <h1>No recent shows!</h1>
        </template>

        <template v-else>
            <img class="splash" :src="show.cover_thumb" />

            <div class="message-container">
                <h1>Thank you for coming to the show!</h1>

                <template v-for="category in ['acts', 'hosts']" :key="category">
                    <div class="act-listing">
                        <h2 v-if="category == 'acts'">Today you saw these fantastic acts</h2>
                        <h2 v-if="category == 'hosts'">And your hosts!</h2>

                        <template v-for="(act, idx) in show[category]" :key="act">
                            <div>
                                <img v-if="act.headshot" :src="`${act.headshot}-thumb`" class="headshot" />
                                <img v-else src="/monster.webp" class="headshot placeholder" />
                            </div>
                            <div class="about-act">
                                <div>{{ act.name }}</div>

                                <div v-if="act.plug">
                                </div>

                                <div v-else>
                                    {{ act.name.split(" ")[0] }}
                                </div>
                            </div>
                        </template>
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<style lang="scss">
    .theme-container.md-thanks {
        background: #333;
        color: var(--light);

        h1,
        h2 {
            color: var(--light);
        }

        footer {
            background: #333;
        }
    }

    main.markdown .thanks-page {
        padding-bottom: 3em;
        margin: 0 auto;
        --square-size: 60px;

        .message-container {
            padding: var(--content-horiz-padding);
        }

        .act-listing {
            display: grid;
            grid-template-columns: auto 1fr;
            margin-top: 1em;
            gap: 10px;
            align-items: center;

            h2 {
                grid-column: 1/-1;
            }
        }

        .headshot {
            border-radius: 50%;
            max-height: 90px;

            &.placeholder {
                background: var(--accent-burgundy);
                padding: 10px;
            }
        }
    }
</style>
