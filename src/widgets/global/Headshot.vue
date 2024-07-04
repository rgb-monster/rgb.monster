<script>
    export default {
        name: "Headshot",
        props: {
            act: Object,
            noActLabel: "",
            thumb: {
                type: Boolean,
                default: true,
            },
        },
        data() {
            return {
                observer: null,
                visible: false,
            };
        },
        computed: {
            headshot: state => state.act?.headshot || (state.act?.images || [])[0],
            initials: state =>
                (state.act?.name || "")
                    .split(" ")
                    .slice(0, 2)
                    .map(word => word[0])
                    .join("")
                    .toUpperCase(),
            hue: state => parseInt(((parseInt(state.initials, 36) || 0) / 500) * 255),
        },
        methods: {
            handleIntersect(entries, observer) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.visible = true;
                        this.observer.disconnect();
                    }
                });
            },
        },

        mounted() {
            this.observer = new IntersectionObserver(this.handleIntersect, {threshold: 0});
            this.observer.observe(this.$el);
        },
        beforeUnmount() {
            this.observer?.disconnect();
        },
    };
</script>

<template>
    <div
        class="headshot"
        draggable="false"
        :class="{'no-act': !act, 'no-headshot': !headshot, 'not-visible': !visible}"
        :style="act && !headshot ? {background: `hsl(${hue}, 40%, 70%)`} : null"
    >
        <template v-if="headshot">
            <img v-if="visible" :src="`${headshot}${thumb ? '-thumb' : ''}`" crossorigin="anonymous" />
        </template>
        <div v-else-if="act" draggable="false">{{ initials || "--" }}</div>
        <div v-else-if="noActLabel" draggable="false">{{ noActLabel }}</div>
        <Icon name="question_mark" v-else />
    </div>
</template>

<style lang="scss">
    .headshot {
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        display: inline-flex;
        background: var(--base-2);
        align-items: center;
        justify-content: center;
        user-select: none;
        font-size: 1.2em;
        font-weight: 600;
        color: var(--base-6);
        opacity: 1;

        & > * {
            pointer-events: none;
        }

        &.not-visible {
            opacity: 1;
        }

        .icon {
            height: 50%;
            width: 50%;
            color: var(--base-6);
        }

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
        }

        &.no-headshot {
            color: #fff;
            font-weight: 600;
        }
    }
</style>
