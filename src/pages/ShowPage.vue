<script>
    import dt from "py-datetime";

    import {useStore} from "../stores/shows.js";
    import utils from "/src/scripts/utils.js";
    import {Sieve} from "/src/scripts/sieve.js";

    export default {
        name: "ShowPage",
        props: {
            // these are optional props for if your button has a linkable state
            showInfo: Object,
        },
        components: {
            // Cover,
        },
        data() {
            return {
                store: useStore(),
                loaded: false,

                videoPlaying: false,

                headerObserver: null,

                scrollY: 0,

                activeAct: null,
            };
        },
        computed: {
            pushAway() {
                let factor = this.scrollY * 0.02;
                return Math.max(-Math.pow(factor, 2), -300);
            },

            metas: state => state.shows[0]?.metas || {},
            slug: state => state.showInfo.slug,

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

            shows() {
                let shows = this.store.shows.filter(show => show.slug == this.slug);

                // node nonsense (window is not defined when generating pages)
                let windowHandle;
                try {
                    windowHandle = window;
                } catch (error) {
                    // pass
                }

                if (windowHandle && windowHandle.location.search) {
                    let filter = new URLSearchParams(windowHandle.location.search).get("festival");
                    if (filter) {
                        let ids = this.showsSieve.filter(filter);
                        shows = shows.filter(show => ids.includes(show.id));
                    }
                }

                return shows;
            },

            upcomingShows() {
                let now = dt.datetime.now();
                return this.shows.filter(show => show.ts > now);
            },

            showsByDate() {
                let byDate = {};
                this.upcomingShows.forEach(show => {
                    utils
                        .setDefault(byDate, show.date.strftime("%Y-%m-%d"), {date: show.date, ts: show.ts, shows: []})
                        .shows.push(show);
                });

                return utils.sort(Object.values(byDate), date => date.date);
            },

            showDescription() {
                let description = this.metas.description;
                description = description.replace(/\n/g, "<br />");
                return description;
            },

            topShow() {
                let byVenueTime = {};
                this.shows.forEach(show => {
                    utils.setDefault(byVenueTime, `${show.venue.name}-${show.ts.strftime("%H:%M")}`, {
                        show: show,
                        shows: 0,
                    }).shows += 1;
                });

                let topShows = utils.sort(Object.values(byVenueTime), rec => -rec.shows);

                return topShows.length ? topShows[0].show : null;
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
                    return `${utils.humanDate(start)}-${utils.humanDate(end)}`;
                }
            },

            paymentSectionTitle() {
                let titles = {
                    ticketed: "Ticketed Show",
                    "ticketed+pwyw": "Ticketed + PWYW Show",
                    pwyc: "Pay What You Can",
                    unticketed: "Unticketed Show",
                };
                return titles[this.metas.payment || "ticketed"];
            },
        },

        methods: {
            togglePlayback() {
                let video = this.$refs.video;
                let onVideoEnd = reset => {
                    video.removeEventListener("ended", onVideoEnd);
                    this.videoPlaying = false;
                    if (reset) {
                        video.currentTime = 0;
                    }
                };
                video.addEventListener("ended", onVideoEnd);

                if (video.paused || video.ended) {
                    video.play();
                    this.videoPlaying = true;
                    plausible("video-playback", {props: {video: this.metas.title}});
                } else {
                    video.pause();
                    this.videoPlaying = false;
                }
            },

            jumpToDates() {
                this.$refs.dates.scrollIntoView({behavior: "smooth"});
            },

            updateScrollPos(evt) {
                this.scrollY = window.scrollY;
            },

            toggleAct(act) {
                this.activeAct = act == this.activeAct ? null : act;
            },
        },

        async mounted() {
            this.headerObserver = new IntersectionObserver(
                ([evt]) => {
                    this.$refs.header.classList.toggle("pinned", evt.intersectionRatio < 1);
                },
                {threshold: 1}
            );
            await this.store.fetchShows();
            this.loaded = true;

            await this.$nextTick();

            this.headerObserver.observe(this.$refs.metaHeader);
            document.addEventListener("scroll", this.updateScrollPos);

            if (document.location.hash) {
                let elem = document.getElementById(document.location.hash.slice(1));
                if (elem) {
                    elem.scrollIntoView({block: "start", inline: "nearest", behavior: "smooth"});
                }
            }
        },

        beforeUnmount() {
            this.headerObserver.disconnect();
            document.removeEventListener("scroll", this.updateScrollPos);
        },
    };
</script>

<template>
    <div class="show-page">
        <img class="curtains-left" src="/curtains-left.webp" :style="{'margin-left': `${pushAway}px`}" />
        <img class="curtains-right" src="/curtains-right.webp" :style="{'margin-right': `${pushAway}px`}" />

        <div class="sticky-header" ref="header">
            <Dropdown class="plain site-dropdown" menu-class="site-dropdown-menu">
                <template #toggle>
                    <Icon name="menu" />
                </template>
                <template #menu>
                    <a class="menu-item" href="/fringe">All Shows</a>
                    <a class="menu-item" href="/about-us">About Us</a>
                </template>
            </Dropdown>

            <div class="contents">
                <img class="square-logo" v-if="metas.square" :src="metas.square" />
                <h1 v-html="metas.title" />
            </div>
        </div>

        <template v-if="loaded">
            <section class="banner">
                <div class="contents">
                    <Cover :show="metas" />
                </div>
            </section>

            <section class="title" ref="metaHeader">
                <div class="contents">
                    <div class="partnership" v-if="metas.partnership">
                        Presented in partnership with <mark>{{ metas.partnership }}</mark>
                    </div>
                    <h1 v-html="metas.title" />
                </div>
            </section>

            <section class="meta">
                <div class="contents">
                    <div class="location" :class="{'not-ready': !loaded || !topShow}">
                        <div>
                            <Icon name="calendar_month" />
                            <div v-if="loaded">{{ dates }}</div>
                        </div>

                        <!-- <div>
                            <Icon name="location_on" />
                            <div v-if="loaded">{{ topShow?.venue?.name }}</div>
                        </div>

                        <div>
                            <Icon name="schedule" />
                            <div v-if="loaded">{{ topShow?.ts?.strftime("%H:%M") }}</div>
                        </div> -->
                    </div>

                    <div class="tags">
                        <div v-for="(tag, idx) in metas.tags" :key="idx" :class="tag.tag">{{ tag.tag }}</div>
                    </div>
                </div>
            </section>

            <section class="cta">
                <div class="contents" :class="{'not-ready': !loaded || !topShow}">
                    <button @click="jumpToDates()" v-if="!loaded || upcomingShows.length > 1">
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

                    <a :href="topShow?.tickets" target="blank" v-else>
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
                </div>
            </section>

            <section class="show-description">
                <div class="contents" v-html="showDescription" />
            </section>

            <section v-if="metas.squareVideo" class="video">
                <div class="contents">
                    <button class="player" :class="{playing: videoPlaying}" @click="togglePlayback">
                        <video playsinline ref="video">
                            <source :src="metas.squareVideo" type="video/mp4" />
                        </video>
                        <div class="play-controls">
                            <div class="play-icon"><Icon name="play_arrow" /></div>
                        </div>
                    </button>
                </div>
            </section>

            <section class="social-proof" v-if="metas.quotes">
                <div class="contents">
                    <QuotesCarousel :quotes="metas.quotes" />
                </div>
            </section>

            <template v-if="loaded && upcomingShows.length > 1">
                <section class="about-tickets">
                    <div class="contents">
                        <div class="monster-box">
                            <img class="monster" src="/doodles/sticking-out.webp" />
                        </div>

                        <div class="box" v-if="metas.payment != 'hide'">
                            <header class="flexer"><Icon name="confirmation_number" />{{ paymentSectionTitle }}</header>

                            <div v-if="(metas.payment || 'ticketed') == 'ticketed'">
                                This is a ticketed show. This means that unlike some other shows that we produce where
                                you may nominate a price you can afford, you may only enter this show with a ticket.
                            </div>

                            <div v-if="metas.payment == 'ticketed+pwyw'">
                                This is a ticketed show. This means that the only way to guarantee entry is with a
                                ticket. If you are low income, unwaged, or you can't afford a full price ticket for any
                                reason, you are welcome to buy a concession ticket on a trust basis. If there is spare
                                capacity once the ticket holders have been admitted, the venue may at their discression
                                admit non-ticket holders on a pay what you can basis, where you will be able to purchase
                                your ticket at a price of your choosing at the end of the show.
                            </div>

                            <div v-if="metas.payment == 'pwyc'">
                                This is a Pay What You Can Show. There are two ways of paying for the show. You can
                                either reserve a ticket in advance for the full price, or select a reduced price option
                                if that's all you can afford. Or, providing there is spare capacity once we've let the
                                ticket holders in, you can turn up to the venue and enter for free, and offer a cash or
                                card donation at the end of the show. We recommend doing this during the mid-week
                                performances where we are less likely to sell out.
                            </div>

                            <div v-if="metas.payment == 'unticketed'">
                                This is a free show! This means that there is no way of reserving your place in advance.
                                Instead, to be fair to everyone, we let people in the venue on a first come, first
                                served basis, so we recommend turning up around fifteen minutes before the show starts.
                                We ask that you pay what you feel the show was worth at the end of the show. The typical
                                donation is £12, but some people pay more or less than this depending on their personal
                                circumstances. Because of this crowdfunding model, even if you can't afford to pay
                                anything at all, we still hope that you'll come and enjoy the show, since your fellow
                                audience members will be paying for you. It really is free for you.
                            </div>
                        </div>
                    </div>
                </section>

                <section class="dates" ref="dates">
                    <div class="contents">
                        <h2>Upcoming Shows</h2>

                        <div class="date-listing">
                            <div v-for="date in showsByDate" :key="date.date">
                                <a
                                    :id="date.date.strftime('%Y_%m_%d')"
                                    :href="`#${date.date.strftime('%Y_%m_%d')}`"
                                    class="date-anchor"
                                >
                                    <h2>{{ date.date.strftime("%A") }}, {{ humanDate(date.date) }}</h2>
                                </a>
                                <div class="shows">
                                    <template v-for="show in date.shows">
                                        <a
                                            class="show-tile"
                                            :href="show.tickets"
                                            target="blank"
                                            v-if="!metas.show_lineup"
                                        >
                                            <div class="time">
                                                {{ show.ts.strftime("%H:%M") }}

                                                <Icon
                                                    name="nights_stay"
                                                    class="late-night-icon"
                                                    v-if="show.ts.hour <= 5"
                                                />
                                            </div>
                                            <div class="late-night-disclaimer" v-if="show.ts.hour <= 5">
                                                Note: this show happens on {{ show.date.strftime("%A") }} night
                                                (technically, {{ show.ts.strftime("%A") }} morning).
                                            </div>

                                            <div class="venue">{{ show.venue.name }}</div>
                                            <div
                                                class="tickets flexer"
                                                v-if="
                                                    show.tickets_available !== undefined && show.tickets_available < 20
                                                "
                                                :class="{
                                                    'running-low':
                                                        show.tickets_available <= 20 && show.tickets_available > 10,
                                                    'last-few': show.tickets_available <= 10,
                                                    'sold-out': show.tickets_available <= 0,
                                                }"
                                            >
                                                <Icon name="confirmation_number" />
                                                <template
                                                    v-if="show.tickets_available <= 20 && show.tickets_available > 10"
                                                >
                                                    Running Low
                                                </template>
                                                <template v-else-if="show.tickets_available > 0">
                                                    Last few left
                                                </template>
                                                <template v-else-if="show.tickets_available <= 0"> Sold out </template>
                                            </div>

                                            <div
                                                class="action"
                                                v-if="
                                                    show.tickets_available === undefined || show.tickets_available > 0
                                                "
                                            >
                                                {{ metas.payment == "unticketed" ? "More Details" : "Get tickets" }}
                                            </div>
                                        </a>

                                        <div class="show-tile" v-if="metas.show_lineup">
                                            <div class="time">
                                                {{ show.ts.strftime("%H:%M") }}

                                                <Icon
                                                    name="nights_stay"
                                                    class="late-night-icon"
                                                    v-if="show.ts.hour <= 5"
                                                />
                                            </div>
                                            <div class="late-night-disclaimer" v-if="show.ts.hour <= 5">
                                                Note: this show happens on {{ show.date.strftime("%A") }} night
                                                (technically, {{ show.ts.strftime("%A") }} morning).
                                            </div>

                                            <div class="venue">{{ show.venue.name }}</div>
                                            <div
                                                class="tickets flexer"
                                                v-if="
                                                    show.tickets_available !== undefined && show.tickets_available < 20
                                                "
                                                :class="{
                                                    'running-low':
                                                        show.tickets_available <= 20 && show.tickets_available > 10,
                                                    'last-few': show.tickets_available <= 10,
                                                    'sold-out': show.tickets_available == 0,
                                                }"
                                            >
                                                <Icon name="confirmation_number" />
                                                <template
                                                    v-if="show.tickets_available <= 20 && show.tickets_available > 10"
                                                >
                                                    Running Low
                                                </template>
                                                <template v-else-if="show.tickets_available > 0">
                                                    Last few left
                                                </template>
                                                <template v-else-if="show.tickets_available == 0"> Sold out </template>
                                            </div>

                                            <div class="lineup" v-if="metas.show_lineup">
                                                <div class="headshots">
                                                    <template v-if="show.acts.length > show.total_act_spots / 2">
                                                        <template v-if="metas.show_hosts">
                                                            <button
                                                                v-for="(act, idx) in show.hosts"
                                                                :key="idx"
                                                                @click="toggleAct(act)"
                                                                class="headshot-container"
                                                                :class="{
                                                                    active: act == activeAct,
                                                                    faded: activeAct && act !== activeAct,
                                                                }"
                                                                :title="act.name"
                                                            >
                                                                <div class="overlay" />
                                                                <Headshot :act="act" />
                                                            </button>

                                                            <div class="spacer" />
                                                        </template>

                                                        <button
                                                            v-for="(act, idx) in show.acts"
                                                            :key="idx"
                                                            @click="toggleAct(act)"
                                                            class="headshot-container"
                                                            :class="{
                                                                active: act == activeAct,
                                                                faded: activeAct && act !== activeAct,
                                                            }"
                                                            :title="act.name"
                                                        >
                                                            <div class="overlay" />

                                                            <div class="headshot" v-if="act.empty">
                                                                +{{ act.count }}
                                                            </div>
                                                            <Headshot v-else :act="act" />
                                                        </button>
                                                    </template>
                                                    <template v-else> Lineup to be revealed! </template>
                                                </div>

                                                <div
                                                    v-if="
                                                        (activeAct && show.acts.includes(activeAct)) ||
                                                        show.hosts.includes(activeAct)
                                                    "
                                                    class="act-details"
                                                >
                                                    <template v-if="activeAct.empty">
                                                        <div class="bio">
                                                            Plus {{ ordinal(activeAct.count) }} more
                                                            {{ pluralizeNoun(activeAct.count, "act", "acts") }} to be
                                                            revealed!
                                                        </div>
                                                    </template>
                                                    <template v-else>
                                                        <div class="act-name">{{ activeAct.name }}</div>
                                                        <div class="bio" v-if="!metas.hide_bio">
                                                            {{ activeAct.bio }}
                                                        </div>
                                                    </template>
                                                </div>
                                            </div>

                                            <a
                                                :href="show.tickets"
                                                target="blank"
                                                class="action"
                                                v-if="
                                                    show.tickets_available === undefined || show.tickets_available > 0
                                                "
                                            >
                                                {{ metas.payment == "unticketed" ? "More Details" : "Get tickets" }}
                                            </a>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </template>
        </template>
    </div>
</template>

<style lang="scss">
    main.markdown .show-page {
        padding-bottom: 3em;
        margin: 0 auto;
        --square-size: 60px;

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

        .curtains-left,
        .curtains-right {
            position: fixed;
            top: 0;
            z-index: 2000;
            pointer-events: none;
            width: min(400px, 19.5vw);
        }

        .curtains-left {
            left: 0;
        }

        .curtains-right {
            right: 0;
        }

        .late-night-icon {
            color: var(--accent-pink);
        }

        .late-night-disclaimer {
            color: var(--accent-pink);
            font-size: 0.85em;
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
                    padding: var(--content-horiz-padding);
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
                padding: 10px var(--content-horiz-padding);
            }

            h1 {
                color: #fff;
                font-size: min(6vw, 2em);
                margin-top: 4px; // manually pushed the header down for visual vertical alignment
            }

            .square-logo {
                min-width: var(--square-size);
                min-height: var(--square-size);
                max-width: var(--square-size);
                max-height: var(--square-size);
                border-radius: 10px;
            }
        }

        .lineup {
            .headshots {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                align-items: center;
                justify-items: center;

                .spacer {
                    width: 15px;
                }
            }
            .headshot-container {
                position: relative;
                margin-right: -30px;

                &:last-child {
                    margin-right: 0;
                }

                .headshot,
                .overlay {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    border: 3px solid #fff;
                }

                .overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    background: #fff;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 300ms ease;
                }

                &.active {
                    z-index: 300;
                    .headshot {
                        border: 3px solid #fff;
                        box-shadow: 0 0 5px 2px #fff;
                    }
                }
                &.faded {
                    .overlay {
                        opacity: 0.6;
                    }
                }
            }

            .act-details {
                margin-top: 10px;
                .act-name {
                    font-weight: 600;
                    font-size: 1.2em;
                }

                .bio {
                    padding: 5px 0;
                    max-width: 30em;
                    line-height: 150%;
                }
            }
        }

        section.title .contents {
            h1 {
                line-height: 100%;
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
                font-size: min(1.25em, 5vw);
                border-radius: 15px;
                font-weight: 600;
                color: var(--accent-burgundy);

                display: inline-block;

                padding: 6px;

                //text-shadow: 1px 1px #666;
                box-shadow: 0px 6px #b28b8d;

                background: #fff;
                border: 5px solid var(--accent-burgundy);

                text-transform: uppercase;
                font-weight: 600;
                letter-spacing: 0.1em;
                margin-bottom: 3px;

                .icon {
                    font-size: 2em;
                    font-size: min(2em, 10vw);
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
            font-size: 1.25em;
        }

        section.about-tickets {
            font-size: 1.25em;
            line-height: 180%;

            padding-top: 3em;

            .contents {
                position: relative;
            }

            .monster-box {
                display: flex;
                justify-content: end;

                .monster {
                    max-width: 150px;
                    z-index: 50;
                }
            }

            .box {
                //border: 3px solid var(--chrome-x2);
                z-index: 100;
                padding: 20px;
                background: #fff;

                border: 5px solid var(--chrome-x2);
                border-radius: 15px;

                box-shadow: 5px 5px var(--transparent-shadow);

                header {
                    color: var(--chrome-x2);
                    font-size: 1.25em;
                    margin-bottom: 15px;
                }
            }

            header,
            .contents {
                text-align: left;
            }

            header {
                font-weight: 600;
            }
        }

        section.dates {
            margin: 2em 0;

            .date-listing {
                display: grid;

                gap: 1em;

                margin-top: 1em;
                text-align: left;

                .date-anchor {
                    display: block;
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
                    transition: background 300ms ease, color 300ms ease;

                    min-width: 14em;

                    display: grid;
                    justify-items: start;
                    gap: 5px;

                    .time {
                        font-weight: 600;
                        font-size: 2em;
                    }

                    .action {
                        color: var(--chrome-x1);
                        border-radius: 5px;
                        padding: 8px;
                        background: var(--chrome-x1);
                        color: var(--chrome-text);
                        font-weight: 600;
                        cursor: pointer;
                        margin-top: 5px;
                    }

                    .tickets {
                        &.available {
                            color: var(--accent-green);
                        }

                        &.running-low {
                            color: var(--accent-burgundy);
                        }

                        &.last-few {
                            color: var(--accent-red);
                        }

                        &.sold-out {
                            color: var(--label);
                        }
                    }
                }

                a.show-tile:hover {
                    background: var(--chrome);
                    color: var(--chrome-text);

                    .action {
                        background: var(--chrome);
                    }
                }

                div.show-tile {
                    a.action {
                        padding: 15px 20px;
                    }

                    .active-act {
                        .headshot {
                            z-index: 300;
                        }
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
                    font-size: 1em;
                    gap: 0.25em;

                    & > div {
                        gap: 2px;
                    }
                }

                .tags {
                    font-size: 1em;
                }
            }
        }
    }

    #popups .menu.site-dropdown-menu {
        background: var(--chrome-x1);
        color: var(--chrome-text);
        font-size: 1.25em;
    }
</style>
