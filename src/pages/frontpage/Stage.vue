<script>
    export default {
        name: "FrontpageStage",
    };
</script>

<template>
    <div class="frontpage-stage">
        <div class="top-fringe" />
        <img class="curtain curtain-left" src="/stage/curtain-left.webp" />
        <img class="curtain curtain-right" src="/stage/curtain-right.webp" />
        <img class="stage" src="/stage/stage.webp" />

        <div class="projector-screen">
            <BorderBox shadow="true" :radius="40">
                <div class="video-box">
                    <h1>We are RGB Monster!</h1>

                    <BorderBox>
                        <div class="presenter-screen">
                            <img src="https://storage.googleapis.com/rgb-monster-assets/pg-hits/cover.webp" />
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

            &.curtain-left {
                left: 0;
            }

            &.curtain-right {
                right: 0;
            }
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
                font-size: 2em;
                font-weight: 600;
            }

            .intro {
                color: var(--brown);
                font-size: 1.2em;
                font-weight: 600;
                line-height: 140%;
                text-align: center;
            }

            .box-container {
                position: relative;
                //padding: 20px;
            }
        }
    }
</style>
