<script>
    import chroma from "chroma-js";
    import Console from "@/widgets/RGBConsole.vue";
    import {useStore} from "@/shows.js";

    export default {
        components: {
            Console,
        },
        props: {
            blok: Object,
        },
        data() {
            let [h, s, l] = chroma("yellow").hsl();
            s = s * 10;
            l = l * 50;

            return {
                store: useStore(),
                beamColor: "yellow",
                wallColor: [h, s, l],
                outerJags: 0,
                currentItemIdx: 0,
                resizeObserver: null,
            };
        },

        computed: {
            showcaseItems() {
                let items = [];

                if (this.blok.include_video) {
                    items.push({
                        type: "video",
                        description: `We're a comedy production company that also makes software. We're producing over 20
                                    shows in fringe festivals around the world. You can catch us next at Edinburgh Festival
                                    Fringe in August!`,
                        webm: "https://storage.googleapis.com/rgb-monster-assets/main/sizzle-720.webm",
                        mp4: "https://storage.googleapis.com/rgb-monster-assets/main/sizzle-720.mp4",
                    });
                }

                (this.blok.showcase_shows || []).forEach(showId => {
                    const showType = this.store.showTypesByID[showId];
                    if (showType) {
                        items.push({
                            type: showType.video ? "video" : "image",
                            description: showType.shortDescription || showType.description,
                            webm: showType.video,
                            mp4: showType.video,
                            image: showType.coverImage,
                        });
                    }
                });

                return items;
            },

            currentItem: state => (state.showcaseItems || [])[state.currentItemIdx],
            single: state => (state.blok.showcase_shows || []).length + (state.blok.include_video ? 1 : 0) == 1,
        },

        methods: {
            updateColor(color) {
                this.beamColor = color;
                let [h, s, l] = chroma(color).hsl();
                s = s * 10;
                l = l * 50;
                this.wallColor = [h, s, l];
            },
            changeItem(direction) {
                this.currentItemIdx =
                    (this.currentItemIdx + direction + this.showcaseItems.length) % this.showcaseItems.length;
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

        mounted() {
            this.updateColor(this.beamColor);
            this.resizeObserver = new ResizeObserver(this.onResize);
            this.resizeObserver.observe(document.body);
            this.onResize();
            this.store.fetchShows();
        },

        beforeUnmount() {
            this.resizeObserver?.disconnect();
        },
    };
</script>

<template>
    <div class="rgb-stage-container" v-editable="blok">
        <div
            class="rgb-stage"
            :style="{
                background: `hsl(${wallColor[0]}, ${wallColor[1]}%, ${wallColor[2]}%) `,
                '--beam-color': beamColor,
            }"
        >
            <div class="top-fringe" />
            <img class="curtain left" src="/stage/curtain-left.webp" />
            <img class="curtain right" src="/stage/curtain-right.webp" />

            <template v-if="!single">
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
            </template>

            <div class="projector-screen">
                <BorderBox shadow="true" :radius="20">
                    <div class="video-box">
                        <BorderBox :radius="10">
                            <div class="presenter-screen">
                                <template v-if="currentItem">
                                    <video loop muted autoplay v-if="currentItem.type == 'video'">
                                        <source :src="currentItem.webm" type="video/webm" v-if="currentItem.webm" />
                                        <source :src="currentItem.mp4" type="video/mp4" v-if="currentItem.mp4" />
                                    </video>

                                    <img v-else :src="currentItem.image" />
                                </template>
                            </div>
                        </BorderBox>
                    </div>
                </BorderBox>

                <svg height="0" width="0">
                    <defs>
                        <filter id="stage-title-outline">
                            <!-- 1. Enlarge the shape -->
                            <feMorphology in="SourceAlpha" result="DILATED" operator="dilate" radius="3"></feMorphology>

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

            <div class="stage-box" :class="{single}">
                <img class="stage" src="/stage/stage.webp" />

                <div class="laptop-box" v-if="!single">
                    <img class="laptop" src="/stage/laptop.webp" />
                    <div class="laptop-screen">
                        <template v-if="currentItem">
                            <video loop muted autoplay v-if="currentItem.type == 'video'">
                                <source :src="currentItem.webm" type="video/webm" v-if="currentItem.webm" />
                                <source :src="currentItem.mp4" type="video/mp4" v-if="currentItem.mp4" />
                            </video>

                            <img v-show="currentItem.type != 'video'" :src="currentItem.image" />
                        </template>
                    </div>
                    <button class="laptop-button left" @mousedown="changeItem(-1)" />
                    <button class="laptop-button right" @mousedown="changeItem(1)" />
                </div>

                <div class="projector-box" v-if="!single">
                    <img class="projector-beam" src="/stage/light-beam-projector.webp" />
                    <img class="projector" src="/stage/projector.webp" />
                </div>

                <Console :color="beamColor" @update="updateColor($event)" v-if="!single" />
            </div>
        </div>
    </div>
    <div
        :style="{background: `hsl(${wallColor[0]}, ${wallColor[1]}%, ${wallColor[2]}%) `}"
        style="padding-bottom: 2em; margin-top: -2px"
        v-if="!single"
    >
        <img src="/stage/stage-bottom.webp" style="width: 100%" />
    </div>
</template>

<style lang="css">
    .rgb-stage-container {
        width: 100%;
        background: #000;
        display: flex;
        justify-content: center;

        & > div {
            width: 100vw;
            max-width: min(100vw);
            position: relative;
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
                width: 75cqmin;
                margin: 0 auto;
                z-index: 200;

                .presenter-screen {
                    height: 36cqmin;
                    overflow: hidden;

                    img {
                        height: 100%;
                        object-fit: cover;
                    }
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
                }
            }

            .stage-box {
                position: relative;
                margin-top: -3em;

                .stage {
                    width: 100%;
                    height: min(40em, 50cqmin);
                }

                &.single {
                    height: 10.5em;
                    overflow: hidden;

                    .stage {
                        height: 20em;
                    }
                }
            }

            .laptop-box {
                position: absolute;
                width: 40cqmin;
                height: 28.1cqmin;
                right: 60%;
                bottom: 0;

                z-index: 100;
                pointer-events: none;

                .laptop {
                    height: 100%;
                }

                .laptop-screen {
                    position: absolute;

                    top: 9.8%;

                    height: 14cqmin;
                    width: 28cqmin;
                    overflow: hidden;
                    border-radius: 1cqmin;
                    left: 15%;
                    border: 3px solid #000;
                    background: #000;

                    video,
                    img {
                        width: 100%;
                        padding: 0;
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
                bottom: 1cqmin;
                left: 0;
                width: 40cqmin;
                height: 40cqmin;

                left: 50%;
                margin-left: -20cqmin;

                display: grid;
                justify-items: center;
                z-index: 500;

                .projector {
                    position: absolute;
                    z-index: 100;
                    width: 35%;
                    bottom: 10%;
                }

                .projector-beam {
                    position: absolute;
                    z-index: 50;
                    bottom: 70%;
                    width: 50%;
                }
            }

            .console {
                position: absolute;
                width: 37cqmin;
                bottom: 0;
                left: 60%;
            }

            @media --break3 {
                .projector-screen {
                    width: 75cqmin;
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
                }
            }
        }
    }
</style>
