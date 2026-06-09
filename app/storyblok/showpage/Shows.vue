<script>
    import dt from "py-datetime";
    import {useStore} from "@/shows.js";

    import utils from "@/utils.js";

    export default {
        props: {
            blok: Object,
        },
        data() {
            return {
                store: useStore(),
                activeAct: null,
                now: dt.datetime.now(),
            };
        },
        computed: {
            metas: state => state.store.currentMetas,
            shows: state => state.store.currentShows,

            upcomingShows() {
                return this.shows.filter(show => show.ts > this.now);
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
        },

        methods: {
            toggleAct(act) {
                if (this.activeAct === act) {
                    this.activeAct = null;
                } else {
                    this.activeAct = act;
                }
            },

            trackTickets() {
                // Fire the Facebook Pixel event
                if (typeof window !== "undefined" && window.fbq) {
                    window.fbq("track", "InitiateCheckout", {
                        content_name: this.metas.slug,
                    });
                }
            },
        },
    };
</script>

<template>
    <section class="shows-listing">
        <main>
            <h2>{{ blok?.title || "Upcoming Shows" }}</h2>

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
                            v-if="!metas.showLineup"
                            @click="trackTickets()"
                        >
                            <div class="time">
                                {{ show.ts.strftime("%H:%M") }}

                                <Icon name="nights_stay" class="late-night-icon" v-if="show.ts.hour <= 5" />
                            </div>
                            <div class="late-night-disclaimer" v-if="show.ts.hour <= 5">
                                Note: this show happens on {{ show.date.strftime("%A") }} night (technically,
                                {{ show.ts.strftime("%A") }} morning).
                            </div>

                            <div class="venue">{{ show.venue.name }}</div>
                            <div
                                class="tickets flexer"
                                v-if="show.tickets_available !== undefined && show.tickets_available < 20"
                                :class="{
                                    'running-low': show.tickets_available <= 20 && show.tickets_available > 10,
                                    'last-few': show.tickets_available <= 10,
                                    'sold-out': show.tickets_available <= 0,
                                }"
                            >
                                <Icon name="confirmation_number" />
                                <template v-if="show.tickets_available <= 20 && show.tickets_available > 10">
                                    Running Low
                                </template>
                                <template v-else-if="show.tickets_available > 0"> Last few left </template>
                                <template v-else-if="show.tickets_available <= 0"> Sold out </template>
                            </div>

                            <div
                                class="action"
                                v-if="show.tickets_available === undefined || show.tickets_available > 0"
                            >
                                {{ metas.payment == "unticketed" ? "More Details" : "Get tickets" }}
                            </div>
                        </a>

                        <div class="show-tile" v-if="metas.showLineup || metas.showHosts">
                            <div class="time">
                                {{ show.ts.strftime("%H:%M") }}

                                <Icon name="nights_stay" class="late-night-icon" v-if="show.ts.hour <= 5" />
                            </div>
                            <div class="late-night-disclaimer" v-if="show.ts.hour <= 5">
                                Note: this show happens on {{ show.date.strftime("%A") }} night (technically,
                                {{ show.ts.strftime("%A") }} morning).
                            </div>

                            <div class="venue">{{ show.venue.name }}</div>
                            <div
                                class="tickets flexer"
                                v-if="show.tickets_available !== undefined && show.tickets_available < 20"
                                :class="{
                                    'running-low': show.tickets_available <= 20 && show.tickets_available > 10,
                                    'last-few': show.tickets_available <= 10,
                                    'sold-out': show.tickets_available == 0,
                                }"
                            >
                                <Icon name="confirmation_number" />
                                <template v-if="show.tickets_available <= 20 && show.tickets_available > 10">
                                    Running Low
                                </template>
                                <template v-else-if="show.tickets_available > 0"> Last few left </template>
                                <template v-else-if="show.tickets_available == 0"> Sold out </template>
                            </div>

                            <div class="lineup" v-if="metas.showHosts">
                                <div class="headshots">
                                    <template v-if="show.acts.length > show.total_act_spots / 2">
                                        <template v-if="metas.showHosts">
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

                                            <div class="headshot" v-if="act.empty">+{{ act.count }}</div>
                                            <Headshot v-else :act="act" />
                                        </button>
                                    </template>
                                    <template v-else> Lineup to be revealed! </template>
                                </div>

                                <div
                                    v-if="
                                        (activeAct && show.acts.includes(activeAct)) || show.hosts.includes(activeAct)
                                    "
                                    class="act-details"
                                >
                                    <template v-if="activeAct.empty">
                                        <div class="bio">
                                            Plus {{ ordinal(activeAct.count) }} more
                                            {{ pluralizeNoun(activeAct.count, "act", "acts") }} to be revealed!
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
                                v-if="show.tickets_available === undefined || show.tickets_available > 0"
                                @click="trackTickets()"
                            >
                                {{ metas.payment == "unticketed" ? "More Details" : "Get tickets" }}
                            </a>
                        </div>
                    </template>
                </div>
            </div>
        </main>
    </section>
</template>

<style lang="css" scoped>
    .shows-listing {
        .late-night-icon {
            color: var(--accent-pink);
        }

        .late-night-disclaimer {
            color: var(--accent-pink);
            font-size: var(--font-size-sm);
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
                    font-size: var(--font-size-lg);
                }

                .bio {
                    padding: 5px 0;
                    max-width: 30em;
                    line-height: 150%;
                }
            }
        }

        .date-anchor {
            display: block;
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
            transition:
                background 300ms ease,
                color 300ms ease;
            min-width: 14em;
            display: grid;
            justify-items: start;
            gap: 5px;
        }

        .time {
            font-weight: 600;
            font-size: var(--font-size-3xl);
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

        a.show-tile:hover {
            background: var(--chrome);
            color: var(--chrome-text);
        }

        a.show-tile:hover .action {
            background: var(--chrome);
        }

        div.show-tile a.action {
            padding: 15px 20px;
        }

        div.show-tile .active-act .headshot {
            z-index: 300;
        }
    }
</style>
