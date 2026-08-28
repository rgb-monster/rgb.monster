<script setup>
    definePageMeta({layout: false});
    useHead({
        title: "Toast Live",
        meta: [
            {name: "robots", content: "noindex"},
            {name: "color-scheme", content: "light"},
        ],
        htmlAttrs: {style: "color-scheme: only light; background: #fff"},
    });
</script>

<script>
    import dt from "py-datetime";

    // Captured before Nuxt boots: the router rewrites the URL during hydration
    let launchFlags = "";
    if (import.meta.client) {
        launchFlags = window.location.search.slice(1) || window.location.hash.slice(1);
    }

    export default {
        data() {
            return {
                time: "",
                active: false,
                facing: "front",
                flips: 0,
                skipAnchor: null,
                cycle: 0,
                stroke: 0,
                frame: null,
                timer: null,
                wakeLock: null,
                painted: 0,
                layerCount: 10,
                spacingStep: 6,
                spinWindow: 60,
                growWindow: 5,
                flipMinute: 750,
                testing: false,
                debug: false,
                readout: "",
                reported: 0,
                testInterval: 180,
                testOrigin: 0,
            };
        },
        computed: {
            layers() {
                return Array.from({length: this.layerCount}, (_, index) => index);
            },
            sides() {
                if (this.active) {
                    return ["front", "back"];
                }
                return [this.facing];
            },
            pieces() {
                let pieces = [];
                if (this.active) {
                    pieces = this.layers.map((index) => ({key: index, face: false, style: this.layerStyle(index)}));
                }
                pieces.push({key: "face", face: true, style: {}});
                return pieces;
            },
            windowEnd() {
                return this.spinWindow + this.growWindow;
            },
        },
        methods: {
            stackStyle(side) {
                if (side == "back") {
                    return {transform: `rotateY(180deg) translateZ(calc(var(--spacing) * ${this.layerCount}))`};
                }
                return {};
            },
            layerStyle(index) {
                let shade = Math.round(150 - (index / this.layerCount) * 120);
                let color = `rgb(${shade} ${shade} ${shade})`;
                return {
                    transform: `translateZ(calc(var(--spacing) * ${-index}))`,
                    color: color,
                    "-webkit-text-stroke-color": color,
                };
            },
            smooth(progress) {
                let clamped = Math.min(Math.max(progress, 0), 1);
                return clamped * clamped * (3 - 2 * clamped);
            },
            anchor(seconds) {
                if (this.testing) {
                    let offset = seconds - this.testOrigin;
                    return Math.round(offset / this.testInterval) * this.testInterval + this.testOrigin;
                }
                let now = new Date(seconds * 1000);
                let midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
                return midnight + this.flipMinute * 60;
            },
            position(seconds) {
                return seconds - (this.anchor(seconds) - this.spinWindow / 2);
            },
            skipping(seconds) {
                return this.anchor(seconds) == this.skipAnchor;
            },
            restAngle() {
                return 180 * (this.flips % 2);
            },
            spinAngle(seconds) {
                let position = this.position(seconds);
                if (this.skipping(seconds) || position < 0) {
                    return this.restAngle();
                }
                let turn = 180;
                if (this.flips % 2) {
                    turn = -180;
                }
                return this.restAngle() + turn * this.smooth(position / this.spinWindow);
            },
            bulgeAmount(seconds) {
                let position = this.position(seconds);
                if (this.skipping(seconds)) {
                    return 0;
                }
                if (position >= 0 && position <= this.spinWindow) {
                    return 1;
                }
                if (position < 0 && position > -this.growWindow) {
                    return this.smooth(1 + position / this.growWindow);
                }
                if (position > this.spinWindow && position < this.windowEnd) {
                    return this.smooth(1 - (position - this.spinWindow) / this.growWindow);
                }
                return 0;
            },
            updateClock() {
                this.time = dt.datetime.now().strftime("%H:%M");
            },
            paint(seconds) {
                let angle = this.spinAngle(seconds);
                let bulge = this.bulgeAmount(seconds);
                let clock = this.$refs.clock;
                let facing = "front";
                if (angle > 90 && angle < 270) {
                    facing = "back";
                }
                if (facing != this.facing) {
                    this.facing = facing;
                }
                clock.style.transform = `rotateY(${angle}deg)`;
                clock.style.setProperty("--spacing", `${0.05 + bulge * this.spacingStep}px`);

                let stroke = Math.round((0.35 + bulge * 0.35) * 40) / 40;
                if (stroke != this.stroke) {
                    this.stroke = stroke;
                    clock.style.setProperty("--stroke", `${stroke}vw`);
                }
            },
            async keepAwake() {
                if (!navigator.wakeLock) {
                    return;
                }
                try {
                    this.wakeLock = await navigator.wakeLock.request("screen");
                } catch (error) {
                    this.wakeLock = null;
                }
            },
            pause() {
                if (document.hidden) {
                    cancelAnimationFrame(this.frame);
                    clearTimeout(this.timer);
                    return;
                }
                this.keepAwake();
                this.tick();
            },
            tick() {
                let seconds = Date.now() / 1000;
                let minute = Math.floor(seconds / 60);
                if (minute != this.cycle) {
                    this.cycle = minute;
                    this.updateClock();
                }

                let position = this.position(seconds);
                if (this.debug && seconds - this.reported > 0.25) {
                    this.reported = seconds;
                    this.readout = [
                        `url ${window.location.href}`,
                        `flags "${launchFlags}"`,
                        `test ${this.testing} every ${this.testInterval}s`,
                        `clock ${new Date().toTimeString().slice(0, 8)}`,
                        `anchor in ${(this.anchor(seconds) - seconds).toFixed(1)}s`,
                        `position ${position.toFixed(1)} of -${this.growWindow}..${this.windowEnd}`,
                        `active ${this.active} skipping ${this.skipping(seconds)} flips ${this.flips}`,
                        `angle ${this.spinAngle(seconds).toFixed(1)} bulge ${this.bulgeAmount(seconds).toFixed(2)}`,
                    ].join("\n");
                }
                if (!this.skipping(seconds) && position > this.windowEnd) {
                    this.flips += 1;
                    this.skipAnchor = this.anchor(seconds);
                }

                if (!this.skipping(seconds) && position >= -this.growWindow && position < this.windowEnd) {
                    this.active = true;
                    if (seconds - this.painted > 0.05) {
                        this.painted = seconds;
                        this.paint(seconds);
                    }
                    this.frame = requestAnimationFrame(this.tick);
                    return;
                }

                this.active = false;
                this.paint(seconds);
                let wait = 60 - (seconds % 60);
                let opening = -this.growWindow - position + 0.05;
                if (opening > 0) {
                    wait = Math.min(wait, opening);
                }
                this.timer = setTimeout(this.tick, Math.max(wait, 0.05) * 1000);
            },
        },
        mounted() {
            let seconds = Date.now() / 1000;
            let flags = launchFlags || window.location.search.slice(1) || window.location.hash.slice(1);
            let params = new URLSearchParams(flags);
            this.testing = params.has("test");
            this.debug = this.testing || params.has("debug");
            this.testInterval = Math.max(Number(params.get("test")) || 0, this.windowEnd * 3);
            if (this.testing) {
                this.testOrigin = seconds + this.spinWindow / 2 + this.growWindow + 5;
            }
            if (!this.testing && seconds > this.anchor(seconds) - this.spinWindow / 2 - this.growWindow) {
                this.skipAnchor = this.anchor(seconds);
            }
            this.cycle = Math.floor(seconds / 60);
            this.updateClock();
            this.tick();
            this.keepAwake();
            document.addEventListener("visibilitychange", this.pause);
        },
        beforeUnmount() {
            if (this.wakeLock) {
                this.wakeLock.release();
                this.wakeLock = null;
            }
            document.removeEventListener("visibilitychange", this.pause);
            cancelAnimationFrame(this.frame);
            clearTimeout(this.timer);
        },
    };
</script>

<template>
    <div class="toast-live">
        <div class="clock-container">
            <div ref="clock" class="clock">
                <span class="sizer">00:00</span>
                <div v-for="side in sides" :key="side" class="stack" :class="side" :style="stackStyle(side)">
                    <span v-for="piece in pieces" :key="piece.key" class="layer" :class="{face: piece.face}" :style="piece.style">{{ time }}</span>
                </div>
            </div>
        </div>
        <img class="toast-logo" src="/toast.webp" alt="Toast" />
        <pre v-if="debug" class="debug">{{ readout }}</pre>
    </div>
</template>

<style lang="css">
    @font-face {
        font-family: toybox;
        src: url(/ToyBox.otf);
    }

    html,
    body {
        color-scheme: only light;
        background: #fff;
        forced-color-adjust: none;
    }

    .toast-live {
        color-scheme: only light;
        forced-color-adjust: none;
        background: #fff;
        overflow: hidden;
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

        .debug {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 10;
            padding: 8px;
            background: #fff;
            color: #000;
            font-family: monospace;
            font-size: 14px;
            line-height: 1.4;
        }

        .clock-container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding-bottom: 5vh;
            perspective: 70vw;
            perspective-origin: 50% 50%;
        }

        .clock {
            position: relative;
            font-size: min(21vw, 34vh);
            line-height: 80%;
            transform-style: preserve-3d;
            will-change: transform;

            .sizer,
            .layer {
                text-align: center;
            }

            .sizer {
                visibility: hidden;
            }

            .stack {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                transform-style: preserve-3d;
            }

            .layer {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                backface-visibility: hidden;
                -webkit-text-stroke-width: var(--stroke, 0.35vw);
                paint-order: stroke fill;
            }

            .face {
                color: #fff;
                -webkit-text-stroke-color: #000;
            }

            .back .face {
                color: #000;
                -webkit-text-stroke-color: #fff;
            }
        }
    }
</style>
