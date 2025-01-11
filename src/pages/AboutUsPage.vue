<script>
    import {generic as genericMetas} from "/src/scripts/metas.js";
    export default {
        name: "AboutUsPage",
        data() {
            return {
                metas: genericMetas,
            };
        },
        computed: {
            // we'll render link that looks like a button if button has state; otherwise it's just your regular button
            element: state => (state.route ? "Link" : "button"),
        },
    };
</script>

<template>
    <div class="about-us-page links">
        <section class="big-mojis">
            <div class="contents">
                <h1>We are RGB Monster</h1>

                <p>
                    👋 We are a comedy production company that makes software. Since 2014 we've produced shows all over
                    the world, in multiple languages, in venues large and small. We have produced shows at the
                    <mark class="subtle">Edinburgh Fringe</mark>, <mark class="subtle">Brighton Fringe</mark>,
                    <mark class="subtle">Perth Fringeworld</mark>, <mark class="subtle">Adelaide Fringe</mark>, and
                    <mark class="subtle">Melbourne International Comedy Festival</mark>.
                </p>

                <p>
                    ⚙️ What makes us different is we also build software that helps creatives work better and improves
                    live performances. Our software is used by comedy clubs, comedy producers, bookers, and artists. It
                    also powers the <mark class="subtle">light</mark>, <mark class="subtle">sound</mark> and
                    <mark class="subtle">video screens</mark> of comedy clubs worldwide, allowing them to operate their
                    entire production with a simple interface.
                </p>

                <p>
                    🧑‍🔧️ We built technology that powers <a href="/inside-the-robot">Inside The Robot</a>, our flagship
                    escape-room-like show, we make <a href="https://confirmed.show">Confirmed</a>, the industry's
                    leading comedy club booking software, and we have created the technology that powers all manner of
                    live entertainment experiences, from interactive gong shows, to audience suggestion-powered visuals
                    for <a href="https://www.mchammersmith.com/">MC Hammersmith's</a> improvised raps!
                </p>
            </div>
        </section>
        <section>
            <div class="contents">
                <h1>Our format shows</h1>

                <p>
                    We develop <mark class="subtle">quiz</mark>, <mark class="subtle">format</mark>, and
                    <mark class="subtle">game shows</mark>, some of which we licenced to other productions.
                </p>

                <div class="short-long shows-grid">
                    <img :src="metas['not-my-audience'].square" />
                    <div>
                        <a href="/not-my-audience">Not My Audience</a> is a panel show where comedians compete in
                        stand-up challenges set by the audience through an app.
                    </div>

                    <img :src="metas['best-worst-date'].square" />

                    <div>
                        In <a href="/date">Best Worst Date</a>, the audience anonymously share their dating horror
                        stories and two comedians crown the best worst date
                    </div>

                    <img :src="metas['inside-the-robot'].square" />
                    <div>
                        <a href="/inside-the-robot">Inside The Robot</a> is an interactive escape-room like theatrical
                        performance where kids control the narrative, special effects, and live video games.
                    </div>

                    <img :src="metas['out-of-order'].square" />
                    <div>
                        Finally, <a href="/out-of-order">Out Of Order</a> is a quiz with just one question that the
                        audience can play along with.
                    </div>
                </div>
            </div>
        </section>

        <section>
            <div class="contents">
                <h1>Our comedy shows</h1>

                <div class="shows-grid short-long">
                    <img :src="metas['five-headliners'].square" />
                    <div>
                        Our flagship stand-up comedy showcase is <a href="/headliners">5 Headliners for £10</a> where
                        five top comedians perform their best routines with no crowd work.
                    </div>

                    <img :src="metas['pg-hits'].square" />
                    <div>
                        <a href="/pg-hits">PG Hits!</a> is our family-friendly comedy club where comedians perform their
                        best PG rated routines so everybody can enjoy the show.
                    </div>

                    <img :src="metas['best-of-kids'].square" />
                    <div>
                        <a href="/best-of-kids">Best of Kids Comedy</a> is our flagship kids comedy show, bringing
                        together the best in family-friendly entertainment in one huge show.
                    </div>
                </div>
            </div>
        </section>
        <section>
            <div class="contents">
                <h1>Shows we produce</h1>

                <p>
                    In addition to producing our own solo and touring shows (currently:
                    <a href="/ollie">Ollie Horn: Comedy for Toxic People</a>), we are proud to produce a small roster of
                    acts at the Edinburgh Fringe each year. Typically these are international acts who are bringing
                    something unusual to the festival.In 2024 we are producing solo shows from
                    <a href="/andre">Andre De Freitas</a>, <a href="/chanel">Chanel Ali</a>,
                    <a href="/matt-colorful">Matt Davies</a>, <a href="/jack">Jack Holmes</a>, and
                    <a href="/kavin">Kavin Jay</a>.
                </p>

                <p>
                    We are also producing the australian superstar duo <a href="/bad-mums">Bad Mums</a> debut Edinburgh
                    Fringe show; we are proud to be producing the award-winning Fringe institution
                    <a href="/trial">This Is Your Trial</a>; we are working in partnership with
                    <mark class="subtle">Bowtie Productions</mark> on our interactive choose-your-own-adventure
                    <a href="/off-with-your-head">Off With Your Head</a>, and we are introducing
                    <mark class="subtle">Matt Davis'</mark> chaotic new format show
                    <a href="/with-your-guest">With Your Guest</a> to the festival this year, where three comedians
                    compete to host their own late night chat show.
                </p>

                <p>
                    We're proud to be working with <mark class="subtle">Just The Tonic</mark> to bring to life the
                    <a href="/11pm">11PM Live at the Big Cave</a>
                    celebration of the best in stand-up, and <a href="/afterparty">Big Gay Afterparty</a>, hosted by
                    cabaret star <mark class="subtle">Aidan Sadler</mark>, which are already proving to be big hits with
                    audiences seeking a great value way to end their day at the festival.
                </p>
            </div>
        </section>
        <section class="software">
            <div class="contents">
                <h1>Software we make</h1>

                <h2>Confirmed</h2>
                <p>
                    <a href="https://confirmed.show/">Confirmed</a> is the industry leading comedy club booking
                    software. It handles soliciting comedian availability, extending booking offers, generating call
                    sheets, and financial reconciliation with one click settlement reports. With integrations with
                    <mark class="subtle">Red61</mark>, <mark class="subtle">Eventbrite</mark>, and others, showrunners
                    can get a birds eye view of the state of their productions.
                </p>

                <p>
                    What's more, everything is accessible via API, meaning that you can export your data for easy
                    generation of social media assets, dynamic website generation, and innovative showrunning
                    opportunities such as dynamically displaying your acts details on a screen as they perform.
                </p>

                <h2>Showtime</h2>
                <p>
                    Showtime is our comedy club showrunning software, that is trusted by comedy clubs big and small to
                    run the <mark class="subtle">sound</mark>, <mark class="subtle">lighting</mark>, and
                    <mark class="subtle">visuals</mark> for their club. From dynamically-connected screens showing
                    countdown timers or generating 'the light', to controlling full DMX lighting rigs, to automating the
                    playing of background music and stingers. <a href="mailto:hello@rgb.monster">Send us a mail</a> if
                    you would like a demo!
                </p>

                <h2>Involved</h2>
                <p>
                    Limited only by your imagination, we can produce innovative ways for your audience to get involved
                    with a show. From surveys, quizzes, phone-generated light shows, games and more. We know how to make
                    audiences being on the phone an opportunity rather than a problem!
                    <a href="mailto:hello@rgb.monster">Send us a mail</a> if you would like a demo!
                </p>
            </div>
        </section>

        <section class="other">
            <div class="contents">
                <h1>Other things we do</h1>

                <h2>Creative consulting</h2>
                <p>
                    We help comedy clubs get off the ground, assist in developing formats for live and broadcast, aid
                    with designing lighting for permanent and temporary comedy venues, and more.
                </p>

                <h2>Videography</h2>
                <p>
                    We are really good at videography of live comedy, and have filmed shows for release on Amazon Prime,
                    ITV X and social media.
                </p>

                <h2>The Most Toast</h2>
                <p>Every year at the Edinburgh Fringe we find out who in the audience has had the most toast.</p>
            </div>
        </section>
    </div>
</template>

<style lang="scss">
    main .about-us-page {
        h1 {
            padding-top: 1em;
            padding-bottom: 0.3em;
        }

        p,
        li,
        .shows-grid {
            text-align: left;
            font-size: 1.25em;
        }

        p {
            line-height: 180%;
            text-align: left;
            padding: 0.5em 0;
            margin: 0;

            text-indent: 1em;

            text-indent: 0;
        }

        .big-mojis p {
            &:first-letter {
                float: left;
                font-size: 75px;
                line-height: 80px;
                padding-top: 4px;
                padding-right: 8px;
                padding-left: 3px;
            }
        }

        .shows-grid {
            gap: 1em;
            text-align: left;
            margin-top: 1em;
            align-items: start;
            img {
                max-width: 100px;
            }
        }

        section.software,
        section.other {
            h2 {
                text-align: left;
                margin-top: 2em;
                padding-bottom: 5px;
            }

            p {
                padding-top: 0;
            }
        }
    }
</style>
