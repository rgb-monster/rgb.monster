<script>
    export default {
        props: {
            blok: {
                type: Object,
                required: true,
            },
        },
        computed: {
            code() {
                return this.blok.code || "";
            },
            styles() {
                if (this.blok.full_width) {
                    return null;
                }
                return {maxWidth: this.blok.max_width || "700px"};
            },
        },
    };
</script>

<template>
    <div v-if="code" class="embed" :class="blok.full_width ? 'full-width' : null" :style="styles" v-editable="blok">
        <div class="embed-body" v-html="code"></div>
        <p v-if="blok.caption" class="caption">{{ blok.caption }}</p>
    </div>
</template>

<style lang="css">
    .embed {
        width: 100%;
        margin: 2rem auto;

        .embed-body :is(iframe, video, embed, object) {
            display: block;
            width: 100%;
            max-width: 100%;
            border: 0;
        }

        .caption {
            margin-top: 0.5rem;
            color: var(--color-muted);
            font-size: 0.9em;
            text-align: center;
        }
    }
</style>
