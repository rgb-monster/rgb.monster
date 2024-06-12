import utils from "/src/scripts/utils.js";

export default {
    name: "tab-trap",
    mounted(el, binding) {
        /*
            Tab trap keeps the tab focus within the container the directive is called on, wrapping as necessary!
        */
        let instance = binding.instance;

        instance.onKeyDown = el.addEventListener("keydown", evt => {
            if (evt.key == "Tab") {
                let focusableElements = utils.focusables(el);
                if (!focusableElements.length) {
                    return;
                }
                let first = focusableElements[0];
                let last = focusableElements.slice(-1)[0];
                let current = document.activeElement;

                if (evt.shiftKey && current == first) {
                    evt.preventDefault();
                    last.focus();
                } else if (!evt.shiftKey && current == last) {
                    evt.preventDefault();
                    first.focus();
                }
            }
        });
    },
    beforeUnmount(el, binding) {
        el.removeEventListener("keydown", binding.instance.onKeyDown);
    },
};
