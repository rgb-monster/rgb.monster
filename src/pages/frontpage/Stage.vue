<script>
    import Console from "./Console.vue";

    export default {
        name: "FrontpageStage",
        components: {
            Console,
        },
        data() {
            return {
                colors: ["yellow", "#f5e6c9"],
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
            },
            changeShow(direction) {
                this.currentShowIdx = (this.currentShowIdx + direction) % this.shows.length;
            },
        },
        computed: {
            beamColor: state => state.colors[0],
            titleColor: state => state.colors[1],
            currentShow: state => state.shows[state.currentShowIdx],
        },
    };
</script>

<template>
    <div class="frontpage-stage">
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

        <div class="top-fringe" />
        <img class="curtain left" src="/stage/curtain-left.webp" />
        <img class="curtain right" src="/stage/curtain-right.webp" />
        <img class="stage" src="/stage/stage.webp" />

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

        <div class="laptop-box">
            <img class="laptop" src="/stage/laptop.webp" />
            <img class="laptop-screen" :src="currentShow" />
            <button class="laptop-button left" @mousedown="changeShow(-1)" />
            <button class="laptop-button right" @mousedown="changeShow(1)" />
        </div>

        <img class="projector" src="/stage/projector.webp" />
        <img class="projector-beam" src="/stage/light-beam-projector.webp" />

        <Console :colors="colors" @update="updateColor($event)" />

        <div class="projector-screen">
            <BorderBox shadow="true" :radius="40">
                <div class="video-box" :style="{background: titleColor}">
                    <h1>We are RGB Monster!</h1>

                    <BorderBox>
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
        </div>
    </div>
</template>

<style lang="scss">
    .frontpage-stage {
        background: var(--pink);
        height: 100vw;

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
            height: 53vw;

            &.left {
                left: 0;
            }

            &.right {
                right: 0;
            }
        }

        --fixture-width: 12vw;
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

        .laptop-box {
            position: absolute;
            top: 65vw;
            left: 5vw;
            z-index: 100;

            .laptop {
                width: 30vw;
            }

            .laptop-screen {
                position: absolute;
                left: 0;
                width: 70%;
                left: 14%;
                top: 10%;
            }

            .laptop-button {
                width: 6vw;
                height: 3.5vw;
                position: absolute;
                bottom: 3vw;
                background-image: url(/stage/laptop-button.webp);
                background-size: 100% 100%;
                background-repeat: no-repeat;

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

        .projector {
            position: absolute;
            width: 10vw;
            top: 65vw;
            left: 45vw;
            z-index: 100;
        }

        .projector-beam {
            position: absolute;
            width: 10vw;
            top: 53vw;
            left: 45vw;
            z-index: 50;
        }

        .console {
            position: absolute;
            width: 30vw;
            top: 70vw;
            right: 3vw;
        }

        .stage {
            width: 100%;
            //margin-top: calc(-50vw * 0.1);
            position: absolute;
            top: 45vw;
        }

        .projector-screen {
            align-items: center;
            padding-top: 2vw;
            width: 75vw;
            margin: 0 auto;

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
                font-size: 2.5em;
                font-weight: 600;
                margin-bottom: -1vw;
                margin-top: -0.5vw;

                filter: url(#stage-title-outline);
            }

            .intro {
                color: var(--brown);
                font-size: 1.2em;
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
    }
</style>
