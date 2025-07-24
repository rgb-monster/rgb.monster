<script>
    import chroma from "chroma-js";
    import Console from "./RGBConsole.vue";

    export default {
        name: "FrontpageStage",
        components: {
            Console,
        },
        props: {
            items: Array,
        },
        data() {
            return {
                colors: ["yellow", "#ffe9bd"],
                wallColor: [],
                screenColor: "",
                outerJags: 0,
                currentItemIdx: 0,
            };
        },
        methods: {
            updateColor({color, mode}) {
                this.colors[mode] = color;
                let [h, s, l] = chroma(color).hsl();
                if (mode == 0) {
                    s = s * 10;
                    l = l * 50;
                    this.wallColor = [h, s, l];
                } else if (mode == 1) {
                    s = s * 0.6;
                    l = l;
                    this.screenColor = chroma.hsl(h, s, l).hex();
                }
            },
            changeItem(direction) {
                this.currentItemIdx = (this.currentItemIdx + direction + this.items.length) % this.items.length;
            },

            onResize() {
                let [width, height] = [window.innerWidth, window.innerHeight];
                if (height * 1.1 - width < 10) {
                    this.outerJags = 15;
                } else {
                    this.outerJags = 0;
                }
            },
        },

        computed: {
            beamColor: state => state.colors[0],
            currentItem: state => state.items[state.currentItemIdx],
        },

        mounted() {
            this.colors.forEach((color, mode) => {
                this.updateColor({color, mode});
            });

            this.resizeObserver = new ResizeObserver(this.onResize);
            this.resizeObserver.observe(document.body);
            this.onResize();
        },

        beforeUnmount() {
            this.resizeObserver.disconnect();
        },
    };
</script>

<template>
    <div class="rgb-stage-container">
        <BorderBox :jaggedness="outerJags" :radius="0" :horizOnly="true" :style="{'--beam-color': beamColor}">
            <div class="rgb-stage" :style="{background: `hsl(${wallColor[0]}, ${wallColor[1]}%, ${wallColor[2]}%) `}">
                <div class="top-fringe" />
                <img class="curtain left" src="/stage/curtain-left.webp" />
                <img class="curtain right" src="/stage/curtain-right.webp" />
                <img class="fixture left" src="/stage/light-left.webp" />
                <img class="fixture right" src="/stage/light-right.webp" />


                <svg
                    width="573.548"
                    height="380.793"
                    viewBox="0 0 151.751 100.751"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    xmlns="http://www.w3.org/2000/svg"
                    class="beam right"
                    :style="{'mix-blend-mode': 'lighten'}"
                >
                    <defs>
                        <linearGradient id="b1">
                            <stop :style="`stop-color: var(--beam-color); stop-opacity: 0`" offset="0" />
                            <stop :style="`stop-color: var(--beam-color); stop-opacity: 0.64705884`" offset=".079" />
                            <stop :style="`stop-color: var(--beam-color); stop-opacity: 0`" offset="1" />
                        </linearGradient>
                        <linearGradient
                            xlink:href="#a1"
                            id="d1"
                            gradientUnits="userSpaceOnUse"
                            x1="9.648"
                            y1="36.34"
                            x2="457.311"
                            y2="290.402"
                            gradientTransform="matrix(.25273 -.0783 .0783 .25273 13.342 69.554)"
                        />
                        <linearGradient id="a1">
                            <stop :style="`stop-color: var(--beam-color); stop-opacity: 0`" offset="0" />
                            <stop :style="`stop-color: var(--beam-color); stop-opacity: 0.64705884`" offset=".079" />
                            <stop :style="`stop-color: var(--beam-color); stop-opacity: 0`" offset="1" />
                        </linearGradient>
                        <linearGradient
                            xlink:href="#b1"
                            id="c1"
                            x1="9.648"
                            y1="36.34"
                            x2="457.311"
                            y2="290.402"
                            gradientUnits="userSpaceOnUse"
                            gradientTransform="matrix(.26458 0 0 .26458 17.607 71.493)"
                        />
                    </defs>
                    <path
                        style="
                            mix-blend-mode: normal;
                            fill: url(#c1);
                            stroke: none;
                            stroke-width: 0.264583px;
                            stroke-linecap: butt;
                            stroke-linejoin: miter;
                            stroke-opacity: 1;
                        "
                        d="m11.821 85.788 127.464 83.047 15.826-33.525L22.372 72.004Z"
                        transform="translate(-11.821 -68.631)"
                    />
                    <path
                        style="
                            fill: url(#d1);
                            stroke: none;
                            stroke-width: 0.264583px;
                            stroke-linecap: butt;
                            stroke-linejoin: miter;
                            stroke-opacity: 1;
                        "
                        d="m12.045 84.92 146.331 41.607 5.197-36.708L18.044 68.631Z"
                        transform="translate(-11.821 -68.631)"
                    />
                </svg>

                <svg
                    width="573.548"
                    height="380.793"
                    viewBox="0 0 151.751 100.751"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    xmlns="http://www.w3.org/2000/svg"
                    class="beam left"
                    :style="{'mix-blend-mode': 'lighten'}"
                >
                    <defs>
                        <linearGradient id="b">
                            <stop :style="`stop-color: var(--beam-color); stop-opacity: 0`" offset="0" />
                            <stop :style="`stop-color: var(--beam-color); stop-opacity: 0.64705884`" offset=".079" />
                            <stop :style="`stop-color: var(--beam-color); stop-opacity: 0`" offset="1" />
                        </linearGradient>
                        <linearGradient
                            xlink:href="#a"
                            id="d"
                            gradientUnits="userSpaceOnUse"
                            x1="9.648"
                            y1="36.34"
                            x2="457.311"
                            y2="290.402"
                            gradientTransform="matrix(.25273 -.0783 .0783 .25273 13.342 69.554)"
                        />
                        <linearGradient id="a">
                            <stop :style="`stop-color: var(--beam-color); stop-opacity: 0`" offset="0" />
                            <stop :style="`stop-color: var(--beam-color); stop-opacity: 0.64705884`" offset=".079" />
                            <stop :style="`stop-color: var(--beam-color); stop-opacity: 0`" offset="1" />
                        </linearGradient>
                        <linearGradient
                            xlink:href="#b"
                            id="c"
                            x1="9.648"
                            y1="36.34"
                            x2="457.311"
                            y2="290.402"
                            gradientUnits="userSpaceOnUse"
                            gradientTransform="matrix(.26458 0 0 .26458 17.607 71.493)"
                        />
                    </defs>
                    <path
                        style="
                            mix-blend-mode: normal;
                            fill: url(#c);
                            stroke: none;
                            stroke-width: 0.264583px;
                            stroke-linecap: butt;
                            stroke-linejoin: miter;
                            stroke-opacity: 1;
                        "
                        d="m11.821 85.788 127.464 83.047 15.826-33.525L22.372 72.004Z"
                        transform="translate(-11.821 -68.631)"
                    />
                    <path
                        style="
                            mix-blend-mode: multiply;
                            fill: url(#d);
                            stroke: none;
                            stroke-width: 0.264583px;
                            stroke-linecap: butt;
                            stroke-linejoin: miter;
                            stroke-opacity: 1;
                        "
                        d="m12.045 84.92 146.331 41.607 5.197-36.708L18.044 68.631Z"
                        transform="translate(-11.821 -68.631)"
                    />
                </svg>


                <div class="projector-screen">
                    <BorderBox shadow="true" :radius="20">
                        <div class="video-box" :style="{background: screenColor}">
                            <h1>We are RGB Monster!</h1>

                            <BorderBox :radius="10">
                                <div class="presenter-screen">
                                    <video muted autoplay v-if="currentItem.type == 'video'">
                                        <source :src="currentItem.webm" type="video/webm" v-if="currentItem.webm" />
                                        <source :src="currentItem.mp4" type="video/mp4" v-if="currentItem.mp4" />
                                    </video>

                                    <img v-else :src="currentItem.image" />
                                </div>
                            </BorderBox>

                            <div class="intro">
                                {{ currentItem.description }}
                            </div>
                        </div>
                    </BorderBox>
                    <svg height="0" width="0">
                        <defs>
                            <filter id="stage-title-outline">
                                <!-- 1. Enlarge the shape -->
                                <feMorphology
                                    in="SourceAlpha"
                                    result="DILATED"
                                    operator="dilate"
                                    radius="3"
                                ></feMorphology>

                                <!-- 2. Blur the enlarged shape to round the corners -->
                                <feGaussianBlur in="DILATED" result="BLURRED" stdDeviation="3"></feGaussianBlur>

                                <!-- 3. Create the outline color -->
                                <feFlood flood-color="#f5e6c9" result="flood"></feFlood>

                                <!-- 4. Composite the color into the blurred shape -->
                                <feComposite in="flood" in2="BLURRED" operator="in" result="OUTLINE_GLOW"></feComposite>

                                <!-- 5. Merge the glow and the original text -->
                                <feMerge>
                                    <feMergeNode in="OUTLINE_GLOW" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                    </svg>
                </div>

                <div class="stage-box">
                    <img class="stage" src="/stage/stage.webp" />

                    <div class="laptop-box">
                        <img class="laptop" src="/stage/laptop.webp" />
                        <div class="laptop-screen">
                            <video loop muted autoplay v-show="currentItem.type == 'video'">
                                <source :src="currentItem.webm" type="video/webm" v-if="currentItem.webm" />
                                <source :src="currentItem.mp4" type="video/mp4" v-if="currentItem.mp4" />
                            </video>

                            <img v-show="currentItem.type != 'video'" :src="currentItem.image" />
                        </div>
                        <button class="laptop-button left" @click="changeItem(-1)" />
                        <button class="laptop-button right" @click="changeItem(1)" />
                    </div>

                    <div class="projector-box">
                        <img class="projector-beam" src="/stage/light-beam-projector.webp" />
                        <img class="projector" src="/stage/projector.webp" />
                    </div>

                    <Console :colors="colors" @update="updateColor($event)" />
                </div>
            </div>
        </BorderBox>
    </div>
    <div
        :style="{background: `hsl(${wallColor[0]}, ${wallColor[1]}%, ${wallColor[2]}%) `}"
        style="padding-bottom: 4em; margin-top: -2px"
    >
        <img src="/stage/stage-bottom.webp" />
    </div>
</template>

<style lang="scss">
    .rgb-stage-container {
        width: 100%;
        background: #000;
        display: flex;
        justify-content: center;

        & > div {
            width: 100vw;
            max-width: min(100vw, 110vh);
            position: relative;
        }
    }

    .rgb-stage {
        --fixture-width: 12cqmin;

        .top-fringe {
            position: absolute;
            top: 0;
            z-index: 500;

            background: url(/stage/top-fringe.webp);
            background-repeat: repeat-x;
            background-size: contain;
            background-position: center;

            height: calc(3px + 0.9cqmin);
            left: 0;
            right: 0;
        }

        .curtain {
            position: absolute;
            z-index: 400;
            top: 0;
            height: 47cqmin;

            &.left {
                left: 0;
            }

            &.right {
                right: 0;
            }
        }

        .fixture {
            position: absolute;
            z-index: 400;
            top: 0;
            width: var(--fixture-width);

            &.left {
                left: 0;
            }

            &.right {
                right: 0;
            }
        }

        .beam {
            position: absolute;
            z-index: 500;
            top: 2cqmin;
            width: 35cqmin;
            height: 35cqmin;
            pointer-events: none;

            --offset: calc(var(--fixture-width) - 4cqmin);

            &.left {
                left: var(--offset);
            }

            &.right {
                right: var(--offset);
                transform: scaleX(-1);
            }
        }

        .projector-screen {
            position: relative;
            align-items: center;
            padding-top: 2cqmin;
            width: 60cqmin;
            margin: 0 auto;
            z-index: 200;
            margin-bottom: -7cqmin;

            .presenter-screen {
                height: 28.6cqmin;
            }

            .video-box {
                background: var(--beige);
                padding: 1.5cqmin;
                display: grid;
                gap: 1.2cqmin;
                align-items: center;
                justify-items: center;
            }

            font-size: 1.5cqmin;

            h1 {
                margin-bottom: -1cqmin;
                margin-top: -0.5cqmin;

                filter: url(#stage-title-outline);
            }

            .intro {
                color: var(--brown);
                font-size: 1.1em;
                font-weight: 600;
                line-height: 140%;
                text-align: center;
                filter: url(#stage-title-outline);
                height: 4em;
                display: flex;
                align-items: center;
            }

            .box-container {
                position: relative;
                //padding: 20px;
            }
        }

        .stage-box {
            position: relative;

            .stage {
                width: 100%;
            }
        }

        .laptop-box {
            position: absolute;
            width: 40cqmin;
            height: 28.1cqmin;
            left: 1cqmin;
            bottom: 0cqmin;

            z-index: 100;
            pointer-events: none;

            .laptop {
                height: 100%;
            }

            .laptop-screen {
                position: absolute;
                left: 0;
                left: 19%;
                top: 10%;

                width: 60%;

                video,
                img {
                    width: 100%;
                    line-height: 100%;
                    padding: 0;
                    border: 4px solid #000;
                    border-radius: 1cqmin;
                }
            }

            .laptop-button {
                width: 30%;
                height: 20%;
                position: absolute;
                bottom: 12%;
                background-image: url(/stage/laptop-button.webp);
                background-size: 100% 100%;
                background-repeat: no-repeat;
                pointer-events: all;

                &.left {
                    left: 5cqmin;
                    transform: scaleX(-1);
                }

                &.right {
                    right: 5cqmin;
                }

                &:active {
                    background-image: url(/stage/laptop-button-pressed.webp);
                }
            }
        }

        .projector-box {
            position: absolute;
            pointer-events: none;
            bottom: 0cqmin;
            left: 0;
            width: 100%;
            display: grid;
            justify-items: center;
            z-index: 500;

            .projector-beam {
                width: 20cqmin;
                top: 0;
                z-index: 50;
                margin-bottom: -12cqmin;
            }

            .projector {
                z-index: 100;
                width: 100%;
                width: 15cqmin;
            }
        }

        .console {
            position: absolute;
            width: 37cqmin;
            bottom: 3cqmin;
            right: 1.5cqmin;
        }

        @media (max-width: mixins.$break3) {
            .projector-screen {
                width: 74cqmin;
                .intro {
                    font-size: 3cqmin;
                    padding: 1cqmin 3cqmin;
                }
            }

            .projector-box {
                display: none;
            }

            .laptop-box {
                width: 46cqmin;
            }

            .console {
                width: 46cqmin;
                bottom: 0;
            }
        }
    }
</style>
