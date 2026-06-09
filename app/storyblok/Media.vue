<script>
    export default {
        props: {
            blok: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {
                isPaused: true,
            };
        },
        computed: {
            isVideo() {
                let file = this.blok?.file;
                if (!file) {
                    return false;
                }
                let filetype = file.filetype;
                if (filetype) {
                    if (filetype.includes("video")) {
                        return true;
                    }
                }
                let url = file.url;
                if (url) {
                    if (url.includes(".webm") || url.includes(".mp4")) {
                        return true;
                    }
                }
                return false;
            },
            autoplay() {
                return Boolean(this.blok?.autoplay);
            },
        },
        methods: {
            togglePlay() {
                let video = this.$refs.videoPlayer;
                if (!video) {
                    return;
                }
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            },
            onPlay() {
                this.isPaused = false;
            },
            onPause() {
                this.isPaused = true;
            },
        },
    };
</script>

<template>
    <div v-if="blok.file?.url && isVideo" class="video-container" @click="togglePlay">
        <video
            ref="videoPlayer"
            class="section-image"
            v-editable="blok"
            loop
            :autoplay="autoplay"
            :muted="autoplay"
            playsinline
            @play="onPlay"
            @pause="onPause"
        >
            <source :src="blok.file.url" :type="blok.file.filetype" />
        </video>
        <button v-if="isPaused" class="play-overlay-btn" aria-label="Play video">
            <svg viewBox="0 0 24 24" class="play-icon">
                <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
        </button>
    </div>
    <img v-else-if="blok.file?.url" class="section-image" v-editable="blok" :src="blok.file.url" :alt="blok.alt" />
</template>

<style scoped>
    .video-container {
        position: relative;
        display: inline-block;
        width: 100%;
        cursor: pointer;
    }

    .play-overlay-btn {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 4.5rem;
        height: 4.5rem;
        background: rgba(0, 0, 0, 0.6);
        border: none;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        pointer-events: none;
        transition:
            background 0.2s ease,
            transform 0.2s ease;
    }

    .video-container:hover .play-overlay-btn {
        background: rgba(0, 0, 0, 0.8);
        transform: translate(-50%, -50%) scale(1.1);
    }

    .play-icon {
        width: 2rem;
        height: 2rem;
        margin-left: 0.25rem;
    }
</style>
