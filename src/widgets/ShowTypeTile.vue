<script>
    import utils from "../scripts/utils.js";

    export default {
        name: "ShowTypeTile",
        props: {
            // these are optional props for if your button has a linkable state
            showType: Object,
            filter: String,
            active: Boolean,
        },
        data() {
            return {
                showHovers: false,
            };
        },
        computed: {
            dates() {
                let byDate = {};
                this.showType.shows.forEach(show => {
                    byDate[show.ts.strftime("%Y-%m-%d")] = show.ts;
                });

                let dates = utils.sort(Object.values(byDate));
                if (dates.length < 3) {
                    return dates.map(ts => utils.humanDate(ts)).join(", ");
                } else {
                    let [start, end] = [dates[0], dates[dates.length - 1]];
                    return `${start.strftime("%d %b")} - ${end.strftime("%d %b")}`;
                }
            },

            times() {
                let byTime = {};
                this.showType.shows.forEach(show => {
                    byTime[show.ts.strftime("%H:%M")] = show.ts;
                });
                return utils.sort(Object.values(byTime), ts => ts.time()).map(ts => ts.strftime("%H:%M"));
            },

            filterIfPresent: state => (state.filter ? `?festival=${state.filter.replace(/\s/g, "+")}` : ""),
        },
    };
</script>

<template>
    <BorderBox class="show-type-tile">
        <a :class="(showType.tags || [])[0]" :href="`/${showType.slug}${filterIfPresent}`">
            <div class="cover-image" v-if="showType.coverThumb">
                <video
                    v-if="showHovers && showType.hoverVideo"
                    :src="showType.hoverVideo"
                    v-show="active"
                    loop
                    muted
                    autoplay
                    playsinline
                    ref="video"
                    :poster="showType.coverThumb"
                />
                <img :src="showType.coverThumb" v-show="!showHovers || !showType.hoverVideo || !active" />
            </div>
            <header v-html="showType.title" />

            <div class="description">{{ showType.shortDescription }}</div>

            <div class="tags">
                <div v-for="tag in showType.tags.slice(0, 1)" :class="tag">{{ tag }}</div>
            </div>

            <div class="meta">
                <div class="dates">
                    <Icon name="calendar_month" />
                    <div>
                        {{ dates }}
                    </div>
                </div>
                <div class="times">
                    <Icon name="schedule" />
                    <div>
                        {{ times.join(", ") }}
                    </div>
                </div>
            </div>
        </a>
    </BorderBox>
</template>

<style lang="scss">
    .show-type-tile {
        border-radius: 8px;

        transition: border 300ms ease, box-shadow 300ms ease;

        display: flex;
        flex-direction: column;
        text-align: left;

        --tile-padding: 25px;

        font-family: var(--body-font);
        font-weight: 600;

        & > .contents {
            height: 100%;
            background: var(--beige);
            padding: 10px;
            display: grid;
        }

        a {
            cursor: pointer;
            height: 100%;
            overflow: hidden;
        }

        .cover-image {
            display: flex;
            width: 100%;

            img,
            video {
                max-width: 100%;
                object-position: center;
                object-fit: contain;
            }
        }

        header {
            font-size: 1.5em;
            font-weight: 600;
            padding: 10px;
            text-align: center;
            color: var(--brown);
            font-family: var(--rgb-font);
        }

        .description {
            padding: 0 var(--tile-padding);
            color: var(--label);
            text-align: center;
        }

        .tags {
            padding: 5px var(--tile-padding);
            text-align: center;

            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            justify-content: center;

            & > div {
                font-weight: 600;
                color: var(--accent-pink);

                &.kids {
                    color: var(--pink);
                }

                &.format {
                    color: var(--green);
                }

                &.unique {
                    color: var(--blue);
                }
            }
        }

        .meta {
            padding: 0 var(--tile-padding);
            padding-bottom: calc(var(--tile-padding) / 2);
            display: grid;
            gap: 5px;
        }

        .dates,
        .times {
            display: flex;
            align-items: center;
            gap: 5px;

            .icon {
                font-size: 1.25em;
            }
        }

        @media (max-width: mixins.$break3) {
            --tile-padding: 10px;
            max-width: 400px;
            margin: 0 auto;
        }
    }
</style>
