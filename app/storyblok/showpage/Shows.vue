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
                selectedShow: null,
            };
        },
        computed: {
            metas: state => state.store.currentMetas,
            shows: state => state.store.currentShows,
            expandedView: state => state.metas.showLineup || state.metas.showHosts,

            showsByDate() {
                let byDate = {};
                this.shows.forEach(show => {
                    utils
                        .setDefault(byDate, show.date.strftime("%Y-%m-%d"), {date: show.date, ts: show.ts, shows: []})
                        .shows.push(show);
                });
                return byDate;
            },
            grouped: state => utils.sort(Object.values(state.showsByDate), date => date.date),
            upcoming: state => state.grouped.filter(day => day.ts > state.now),

            currentFestivalDates: state => state.store.filteredShows.map(show => show.date),

            allDays() {
                let byDate = this.showsByDate;
                if (utils.isEmpty(byDate)) {
                    return {times: [], days: []};
                }

                let first = dt.datetime(Math.min(...this.currentFestivalDates));
                let startOffset = -first.weekday();
                let rangeStart = dt.datetime(first + dt.timedelta({days: startOffset}));

                let last = dt.datetime(Math.max(...this.currentFestivalDates));
                let endOffset = (7 - last.weekday()) % 7;
                let rangeEnd = dt.datetime(last + dt.timedelta({days: endOffset}));

                let uniqueTimes = {};
                this.shows.forEach(show => {
                    let timeStr = show.ts.strftime("%H:%M");
                    uniqueTimes[timeStr] = show.ts.time();
                });
                let times = utils.sort(Object.keys(uniqueTimes), timeStr => uniqueTimes[timeStr]);

                let days = [];
                let date = rangeStart;
                while (date <= rangeEnd) {
                    let dateStr = date.strftime("%Y-%m-%d");
                    let showsForDay = byDate[dateStr]?.shows || [];

                    let showsAtTime = {};
                    showsForDay.forEach(show => {
                        let timeStr = show.ts.strftime("%H:%M");
                        showsAtTime[timeStr] = show;
                    });

                    days.push({
                        date: date,
                        dateStr: dateStr,
                        showsAtTime: showsAtTime,
                    });

                    date = dt.datetime(date + dt.timedelta({days: 1}));
                }

                return {
                    times,
                    days,
                };
            },
        },

        methods: {
            toggleAct(act) {
                if (this.activeAct == act) {
                    this.activeAct = null;
                } else {
                    this.activeAct = act;
                }
            },

            trackTickets() {
                // Fire the Facebook Pixel event
                if (typeof window != "undefined" && window.fbq) {
                    window.fbq("track", "InitiateCheckout", {
                        content_name: this.metas.slug,
                    });
                }
            },

            formatTime(timeStr) {
                let parts = timeStr.split(":");
                let hour = parseInt(parts[0]);
                let minute = parts[1];
                let ampm = hour >= 12 ? "pm" : "am";
                let displayHour = hour % 12;
                if (displayHour == 0) {
                    displayHour = 12;
                }
                return `${displayHour}:${minute}${ampm}`;
            },

            isToday(date) {
                return date.strftime("%Y-%m-%d") == this.now.strftime("%Y-%m-%d");
            },

            selectShow(show) {
                this.selectedShow = show;
                this.activeAct = null;
            },
        },
    };
</script>

<template>
    <section class="shows-listing">
        <main>
            <div class="compact-view" v-if="!expandedView">
                <h2>{{ blok?.title || "Dates &amp; Times" }}</h2>
                <div class="matrix-container">
                    <div
                        class="matrix-grid"
                        :style="{'grid-template-columns': 'auto repeat(' + allDays.days.length + ', 1fr)'}"
                    >
                        <div class="time-header-corner">Time</div>
                        <div
                            v-for="day in allDays.days"
                            :key="day.dateStr"
                            class="day-header"
                            :class="{'is-today': isToday(day.date)}"
                        >
                            <div class="day-name">{{ day.date.strftime("%a")[0] }}</div>
                            <div class="day-number">{{ day.date.strftime("%d") }}</div>
                        </div>

                        <template v-for="time in allDays.times" :key="time">
                            <div class="time-cell">{{ formatTime(time) }}</div>
                            <div v-for="day in allDays.days" :key="day.dateStr" class="show-cell">
                                <button
                                    v-if="day.showsAtTime[time]"
                                    class="show-dot-btn"
                                    :class="{'is-selected': selectedShow == day.showsAtTime[time]}"
                                    @click="selectShow(day.showsAtTime[time])"
                                    :title="`${day.showsAtTime[time].venue.name} - ${formatTime(time)}`"
                                >
                                    <div class="dot-inner"></div>
                                </button>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- Show Details Panel -->
                <transition name="fade">
                    <div v-if="selectedShow" class="show-details-modal-overlay" @click.self="selectedShow = null">
                        <div class="selected-show-details">
                            <div class="details-header">
                                <h3>Show Details</h3>
                                <button @click="selectedShow = null" class="close-btn">
                                    <Icon name="close" />
                                </button>
                            </div>
                            <div class="details-body">
                                <div class="datetime-venue">
                                    <div class="date-time">
                                        {{ selectedShow.date.strftime("%A, %b %d") }} at
                                        {{ selectedShow.ts.strftime("%H:%M") }}
                                        <Icon
                                            name="nights_stay"
                                            class="late-night-icon"
                                            v-if="selectedShow.ts.hour <= 5"
                                        />
                                    </div>
                                    <div class="venue-name">{{ selectedShow.venue.name }}</div>
                                </div>

                                <!-- Lineup (reusing the expanded view lineup UI style) -->
                                <div class="lineup" v-if="metas.showLineup || metas.showHosts">
                                    <div class="headshots">
                                        <template v-if="selectedShow.acts.length > selectedShow.total_act_spots / 2">
                                            <template v-if="metas.showHosts">
                                                <button
                                                    v-for="(act, idx) in selectedShow.hosts"
                                                    :key="idx"
                                                    @click="toggleAct(act)"
                                                    class="headshot-container"
                                                    :class="{
                                                        active: act == activeAct,
                                                        faded: activeAct && act != activeAct,
                                                    }"
                                                    :title="act.name"
                                                >
                                                    <div class="overlay" />
                                                    <Headshot :act="act" />
                                                </button>
                                                <div class="spacer" />
                                            </template>

                                            <button
                                                v-for="(act, idx) in selectedShow.acts"
                                                :key="idx"
                                                @click="toggleAct(act)"
                                                class="headshot-container"
                                                :class="{
                                                    active: act == activeAct,
                                                    faded: activeAct && act != activeAct,
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
                                            (activeAct && selectedShow.acts.includes(activeAct)) ||
                                            selectedShow.hosts.includes(activeAct)
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

                                <div class="ticket-info">
                                    <div
                                        class="tickets flexer"
                                        v-if="
                                            selectedShow.tickets_available != undefined &&
                                            selectedShow.tickets_available < 20
                                        "
                                        :class="{
                                            'running-low':
                                                selectedShow.tickets_available <= 20 &&
                                                selectedShow.tickets_available > 10,
                                            'last-few': selectedShow.tickets_available <= 10,
                                            'sold-out': selectedShow.tickets_available == 0,
                                        }"
                                    >
                                        <Icon name="confirmation_number" />
                                        <template
                                            v-if="
                                                selectedShow.tickets_available <= 20 &&
                                                selectedShow.tickets_available > 10
                                            "
                                        >
                                            Running Low
                                        </template>
                                        <template v-else-if="selectedShow.tickets_available > 0">
                                            Last few left
                                        </template>
                                        <template v-else-if="selectedShow.tickets_available == 0"> Sold out </template>
                                    </div>

                                    <a
                                        :href="selectedShow.tickets"
                                        target="blank"
                                        class="action"
                                        v-if="
                                            selectedShow.tickets_available == undefined ||
                                            selectedShow.tickets_available > 0
                                        "
                                        @click="trackTickets()"
                                    >
                                        {{ metas.payment == "unticketed" ? "More Details" : "Get tickets" }}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>

            <div class="expanded-view" v-else>
                <h2>{{ blok?.title || "Upcoming Shows" }}</h2>
                <div v-for="day in upcoming" :key="day.date">
                    <a
                        :id="day.date.strftime('%Y_%m_%d')"
                        :href="`#${day.date.strftime('%Y_%m_%d')}`"
                        class="date-anchor"
                    >
                        <div class="day-header">{{ day.date.strftime("%A") }}, {{ humanDate(day.date) }}</div>
                    </a>
                    <div class="shows">
                        <template v-for="show in day.shows" :key="show.id">
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
                                            (activeAct && show.acts.includes(activeAct)) ||
                                            show.hosts.includes(activeAct)
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
            </div>
        </main>
    </section>
</template>

<style lang="css">
    .shows-listing {
        .late-night-icon {
            color: var(--accent-pink);
        }

        .late-night-disclaimer {
            color: var(--accent-pink);
            font-size: var(--font-size-sm);
        }

        .compact-view {
            margin-top: 1.5em;

            .matrix-container {
                overflow-x: auto;
                border: 1px solid var(--shadow);
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.05);
                box-shadow: 0 4px 20px var(--shadow);
                margin-bottom: 2em;
                -webkit-overflow-scrolling: touch;
            }

            .matrix-grid {
                display: grid;
                width: max-content;
                min-width: 100%;
                font-family: var(--rgb-font);
                background: var(--shadow);
                gap: 1px;
                padding-bottom: 5px;
            }

            .time-header-corner,
            .day-header,
            .time-cell,
            .show-cell {
                padding: 4px 2px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
            }

            .time-header-corner {
                font-size: 0.6em;
                text-transform: uppercase;
                color: var(--label);
                font-weight: 600;
                min-width: 3.2em;
                position: sticky;
                left: 0;
                z-index: 10;
                background: #fafafa;
                border-right: 2px solid var(--shadow);
            }

            .day-header {
                min-width: 1.6em;
                background: #fafafa;

                .day-name {
                    font-size: 10px;
                    text-transform: uppercase;
                    color: var(--label);
                    font-weight: 600;
                }

                .day-number {
                    font-size: clamp(10px, 1.5vw, 18px);
                    font-weight: 700;
                    margin-top: 1px;
                }

                &.is-today {
                    background: var(--chrome-x1);
                    color: var(--chrome-text);

                    .day-name {
                        color: var(--chrome-text);
                    }
                }
            }

            .time-cell {
                font-weight: 600;
                font-size: 10px;
                color: var(--label);
                position: sticky;
                left: 0;
                z-index: 9;
                background: #fafafa;
                border-right: 2px solid var(--shadow);
                padding: 0 5px;
            }

            .show-cell {
                background: var(--light);
                padding: 0;
                aspect-ratio: 1;
            }

            .show-dot-btn {
                background: none;
                border: none;
                padding: 0;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: clamp(10px, 1.5vw, 13px);
                height: clamp(10px, 1.5vw, 13px);
                transition:
                    transform 200ms ease,
                    background-color 200ms ease;

                .dot-inner {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background-color: var(--accent-pink);
                    transition:
                        transform 200ms ease,
                        background-color 200ms ease;
                }

                &:hover {
                    transform: scale(1.2);
                    background-color: rgba(var(--chrome-x1), 0.1);

                    .dot-inner {
                        background-color: var(--chrome);
                    }
                }

                &.is-selected {
                    transform: scale(1.2);
                    background-color: rgba(var(--chrome), 0.15);
                    border: 1px dashed var(--chrome);

                    .dot-inner {
                        background-color: var(--chrome);
                        transform: scale(0.8);
                    }
                }
            }

            .show-details-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(4px);
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1.5em;
            }

            .selected-show-details {
                background: var(--light);
                border: 1px solid var(--shadow);
                border-radius: 12px;
                padding: 1.5em;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
                text-align: left;
                width: 100%;
                max-width: 500px;
                position: relative;
                max-height: 90vh;
                overflow-y: auto;

                .details-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid var(--shadow);
                    padding-bottom: 0.8em;
                    margin-bottom: 1em;

                    h3 {
                        margin: 0;
                        font-family: var(--rgb-font);
                        font-size: var(--font-size-xl);
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    }

                    .close-btn {
                        background: none;
                        border: none;
                        cursor: pointer;
                        color: var(--label);
                        padding: 4px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        transition: background-color 200ms ease;

                        &:hover {
                            background-color: var(--shadow);
                        }
                    }
                }

                .details-body {
                    display: grid;
                    gap: 1.2em;
                }

                .datetime-venue {
                    .date-time {
                        font-size: var(--font-size-xl);
                        font-weight: 700;
                        display: flex;
                        align-items: center;
                        gap: 0.3em;
                    }

                    .venue-name {
                        font-size: var(--font-size-md);
                        color: var(--label);
                        margin-top: 4px;
                    }
                }

                .ticket-info {
                    display: flex;
                    align-items: center;
                    gap: 1em;
                    flex-wrap: wrap;
                    margin-top: 0.5em;
                }

                .action {
                    display: inline-block;
                    padding: 12px 24px;
                    background: var(--chrome);
                    color: var(--chrome-text);
                    font-weight: 600;
                    border-radius: 6px;
                    text-decoration: none;
                    text-align: center;
                    transition: opacity 200ms ease;

                    &:hover {
                        opacity: 0.9;
                    }
                }

                .lineup {
                    margin-top: 0.5em;
                    border-top: 1px dashed var(--shadow);
                    padding-top: 1em;

                    .headshots {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 10px;
                        align-items: center;

                        .spacer {
                            width: 15px;
                        }
                    }

                    .headshot-container {
                        position: relative;
                        margin-right: -30px;
                        background: none;
                        border: none;
                        padding: 0;
                        cursor: pointer;

                        &:last-child {
                            margin-right: 0;
                        }

                        .headshot,
                        .overlay {
                            width: 60px;
                            height: 60px;
                            border-radius: 50%;
                            border: 2px solid var(--light);
                        }

                        .overlay {
                            position: absolute;
                            top: 0;
                            left: 0;
                            background: var(--light);
                            pointer-events: none;
                            opacity: 0;
                            transition: opacity 300ms ease;
                        }

                        &.active {
                            z-index: 300;
                            .headshot {
                                border: 2px solid var(--light);
                                box-shadow: 0 0 5px 2px var(--light);
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
                        background: #fdfdfd;
                        border: 1px solid var(--shadow);
                        border-radius: 8px;
                        padding: 10px;

                        .act-name {
                            font-weight: 600;
                            font-size: var(--font-size-md);
                        }

                        .bio {
                            padding: 4px 0;
                            font-size: var(--font-size-sm);
                            line-height: 140%;
                            color: #555;
                        }
                    }
                }
            }

            .fade-enter-active,
            .fade-leave-active {
                transition:
                    opacity 300ms ease,
                    transform 300ms ease;
            }
            .fade-enter-from,
            .fade-leave-to {
                opacity: 0;
                transform: translateY(10px);
            }
        }

        .expanded-view {
            .day-header {
                color: var(--header-color);
                font-weight: 600;
                font-size: 1.25em;
                letter-spacing: 0.025em;
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
    }
</style>
