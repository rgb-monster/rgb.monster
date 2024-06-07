// https://vitepress.dev/guide/custom-theme
import {createPinia} from "pinia";

import Layout from "./Layout.vue";
import "./destyle.css";
import "./style.scss";

/** @type {import('vitepress').Theme} */
export default {
    Layout,
    enhanceApp({app, router, siteData}) {
        const pinia = createPinia();
        pinia.use(({store}) => {
            //store.$requests = requests;
        });
        app.use(pinia);
    },
};
