<script>
    import chroma from "chroma-js";
    import Console from "./RGBConsole.vue";

    export default {
        name: "FrontpageStage",
        components: {
            Console,
        },
        data() {
            return {
                colors: ["yellow", "#ffe9bd"],
                wallColor: [],
                screenColor: "",

                shows: [
                    "https://storage.googleapis.com/rgb-monster-assets/muck/cover.webp",
                    "https://storage.googleapis.com/rgb-monster-assets/11pm/cover.webp",
                    "https://storage.googleapis.com/rgb-monster-assets/brunch/cover.webp",
                    "https://storage.googleapis.com/rgb-monster-assets/bad-boys/cover.webp",
                    "https://storage.googleapis.com/rgb-monster-assets/5-headliners/cover.webp",
                    "https://storage.googleapis.com/rgb-monster-assets/best-of-kids/cover.webp",
                    "https://storage.googleapis.com/rgb-monster-assets/best-worst-date/cover.webp",
                    "https://storage.googleapis.com/rgb-monster-assets/afterparty/cover.webp",
                    "https://storage.googleapis.com/rgb-monster-assets/ollie-toxic/cover.webp",
                    "https://storage.googleapis.com/rgb-monster-assets/ollie-bet/cover.webp",
                    "https://storage.googleapis.com/rgb-monster-assets/itr/cover.webp",
                    "https://storage.googleapis.com/rgb-monster-assets/kids-can-heckle/cover.webp",
                    "https://storage.googleapis.com/rgb-monster-assets/nma/cover.webp",
                    "https://storage.googleapis.com/rgb-monster-assets/off-with-your-head/cover.webp",
                    "https://storage.googleapis.com/rgb-monster-assets/ooo/cover.webp",
                    "https://storage.googleapis.com/rgb-monster-assets/nerd-fest/cover.webp",
                    "https://storage.googleapis.com/rgb-monster-assets/movieoke/cover.webp",
                    "https://storage.googleapis.com/rgb-monster-assets/pg-hits/cover.webp",
                    "https://storage.googleapis.com/rgb-monster-assets/toast/cover.webp",
                    "https://storage.googleapis.com/rgb-monster-assets/trial/cover.webp",
                ],
                currentShowIdx: 0,
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
            changeShow(direction) {
                this.currentShowIdx = (this.currentShowIdx + direction + this.shows.length) % this.shows.length;
            },
        },
        computed: {
            beamColor: state => state.colors[0],
            currentShow: state => state.shows[state.currentShowIdx],
        },

        mounted() {
            this.colors.forEach((color, mode) => {
                this.updateColor({color, mode});
            });
        },
    };
</script>

<template>
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
            class="beam left"
            :style="{'mix-blend-mode': 'lighten'}"
        >
            <defs>
                <linearGradient id="b">
                    <stop :style="`stop-color: ${beamColor}; stop-opacity: 0`" offset="0" />
                    <stop :style="`stop-color: ${beamColor}; stop-opacity: 0.64705884`" offset=".079" />
                    <stop :style="`stop-color: ${beamColor}; stop-opacity: 0`" offset="1" />
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
                    <stop :style="`stop-color: ${beamColor}; stop-opacity: 0`" offset="0" />
                    <stop :style="`stop-color: ${beamColor}; stop-opacity: 0.64705884`" offset=".079" />
                    <stop :style="`stop-color: ${beamColor}; stop-opacity: 0`" offset="1" />
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
                <linearGradient id="b">
                    <stop :style="`stop-color: ${beamColor}; stop-opacity: 0`" offset="0" />
                    <stop :style="`stop-color: ${beamColor}; stop-opacity: 0.64705884`" offset=".079" />
                    <stop :style="`stop-color: ${beamColor}; stop-opacity: 0`" offset="1" />
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
                    <stop :style="`stop-color: ${beamColor}; stop-opacity: 0`" offset="0" />
                    <stop :style="`stop-color: ${beamColor}; stop-opacity: 0.64705884`" offset=".079" />
                    <stop :style="`stop-color: ${beamColor}; stop-opacity: 0`" offset="1" />
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
                            <img :src="currentShow" />
                        </div>
                    </BorderBox>

                    <div class="intro">
                        We're a comedy production company that also makes software. We're producing over 20 shows in
                        fringe festivals around the world. You can catch us next at Edinburgh Festival Fringe in August!
                    </div>
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

        <div class="stage-box">
            <img class="stage" src="/stage/stage.webp" />

            <div class="laptop-box">
                <img class="laptop" src="/stage/laptop.webp" />
                <img class="laptop-screen" :src="currentShow" />
                <button class="laptop-button left" @click="changeShow(-1)" />
                <button class="laptop-button right" @click="changeShow(1)" />
            </div>

            <div class="projector-box">
                <img class="projector-beam" src="/stage/light-beam-projector.webp" />
                <img class="projector" src="/stage/projector.webp" />
            </div>

            <Console :colors="colors" @update="updateColor($event)" />
        </div>
    </div>
</template>

<style lang="scss">
    .rgb-stage {
        --fixture-width: 12vw;

        padding-bottom: 5vw;

        .top-fringe {
            position: absolute;
            top: 0;
            z-index: 500;

            background: url(/stage/top-fringe.webp);
            background-repeat: repeat-x;
            background-size: contain;
            background-position: center;

            height: calc(3px + 0.9vw);
            left: 0;
            right: 0;
        }

        .curtain {
            position: absolute;
            z-index: 400;
            top: 0;
            height: 47vw;

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
            top: 2vw;
            width: 35vw;
            height: 35vw;
            pointer-events: none;

            --offset: calc(var(--fixture-width) - 4vw);

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
            padding-top: 2vw;
            width: 60vw;
            margin: 0 auto;
            z-index: 200;
            margin-bottom: -7vw;

            .video-box {
                background: var(--beige);
                padding: 1.5vw;
                display: grid;
                gap: 1.2vw;
                align-items: center;
                justify-items: center;
            }

            font-size: 1.5vw;

            h1 {
                margin-bottom: -1vw;
                margin-top: -0.5vw;

                filter: url(#stage-title-outline);
            }

            .intro {
                color: var(--brown);
                font-size: 1.1em;
                font-weight: 600;
                line-height: 140%;
                text-align: center;
                filter: url(#stage-title-outline);
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
            width: 40vw;
            left: 1vw;
            bottom: 12vw;

            z-index: 100;
            pointer-events: none;

            .laptop {
                height: 100%;
            }

            .laptop-screen {
                position: absolute;
                left: 0;
                width: 70%;
                left: 14%;
                top: 9%;
                border: 4px solid #000;
                border-radius: 1vw;
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
                    left: 5vw;
                    transform: scaleX(-1);
                }

                &.right {
                    right: 5vw;
                }

                &:active {
                    background-image: url(/stage/laptop-button-pressed.webp);
                }
            }
        }

        .projector-box {
            position: absolute;
            width: 15vw;
            bottom: 15vw;
            left: 42vw;
            pointer-events: none;
            z-index: 500;

            .projector {
                z-index: 100;
                width: 100%;
            }

            .projector-beam {
                width: 100%;
                top: 0;
                z-index: 50;
                margin-bottom: -60%;
            }
        }

        .console {
            position: absolute;
            width: 37vw;
            bottom: 13vw;
            right: 1.5vw;
        }

        @media (max-width: mixins.$break3) {
            .projector-screen {
                width: 74vw;
                .intro {
                    font-size: 3vw;
                    padding: 1vw 3vw;
                }
            }

            .projector-box {
                display: none;
            }

            .laptop-box {
                width: 46vw;
                bottom: 8vw;
            }

            .console {
                width: 46vw;
                bottom: 9vw;
            }
        }
    }
</style>
