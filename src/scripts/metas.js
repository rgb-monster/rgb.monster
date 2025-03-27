export const metas = [
    {
        show_type: "11pm-live",
        slug: "11pm",
        title: "11PM Live",
        tags: ["variety"],
        partnership: "Just the Tonic",
        cover: "https://storage.googleapis.com/rgb-monster-assets/11pm/cover.webp",
        cover_thumb: "https://storage.googleapis.com/rgb-monster-assets/11pm/cover-thumb.webp",
        short_description:
            "A 90 minute showcase of TV stars and gems of the festival followed by the hottest afterparty in town",
        description:
            "End your day at the Festival in style at our iconic Edinburgh venue with the very best in stand-up talent. Expect <mark>top TV names, Netflix stars, and gems of the festival</mark> in this 90-minute late-night boozy extravaganza where anything goes! Rub shoulders and boogie with the artists until the wee hours!",
        tickets: "https://edinburgh.justthetonic.com/event/88:4259/",
    },

    {
        show_type: "comedy-brunch",
        slug: "brunch",
        title: "Comedy Brunch",
        tags: ["variety", "compilation"],
        partnership: "Toucan Events",
        cover: "https://storage.googleapis.com/rgb-monster-assets/brunch/cover.webp",
        cover_thumb: "https://storage.googleapis.com/rgb-monster-assets/brunch/cover-thumb.webp",
        short_description: "The perfect way to start your day at the fringe",
        description:
            "A delightful compilation show with a variety of comedians serving you up a hilarious feast to kick your day off! Grab a delicious breakfast from the Belgian Beer Cafe's extensive breakfast menu from 10am, then join us in our intimate Fringe venue for a selection of top local and international comedians doing short sets of their best material, where the laughs are bottomness! ",
        tickets: "https://fringeworld.com.au/whats_on/comedy-brunch-fw2025",
        payment: "hide",
    },

    {
        show_type: "bad-boys",
        slug: "bad-boys",
        title: "Bad Boys of British Comedy",
        tags: ["standup"],
        short_description: "Powerhouse stand-up comedy from two British rising stars",
        cover: "https://storage.googleapis.com/rgb-monster-assets/bad-boys/cover.webp",
        cover_thumb: "https://storage.googleapis.com/rgb-monster-assets/bad-boys/cover-thumb.webp",
        square: "https://storage.googleapis.com/rgb-monster-assets/bad-boys/square.webp",
        description:
            "<mark class='subtle'>Darius Davies</mark> (English Comedian of the Year Finalist 2017, BBC, vaping inside) and <mark class='subtle'>Ollie Horn</mark> (Best reviewed show of Ed Fringe 24, ITV, jaywalking) make their way to Perth Fringe to corrupt Western Australia in one powerhouse comedy hour. Think riding bikes with no hands, ignoring ‘wet paint’ signs, and pressing the ‘close door’ button in a lift when someone approaches. This is <mark>no-holds-barred, too hot for TV, XXX-rated comedy.</mark> A show your mother doesn't want you to see: leather jackets, elbows on the table, and perhaps even references to the green stuff (only those in the know will know what that means, but we’re not talking about vegetables that’s all we’re saying). Over 2 million views on social media.",
        tickets: [
            {
                city: "Perth",
                url: "https://fringeworld.com.au/whats_on/bad-boys-of-british-comedy-fw2025",
            },
        ],
    },

    {
        show_type: "five-headliners",
        slug: "headliners",
        title: "5 Headliners for £10",
        tags: ["standup"],
        short_description: "Top stand-up with no picking on the audience",
        cover: "https://storage.googleapis.com/rgb-monster-assets/5-headliners/cover.webp",
        cover_thumb: "https://storage.googleapis.com/rgb-monster-assets/5-headliners/cover-thumb.webp",
        square: "https://storage.googleapis.com/rgb-monster-assets/5-headliners/square.webp",
        description:
            "Five top-level circuit comedians perform their very best material, one after the other. <mark>No picking on the audience, no MC in between asking you where you're from</mark>—just non-stop laughs from headline-level international comedy circuit professionals who know exactly how to bring the funny! There is no better value-for-money way to spend £10 at the Fringe. Total sell-out 2024, so book early!",
        default: true,
        video: "https://storage.googleapis.com/rgb-monster-assets/5-headliners/10-secs.webm",

        tickets: [
            {
                city: "Edinburgh",
                venue: "The Apex",
                time: "13:30",
                url: "https://www.edfringe.com/tickets/whats-on/5-headliners-for-10",
            },
            {
                city: "Edinburgh",
                venue: "JTT@The Nucleus",
                time: "16:30",
                url: "https://www.justthetonic.com/",
            },
            {
                city: "Edinburgh",
                venue: "The Apex",
                time: "19:30",
                url: "https://www.edfringe.com/tickets/whats-on/5-headliners-for-10",
            },
        ],
    },

    {
        show_type: "five-headliners",
        slug: "headliners",
        title: "5 Headliners for $25",
        description:
            "Five top-level circuit comedians perform their very best material, one after the other. <mark>No picking on the audience, no MC in between asking you where you're from</mark>—just non-stop laughs from headline-level international comedy circuit professionals who know exactly how to bring the funny! There is no better value-for-money way to spend $25 at the Fringe. Total sell-out 2024, so book early!",
        cover: "https://storage.googleapis.com/rgb-monster-assets/5-headliners-aus/cover.webp",
        cover_thumb: "https://storage.googleapis.com/rgb-monster-assets/5-headliners-aus/cover-thumb.webp",
        video: "https://storage.googleapis.com/rgb-monster-assets/5-headliners/10-secs.webm",
        tickets: [
            {
                city: "Adelaide",
                url: "https://adelaidefringe.com.au/fringetix/5-headliners-for-25-af2025",
            },
            {
                city: "Perth",
                url: "https://fringeworld.com.au/whats_on/5-headliners-for-25-fw2025",
            },
        ],
    },

    {
        show_type: "best-of-kids",
        slug: "best-of-kids",
        title: "Best of Kids Comedy",
        tags: ["kids"],
        cover: "https://storage.googleapis.com/rgb-monster-assets/best-of-kids/cover.webp",
        cover_thumb: "https://storage.googleapis.com/rgb-monster-assets/best-of-kids/cover-thumb.webp",
        square: "https://storage.googleapis.com/rgb-monster-assets/best-of-kids/square.webp",
        short_description: "Huge laughs for tiny people!",
        description:
            "The biggest laughs from the biggest little-person-friendly comedy stars! We drove our clown car around town and picked up the funniest in family-friendly comedy to make one enormous show! We'll pack <mark>loads of different types of entertainers into one big variety show</mark>, so there's lots for everybody to enjoy. We'll be playing games, singing songs, and laughing our smelly socks off! A must-see compilation of the best this year's Fringe has to offer in our clean and safe air-conditioned venue on Grassmarket.",
        tickets: "https://tickets.edfringe.com/whats-on/best-of-kids-comedy-the-big-show",
    },

    {
        show_type: "best-worst-date",
        slug: "date",
        title: "Best Worst Date",
        cover: "https://storage.googleapis.com/rgb-monster-assets/best-worst-date/cover.webp",
        cover_thumb: "https://storage.googleapis.com/rgb-monster-assets/best-worst-date/cover-thumb.webp",
        tags: ["format"],
        square: "https://storage.googleapis.com/rgb-monster-assets/best-worst-date/square.webp",
        short_description: "Dating horror stories party",
        description:
            "If your dating life is a joke: this is the show for you! Share your cringeworthy dating stories, and two top stand-ups compete to crown the best of the worst dates, riffing on what you've anonymously shared through our exclusive app! It's an <mark>interactive riot celebrating the chaos of single life</mark>—where your awkward is our awesome! Whether you've since found love, are forever single, or are somewhere in between, you'll leave the show feeling happier about all of the right swipes you regret!",
        tickets: [
            {
                city: "Perth",
                url: "https://fringeworld.com.au/whats_on/best-worst-date-the-hilarious-dating-horror-stories-party-fw2025",
            },
        ],
        payment: "hide",
    },

    {
        show_type: "afterparty",
        slug: "afterparty",
        title: "Big Gay Afterparty",
        tags: ["variety"],
        cover: "https://storage.googleapis.com/rgb-monster-assets/afterparty/cover.webp",
        cover_thumb: "https://storage.googleapis.com/rgb-monster-assets/afterparty/cover-thumb.webp",
        short_description: "Pop-up cabaret and mayhem (fun straights allowed)",
        description:
            "Queer, chic and outrageous—you're invited to the biggest, gayest party at the Fringe (fun straights allowed). <mark>Indulge in the hottest pop-up cabaret experience on Cowgate</mark> with a rotating selection of the most electrifying and scandalous performers at the festival. Curated by 'demonic David Bowie' Aidan Sadler (Fest), this is where artists, dreamers and vagabonds drink, make mistakes and dance until the wee hours. <mark class='subtle'>Don't worry about turning up late!</mark> The night is a pop up cabaret, and there will be fantastic acts on stage until 2:30am, when we hand over the reigns to our house DJ!",
        video: "https://storage.googleapis.com/rgb-monster-assets/afterparty/10-secs.mp4",
        show_lineup: true,
        tickets: "https://www.eventbrite.co.uk/e/big-gay-afterparty-tickets-1302987924959",
    },

    {
        show_type: "toxic",
        slug: "ollie",
        title: "Ollie Horn: Comedy For Toxic People",
        partnership: "Talented Artists Limited",
        tags: ["solo", "standup"],
        cover: "https://storage.googleapis.com/rgb-monster-assets/ollie-toxic/cover.webp",
        cover_thumb: "https://storage.googleapis.com/rgb-monster-assets/ollie-toxic/cover-thumb.webp",
        video: "https://storage.googleapis.com/rgb-monster-assets/ollie-toxic/10-secs.mp4",
        short_description: "Spontaneous, sharp, high-energy stand-up",
        description: `Stick your tongue out, do a peace sign, and tilt your head. British Comedy Guide Recommended 2023 Ollie Horn returns with a brand-new, highly interactive, semi-improvised, <mark>laugh-out-loud show about how you can justify being toxic.</mark> Think of the WhatsApp group that you're ashamed to be in - the show will feel like that live on stage.
            `,
        tickets: "https://tickets.edfringe.com/whats-on/ollie-horn-comedy-for-toxic-people-and-their-friends",

        quotes: [
            {stars: 4, quote: "Delivers every joke with a cheeky little smile", author: "EdFringe Review"},
            {stars: 4, quote: "One hell of a good show", author: "ThreeWeeks"},
            {stars: 4, quote: "An hour of escapist perfection", author: "Mumble Comedy"},
            {stars: 4, quote: "A clear passion for his craft", author: "Broadway World"},
        ],
    },

    {
        show_type: "inside-the-robot",
        slug: "inside-the-robot",
        title: "Inside the Robot",
        tags: ["kids"],
        cover: "https://storage.googleapis.com/rgb-monster-assets/itr/cover.webp",
        cover_thumb: "https://storage.googleapis.com/rgb-monster-assets/itr/cover-thumb.webp",
        video: "https://storage.googleapis.com/rgb-monster-assets/itr/10-secs.mp4",
        square: "https://storage.googleapis.com/rgb-monster-assets/itr/square.webp",
        short_description: "Escape-room-like comedy family adventure",
        description:
            "The world's only theatrical escape room! You are the crew of a time-travelling robot and everything has gone wrong. Help! <mark>Stunning visual effects and immersive interactive technology</mark> mean kids aged 5 to 95 will be enthralled in this thrilling, educational, and hilarious spectacular. Back with fresh new challenges and a new story for 2024 - fans of puzzles, games and silly dances can't miss this unique Fringe experience back for its third year! Catch us in the iconic Big Caves venue like you have never seen it before.",
        tickets: "https://edinburgh.justthetonic.com/event/88:4227",
    },

    {
        show_type: "kids-can-heckle",
        slug: "kids-can-heckle",
        title: "Kids Can Heckle!",
        tags: ["kids", "solo"],
        cover: "https://storage.googleapis.com/rgb-monster-assets/kids-can-heckle/cover.webp",
        cover_thumb: "https://storage.googleapis.com/rgb-monster-assets/kids-can-heckle/cover-thumb.webp",
        square: "https://storage.googleapis.com/rgb-monster-assets/kids-can-heckle/square.webp",
        short_description: "Perth Fringe 2024 weekly award winner",
        description:
            "Fun for the whole family, but especially fun for the little ones! Top UK stand-up Ollie Horn—attempts to tell the same clean stand-up that he does around the world. <mark>The only thing that can stop him is the imagination of your kids,</mark> who at any point are allowed, no, encouraged to jump in and be as silly as possible! Weekly award winner, Perth Fringe World 2024: Best Kids Show.",
        tickets: [
            {
                city: "Adelaide",
                url: "https://adelaidefringe.com.au/fringetix/kids-can-heckle-af2025",
            },

            {
                city: "Perth",
                url: "https://fringeworld.com.au/whats_on/kids-can-heckle-fw2025",
            },
        ],
        quotes: [
            {
                stars: 4,
                quote: "The perfect way to introduce your kids to the world of stand-up",
                author: "KidsInAdelaide.com.au",
            },
            {quote: "Ollie Horn is a gifted storyteller", author: "TheWeeReview.com"},
        ],
    },

    {
        show_type: "not-my-audience",
        slug: "not-my-audience",
        title: "Not My Audience",
        tags: ["format", "guest comics"],
        cover: "https://storage.googleapis.com/rgb-monster-assets/nma/cover.webp",
        cover_thumb: "https://storage.googleapis.com/rgb-monster-assets/nma/cover-thumb.webp",
        square: "https://storage.googleapis.com/rgb-monster-assets/nma/square.webp",
        short_description: "The panel show you control with an app",
        description:
            "Comedy panel show where top comics answer the daft questions you choose on <mark class='subtle'>our exclusive app,</mark> and take on stand-up challenges that test their comedy muscles. A Fringe cult hit since 2018 and never the same show twice. A must for comedy fans who want to <mark>see some of the sharpest comedy minds at the festival be put through their paces.</mark> No need to reserve, just rock up with a charged smartphone ten minutes before the show starts! Free entry, pay what you like on exit!",
        payment: "unticketed",
        show_hosts: true,
        show_lineup: true,
        hide_bio: true,
        tickets: "https://www.edfringe.com/tickets/whats-on/not-my-audience-the-stand-up-panel-show-you-control",
    },

    {
        show_type: "off-with-your-head",
        slug: "off-with-your-head",
        title: "Off With Your Head!",
        tags: ["format", "gameshow"],
        cover: "https://storage.googleapis.com/rgb-monster-assets/off-with-your-head/cover.webp",
        cover_thumb: "https://storage.googleapis.com/rgb-monster-assets/off-with-your-head/cover-thumb.webp",
        short_description: "Choose your own adventure live video game",
        partnership: "Bowtie Productions",
        description:
            "Are you fit to reign? How long do you think you can survive as ruler? Come and find out in this one-of-a-kind interactive comedy video game! Part comedy, part improv, part video game and part choose-your-own-adventure, where you and two guest comedians try to rule a kingdom! A unique experience at every show<mark>—how will you fare, my liege?</mark> From veteran performer Sam See (**** Fest) and video game designer Stephen Case (Trust No Bunny, Not My Audience).",
        tickets: "https://tickets.edfringe.com/whats-on/off-with-your-head",
        payment: "hide",
    },

    {
        show_type: "out-of-order",
        slug: "out-of-order",
        title: "Out of Order",
        tags: ["format", "gameshow"],
        cover: "https://storage.googleapis.com/rgb-monster-assets/ooo/cover.webp",
        cover_thumb: "https://storage.googleapis.com/rgb-monster-assets/ooo/cover-thumb.webp",
        short_description: "Everything seems to be correct, but totally out of order",
        description: "Everything seems to be correct, but totally out of order",
        tickets: "",
    },

    {
        show_type: "pg-hits",
        slug: "pg-hits",
        title: "PG Hits!",
        tags: ["kids", "standup"],
        cover: "https://storage.googleapis.com/rgb-monster-assets/pg-hits/cover.webp",
        cover_thumb: "https://storage.googleapis.com/rgb-monster-assets/pg-hits/cover-thumb.webp",
        square: "https://storage.googleapis.com/rgb-monster-assets/pg-hits/square.webp",
        short_description: "Family-friendly stand-up comedy club",
        description:
            "Three top stand-ups perform their very best routines just as they do in comedy clubs up and down the country and abroad, just without the swearing! PG Hits is a professional stand-up comedy compilation show that <mark>leaves out the really rude bits so everybody can enjoy the show.</mark> Comedy fans of all ages and all tastes will have something to enjoy as we bring you a diverse line-up from the very best the festival has to offer, at a relaxed lunchtime performance.",
        video: "https://storage.googleapis.com/rgb-monster-assets/pg-hits/10-secs.webm",
        tickets: [
            {
                city: "Adelaide",
                url: "https://adelaidefringe.com.au/fringetix/pg-hits-the-very-best-in-family-friendly-stand-up-af2025",
            },
            {
                city: "Perth",
                url: "https://fringeworld.com.au/whats_on/pg-hits-the-best-in-family-friendly-stand-up-comedy-fw2025",
            },
            {
                city: "Perth",
                url: "https://fringeworld.com.au/whats_on/pg-hits-the-best-in-family-friendly-stand-up-comedy-fw2025",
            },
        ],
        payment: "hide",
        show_lineup: true,
        show_hosts: true,
        hide_bio: true,
    },

    {
        show_type: "most-toast",
        slug: "toast",
        title: "The Most Toast",
        tags: ["important event"],
        cover: "https://storage.googleapis.com/rgb-monster-assets/toast/cover.webp",
        cover_thumb: "https://storage.googleapis.com/rgb-monster-assets/toast/cover-thumb.webp",
        square: "https://storage.googleapis.com/rgb-monster-assets/toast/square.webp",
        short_description: "Somebody has eaten the most toast. We will find them.",
        description: "Somebody in the audience will have eaten the most toast. We will find them.",
        cta: "🍞 Secure My Place",
        tickets: "https://www.edfringe.com/tickets/whats-on/the-most-toast",
    },

    {
        show_type: "this-is-your-trial",
        slug: "trial",
        title: "This Is Your Trial",
        tags: ["format"],
        partnership: "This is Your Laugh",

        cover: "https://storage.googleapis.com/rgb-monster-assets/trial/cover.webp",
        cover_thumb: "https://storage.googleapis.com/rgb-monster-assets/trial/cover-thumb.webp",
        square: "https://storage.googleapis.com/rgb-monster-assets/trial/square.webp",
        short_description: "Award-winning improvised comedy courtroom",
        description:
            "Guilty or innocent? You decide! The award-winning, critically acclaimed courtroom roast returns to the Fringe for its eleventh year! <mark>You accuse friends and family of crimes, and top comedians take on the roles of judge and defence counsel,</mark> hearing testimony, cross-examining witnesses, and improvising their arguments for each case. It’s up to the audience as jury to deliver your verdict. Never the same show twice, a must-do fringe experience! 'A perfect bit of improv mayhem' ***** (Mirror). 'Inventive, intelligent comedy' ***** (Scotsman).",
        tickets: [
            {
                city: "Perth",
                venue: "Belgian Beer Cafe",
                url: "https://fringeworld.com.au/whats_on/this-is-your-trial-the-fully-improvised-comedy-courtroom-fw2025",
            },
            {
                city: "Perth",
                venue: "The Old Courthouse",
                url: "https://www.eventbrite.com/e/this-is-your-trial-interactive-comedy-courtroom-fremantle-tickets-1119682423269",
            },

            {
                city: "Edinburgh",
                venue: "The Apex",
                url: "https://www.edfringe.com/tickets/whats-on/this-is-your-trial-the-fully-improvised-comedy-courtroom",
            },
        ],
    },
];

let byShowType = {};
metas.forEach(showMetas => {
    byShowType[showMetas.show_type] = byShowType[showMetas.show_type] || [];
    byShowType[showMetas.show_type].push(showMetas);
});

export let generic = {};
Object.values(byShowType).forEach(allMetas => {
    let defaults = allMetas.filter(showMetas => showMetas.default)[0];
    if (!defaults) {
        defaults = allMetas.filter(showMetas => !Array.isArray(showMetas.tickets))[0];
    }

    if (!defaults) {
        defaults = allMetas[0];
    }

    let metas = JSON.parse(JSON.stringify(defaults || {}));
    generic[metas.show_type] = metas;
});

export function getShowMetas(show) {
    // based on show's venue and time match it with the right metas
    let allMetas = byShowType[show.show_type] || [];

    let defaults = allMetas.filter(showMetas => showMetas.default)[0];
    if (!defaults) {
        defaults = allMetas.filter(showMetas => !Array.isArray(showMetas.tickets))[0];
    }
    let metas = JSON.parse(JSON.stringify(defaults || {}));

    let venueSpecific = allMetas.filter(showMetas => Array.isArray(showMetas.tickets));

    // see if we can find a more precise match than the default
    for (let showMetas of venueSpecific) {
        for (let ticketInfo of showMetas.tickets) {
            // matches returns true if either the value matches, or we don't have the specific criteria in conditions
            let matches = (field, showVal) => !ticketInfo[field] || (ticketInfo[field] && ticketInfo[field] == showVal);

            let fullMatch = [
                matches("city", show.venue?.city),
                matches("venue", show.venue?.name),
                matches("time", show.ts.strftime("%H:%M")),
            ].every(rec => rec);

            if (fullMatch) {
                metas = {...metas, ...showMetas, tickets: ticketInfo.url};
            }
        }
    }

    let ticketsURL = metas.tickets || "";
    if (ticketsURL && ticketsURL.includes("tickets.edfringe.com")) {
        // fringe has brokeneth the ability to deep-link
        // ticketsURL = `${ticketsURL}?day=${show.date.strftime("%d-%m-%Y")}`;
        // metas.tickets = ticketsURL;
    }

    // console.log("rrrrrrrrrrrrrrrrrrr", show.name, show.venue.city, metas);
    return metas;
}

// list of all slugs that we want pages for
export const slugs = [
    ...new Set(
        Object.values(byShowType)
            .map(sameTypes => sameTypes.map(showMetas => showMetas.slug))
            .flat()
    ),
];
