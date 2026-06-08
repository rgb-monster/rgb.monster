<script>
    import {useStore} from "@/shows.js";

    export default {
        data() {
            return {
                store: useStore(),
            };
        },
        computed: {
            metas: state => state.store.currentMetas,

            paymentSectionTitle() {
                const titles = {
                    ticketed: "Ticketed Show",
                    "ticketed+pwyw": "Ticketed + PWYW Show",
                    pwyc: "Pay What You Can",
                    unticketed: "Unticketed Show",
                };
                return titles[this.metas.payment || "ticketed"];
            },
        },
    };
</script>

<template>
    <section class="about-tickets">
        <main>
            <div class="monster-box">
                <img class="monster" src="/doodles/sticking-out.webp" />
            </div>

            <div class="box" v-if="metas.payment != 'hide'">
                <header class="flexer"><Icon name="confirmation_number" />{{ paymentSectionTitle }}</header>

                <div v-if="(metas.payment || 'ticketed') == 'ticketed'">
                    This is a ticketed show. This means that unlike some other shows that we produce where you may
                    nominate a price you can afford, you may only enter this show with a ticket.
                </div>

                <div v-if="metas.payment == 'ticketed+pwyw'">
                    This is a ticketed show. This means that the only way to guarantee entry is with a ticket. If you
                    are low income, unwaged, or you can't afford a full price ticket for any reason, you are welcome to
                    buy a concession ticket on a trust basis. If there is spare capacity once the ticket holders have
                    been admitted, the venue may at their discression admit non-ticket holders on a pay what you can
                    basis, where you will be able to purchase your ticket at a price of your choosing at the end of the
                    show.
                </div>

                <div v-if="metas.payment == 'pwyc'">
                    This is a Pay What You Can Show. There are two ways of paying for the show. You can either reserve a
                    ticket in advance for the full price, or select a reduced price option if that's all you can afford.
                    Or, providing there is spare capacity once we've let the ticket holders in, you can turn up to the
                    venue and enter for free, and offer a cash or card donation at the end of the show. We recommend
                    doing this during the mid-week performances where we are less likely to sell out.
                </div>

                <div v-if="metas.payment == 'unticketed'">
                    This is a free show! This means that there is no way of reserving your place in advance. Instead, to
                    be fair to everyone, we let people in the venue on a first come, first served basis, so we recommend
                    turning up around fifteen minutes before the show starts. We ask that you pay what you feel the show
                    was worth at the end of the show. The typical donation is £12, but some people pay more or less than
                    this depending on their personal circumstances. Because of this crowdfunding model, even if you
                    can't afford to pay anything at all, we still hope that you'll come and enjoy the show, since your
                    fellow audience members will be paying for you. It really is free for you.
                </div>
            </div>
        </main>
    </section>
</template>

<style lang="css">
    .about-tickets {
        font-size: var(--font-size-xl);
        line-height: 180%;
        padding-top: 3em;

        header {
            text-align: left;
            font-weight: 600;
        }

        .contents {
            position: relative;
            text-align: left;
        }

        .monster-box {
            display: flex;
            justify-content: end;
        }

        .monster {
            max-width: 150px;
            z-index: 50;
        }

        .box {
            z-index: 100;
            padding: 20px;
            background: #fff;
            border: 5px solid var(--chrome-x2);
            border-radius: 15px;
            box-shadow: 5px 5px var(--transparent-shadow);
        }

        .box header {
            color: var(--chrome-x2);
            font-size: var(--font-size-xl);
            margin-bottom: 15px;
        }
    }
</style>
