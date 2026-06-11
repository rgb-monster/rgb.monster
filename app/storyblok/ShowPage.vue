<script>
    import dt from "py-datetime";

    import utils from "@/utils.js";
    import {useStore} from "@/shows.js";
    import {useRoute} from "vue-router";

    import Showcase from "./Showcase.vue";
    import Section from "./Section.vue";
    import Catalog from "./Catalog.vue";

    export default {
        components: {
            Showcase,
            Section,
            Catalog,
        },
        props: {
            blok: Object,
        },
        data() {
            return {
                store: useStore(),
                route: useRoute(),
                headerObserver: null,
                scrollY: 0,
                now: dt.datetime.now(),
            };
        },

        computed: {
            standard: state => [undefined, true].includes(state.blok.standard_structure),
            slug: state => state.route.params.slug[0],
            filters: state => state.route.query,
            theme: state => state.blok.colour || "beige",
            curtains: state => !state.blok.hide_curtains,
            loading: state => state.store.loading,

            pushAway() {
                let factor = this.scrollY * 0.02;
                let px = Math.max(-Math.pow(factor, 2), -300);
                return px;
            },

            shows: state => state.store.currentShows,
            metas: state => state.store.currentMetas,
            seeAlso: state => (utils.isEmpty(state.metas.see_also) ? null : state.metas.see_also),
            topShow: state => state.shows[0],
            upcomingShows() {
                return this.shows.filter(show => show.ts > this.now);
            },

            styleOverrides: state =>
                state.blok.style_overrides ? `.page-${state.slug} { ${state.blok.style_overrides || ""} }` : null,
        },

        methods: {
            updateScrollPos() {
                this.scrollY = window.scrollY;
            },

            goToTickets() {
                // Fire the Facebook Pixel event
                if (typeof window !== "undefined" && window.fbq) {
                    window.fbq("track", "InitiateCheckout", {
                        content_name: this.metas.slug,
                    });
                }

                // Open the URL in a new tab
                window.open(this.metas.tickets, "_blank", "noopener");
            },
        },

        async mounted() {
            this.headerObserver = new IntersectionObserver(
                ([evt]) => {
                    if (this.$refs.header) {
                        this.$refs.header.classList.toggle("pinned", evt.intersectionRatio < 1);
                    }
                },
                {threshold: 1}
            );

            this.store.setFilter({
                from: this.filters.from,
                to: this.filters.to,
                city: this.filters.festival,
            });
            this.store.setCurrentShow(this.slug);
            await this.store.fetchShows();

            await this.$nextTick();
            if (this.standard) {
                this.headerObserver.observe(this.$refs.metaHeader);
            }

            document.addEventListener("scroll", this.updateScrollPos);

            if (this.route.hash) {
                let elem = document.getElementById(this.route.hash.slice(1));
                if (elem) {
                    elem.scrollIntoView({block: "start", inline: "nearest", behavior: "smooth"});
                }
            }
        },

        beforeUnmount() {
            if (this.headerObserver) {
                this.headerObserver.disconnect();
            }
        },
    };
</script>

<template>
    <component :is="'style'" v-if="!loading && styleOverrides" v-text="styleOverrides" />
    <main
        v-editable="blok"
        class="show-page page"
        :class="[`theme-${blok.colour || 'base'}`, `page-${slug}`]"
        v-if="!loading"
    >
        <div class="sticky-header" ref="header">
            <div class="contents">
                <img class="square-logo" v-if="metas.square" :src="metas.square" />
                <h1 v-html="metas.title" />
            </div>
        </div>

        <template v-if="standard">
            <template v-if="!loading">
                <Showcase :blok="{showcase_shows: [metas.type]}" />
                <Section
                    :blok="{colour: 'base', swoosh: true, align: 'center', contents: []}"
                    style="margin-top: -15px"
                >
                    <section class="title" ref="metaHeader">
                        <main>
                            <div class="partnership" v-if="metas.partnership">
                                Presented in partnership with <mark>{{ metas.partnership }}</mark>
                            </div>
                            <h1 v-html="metas.title" />
                        </main>
                    </section>

                    <section class="meta">
                        <main>
                            <div class="location" :class="{'not-ready': loading || !topShow}">
                                <div>
                                    <Icon name="calendar_month" />
                                    <div v-if="!loading">{{ metas.dates }}</div>
                                </div>
                            </div>

                            <div class="tags" v-if="!isEmpty(metas.tags)">
                                <template v-for="(tag, idx) in metas.tags" :key="idx">
                                    <div v-if="tag" :class="tag">{{ tag }}</div>
                                </template>
                            </div>
                        </main>
                    </section>
                </Section>

                <section class="cta">
                    <main :class="{'not-ready': loading || !topShow}">
                        <button @click="goToTickets()" v-if="loading || upcomingShows.length > 1">
                            <div class="button-inner">
                                <template v-if="!metas.cta">
                                    <Icon name="local_activity" />
                                    {{ metas.payment == "unticketed" ? "See Dates" : "Get tickets" }}
                                </template>
                                <template v-else>
                                    {{ metas.cta }}
                                </template>
                            </div>
                        </button>

                        <a :href="metas?.tickets" target="blank" v-else>
                            <div class="button-inner">
                                <template v-if="!metas.cta">
                                    <Icon name="local_activity" />
                                    {{ metas.payment == "unticketed" ? "See Dates" : "Get tickets" }}
                                </template>
                                <template v-else>
                                    {{ metas.cta }}
                                </template>
                            </div>
                        </a>
                    </main>
                </section>

                <component is="showpage-show-description" />

                <component is="showpage-video-player" />

                <component is="showpage-quotes-carousel" />

                <template v-if="!loading && upcomingShows.length > 1">
                    <component is="showpage-shows" />
                </template>

                <template v-if="!loading && seeAlso">
                    <section style="padding-top: 3em">
                        <main style="padding-bottom: 0">
                            <h1>You might also enjoy these shows</h1>
                        </main>
                    </section>
                    <Catalog
                        :blok="{
                            date_from: this.filters.from,
                            date_to: this.filters.to,
                            city: this.filters.festival,
                            show_types: seeAlso,
                        }"
                    />
                </template>
            </template>
        </template>

        <StoryblokComponent v-for="currentBlok in blok.body" :key="currentBlok._uid" :blok="currentBlok" />
    </main>
</template>

<style lang="css">
    .show-page {
        padding-bottom: 3em;
        margin: 0 auto;
        --square-size: 60px;
        --within-curtains: min(1000px, 55vw);

        h2 {
            margin-top: 1em;
            margin-bottom: 0.5em;
        }

        .cover {
            transition: all 300ms;
            overflow: hidden;
            border-radius: 0;
        }

        .doodle-mic-left {
            position: absolute;
            opacity: 0;
            pointer-events: none;
        }

        .sticky-header {
            position: fixed;
            z-index: 500;
            width: 100%;
            box-shadow: 0px 2px 5px #aaa;
            background: var(--chrome);
            color: var(--chrome-text);

            top: -100px;

            transition: top 300ms ease;

            display: grid;
            grid-template-columns: auto 1fr;

            .site-dropdown {
                .toggle {
                    padding: 1.25em;
                }
            }

            &.pinned {
                top: 0;
            }

            .contents {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 15px;
                padding: 10px 1.25em;
            }

            h1 {
                color: #fff;
                font-size: var(--font-size-3xl);
                margin-top: 4px; /* manually pushed the header down for visual vertical alignment */
            }

            .square-logo {
                min-width: var(--square-size);
                min-height: var(--square-size);
                max-width: var(--square-size);
                max-height: var(--square-size);
                border-radius: 10px;
            }
        }

        main {
            text-align: center;
        }

        section.title {
            text-align: center;
            main {
                max-width: var(--within-curtains);
                padding-bottom: 0;
            }

            h1 {
                line-height: 100%;
                margin-bottom: 0;
            }

            .partnership {
                font-weight: 600;
                color: var(--label);
                margin-bottom: 10px;

                mark {
                    background: none;
                    color: inherit;
                }
            }
        }

        section.meta {
            padding-top: 0;

            main {
                padding-bottom: 0;
            }

            .location {
                font-family: var(--rgb-font);
                color: #999;
                font-size: var(--font-size-xl);
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
                    font-size: var(--font-size-xl);
                    display: flex;
                }
            }

            .tags {
                font-family: var(--rgb-font);
                color: var(--accent-pink);
                font-size: var(--font-size-xl);
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
            background: var(--base);
            padding: 2em;
            opacity: 1;
            transition: opacity 500ms ease;

            .contents.not-ready {
                opacity: 0;
            }

            .button-inner {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 5px 30px;
                border-radius: 10px;
            }

            button,
            a {
                background: var(--accent-burgundy);
                font-size: var(--font-size-xl);
                border-radius: 15px;
                font-weight: 600;
                color: var(--accent-burgundy);

                display: inline-block;

                padding: 6px;

                box-shadow: 0px 6px #b28b8d;

                background: #fff;
                border: 5px solid var(--accent-burgundy);

                text-transform: uppercase;
                font-weight: 600;
                letter-spacing: 0.1em;
                margin-bottom: 3px;

                .icon {
                    font-size: var(--font-size-3xl);
                }

                &:active {
                    box-shadow: none;
                    margin-top: 3px;
                    margin-bottom: 0;
                }
            }
        }

        section.show-description {
            line-height: 1.8;
            font-size: var(--font-size-xl);
        }

        .show-catalog {
            .shows {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;

                .show-type-tile {
                    width: 300px;
                }
            }
        }

        p {
            line-height: 180%;
            font-size: var(--font-size-xl);
        }

        @media (min-width: 1000px) {
            .doodle-mic-left {
                opacity: 1;
                left: 0;
                top: 100px;
                width: 150px;
            }
        }

        @media (min-width: 800px) {
            .cover {
                border-radius: 15px;
            }
        }

        @media (max-width: 800px) {
            section.banner {
                padding: 0;

                .contents {
                    padding: 0;
                }
            }

            .doodle-mic-left {
                opacity: 1;
                left: 0;
                top: 50vw;
                width: 70px;
            }
        }

        @media (max-width: 600px) {
            --square-size: 14vw;

            section.meta {
                .location {
                    display: grid;
                    justify-items: center;
                    font-size: var(--font-size-base);
                    gap: 0.25em;

                    & > div {
                        gap: 2px;
                    }
                }

                .tags {
                    font-size: var(--font-size-base);
                }
            }
        }
    }
</style>
