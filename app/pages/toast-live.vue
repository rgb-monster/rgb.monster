<script setup>
    definePageMeta({layout: false});
    useHead({title: "Toast Live", meta: [{name: "robots", content: "noindex"}]});
</script>

<script>
    import dt from "py-datetime";

    export default {
        data() {
            return {
                time: "",
                timer: null,
            };
        },
        methods: {
            updateClock() {
                this.time = dt.datetime.now().strftime("%H:%M");
            },
        },
        mounted() {
            this.updateClock();
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
        <img class="toast-logo" src="/toast.webp" alt="Toast" />
    </div>
</template>

<style lang="css">
    @font-face {
        font-family: toybox;
        src: url(/ToyBox.otf);
    }

    .toast-live {
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
