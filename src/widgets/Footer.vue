<script setup>
    import dt from "py-datetime";
    import {useData} from "vitepress";
    const {frontmatter} = useData();
    let year = dt.datetime.now().year;

    import facebook from "/social-icons/facebook.svg";

    let socialIcons = {
        facebook: `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 64 64" width="64px" height="64px"><path d="M32,6C17.641,6,6,17.641,6,32c0,12.999,9.54,23.769,22,25.693V40h-6v-7h6v-5c0-7,4-11,10-11c3.133,0,5,1,5,1v6h-4 c-2.86,0-4,2.093-4,4v5h7l-1,7h-6v17.822C47.945,56.334,58,45.344,58,32C58,17.641,46.359,6,32,6z"/></svg>`,
        instagram: `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 64 64" width="64px" height="64px"><path d="M 21.580078 7 C 13.541078 7 7 13.544938 7 21.585938 L 7 42.417969 C 7 50.457969 13.544938 57 21.585938 57 L 42.417969 57 C 50.457969 57 57 50.455062 57 42.414062 L 57 21.580078 C 57 13.541078 50.455062 7 42.414062 7 L 21.580078 7 z M 47 15 C 48.104 15 49 15.896 49 17 C 49 18.104 48.104 19 47 19 C 45.896 19 45 18.104 45 17 C 45 15.896 45.896 15 47 15 z M 32 19 C 39.17 19 45 24.83 45 32 C 45 39.17 39.169 45 32 45 C 24.83 45 19 39.169 19 32 C 19 24.831 24.83 19 32 19 z M 32 23 C 27.029 23 23 27.029 23 32 C 23 36.971 27.029 41 32 41 C 36.971 41 41 36.971 41 32 C 41 27.029 36.971 23 32 23 z"/></svg>`,
        tiktok: `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 64 64" width="64px" height="64px"><path d="M48,8H16c-4.418,0-8,3.582-8,8v32c0,4.418,3.582,8,8,8h32c4.418,0,8-3.582,8-8V16C56,11.582,52.418,8,48,8z M50,27 c-3.964,0-6.885-1.09-9-2.695V38.5C41,44.841,35.841,50,29.5,50S18,44.841,18,38.5S23.159,27,29.5,27h2v5h-2 c-3.584,0-6.5,2.916-6.5,6.5s2.916,6.5,6.5,6.5s6.5-2.916,6.5-6.5V14h5c0.018,1.323,0.533,8,9,8V27z"/></svg>`,
        twitter: `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 64 64" width="64px" height="64px"><path d="M32,6C17.641,6,6,17.641,6,32c0,14.359,11.641,26,26,26s26-11.641,26-26C58,17.641,46.359,6,32,6z M44.927,26.226 c0.012,0.271,0.017,0.543,0.017,0.816c0,8.34-6.189,17.958-17.51,17.958c-3.476,0-6.711-1.045-9.435-2.835 c0.482,0.059,0.973,0.089,1.469,0.089c2.884,0,5.538-1.009,7.644-2.702c-2.693-0.051-4.966-1.877-5.749-4.384 c0.375,0.072,0.761,0.112,1.157,0.112c0.562,0,1.107-0.077,1.622-0.221c-2.816-0.579-4.937-3.13-4.937-6.188 c0-0.027,0-0.052,0-0.079c0.83,0.472,1.779,0.756,2.788,0.789c-1.651-1.131-2.737-3.063-2.737-5.252 c0-1.158,0.303-2.242,0.832-3.175c3.037,3.819,7.571,6.333,12.686,6.595c-0.104-0.46-0.159-0.943-0.159-1.438 c0-3.485,2.755-6.311,6.154-6.311c1.77,0,3.369,0.767,4.492,1.994c1.403-0.284,2.721-0.809,3.909-1.532 c-0.459,1.474-1.434,2.711-2.706,3.492C45.71,23.8,46.896,23.462,48,22.959C47.175,24.224,46.131,25.335,44.927,26.226z"/></svg>`,
    };

    let socialURLs = {
        facebook: "https://facebook.com/rgbmonster",
        instagram: "https://instagram.com/rgbmonster",
        twitter: "https://x.com/rgbcomedy",
        tiktok: "https://tiktok.com/@rgbmonster",
    };
</script>

<template>
    <footer class="site">
        <div class="bg-layer">
            <main>
                <div class="socials">
                    <a
                        :href="socialURLs[social]"
                        target="_blank"
                        v-for="social in ['instagram', 'facebook', 'twitter', 'tiktok']"
                        :key="social"
                    >
                        <div v-html="socialIcons[social]" />
                    </a>
                </div>
                <div class="copy">
                    <div>&copy; {{ year }} RGB MONSTER</div>
                </div>
            </main>
        </div>
    </footer>
</template>

<style lang="scss">
    footer.site {
        color: var(--brown);
        position: relative;

        .bg-layer {
            position: absolute;
            left: 0;
            right: 0;
            top: -30px;

            background: var(--beige);
            mask-image: url(/new/ink-swipe-level-bottom.webp);
            mask-size: 100% 100%;

            padding-top: 0.7em;

            text-align: center;
            text-transform: uppercase;
        }

        main {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;

            display: flex;
            justify-content: space-between;
            gap: 50px;

            font-size: 1.2rem;
            font-family: var(--rgb-font);
            align-items: center;
        }

        .socials {
            display: flex;
            gap: 5px;

            --size: 30px;
            svg {
                height: var(--size);
                width: var(--size);
                fill: var(--brown);
            }
        }

        .copy {
            text-align: right;
        }
    }
</style>
