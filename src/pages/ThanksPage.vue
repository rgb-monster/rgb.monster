<script>
    import dt from "py-datetime";

    import {useStore} from "../stores/shows.js";
    import utils from "/src/scripts/utils.js";

    export default {
        name: "ThanksPage",
        data() {
            return {
                store: useStore(),

                loaded: false,
                notFound: false,
                show: null,

                socialURLs: {
                    twitter: handle => `https://x.com/${handle}`,
                    instagram: handle => `https://instagram.com/${handle}`,
                    tiktok: handle => `https://tiktok.com/@${handle}`,
                    facebook: handle => `https://facebook.com/${handle}`,
                },

                email: "",
                submitting: false,
                subscribed: false,
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

            shows: state => state.store.allShows,

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
                return listName;
            },
        },

        methods: {
            redirectToMostRecent(show) {
                this.show = show;
                window.history.replaceState(null, null, `${window.location.origin}/thanks?type=${this.show.id}`);
            },

            async subscribeToMailingList() {
                // determine mailing list name
                if (!this.mailinglist) {
                    return;
                }
                this.submitting = true;

                await this.$requests.post("mailinglist", {
                    email: this.email,
                    mailinglist: this.mailinglist,
                });
                this.submitting = false;
                this.subscribed = true;
            },
        },

        async mounted() {
            await this.store.fetchShows();

            let now = dt.datetime.utcnow();
            let shows = this.shows.filter(
                show =>
                    !show.excludeThanks && dt.datetime(show.ts_utc + dt.timedelta({minutes: show.duration - 10})) < now
            );

            // sort by most recent first
            shows = utils.sort(shows, show => -show.ts_utc);

            if (!this.showType) {
                this.redirectToMostRecent(shows[0]);
            } else {
                this.show = shows.find(show => show.id == this.showType);
                this.show.acts = this.show.acts.filter(act => act.name);
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
            <div class="splash">
                <img :src="show.coverThumb" />
            </div>

            <div class="message-container">
                <h1>
                    Thank you for coming to <em>{{ show.title }}</em> on<br />
                    <em>{{ humanTs(show.ts) }}</em>
                </h1>

                <template v-for="category in ['acts', 'hosts']" :key="category">
                    <div class="act-listing">
                        <h2 v-if="category == 'acts'">Today you saw these acts!</h2>
                        <h2 v-if="category == 'hosts' && show.hosts.length > 1">And your hosts!</h2>
                        <h2 v-else-if="category == 'hosts' && show.hosts.length == 1">And your host!</h2>

                        <template v-for="(act, idx) in show[category]" :key="act">
                            <div>
                                <img v-if="act.headshot" :src="`${act.headshot}-thumb`" class="headshot" />
                                <img v-else src="/monster.webp" class="headshot placeholder" />
                            </div>
                            <div class="about-act">
                                <div class="act-name">{{ act.name }}</div>
                                <div>
                                    <a v-if="act.website" target="_blank">
                                        <Icon name="link" />
                                    </a>

                                    <template
                                        v-for="social in ['instagram', 'tiktok', 'twitter', 'facebook']"
                                        :key="social"
                                    >
                                        <a v-if="act[social]" :href="socialURLs[social](act[social])" target="_blank">
                                            <img class="social" :src="`/social-icons/${social}.svg`" />
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
                    </div>
                </template>

                <template v-if="mailinglist">
                    <template v-if="subscribed">
                        <h1 style="margin-top: 1em; margin-bottom: 0.5em">You're in</h1>

                        <div v-if="subscribed" style="text-align: center; line-height: 150%">
                            Thank you for subscribing! If you're looking for a good laugh on the go, we also have an
                            Instagram page with lots of comedy clips!

                            <div style="display: flex; justify-content: center">
                                <a
                                    style="
                                        background: var(--base);
                                        color: var(--text);
                                        text-align: center;
                                        padding: 10px 20px;
                                        border-radius: 10px;
                                        font-family: var(--rgb-font);
                                        text-transform: uppercase;
                                        font-size: 1.2em;
                                        margin: 1em 0;
                                    "
                                    href="https://www.instagram.com/rgbmonster"
                                    target="_blank"
                                >
                                    See Instagram
                                </a>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        <h1 style="margin: 1em auto">Stay in the loop</h1>
                        <div style="line-height: 150%">
                            <p>
                                We produce lots of different comedy shows, and send occasional emails with ticket
                                offers, show recommendations, and insider tips. Subscribe to our
                                <em>no-spam {{ show.venue.city }} comedy mailing list </em> and don't miss a show!
                            </p>

                            <form
                                @submit.prevent="subscribeToMailingList"
                                style="display: grid; justify-content: center; gap: 20px; margin: 1em 0"
                            >
                                <input
                                    name="email"
                                    type="email"
                                    v-model="email"
                                    style="
                                        padding: 10px;
                                        border: 2px solid var(--base);
                                        border-radius: 10px;
                                        width: 20em;
                                    "
                                    placeholder="email@domain.com"
                                />
                                <div style="display: flex; justify-content: center">
                                    <button
                                        :disabled="!emailOk(email) || submitting"
                                        style="
                                            background: var(--base);
                                            color: var(--text);
                                            text-align: center;
                                            padding: 20px;
                                            border-radius: 10px;
                                            font-family: var(--rgb-font);
                                            text-transform: uppercase;
                                            font-size: 1.2em;
                                        "
                                    >
                                        {{ !submitting ? "Subscribe" : "Subscribing&hellip;" }}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </template>
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
            margin: 0 auto;
        }

        h1 {
            font-size: min(max(6vw, 1.6em), 2.5em);
            max-width: 13em;
            line-height: 110%;
        }

        h2 {
            margin-top: 20px;
        }

        footer {
            background: #333;
        }

        em {
            color: var(--accent-pink);
        }
    }

    main.markdown .thanks-page {
        padding-bottom: 3em;
        margin: 0 auto;
        --square-size: 60px;

        .splash {
            display: flex;
            align-items: center;
            justify-content: center;

            padding-top: 6vw;
            img {
                max-width: min(100%, 600px);
            }
        }

        .about-act {
            .act-name {
                font-weight: 600;
            }

            img {
                filter: invert(100%);
                height: 40px;
                padding: 5px;
            }
        }

        .message-container {
            padding: var(--content-horiz-padding);
            max-width: 600px;
            margin: 0 auto;
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

            a {
                color: var(--control);
                text-decoration: underline;
            }
        }

        .headshot {
            border-radius: 50%;
            max-height: 90px;
            aspect-ratio: 1/1;

            &.placeholder {
                background: var(--accent-burgundy);
                padding: 10px;
            }
        }

        @media (max-width: mixins.$break-mob) {
            .splash {
                padding-top: 0;
            }
        }
    }
</style>
