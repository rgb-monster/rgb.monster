<script>
    import utils from "/src/scripts/utils.js";

    export default {
        name: "MailingListBox",
        emits: ["update"],
        props: {
            colors: Array,
            list: String, // one of
        },
        data() {
            return {
                email: "",
                submitting: false,
                subscribed: false,

                known_lists: ["edinburgh", "perth", "adelaide", "brighton", "melbourne", "london", "ollie"],
            };
        },

        methods: {
            async subscribeToMailingList() {
                // determine mailing list name
                if (!utils.emailOk(this.email) || !this.known_lists.includes(this.list)) {
                    return;
                }
                this.submitting = true;

                await this.$requests.post("mailinglist", {
                    email: this.email,
                    mailinglist: this.mailinglist,
                });
                this.submitting = false;
                this.subscribed = true;
            },
        },
        mounted() {
            if (!this.known_lists.includes(this.list)) {
                console.error("Mailing list not recognized - signup not possible", this.list);
            }
        },
    };
</script>

<template>
    <BorderBox>
        <div class="mailing-list-box">
            <h2>
                <slot name="header">Stay in the loop!</slot>
            </h2>

            <p>
                <slot name="details" />
            </p>

            <BorderBox class="outer" :radius="20">
                <form class="email-form" @submit.prevent="subscribeToMailingList()">
                    <BorderBox class="inner" :radius="10">
                        <div class="email-container">
                            <BorderBox :radius="10">
                                <input type="email" placeholder="email@myspace.com" v-model="email" />
                            </BorderBox>

                            <BorderBox>
                                <button type="submit" class="email-button" :disabled="!emailOk(email) || submitting">
                                    <div class="button-text">
                                        {{ submitting ? "Submitting&hellip;" : "Sign Up" }}
                                    </div>
                                </button>
                            </BorderBox>
                        </div>
                    </BorderBox>
                </form>
            </BorderBox>
        </div>
    </BorderBox>
</template>

<style lang="scss">
    .mailing-list-box {
        background: var(--beige);
        color: var(--blue);

        padding: 5em 1em;
        margin: 2em 0;

        display: grid;
        gap: 2em;

        h2 {
            font-size: 2em;
            text-align: center;
            text-transform: uppercase;
        }

        p {
            line-height: 150%;
            font-weight: 600;
            text-align: center;
        }

        .email-form {
            background: var(--pink);
            display: grid;
            padding: 8px;

            .email-container {
                display: grid;
                grid-template-columns: 1fr auto;
                align-items: center;

                input,
                button {
                    font-size: 1.2em;
                    padding: 0.5em 1em;
                }

                input {
                    //background: #fff;
                    background: none;
                    background: var(--beige);
                    color: var(--pink);
                    width: 100%;
                    height: 100%;
                    font-weight: 600;
                    text-align: center;

                    &:focus-visible {
                        outline: none;
                    }

                    &::placeholder {
                        color: var(--pink-faint);
                    }
                }

                button {
                    padding: 0.5em 1em;
                    background: var(--pink);
                    color: var(--beige);
                    text-transform: uppercase;
                    font-family: var(--header-font);
                    line-height: 0.8;
                    text-align: center;

                    .button-text {
                        transform: translateY(0.07em);
                    }

                    &:disabled {
                        color: var(--beige-faint);
                    }
                }
            }
        }

        @media (max-width: 600px) {
            padding: 3em 1em;
            padding-bottom: 1em;
            gap: 1em;

            .email-form {
                background: var(--beige);

                .email-container {
                    grid-template-columns: 1fr;
                    gap: 10px;

                    input {
                        background: var(--light);
                    }

                    button {
                        width: 100%;
                        padding: 0.8em;
                    }
                }
            }
        }
    }
</style>
