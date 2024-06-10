// https://vitepress.dev/guide/custom-theme
import {createPinia} from "pinia";

import Layout from "./Layout.vue";

import "./destyle.css";
import "./style.scss";

import utils from "../../src/scripts/utils.js";
const globalWidgets = utils.importToComp(import.meta.glob("../../src/widgets/global/*.vue", {eager: true}));

/** @type {import('vitepress').Theme} */
export default {
    Layout,
    enhanceApp({app, router, siteData}) {
        const pinia = createPinia();
        pinia.use(({store}) => {
            //store.$requests = requests;
        });
        app.use(pinia);

        for (const name in globalWidgets) {
            app.component(name, globalWidgets[name]);
        }

        app.mixin({
            // make utils.filters available as global methods so we don't have to spell them out individually
            methods: utils.filters,
        });
    },
};
