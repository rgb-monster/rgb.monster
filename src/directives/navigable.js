import utils from "/src/scripts/utils.js";

export default {
    name: "navigable",
    mounted(el, binding) {
        el.classList.add("navigable");
        el.setAttribute("tabindex", "0");

        let direction = {
            ArrowUp: -1,
            ArrowDown: 1,
            Home: -1000,
            End: 1000,
        };

        let instance = binding.instance;

        instance.onKeyDown = el.addEventListener("keydown", evt => {
            if (evt.target != el) {
                // we operate exclusively on the element itself, not its children
                return;
            }

            if (direction[evt.key]) {
                evt.preventDefault();

                let navigables = utils
                    .focusables(el.parentElement, false)
                    .filter(el => el.classList.contains("navigable"));
                let idx = navigables.indexOf(el) + direction[evt.key];
                idx = Math.min(Math.max(idx, 0), navigables.length - 1);
                utils.scrollIn(navigables[idx]);
                navigables[idx].focus();
            } else if (evt.key == "ArrowRight") {
                // tabbing in
                evt.preventDefault();
                utils.focusables(el)[0].focus();
            }
        });
    },
    updated(el) {
        el.classList.add("navigable");
        el.setAttribute("tabindex", "0");
    },
    beforeUnmount(el, binding) {
        el.removeEventListener("keydown", binding.instance.onKeyDown);
    },
};
