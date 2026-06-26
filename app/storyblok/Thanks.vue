<script>
    import dt from "py-datetime";
    import {useStore} from "@/shows.js";
    import utils from "@/utils.js";
    import Mailinglist from "./Mailinglist.vue";

    export default {
        components: {
            Mailinglist,
        },
        props: {
            blok: Object,
        },
        data() {
            return {
                store: useStore(),

                loading: true,
                notFound: false,
                show: null,

                socialURLs: {
                    twitter: handle => `https://x.com/${handle}`,
                    instagram: handle => `https://instagram.com/${handle}`,
                    tiktok: handle => `https://tiktok.com/@${handle}`,
                    facebook: handle => `https://facebook.com/${handle}`,
                    website: url => (url.startsWith("http") ? url : `https://${url}`),
                },
                socialIcons: {
                    instagram:
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M 21.580078 7 C 13.541078 7 7 13.544938 7 21.585938 L 7 42.417969 C 7 50.457969 13.544938 57 21.585938 57 L 42.417969 57 C 50.457969 57 57 50.455062 57 42.414062 L 57 21.580078 C 57 13.541078 50.455062 7 42.414062 7 L 21.580078 7 z M 47 15 C 48.104 15 49 15.896 49 17 C 49 18.104 48.104 19 47 19 C 45.896 19 45 18.104 45 17 C 45 15.896 45.896 15 47 15 z M 32 19 C 39.17 19 45 24.83 45 32 C 45 39.17 39.169 45 32 45 C 24.83 45 19 39.169 19 32 C 19 24.831 24.83 19 32 19 z M 32 23 C 27.029 23 23 27.029 23 32 C 23 36.971 27.029 41 32 41 C 36.971 41 41 36.971 41 32 C 41 27.029 36.971 23 32 23 z"/></svg>',
                    tiktok: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M48,8H16c-4.418,0-8,3.582-8,8v32c0,4.418,3.582,8,8,8h32c4.418,0,8-3.582,8-8V16C56,11.582,52.418,8,48,8z M50,27 c-3.964,0-6.885-1.09-9-2.695V38.5C41,44.841,35.841,50,29.5,50S18,44.841,18,38.5S23.159,27,29.5,27h2v5h-2 c-3.584,0-6.5,2.916-6.5,6.5s2.916,6.5,6.5,6.5s6.5-2.916,6.5-6.5V14h5c0.018,1.323,0.533,8,9,8V27z"/></svg>',
                    twitter:
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M32,6C17.641,6,6,17.641,6,32c0,14.359,11.641,26,26,26s26-11.641,26-26C58,17.641,46.359,6,32,6z M44.927,26.226 c0.012,0.271,0.017,0.543,0.017,0.816c0,8.34-6.189,17.958-17.51,17.958c-3.476,0-6.711-1.045-9.435-2.835 c0.482,0.059,0.973,0.089,1.469,0.089c2.884,0,5.538-1.009,7.644-2.702c-2.693-0.051-4.966-1.877-5.749-4.384 c0.375,0.072,0.761,0.112,1.157,0.112c0.562,0,1.107-0.077,1.622-0.221c-2.816-0.579-4.937-3.13-4.937-6.188 c0-0.027,0-0.052,0-0.079c0.83,0.472,1.779,0.756,2.788,0.789c-1.651-1.131-2.737-3.063-2.737-5.252 c0-1.158,0.303-2.242,0.832-3.175c3.037,3.819,7.571,6.333,12.686,6.595c-0.104-0.46-0.159-0.943-0.159-1.438 c0-3.485,2.755-6.311,6.154-6.311c1.77,0,3.369,0.767,4.492,1.994c1.403-0.284,2.721-0.809,3.909-1.532 c-0.459,1.474-1.434,2.711-2.706,3.492C45.71,23.8,46.896,23.462,48,22.959C47.175,24.224,46.131,25.335,44.927,26.226z"/></svg>',
                    facebook:
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M32,6C17.641,6,6,17.641,6,32c0,12.999,9.54,23.769,22,25.693V40h-6v-7h6v-5c0-7,4-11,10-11c3.133,0,5,1,5,1v6h-4 c-2.86,0-4,2.093-4,4v5h7l-1,7h-6v17.822C47.945,56.334,58,45.344,58,32C58,17.641,46.359,6,32,6z"/></svg>',
                    website:
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10,10-4.48,10-10S17.52,2,12,2Zm-1,17.93c-3.95-.49-7-3.85-7-7.93,0-.62,.08-1.21,.21-1.79l5.79,5.79v1c0,1.1,.9,2,2,2v.93Zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55,0,1-.45,1-1V7h2c1.1,0,2-.9,2-2v-.41c2.93,1.19,5,4.06,5,7.41,0,2.08-.8,3.97-2.1,5.39Z"/></svg>',
                },
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
            showType: state => state.searchParams.get("type"),
            showID: state => state.searchParams.get("id"),

            // "before" => the show you're about to see (welcome), "after" => the show you just saw (thanks)
            isBefore() {
                return this.blok.timing == "before";
            },

            // "Today" only reads right in the afternoon — phrase it by the show's start hour
            actTime() {
                let hours = this.show?.ts.hour;
                return hours < 12 ? "This morning" : hours < 17 ? "Today" : "This evening";
            },
            // lowercase variant for mid-sentence use, e.g. "your hosts this evening"
            hostTime() {
                let hours = this.show?.ts.hour;
                return hours < 12 ? "morning" : hours < 17 ? "afternoon" : "evening";
            },

            shows: state => state.store.filteredShows,

            mailinglist() {
                let city = (this.show.venue?.city || "").toLowerCase().trim();
                let showType = (this.show.show_type || "").toLowerCase().trim();

                let knownCities = ["edinburgh", "perth", "adelaide", "brighton", "melbourne", "london"];

                let listName;
                if (showType.includes("ollie")) {
                    listName = "ollie";
                } else if (knownCities.includes(city)) {
                    listName = city;
                }
                return {tag: listName, tags: [showType]};
            },
        },

        methods: {
            selectShow(show) {
                this.show = show;
                window.history.replaceState(
                    null,
                    null,
                    `${window.location.origin}${window.location.pathname}?id=${this.show.id}`
                );
            },

            async loadShow() {
                await this.store.fetchShows();

                if (this.showID) {
                    let show = this.shows.find(show => show.id == this.showID);
                    if (show) {
                        this.selectShow(show);
                    } else {
                        this.show = null;
                    }
                    this.loading = false;

                    return;
                }

                let now = dt.datetime.utcnow();
                let shows;
                if (this.isBefore) {
                    // before: shows that haven't ended yet (about to see / in progress)
                    shows = this.shows.filter(
                        show => dt.datetime(show.ts_utc + dt.timedelta({minutes: show.duration - 10})) >= now
                    );
                    // sort by soonest first
                    shows = utils.sort(shows, show => show.ts_utc);
                } else {
                    // after: shows that have already ended (just saw)
                    shows = this.shows.filter(
                        show => dt.datetime(show.ts_utc + dt.timedelta({minutes: show.duration - 10})) < now
                    );
                    // sort by most recent first
                    shows = utils.sort(shows, show => -show.ts_utc);
                }

                shows.forEach(show => {
                    // filter out empty acts
                    show.acts = show.acts.filter(act => act.name);
                });

                if (this.showType) {
                    // filter by show type if provided
                    shows = shows.filter(show => show.show_type == this.showType);
                } else {
                    // otherwise grab the nearest one that we haven't told to be excluded
                    shows = shows.filter(show => !show.excludeThanks);
                }

                if (shows.length) {
                    this.selectShow(shows[0]);
                }

                this.loading = false;
            },
        },

        async mounted() {
            await this.loadShow();
        },
    };
</script>

<template>
    <section class="thanks-block center">
        <div v-if="loading || isEmpty(shows) || !show" class="loading-indicator">
            <h1 v-if="loading">Loading...</h1>
            <h1 v-else-if="isEmpty(shows)">{{ isBefore ? "No upcoming shows!" : "No recent shows!" }}</h1>
            <h1 v-else-if="!show">Could not find show!</h1>
        </div>

        <main v-else>
            <div class="splash">
                <img :src="show.coverThumb" />
            </div>

            <h1 v-if="isBefore">
                Welcome to <em>{{ show.title }}</em> on<br />
                <em>{{ humanTs(show.ts) }}</em>
            </h1>
            <h1 v-else>
                Thank you for coming to <em>{{ show.title }}</em> on<br />
                <em>{{ humanTs(show.ts) }}</em>
            </h1>

            <template v-for="category in ['acts', 'hosts']" :key="category">
                <div class="act-listing">
                    <h2 v-if="category == 'acts'">
                        {{ isBefore ? "You are about to see the following acts!" : `${actTime} you saw these acts!` }}
                    </h2>
                    <h2 v-if="category == 'hosts' && show.hosts.length > 1">And your hosts this {{ hostTime }}!</h2>
                    <h2 v-else-if="category == 'hosts' && show.hosts.length == 1">
                        And your host this {{ hostTime }}!
                    </h2>

                    <template v-for="(act, idx) in show[category]" :key="act">
                        <template v-if="act.name">
                            <div>
                                <img v-if="act.headshot" :src="`${act.headshot}-thumb`" class="headshot" />
                                <img v-else src="/monster.webp" class="headshot placeholder" />
                            </div>
                            <div class="about-act">
                                <div class="act-name">{{ act.name }}</div>
                                <div class="linkage">
                                    <a v-if="act.website" :href="socialURLs.website(act.website)" target="_blank">
                                        <div v-html="socialIcons.website" class="social-icon" />
                                    </a>

                                    <template
                                        v-for="social in ['instagram', 'tiktok', 'twitter', 'facebook']"
                                        :key="social"
                                    >
                                        <a v-if="act[social]" :href="socialURLs[social](act[social])" target="_blank">
                                            <div v-html="socialIcons[social]" class="social-icon" />
                                        </a>
                                    </template>
                                </div>

                                <div v-if="act.plug">
                                    <a
                                        :href="act.plug.url"
                                        v-if="act.plug.url && act.plug.description && !act.plug.title"
                                    >
                                        {{ act.plug.description }}
                                    </a>

                                    <template v-else>
                                        {{ act.plug.description }}
                                        <a :href="act.plug.url" v-if="act.plug.title"> {{ act.plug.title }} </a>
                                    </template>
                                </div>
                            </div>
                        </template>
                    </template>
                </div>
            </template>

            <template v-if="mailinglist">
                <Mailinglist :blok="mailinglist">
                    <template #prompt>
                        <h1 style="margin: 1em auto">Stay in the loop</h1>

                        <p>
                            We produce lots of different comedy shows, and send occasional emails with ticket offers,
                            show recommendations, and insider tips. Subscribe to our
                            <em>no-spam {{ show.venue.city }} comedy mailing list </em> and don't miss a show!
                        </p>
                    </template>

                    <template #thanks>
                        <h1 style="margin-top: 1em; margin-bottom: 0.5em">You're in</h1>

                        Thank you for subscribing! If you're looking for a good laugh on the go, we also have an
                        Instagram page with lots of comedy clips!

                        <div style="display: flex; justify-content: center">
                            <a class="big-button insta" href="https://www.instagram.com/rgbmonster" target="_blank">
                                See Instagram
                            </a>
                        </div>
                    </template>
                </Mailinglist>
            </template>
        </main>
    </section>
</template>

<style lang="css">
    .thanks-block {
        .loading-indicator {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 500;
            background: var(--bg);
        }

        h1 {
            text-align: center;

            em {
                background: none;
                color: var(--pink);
            }
        }

        .splash {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2em 0;

            img {
                max-width: min(100%, 600px);
                border-radius: 40px;
            }
        }

        .about-act {
            max-width: 30em;
            padding: 5px;
            .act-name {
                font-weight: 600;
                font-size: 1.2em;
            }

            .linkage {
                display: flex;
                flex-wrap: wrap;
                margin-left: -10px;

                a {
                    padding: 10px 10px;
                }
            }

            img {
                filter: invert(100%);
                height: 40px;
                padding: 5px;
            }

            .social-icon {
                display: inline-flex;
                svg {
                    height: 30px;
                    fill: var(--color);
                }

                &:hover svg {
                    fill: var(--control);
                }
            }
        }

        .act-listing {
            display: grid;
            grid-template-columns: auto 1fr;
            margin-top: 3em;
            gap: 10px;
            align-items: center;

            h2 {
                grid-column: 1/-1;
            }

            a {
                color: var(--control);
                text-decoration: underline;
            }
        }

        .headshot {
            border-radius: 50%;
            max-height: 100px;
            aspect-ratio: 1/1;

            &.placeholder {
                background: var(--accent-burgundy);
                padding: 10px;
            }
        }

        .mailinglist-form {
            padding: 2em 0;
        }

        @media (max-width: 620px) {
            .splash {
                padding-top: 1em;

                img {
                    border-radius: 20px;
                }
            }
        }
    }
</style>
