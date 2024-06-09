function edfringeListing(show, url) {
    return show ? `${url}?day=${show.ts.strftime("%Y-%m-%d")}` : url;
}

export default {
    "11PM Live": {
        slug: "11pm",
        tags: ["variety"],
        cover: "https://storage.googleapis.com/rgb-monster-assets/11pm/cover.webp",
        short_description:
            "A 90 minute showcase of TV stars and gems of the festival followed by the hottest afterparty in town",
        description:
            "End your day at the Festival in style at our iconic Edinburgh venue with the very best in stand-up talent. Expect top TV names, Netflix stars, and gems of the festival in this 90-minute late-night boozy extravaganza where anything goes! Rub shoulders and boogie with the artists until the wee hours!",
        tickets: "https://tickets.edfringe.com/whats-on/11pm-live-at-the-big-cave",
    },

    "5 Headliners": {
        slug: "5-headliners",
        tags: ["standup"],
        short_description: "Top stand-up with no picking on the audience",
        description:
            "Five top-level circuit comedians perform their very best material, one after the other. No picking on the audience, no MC in between asking you where you're from – just non-stop laughs from headline-level international comedy circuit professionals who know exactly how to bring the funny! There is no better value-for-money way to spend £10 at the Fringe. Total sell-out 2023, so book early!",
        tickets: [
            {label: "hoots 7:30pm", url: "https://tickets.edfringe.com/whats-on/5-headliners-for-10"},
            {label: "hoots 9pm", url: "https://tickets.edfringe.com/whats-on/5-headliners-for-10-1"},
            {label: "tonic 1:30pm", url: "https://tickets.edfringe.com/whats-on/5-headliners-for-10-2"},
        ],
    },

    "André De Freitas: As Yet Untitled": {
        slug: "andre",
        tags: ["solo", "standup"],
        short_description: "Portuguese star's unfiltered takes on adulthood",
        description:
            "After making his dazzling debut last year, one of the most distinctive young voices in European comedy returns to the Fringe with fresh new material on the big questions. Join André and a special guest opener as they figure out what growing up means and what comes next in life. Expect forty minutes of thoughtful musings on adulthood and at least five less thoughtful ones on orgies. Just like André: this material is maturing. Tour support for Jim Gaffigan, Jim Jefferies and Alan Carr. ‘Leaves them howling with laughter’ **** (Sunday Express).",
        tickets: "https://tickets.edfringe.com/whats-on/andre-de-freitas-as-yet-untitled",
    },

    "Bad Mums": {
        slug: "bad-mums",
        tags: ["solo", "standup"],
        cover: "https://storage.googleapis.com/rgb-monster-assets/bad-moms/cover.webp",
        short_description: "Hilariously unfiltered tales of #mumlife",
        description:
            "They’re outrageous, late for school drop-off and definitely not on the PTA! After a sold-out Aussie tour, Gill Cordiner and Nikki Valentine bring you Bad Mums: an hour of hysterical, unfiltered tales that has left crowds roaring with laughter and leaving rave reviews! Book your babysitters, organise date night or get your girl gang and see this hotly anticipated Fringe debut for two of Australia's rising comedy stars!",
        tickets: "https://tickets.edfringe.com/whats-on/bad-mums",
    },

    "Best of Kids Comedy": {
        slug: "best-of-kids",
        tags: ["kids"],
        short_description: "Huge laughs for tiny people!",
        description:
            "The biggest laughs from the biggest little-person-friendly comedy stars! We drove our clown car around town and picked up the funniest in family-friendly comedy to make one enormous show! We'll pack loads of different types of entertainers into one big variety show, so there's lots for everybody to enjoy. We'll be playing games, singing songs, and laughing our smelly socks off! A must-see compilation of the best this year's Fringe has to offer in our clean and safe air-conditioned venue on Grassmarket.",
        tickets: "https://tickets.edfringe.com/whats-on/best-of-kids-comedy-the-big-show",
    },

    "Best Worst Date": {
        slug: "best-worst-date",
        tags: ["format"],
        short_description: "Dating horror stories party",
        description: "",
        tickets: "",
    },

    "Big Gay Afterparty": {
        slug: "big-gay",
        tags: ["variety"],
        short_description: "Pop-up cabaret and mayhem (fun straights allowed)",
        description:
            "Queer, chic and outrageous – you're invited to the biggest, gayest party at the Fringe (fun straights allowed). Indulge in the hottest pop-up cabaret experience on Cowgate with a rotating selection of the most electrifying and scandalous performers at the festival. Curated by 'demonic David Bowie' Aidan Sadler (Fest), this is where artists, dreamers and vagabonds drink, make mistakes and dance until the wee hours.",
        tickets: "https://tickets.edfringe.com/whats-on/big-gay-afterparty",
    },

    "Chanel Ali: Break Up With Your Dad": {
        slug: "chanel",
        tags: ["solo", "standup"],
        short_description: "Comedy Central USA star's debut Fringe hour",
        description:
            "If you can break up with your dad, you can break up with anyone. Star of the NYC comedy scene teaches you how to fight everyone – and win. You might recognise Chanel from her two Comedy Central specials, and the hit Netflix series Dash and Lily. Catch her at the Fringe as your silly and hilarious relationship expert who'll make you feel fantastic about living your best life. Don't miss this, your chance to catch one of the USA's hottest comedy exports for a limited run this Fringe.",
        tickets: "https://tickets.edfringe.com/whats-on/chanel-ali-break-up-with-your-dad",
    },

    "Comedy For Toxic People": {
        slug: "ollie",
        tags: ["solo", "standup"],
        cover: "https://storage.googleapis.com/rgb-monster-assets/ollie-toxic/cover.webp",
        short_description: "Spontaneous, sharp, high-energy stand-up",
        description:
            "Stick your tongue out, do a peace sign, and tilt your head. British Comedy Guide Recommended 2023 Ollie Horn returns with a brand-new, highly interactive, semi-improvised, laugh-out-loud show about how you can justify being toxic. Think of the WhatsApp group that you're ashamed to be in – the show will feel like that live on stage. 'Delivers every joke with a cheeky little smile' **** (EdFringeReview.com). 'Escapism and delight... can't help but lift your spirits' **** (Edinburgh Festivals Magazine). 'A clear passion for his craft' **** (BroadwayWorld.com).",
        tickets: "https://tickets.edfringe.com/whats-on/ollie-horn-comedy-for-toxic-people-and-their-friends",
        video: "https://storage.googleapis.com/rgb-monster-assets/ollie-toxic/10-secs.mp4",
    },

    "Inside the Robot": {
        slug: "inside-the-robot",
        tags: ["kids"],
        cover: "https://storage.googleapis.com/rgb-monster-assets/itr/cover.webp",
        short_description: "Escape-room-like comedy family adventure",
        description:
            "The world's only theatrical escape room! You are the crew of a time-travelling robot and everything has gone wrong. Help! Stunning visual effects and immersive interactive technology mean kids aged 5 to 95 will be enthralled in this thrilling, educational, and hilarious spectacular. Back with fresh new challenges and a new story for 2024 - fans of puzzles, games and silly dances can't miss this unique Fringe experience back for its third year! Catch us in the iconic Big Caves venue like you have never seen it before.",
        tickets: "https://tickets.edfringe.com/whats-on/inside-the-robot-kids-in-control",
    },

    "Jack Holmes: Round Man, Square Hole": {
        slug: "jack",
        tags: ["solo", "standup"],
        short_description: "Unpretentious storytelling from journeyman Bristolian",
        description:
            "A laugh-filled journey about finding every group you belong to insufferable. From veganism and his punk band days, to resisting the cliches of being a married man, this sober, record-collecting, British-born, euro-trash comedian jokes and jabs himself apart to the glee of his audiences. An unpretentious and hilarious hour from a lovably gruff comedian who's very worried that being lovably gruff will be the next trend taken over by twats.",
        tickets: "https://tickets.edfringe.com/whats-on/jack-holmes-round-man-square-hole",
    },

    "Kavin Jay: Unsolicited Advice": {
        slug: "kavin",
        tags: ["solo", "standup"],
        short_description: "Malaysian Netflix Star's trademark rants",
        description:
            "Star of Netflix stand-up special Kavin Jay: Everybody Calm Down! makes his Fringe debut with a brand-new show about the worst part of bad news: what will your family say? Big laughs about health, wealth and misguided wisdom, with sharp and hilarious takes on what to do with unsolicited advice from well-meaning yet unqualified family and friends. 'South East Asia's sharpest and funniest voice' (Comedy Masala).",
        tickets: "https://tickets.edfringe.com/whats-on/kavin-jay-unsolicited-advice",
    },

    "Kids Can Heckle!": {
        slug: "kids-can-heckle",
        tags: ["kids", "solo"],
        cover: "https://storage.googleapis.com/rgb-monster-assets/kids-can-heckle/cover.webp",
        short_description: "Perth Fringe 2024 weekly award winner",
        description:
            "Fun for the whole family, but especially fun for the little ones! Top UK stand-up Ollie Horn – 'Ollie Horn is a gifted storyteller' (TheWeeReview.com) – attempts to tell the same clean stand-up that he does around the world. The only thing that can stop him is the imagination of your kids, who at any point are allowed, no, encouraged to jump in and be as silly as possible! Weekly award winner, Perth Fringe World 2024: Best Kids Show. 'The perfect way to introduce your kids to the world of stand-up' **** (KidsInAdelaide.com.au).",
        tickets: "https://tickets.edfringe.com/whats-on/kids-can-heckle",
    },

    "Matt Davis: (I Used to Be) More Fun": {
        slug: "matt-fun",
        tags: ["solo", "standup"],
        short_description: "Acclaimed USA comedy veteran on sobriety",
        description:
            'A comedy storytelling show about sobriety, impulse control, and growing up from acclaimed comedy veteran Matt Davis (USA). Over 20 years into comedy, and a decade into sobriety, top stand-up Matt Davis revisits his "before times" and the unrecognisable person at their center. Rather than blame substances for stealing a police car, getting into a fight at McDonald\'s while pretending to be blind, or waltzing into the secure section of airports offices, Matt Davis explores the behavioural changes that stopping drinking allowed him to address, and the surprising situations that fostered them.',
        tickets: "https://tickets.edfringe.com/whats-on/matt-davis-i-used-to-be-more-fun",
    },

    "Matt Davis: Colorful": {
        slug: "matt-colorful",
        tags: ["solo", "standup"],
        short_description: "Not every big issue has a black and white answer",
        description:
            "Dubbed 'an intellectually-driven stand up comedy king' by the Australian press, Matt Davis brings his internationally minded approach to take on challenging topics. In a wild and hilarious rebuttal to the increasingly prevalent black-and-white view of our world, the comedian weaves together personal narratives as he comically challenges beliefs. Grab that friend who likes to laugh, or that one who really needs to, and join us on the other side of arguments with two dimensions for an evening where things are… Colorful!",
        tickets: "https://tickets.edfringe.com/whats-on/matt-davis-colorful",
    },

    "Not My Audience": {
        slug: "not-my-audience",
        tags: ["format", "guest comics"],
        cover: "https://storage.googleapis.com/rgb-monster-assets/nma/cover.webp",
        short_description: "The panel show you control with an app",
        description:
            "Comedy panel show where top comics answer the daft questions you choose on our exclusive app, and take on stand-up challenges that test their comedy muscles. A Fringe cult hit since 2018 and never the same show twice. A must for comedy fans who want to see some of the sharpest comedy minds at the festival be put through their paces. No need to reserve, just rock up with a charged smartphone ten minutes before the show starts! Free entry, pay what you like on exit!",
        tickets:
            "https://tickets.edfringe.com/whats-on/not-my-audience-the-stand-up-panel-show-you-control-with-an-app",
    },

    "Off With Your Head!": {
        slug: "off-with-your-head",
        tags: ["format", "gameshow"],
        short_description: "Choose your own adventure live video game",
        description:
            "Are you fit to reign? How long do you think you can survive as ruler? Come and find out in this one-of-a-kind interactive comedy video game! Part comedy, part improv, part video game and part choose-your-own-adventure, where you and two guest comedians try to rule a kingdom! A unique experience at every show – how will you fare, my liege? From veteran performer Sam See (**** (Fest)) and video game designer Stephen Case from RGB Monster (Trust No Bunny, Not My Audience).",
        tickets: "https://tickets.edfringe.com/whats-on/off-with-your-head",
    },

    "Out of Order": {
        slug: "out-of-order",
        tags: ["format", "gameshow"],
        cover: "https://storage.googleapis.com/rgb-monster-assets/ooo/cover.webp",
        short_description: "Everything seems to be correct, but totally out of order",
        description: "",
        tickets: "",
    },

    "PG Hits!": {
        slug: "pg-hits",
        tags: ["kids", "standup"],
        cover: "https://storage.googleapis.com/rgb-monster-assets/pg-hits/cover.webp",
        short_description: "Family-friendly stand-up comedy club",
        description:
            "Three top stand-ups perform their very best routines just as they do in comedy clubs up and down the country and abroad, just without the swearing! PG Hits is a professional stand-up comedy compilation show that leaves out the really rude bits so everybody can enjoy the show. Comedy fans of all ages and all tastes will have something to enjoy as we bring you a diverse line-up from the very best the festival has to offer, at a relaxed lunchtime performance.",
        tickets: "https://tickets.edfringe.com/whats-on/pg-hits-the-best-in-family-friendly-stand-up-comedy",
    },

    "The Most Toast": {
        slug: "toast",
        tags: ["unique"],
        short_description: "Somebody has eaten the most toast. We will find them.",
        description: "Somebody in the audience will have eaten the most toast. We will find them.",
        tickets: "https://tickets.edfringe.com/whats-on/most-toast",
    },

    "This Is Your Trial": {
        slug: "trial",
        tags: ["format"],
        short_description: "Award-winning improvised comedy courtroom",
        description:
            "Guilty or innocent? You decide! The award-winning, critically acclaimed courtroom roast returns to the Fringe for its eleventh year! You accuse friends and family of crimes, and top comedians take on the roles of judge and defence counsel, hearing testimony, cross-examining witnesses, and improvising their arguments for each case. It’s up to the audience as jury to deliver your verdict. Never the same show twice, a must-do fringe experience! 'A perfect bit of improv mayhem' ***** (Mirror). 'Inventive, intelligent comedy' ***** (Scotsman).",
        tickets: "https://tickets.edfringe.com/whats-on/this-is-your-trial-the-fully-improvised-comedy-courtroom",
    },

    "With your Guest: Matt Davis": {
        slug: "with-your-guest",
        tags: ["format", "guest comedians"],
        short_description: "Three comedians compete to host a game show",
        description:
            "One guest. Three talk shows. Three comedians compete to host the talk show of their dreams, at the same time, with the same guest! On tonight's improvised show, our guest, Matt Davis, is here to promote his latest project: whatever you decide! And here's our hosts, sharing the spotlight and audience suggestions, attempting to keep their show on the air and deliver the best interview for their bizarrely niche viewership. Ladies and gentlemen, please give it up for interactive lunacy, featuring comedians from across the Fringe. *Applause*",
        tickets: "https://tickets.edfringe.com/whats-on/with-your-guest-matt-davis",
    },
};
