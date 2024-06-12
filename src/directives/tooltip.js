export default {
    name: "tooltip",
    mounted(el, binding) {
        let instance = binding.instance;
        let tooltip = document.getElementById("tooltip");

        // we will move the tooltip to element data attribs. this way it also shows up in HTML
        el.dataset.tooltip = binding.value;

        let over = evt => {
            if (instance.showing || !binding.value) {
                return;
            }
            instance.showing = true;
            tooltip.innerHTML = el.dataset.tooltip;

            let elBox = el.getBoundingClientRect();
            let tooltipBox = tooltip.getBoundingClientRect();

            let x = elBox.left;
            if (tooltipBox.width > elBox.width) {
                // center-align the tooltip if the tooltip is wider than the container. Otherwise left-align
                // this is so that flex content doesn't end up with tooltip seemingly floating due to center-alignment
                x += (elBox.width - tooltipBox.width) / 2;
            }
            x = Math.min(Math.max(5, x), window.innerWidth - tooltipBox.width - 5);

            let y;
            let attachment = binding.arg || "bottom";

            if (attachment == "top") {
                y = elBox.top - tooltipBox.height;
            } else {
                y = elBox.bottom;
                if (y + tooltipBox.height > window.innerHeight) {
                    y = elBox.top - tooltipBox.height - 10;
                }
            }

            tooltip.style.left = `${x + window.scrollX}px`;
            tooltip.style.top = `${y + window.scrollY}px`;
            tooltip.classList.add("visible");
        };

        let out = evt => {
            if (evt.relatedTarget && (el.contains(evt.relatedTarget) || evt.relatedTarget == el)) {
                return;
            }
            instance.showing = false;
            tooltip.classList.remove("visible");
        };

        instance.listeners = [];
        let addListener = (evt, callback) => {
            el.addEventListener(evt, callback);
            instance.listeners.push([evt, callback]);
        };
        addListener("focus", over);
        addListener("blur", out);
        addListener("mouseover", over);
        addListener("mouseout", out);
    },

    updated(el, binding) {
        // update tooltip if things change (i'm performing an equality check here as i am not trusting the dom
        // not to be overly careful
        if (el.dataset.tooltip != binding.value) {
            el.dataset.tooltip = binding.value;
        }
    },

    beforeUnmount(el, binding) {
        let instance = binding.instance;
        if (instance.showing) {
            instance.showing = false;
            let tooltip = document.getElementById("tooltip");
            tooltip.classList.remove("visible");
        }

        (binding.instance.listeners || []).forEach(([evt, callback]) => {
            el.removeEventListener(evt, callback);
        });
    },
};
