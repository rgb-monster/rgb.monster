<script>
    export default {
        props: {
            tag: String,
            listName: String,
        },
        data() {
            return {
                email: "",
                submitting: false,
                subscribed: false,
            };
        },
        methods: {
            async subscribeToMailingList() {
                // determine mailing list name
                if (!this.tag) {
                    return;
                }
                this.submitting = true;

                await this.$requests.post("mailinglist", {
                    email: this.email,
                    mailinglist: this.tag,
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
    <template v-if="!subscribed">
        <h1 style="margin: 1em auto">Stay in the loop</h1>
        <div style="line-height: 150%">
            <slot name="prompt">
                We produce lots of different comedy shows, and send occasional emails with ticket offers, show
                recommendations, and insider tips.
                <template v-if="listName">
                    Subscribe to our
                    <em>no-spam {{ listName }} comedy mailing list </em> and don't miss a show!
                </template>
                <template v-else>
                    Subscribe to our
                    <em>no-spam comedy mailing list </em> and don't miss a show!
                </template>
            </slot>

            <form
                @submit.prevent="subscribeToMailingList"
                style="display: grid; justify-content: center; gap: 20px; margin: 1em 0"
            >
                <input
                    name="email"
                    type="email"
                    v-model="email"
                    style="padding: 10px; border: 2px solid var(--base); border-radius: 10px; width: 20em"
                    placeholder="email@domain.com"
                />
                <div style="display: flex; justify-content: center">
                    <button
                        :disabled="!emailOk(email) || submitting"
                        style="
                            background: var(--base);
                            color: var(--text);
                            text-align: center;
                            padding: 20px;
                            border-radius: 10px;
                            font-family: var(--rgb-font);
                            text-transform: uppercase;
                            font-size: 1.2em;
                        "
                    >
                        {{ !submitting ? "Subscribe" : "Subscribing&hellip;" }}
                    </button>
                </div>
            </form>
        </div>
    </template>

    <template v-else>
        <h1 style="margin-top: 1em; margin-bottom: 0.5em">You're in</h1>

        <div v-if="subscribed" style="text-align: center; line-height: 150%">
            <slot name="thanks">
                Thank you for subscribing! If you're looking for a good laugh on the go, we also have an Instagram page
                with lots of comedy clips!

                <div style="display: flex; justify-content: center">
                    <a
                        style="
                            background: var(--base);
                            color: var(--text);
                            text-align: center;
                            padding: 10px 20px;
                            border-radius: 10px;
                            font-family: var(--rgb-font);
                            text-transform: uppercase;
                            font-size: 1.2em;
                            margin: 1em 0;
                        "
                        href="https://www.instagram.com/rgbmonster"
                        target="_blank"
                    >
                        See Instagram
                    </a>
                </div>
            </slot>
        </div>
    </template>
</template>

<style lang="scss">
    header.site {
        display: flex;
        gap: 5px;
        z-index: 500;

        background: var(--chrome);

        // position: sticky;
        // top: 0;

        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--chrome-text);

        a {
            padding: 10px;

            font-family: var(--rgb-font);
            text-decoration: none;
            font-weight: 400;
            font-size: 1.2em;

            &.current {
                color: var(--accent-yellow);
            }
        }
    }
</style>
