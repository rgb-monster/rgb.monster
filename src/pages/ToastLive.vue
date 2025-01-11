<script>
    import dt from "py-datetime";

    export default {
        name: "ShowPage",
        props: {
            // these are optional props for if your button has a linkable state
            id: String,
        },
        components: {
            // Cover,
        },
        data() {
            return {
                time: "",
            };
        },
        computed: {},

        methods: {
            updateClock() {
                this.time = dt.datetime.now().strftime("%H:%M");
            },
        },

        async mounted() {
            this.timer = setInterval(this.updateClock, 2000);
        },

        beforeUnmount() {
            clearInterval(this.timer);
        },
    };
</script>

<template>
    <div class="toast-live">
        <div class="clock-container">
            <div class="clock">{{ time }}</div>
        </div>
        <img class="toast-logo" src="/toast.webp" />
    </div>
</template>

<style lang="scss">
    main.markdown .toast-live {
        background: #fff;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        display: grid;
        grid-template-rows: 1fr auto;
        justify-content: center;
        padding: 50px;
        gap: 10px;
        font-family: toybox;

        @font-face {
            font-family: toybox;
            src: url(/ToyBox.otf);
        }

        .toast-logo {
            max-width: 30vw;
            margin: 0 auto;
        }

        .clock-container {
            display: flex;
            justify-content: center;
        }

        .clock {
            color: #000;
            font-size: 17vw;
            line-height: 80%;
        }
    }
</style>
