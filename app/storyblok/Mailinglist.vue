<script>
    import {renderRichText} from "@storyblok/vue";

    import requests from "~/requests.js";
    import utils from "~/utils.js";

    export default {
        props: {
            blok: Object,
        },
        data() {
            return {
                email: "",
                submitting: false,
                subscribed: false,
            };
        },
        computed: {
            tag: state => state.blok?.tag || "newsletter",
            listName: state => (state.tag == "newsletter" ? null : utils.capitalize(state.tag)),
            introRich: state =>
                !utils.isRichTextEmpty(state.blok.intro_block) ? renderRichText(state.blok.intro_block) : null,
            thanksRich: state =>
                !utils.isRichTextEmpty(state.blok.thanks_block) ? renderRichText(state.blok.thanks_block) : null,
        },
        methods: {
            async subscribeToMailingList() {
                // determine mailing list name
                if (!this.tag) {
                    return;
                }
                this.submitting = true;

                await requests.post("mailinglist", {
                    email: this.email,
                    mailinglist: this.tag,
                    tags: !utils.isEmpty(this.blok.tags) ? this.blok.tags : null,
                });
                this.submitting = false;
                this.subscribed = true;
            },
        },

        mounted() {},
        beforeUnmount() {},
    };
</script>

<template>
    <div class="mailinglist-form">
        <div style="line-height: 150%" v-if="!subscribed">
            <template v-if="!blok.form_only">
                <div v-html="introRich" v-if="introRich" />
                <template v-else>
                    <h1>{{ blok.title || "Stay in the loop" }}</h1>
                    <div>
                        We produce lots of different comedy shows, and send occasional emails with ticket offers, show
                        recommendations, and insider tips.
                        <template v-if="listName">
                            Subscribe to our
                            <em>no-spam {{ listName }} comedy mailing list</em> and don't miss a show!
                        </template>
                        <template v-else>
                            Subscribe to our
                            <em>no-spam comedy mailing list</em> and don't miss a show!
                        </template>
                    </div>
                </template>
            </template>

            <form @submit.prevent="subscribeToMailingList" class="submit-form">
                <input name="email" type="email" v-model="email" placeholder="email@domain.com" />
                <div style="display: flex; justify-content: center">
                    <button :disabled="!emailOk(email) || submitting" class="big-button">
                        {{ !submitting ? blok.subscribe_cta || "Subscribe" : "Subscribing&hellip;" }}
                    </button>
                </div>
            </form>
        </div>

        <div v-else>
            <slot name="thanks">
                <div v-html="thanksRich" v-if="thanksRich" />
                <template v-else>
                    <h1 style="margin-top: 1em; margin-bottom: 0.5em">You're in</h1>

                    <div style="text-align: center; line-height: 150%">
                        Thank you for subscribing! If you're looking for a good laugh on the go, we also have an
                        Instagram page with lots of comedy clips!

                        <div style="display: flex; justify-content: center">
                            <a class="big-button" href="https://www.instagram.com/rgbmonster" target="_blank">
                                See Instagram
                            </a>
                        </div>
                    </div>
                </template>
            </slot>
        </div>
    </div>
</template>

<style lang="css">
    .mailinglist-form {
        max-width: 600px;
        margin: 0 auto;

        input {
            background: #fff;
        }

        .submit-form {
            display: grid;
            justify-content: center;
            gap: 20px;
            margin: 1em 0;

            input {
                color: var(--dark);
                background: var(--light);
                padding: 10px;
                border: 2px solid var(--base);
                border-radius: 10px;
                width: 20em;
            }
        }

        .big-button {
            background: var(--pink);
            color: var(--text);
            text-align: center;
            padding: 20px;
            border-radius: 10px;
            font-family: var(--rgb-font);
            text-transform: uppercase;
            font-size: 1.2em;

            &:disabled {
                background: var(--base-2);
            }
        }
    }
</style>
