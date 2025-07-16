<script>
    export default {
        name: "FrontpageStage",
    };
</script>

<template>
    <div class="frontpage-stage">
        <section class="stage">
            <main>
                <img class="curtain curtain-left" src="/stage/curtain-left.webp" />

                <BorderBox shadow="true">
                    <div class="video-box">
                        <h1>We are RGB Monster!</h1>

                        <BorderBox>
                            <div class="presenter-screen">
                                <img src="https://storage.googleapis.com/rgb-monster-assets/pg-hits/cover.webp" />
                            </div>
                        </BorderBox>

                        <div class="intro">
                            We're a comedy production company that also makes software. We're producing over 20 shows in
                            fringe festivals around the world. You can catch us next at Edinburgh Festival Fringe in
                            August!
                        </div>
                    </div>
                </BorderBox>
                <img class="curtain curtain-right" src="/stage/curtain-right.webp" />
            </main>
        </section>
    </div>
</template>

<style lang="scss">
    .frontpage-stage {




        section.stage {
            background: var(--pink);
            padding: 0 20px;

            main {
                display: grid;
                grid-template-columns: auto 1fr auto;
                align-items: center;

                padding: 20px 0;
                gap: 20px;

                .curtain {
                    // the height is proportional to width so evertything stays roughly where it should be
                    height: 45vw;
                }

                .video-box {
                    background: var(--beige);
                    padding: 20px;
                    display: grid;
                    gap: 20px;
                    align-items: center;
                    justify-items: center;
                }

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
    }
</style>
