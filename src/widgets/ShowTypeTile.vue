<script>
    import utils from "../scripts/utils.js";
    import showMetas from "../scripts/metas.js";

    export default {
        name: "ShowTypeTile",
        props: {
            // these are optional props for if your button has a linkable state
            showType: Object,
        },
        data() {
            return {};
        },
        computed: {
            meta: state => showMetas[state.showType.name],
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
                    return `${utils.humanDate(start)} - ${utils.humanDate(end)}`;
                }
            },

            times() {
                let byTime = {};
                this.showType.shows.forEach(show => {
                    byTime[show.ts.strftime("%H:%M")] = show.ts;
                });
                return utils.sort(Object.values(byTime), ts => ts.time()).map(ts => ts.strftime("%H:%M"));
            },
        },
    };
</script>

<template>
    <a class="show-type-tile" :href="`/${meta.slug}`">
        <div class="hero-image" v-if="meta.cover">
            <img :src="meta.cover" />
        </div>
        <header>{{ showType.name }}</header>

        <div class="description">{{ meta.short_description }}</div>

        <div class="meta">
            <div class="tags">
                <div v-for="tag in meta.tags.slice(0, 1)" :class="tag">{{ tag }}</div>
            </div>
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
</template>

<style lang="scss">
    .show-type-tile {
        border-radius: 10px;
        background: var(--light);

        border: 2px solid var(--shadow);
        box-shadow: 0 1px 5px var(--shadow);

        display: flex;
        flex-direction: column;
        text-align: left;

        --tile-padding: 25px;

        overflow: hidden;
        .hero-image {
            display: block;

            img {
                max-width: 100%;
                object-position: center;
                object-fit: contain;
            }
        }

        header {
            font-size: 1.25em;
            font-weight: 600;
            padding: 25px;
            margin: 0;
            padding-bottom: 5px;
        }

        .description {
            padding: 0 var(--tile-padding);
        }

        .meta {
            padding: 0 var(--tile-padding);
            padding-bottom: var(--tile-padding);
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

        .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            padding: 5px 0;

            & > div {
                font-weight: 600;
                color: var(--accent-pink);

                &.kids {
                    color: var(--accent-yellow);
                }

                &.format {
                    color: var(--accent-green);
                }

                &.unique {
                    color: var(--accent-red);
                }
            }
        }
    }
</style>
