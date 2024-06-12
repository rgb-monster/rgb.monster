export default {
    name: "focus",
    mounted(el) {
        if (window.innerWidth > 500) {
            el.focus();
        }
    },
};
