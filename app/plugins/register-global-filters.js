import utils from "../utils.js";

export default defineNuxtPlugin(nuxtApp => {
    Object.entries(utils.filters).forEach(([name, func]) => {
        nuxtApp.vueApp.config.globalProperties[name] = func;
    });
});
