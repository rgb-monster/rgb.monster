<script setup>
    import dt from "py-datetime";
    import {useData} from "vitepress";
    const {frontmatter} = useData();
    let year = dt.datetime.now().year;
</script>

<template>
    <footer class="site light" v-if="frontmatter.footer == 'light'">&copy; {{ year }} RGB MONSTER</footer>
    <footer class="site brush" v-else-if="frontmatter.footer == 'brush'">
        <div class="doodle">
            <div>&copy; {{ year }} RGB MONSTER</div>
        </div>
    </footer>

    <footer class="site" v-else>RGB MONSTER LIMITED 33 FOLEY STREET, LONDON, W1W 7TL. COMPANY NUMBER 14897378.</footer>
</template>

<style lang="scss">
    footer.site {
        background: var(--chrome);
        color: var(--chrome-text);
        padding: 1em;
        text-align: center;

        font-size: 0.85em;

        &.light {
            background: var(--base);
            color: var(--base-text);
        }

        &.brush {
            background: transparent;
            padding: 0;

            .doodle {
                //width: min(500px, 80vw);
                height: 130px;
                background-image: url(/doodles/brush-bottom.webp);
                background-repeat: no-repeat;

                display: flex;
                align-items: center;
                justify-content: center;

                max-width: min(100vw, 1000px);
                margin: 0 auto;
                & > div {
                    color: var(--text);
                }
            }
        }
    }
</style>
