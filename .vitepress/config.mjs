import {defineConfig} from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "RGB Monster",
    titleTemplate: ":title - RGB Monster",
    description: "Unusual Comedy Production",
    head: [
        ["link", {rel: "icon", href: "/favicon.ico"}],

        ["link", {rel: "preconnect", href: "https://fonts.googleapis.com"}],
        ["link", {rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: ""}],
        ["link", {href: "https://fonts.googleapis.com/css2?family=Roboto&display=swap", rel: "stylesheet"}],
    ],

    srcDir: "./src/pages",
});
