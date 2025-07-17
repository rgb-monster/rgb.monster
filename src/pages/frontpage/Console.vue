<script>
    import utils from "/src/scripts/utils.js";
    import chroma from "chroma-js";

    export default {
        name: "StageConsole",
        emits: ["update"],
        props: {
            colors: Array,
        },
        data() {
            return {
                mode: 0,
                channels: {
                    r: 0,
                    g: 0,
                    b: 0,
                },
                dragging: false,
            };
        },

        watch: {
            colors: {
                deep: true,
                immediate: true,
                handler(colors) {
                    let color = this.colors[this.mode];
                    [this.channels.r, this.channels.g, this.channels.b] = chroma(color).rgb();
                },
            },
            mode() {
                let color = this.colors[this.mode];
                [this.channels.r, this.channels.g, this.channels.b] = chroma(color).rgb();
            },
        },

        methods: {
            async handleDrag(evt, channel) {
                evt.preventDefault();
                this.dragging = true;

                // after selecting we entertain the notion of drag
                let dragElem = evt.target;
                let elemBox = dragElem.getBoundingClientRect();
                let initialPos = utils.mousify(evt).clientY;

                let parentBox = dragElem.parentNode.getBoundingClientRect();
                let minY = parentBox.y;
                let maxY = parentBox.y + parentBox.height - elemBox.height;

                let dragAround = async evt => {
                    let elemY = utils.mousify(evt).clientY;
                    // limit dragging to where the sliders are
                    let elemCurrent = elemBox.y + elemY - initialPos;
                    let cursorY = Math.max(Math.min(elemCurrent, maxY), minY);
                    this.channels[channel] = (1 - (cursorY - minY) / (maxY - minY)) * 255;

                    this.updateColor();
                };

                let release = evt => {
                    this.dragging = false;
                    document.removeEventListener("mouseup", release);
                    document.removeEventListener("touchend", release);
                    document.removeEventListener("mousemove", dragAround);
                    document.removeEventListener("touchmove", dragAround);
                };

                document.addEventListener("mousemove", dragAround);
                document.addEventListener("touchmove", dragAround);
                document.addEventListener("mouseup", release);
                document.addEventListener("touchend", release);
            },

            updateColor() {
                let color = chroma(this.channels).hex();
                this.$emit("update", {color, mode: this.mode});
            },
        },

        mounted() {},
    };
</script>

<template>
    <div class="console">
        <img src="/stage/console.webp" />
        <div class="slider-box-container" @mousedown.stop.prevent="" @touchstart.stop.prevent="">
            <div class="slider-box" :class="{dragging}">
                <img
                    ref="knob1"
                    class="knob knob-1"
                    src="/stage/console-knob-1.webp"
                    @mousedown="handleDrag($event, 'r')"
                    @touchstart="handleDrag($event, 'r')"
                    :style="{bottom: `${(channels.r / 255) * 80}%`}"
                />
                <img
                    ref="knob2"
                    class="knob knob-2"
                    src="/stage/console-knob-2.webp"
                    @mousedown="handleDrag($event, 'g')"
                    @touchstart="handleDrag($event, 'g')"
                    :style="{bottom: `${(channels.g / 255) * 80}%`}"
                />
                <img
                    ref="knob3"
                    class="knob knob-3"
                    src="/stage/console-knob-3.webp"
                    @mousedown="handleDrag($event, 'b')"
                    @touchstart="handleDrag($event, 'b')"
                    :style="{bottom: `${(channels.b / 255) * 80}%`}"
                />
            </div>
        </div>

        <div class="button-box">
            <button class="button button-1" @click="mode = 0" :class="{active: mode == 0}"></button>
            <button class="button button-2" @click="mode = 1" :class="{active: mode == 1}"></button>
        </div>
    </div>
</template>

<style lang="scss">
    .console {
        position: relative;

        user-select: none;

        & > * {
            //pointer-events: none;
        }

        .slider-box-container {
            height: 100%;
            position: absolute;
            top: 0;
            width: 75%;
        }

        .slider-box {
            position: absolute;
            top: 27%;
            left: 8%;
            width: 86%;
            height: 50%;

            .knob {
                pointer-events: all;
                width: 30%;
                position: absolute;
                cursor: grab;

                &.knob-1 {
                    left: 2%;
                }

                &.knob-2 {
                    left: 35%;
                }

                &.knob-3 {
                    left: 72%;
                }
            }

            &.dragging .knob {
                cursor: grabbing;
            }
        }

        @keyframes pulse-brightness {
            0% {
                filter: brightness(200%);
            }
            50% {
                filter: brightness(800%);
            }
            100% {
                filter: brightness(200%);
            }
        }

        .button {
            pointer-events: all;
            position: absolute;
            width: 20%;
            right: 5%;

            height: 20%;

            background-image: url(/stage/console-button.webp);
            background-size: 100% 100%;
            background-repeat: no-repeat;

            &.active {
                background-image: url(/stage/console-button-pressed.webp);
                animation-name: pulse-brightness;
                animation-duration: 4s; /* The total time for one full cycle */
                animation-iteration-count: infinite; /* Loop the animation forever */
                animation-timing-function: ease-in-out; /* Makes the transition smoother */
            }

            &.button-1 {
                bottom: 60%;
            }

            &.button-2 {
                bottom: 30%;
            }
        }
    }
</style>
