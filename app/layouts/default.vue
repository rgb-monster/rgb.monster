<script>
    import {useStore} from "@/shows.js";

    export default {
        data() {
            return {
                store: useStore(),
                socials: [
                    {
                        network: "facebook",
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M32,6C17.641,6,6,17.641,6,32c0,12.999,9.54,23.769,22,25.693V40h-6v-7h6v-5c0-7,4-11,10-11c3.133,0,5,1,5,1v6h-4 c-2.86,0-4,2.093-4,4v5h7l-1,7h-6v17.822C47.945,56.334,58,45.344,58,32C58,17.641,46.359,6,32,6z"/></svg>',
                        url: "https://www.facebook.com/rgbmonster/",
                    },
                    {
                        network: "instagram",
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M 21.580078 7 C 13.541078 7 7 13.544938 7 21.585938 L 7 42.417969 C 7 50.457969 13.544938 57 21.585938 57 L 42.417969 57 C 50.457969 57 57 50.455062 57 42.414062 L 57 21.580078 C 57 13.541078 50.455062 7 42.414062 7 L 21.580078 7 z M 47 15 C 48.104 15 49 15.896 49 17 C 49 18.104 48.104 19 47 19 C 45.896 19 45 18.104 45 17 C 45 15.896 45.896 15 47 15 z M 32 19 C 39.17 19 45 24.83 45 32 C 45 39.17 39.169 45 32 45 C 24.83 45 19 39.169 19 32 C 19 24.831 24.83 19 32 19 z M 32 23 C 27.029 23 23 27.029 23 32 C 23 36.971 27.029 41 32 41 C 36.971 41 41 36.971 41 32 C 41 27.029 36.971 23 32 23 z"/></svg>',
                        url: "https://www.instagram.com/rgbmonster/",
                    },
                    {
                        network: "youtube",
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-label="YouTube Icon" role="img"><rect width="24" height="24" rx="5.5" fill="#00000000"/><g transform="translate(3, 3) scale(0.75)"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" /><path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" class="dark" /></g>',
                        url: "https://www.youtube.com/@rgbmonster",
                    },
                    {
                        network: "tiktok",
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M48,8H16c-4.418,0-8,3.582-8,8v32c0,4.418,3.582,8,8,8h32c4.418,0,8-3.582,8-8V16C56,11.582,52.418,8,48,8z M50,27 c-3.964,0-6.885-1.09-9-2.695V38.5C41,44.841,35.841,50,29.5,50S18,44.841,18,38.5S23.159,27,29.5,27h2v5h-2 c-3.584,0-6.5,2.916-6.5,6.5s2.916,6.5,6.5,6.5s6.5-2.916,6.5-6.5V14h5c0.018,1.323,0.533,8,9,8V27z"/></svg>',
                        url: "https://www.tiktok.com/@rgbmonster",
                    },
                ],
            };
        },
        computed: {
            currentYear() {
                let year = new Date().getFullYear();
                return year;
            },
        },
    };
</script>
<template>
    <slot></slot>
    <footer v-if="!store.loading" class="swoosh">
        <div class="socials">
            <a
                v-for="social in socials"
                :key="social.network"
                :href="social.url"
                :title="capitalize(social.network)"
                target="_blank"
            >
                <div v-html="social.icon" />
            </a>
        </div>

        <div class="container">
            &copy; {{ currentYear }} RGB Monster | Unusual Comedy Production<br />33 Foley Street, London, W1W 6HA
        </div>
    </footer>
</template>

<style lang="css">
    footer.swoosh {
        position: relative;
        background: var(--dark);
        color: var(--beige);
        text-align: center;
        font-family: var(--header-font);
        text-transform: uppercase;
        padding: 20px;

        .socials {
            display: flex;
            justify-content: center;
            margin-bottom: 10px;
            gap: 10px;

            a {
                padding: 5px;
                border-radius: 10px;
                transition: background 300ms ease;

                svg {
                    height: 40px;
                    fill: var(--light);
                    transition: fill 300ms ease;

                    path.dark {
                        fill: var(--dark);
                    }
                }

                &:hover {
                    background: var(--brown);

                    svg {
                        fill: var(--light);
                        path.dark {
                            fill: var(--brown);
                        }
                    }
                }
            }
        }

        &::before {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            height: 1em;
            transform: translateY(-50%);
            background: var(--dark);
            mask-image: url(/new/ink-swipe-top.webp);
            mask-size: cover;
            mask-position: center;
            z-index: 20;
        }
    }
</style>
