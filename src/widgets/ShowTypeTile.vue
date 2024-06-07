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
    <div class="show-type-tile">
        <header>{{ showType.name }}</header>

        <div class="meta">
            <div class="tags">
                <div v-for="tag in meta.tags" :class="tag">{{ tag }}</div>
            </div>
            <div class="dates">{{ dates }}</div>
            <div class="times">{{ times.join(", ") }}</div>
        </div>
    </div>
</template>

<style type="text/scss">
    .show-type-tile {
        border: 1px solid #ccc;
        padding: 15px;
        border-radius: 10px;
        background: var(--light);

        border: 2px solid var(--shadow);
        box-shadow: 0 1px 5px var(--shadow);

        display: grid;
        gap: 1em;

        text-align: left;

        header {
            font-size: 1.25em;
            font-weight: 600;
        }

        .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;

            & > div {
                padding: 5px;

                &.kids {
                    background: yellow;
                }
            }
        }
    }
</style>
