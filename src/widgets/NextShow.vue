<script>
    import {useStore} from "/src/stores/shows.js";

    export default {
        name: "NextShow",
        components: {},
        props: {
            filter: String,
        },
        data() {
            return {};
        },
        methods: {},

        mounted() {},

        beforeUnmount() {},
    };
</script>

<template>
    <div class="next-show-box">
        <div class="contents-container">
            <BorderBox>
                <div class="inner">
                    <InkHeader :offset="false"> Next Show Happening </InkHeader>
                    <div class="next-show-info">asdfasdf asdf asdf asdf asd fas</div>
                </div>
            </BorderBox>
        </div>
    </div>
</template>

<style lang="scss">
    .next-show-box {
        min-height: 30em;
        display: flex;
        justify-content: center;

        .contents-container {
            width: 70cqmin;
            z-index: 300;
        }

        .inner {
            background: var(--beige);
            overflow: hidden;
        }

        .ink-header {
            background: var(--pink);
            padding: 20px;
            padding-top: 30px;
            margin-top: -12px;
            font-size: 5cqmin;
        }

        .next-show-info {
            padding: 20px;
        }
    }
</style>
