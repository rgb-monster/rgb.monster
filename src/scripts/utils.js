import dt from "py-datetime";

let utils = {
    noop: () => {},

    serverUrl(path) {
        // we're running on nginx if we're not on port 8085 anymore
        let nginx = document.location.port != "5173";
        let pathPrefix = path.startsWith("/api/") ? "" : "/api/"; // make sure we don't double prefix our calls
        let apiRoot = nginx
            ? `https://confirmed.show${pathPrefix}`
            : `http://${document.location.hostname}:8080${pathPrefix}`;
        return apiRoot + path;
    },

    slug: str => (str || "").replace(/[^\w-]+/g, "-"),

    focusables: (container, traverse = true) => {
        // returns all keyboard navigable elements in the container
        function* elems(container) {
            // while it may be the 21st century, there is still no simple way to retrieve all the elements you see
            for (let elem of container.children) {
                let style = window.getComputedStyle(elem);
                if (style.display != "none" && style.visibility != "hidden" && !elem.disabled) {
                    if (
                        elem.matches("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])") &&
                        elem.tabIndex != "-1" &&
                        !elem.disabled
                    ) {
                        yield elem;
                    } else if (traverse) {
                        for (let nested of elems(elem)) {
                            yield nested;
                        }
                    }
                }
            }
        }

        return [...elems(container)];
    },

    mousify(event) {
        // mousify touch events by looking at the first touch data
        if ("TouchEvent" in window && event instanceof TouchEvent) {
            // TouchEvent not present in Safari
            return event.touches[0];
        } else {
            return event;
        }
    },

    selectRandom(options) {
        return options[Math.floor(Math.random() * options.length)];
    },

    ordinal(num) {
        let ordinals = {
            1: "one",
            2: "two",
            3: "three",
            4: "four",
            5: "five",
            6: "six",
            7: "seven",
            8: "eight",
            9: "nine",
        };

        return ordinals[num] || num;
    },

    scrollIn: (elem, offset = 0) => {
        let box = elem.getBoundingClientRect();

        let getScrollParent = node => {
            if (node === null) {
                return null;
            }

            if (node != elem && (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth)) {
                return node;
            } else {
                return getScrollParent(node.parentNode);
            }
        };

        let parent = getScrollParent(elem);
        if (!parent) {
            return;
        }
        let parentBox = parent.getBoundingClientRect();

        let top = box.top - parentBox.top;
        let vertNudge = (parentBox.height - box.height) * (offset || 0);
        let scrollTop = parent.scrollTop;
        if (top - vertNudge < 0) {
            scrollTop = parent.scrollTop + top - vertNudge;
        } else if (top + box.height + vertNudge > parentBox.height) {
            scrollTop = parent.scrollTop + top + box.height - parentBox.height + vertNudge;
        }

        let left = box.left - parentBox.left;
        let horizNudge = box.width * (offset || 0);
        let scrollLeft = parent.scrollLeft;
        if (left < 0) {
            scrollLeft = parent.scrollLeft + left - horizNudge;
        } else if (left + box.width > parentBox.width) {
            scrollLeft = parent.scrollLeft + left + box.width - parentBox.width + horizNudge;
        }

        parent.scrollTo(scrollLeft, scrollTop);
    },

    animationFrame: callback => {
        // this little wrapper will skip any dropped frames
        let currentCallback = null;
        return () => {
            window.cancelAnimationFrame(currentCallback);
            currentCallback = window.requestAnimationFrame(callback);
        };
    },

    isNumber: str => /^-?\d+\.?\d*$/.exec(str) != null,

    round(val, precision) {
        let multiplier = Math.pow(10, precision || 0);
        return Math.round(val * multiplier) / multiplier;
    },

    toggleList(list, val) {
        if (list.includes(val)) {
            return list.filter(item => item != val);
        } else {
            return [...list, val];
        }
    },

    sum(values, accessor) {
        accessor = accessor || (val => val);
        return values && values.length ? values.map(item => accessor(item)).reduce((total, cur) => total + cur) : 0;
    },

    sort(values, keyFunc, ascending = true) {
        // exercise in NIH because i don't wanna pull in lodash just for a basic sort

        // shallow clone
        values = [...(values || [])];

        // turn ascening from bool into a 1/-1 we can multiply with
        ascending = ascending ? 1 : -1;

        values.sort((a, b) => {
            let aVals = keyFunc ? keyFunc(a) : a;
            let bVals = keyFunc ? keyFunc(b) : b;
            aVals = aVals?.constructor.name == "Array" ? aVals : [aVals];
            bVals = bVals?.constructor.name == "Array" ? bVals : [bVals];

            for (let i = 0; i < aVals.length; i++) {
                let aVal = aVals[i];
                let bVal = bVals[i];
                if (typeof aVal == "string") {
                    aVal = aVal.toLowerCase();
                }
                if (typeof bVal == "string") {
                    bVal = bVal.toLowerCase();
                }

                if (aVal < bVal) {
                    return -ascending;
                } else if (aVal > bVal) {
                    return ascending;
                } else {
                    continue;
                }
            }
            return 0;
        });
        return values;
    },

    sortOnce(keyFunc, sortFunc) {
        // a live sort can backfire when you, say, edit by name and then change the name
        // rather, we want a stable sort, and a re-sort on the next time the page is visited
        let sorted = null;
        let strKey = rec => keyFunc(rec).toString();

        let sortOnce = (values, ascending = true) => {
            if (!sorted) {
                sorted = utils.sort(values, sortFunc, ascending).map(rec => strKey(rec));
            }
            return utils.sort(values, val => (sorted.includes(strKey(val)) ? sorted.indexOf(strKey(val)) : 9999));
        };

        return sortOnce;
    },

    dedupe(list, accessor) {
        // dedupes a list by the given accessor and returns deduped list while maintaining order
        let byKey = {};
        let res = [];
        list.forEach(item => {
            let key = accessor(item);
            if (!byKey[key]) {
                byKey[key] = true;
                res.push(item);
            }
        });

        return res;
    },

    isDict(obj) {
        return obj && !["number", "string", "boolean"].includes(typeof obj) && !Array.isArray(obj);
    },

    getCSSVar(variable) {
        // returns CSS var defined in root, e.g. --content-horiz-padding
        return (getComputedStyle(document.querySelector("body")).getPropertyValue(`--${variable}`) || "").trim();
    },

    emailOk(email) {
        const re =
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },

    urlOk(url) {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    },

    range(start, end, step) {
        if (end === undefined) {
            [start, end, step] = [0, start, 1];
        }

        step = Math.abs(step) || 1;
        if (end < start) {
            step = step * -1;
        }

        function* iterator() {
            for (let i = start; start < end ? i < end : i > end; i += step) {
                yield i;
            }
        }

        return [...iterator()];
    },

    shuffle(array) {
        // from bostock via stack overflow
        array = array || [];
        let m = array.length;
        let t;
        let i;

        // While there remain elements to shuffle…
        while (m) {
            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    },

    random(start, end) {
        if (Array.isArray(start) || typeof start == "string") {
            // we've been given a list return end number of items from the list
            end = Math.min(Math.max(end || 1, 0), start.length);
            let items = utils.shuffle(start);
            return end > 1 ? items.slice(0, end) : items[0];
        } else if (!end) {
            return Math.round(Math.random() * start);
        } else {
            return start + Math.round(Math.random() * (end - start));
        }
    },

    parseTS(ts, utc) {
        if (typeof ts != "string") {
            return ts ? dt.datetime(ts) || ts : ts;
        }

        let formats = ["%Y-%m-%d %H:%M:%S.%f", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M", "%Y-%m-%d"];
        for (let i = 0; i < formats.length; i++) {
            try {
                // return first successful parse
                return dt.datetime.strptime(ts, formats[i], utc);
            } catch (error) {
                // pass
            }
        }
        // return the input if all else fails
        return ts;
    },

    toBrowserTZ(ts) {
        return dt.datetime(ts.jsDate);
    },

    parseDuration(duration) {
        // tries to parse mm:ss into seconds
        try {
            let [minutes, seconds] = duration.split(":");
            minutes = parseInt(minutes) || 0;
            seconds = parseInt(seconds) || 0;
            return minutes * 60 + seconds;
        } catch (error) {}
        return 0;
    },

    formatTS(ts, format) {
        ts = utils.parseTS(ts);
        return ts.strftime(format);
    },

    capitalize: label => (!label ? "" : `${label[0].toUpperCase()}${label.slice(1, label.length)}`),

    zeroPad: num => new String(parseInt(num)).padStart(2, "0"),

    addMonths(ts, months) {
        let time = {hour: ts.hour, minute: ts.minute};
        ts = dt.datetime.combine(ts, dt.time());
        utils.range(months).forEach(() => {
            if (months > 0) {
                ts = dt.datetime(ts + dt.timedelta(32));
            } else if (months < 0) {
                ts = dt.datetime(ts - dt.timedelta(1));
            }

            ts = ts.replace({day: 1, hour: time.hour, minute: time.minute});
        });

        return ts;
    },

    pluralize(n, singular, plural) {
        n = Array.isArray(n) ? n.length : n;
        return `${n} ${n == 1 ? singular : plural}`;
    },

    pluralizeNoun(n, singular, plural) {
        n = Array.isArray(n) ? n.length : n;
        return n == 1 ? singular : plural;
    },

    sanitize(obj) {
        // trim whitespace for now, maybe other insanity later
        // deep clone, to avoid side-effects
        obj = JSON.parse(JSON.stringify(obj));
        if (obj == null || typeof obj == "number") {
            return obj;
        } else if (Array.isArray(obj)) {
            obj.forEach((item, idx) => {
                obj[idx] = this.sanitize(item);
            });
            return obj;
        } else if (typeof obj == "string") {
            return obj.trim();
        } else {
            Object.entries(obj).forEach(([key, val]) => {
                obj[key] = this.sanitize(val);
            });
            return obj;
        }
    },

    normalize(obj) {
        return utils.sanitize(obj).toString().trim().toLowerCase();
    },

    humanDate(date) {
        let now = dt.datetime.now();
        if (now.year != date.year) {
            return date.strftime("%d %b, %Y");
        } else {
            return date.strftime("%d %b");
        }
    },

    humanTs(ts, timeFormat, toLocal) {
        let now = dt.datetime.now();
        timeFormat = timeFormat || "%H:%M";
        ts = utils.parseTS(ts);
        if (toLocal) {
            // when ts is in utc we allow to convert it to local timezone
            // since utc timestamps now correctly str by default to their UTC values
            ts = dt.datetime(ts.jsDate);
        }

        if (now.year != ts.year) {
            return ts.strftime(`%b %d, %Y ${timeFormat}`);
        } else {
            return ts.strftime(`%b %d, ${timeFormat}`);
        }
    },

    timeSinceUTC(ts) {
        // returns approximate time since. i'm being real lazy right now because we use this only for tickets
        // this also doesn't support future times
        ts = utils.parseTS(ts, true);
        let now = dt.datetime(dt.datetime.utcnow());
        let minutes = dt.timedelta(now - ts).totalSeconds() / 60;
        if (minutes < 1) {
            return "just now";
        } else if (minutes < 120) {
            return `${utils.pluralize(Math.ceil(minutes), "minute", "minutes")} ago`;
        } else if (minutes < 60 * 36) {
            let hours = utils.round(minutes / 60, 1);
            return `${utils.pluralize(hours, "hour", "hours")} ago`;
        } else {
            let days = utils.round(minutes / 60 / 24, 1);
            return `${utils.pluralize(days, "day", "days")} ago`;
        }
    },

    isEmpty(obj) {
        return !obj || Object.keys(obj).length == 0;
    },

    humanNumber(val) {
        // https://stackoverflow.com/a/51322015/46617
        if (typeof val == "string") {
            val = parseFloat(val.replace(/,/, "")) || 0;
        }
        return val.toLocaleString();
    },

    listify(val) {
        return Array.isArray(val) ? val : [val];
    },

    stripThe(name) {
        // removes "the " from prefix so we can normalize and not have to consider the the's
        name = (name || "").trim();
        return name.toLowerCase().startsWith("the ") ? name.slice(4) : name;
    },

    singleSpace(str) {
        return str.replace(/\s+/g, " ").trim();
    },

    replaceAll(str, from, to) {
        // escape any special symbols
        from = from.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
        return str.replace(new RegExp(from, "g"), to);
    },

    setDefault(obj, key, defaultVal) {
        obj[key] = obj[key] || defaultVal;
        return obj[key];
    },

    addEventListener(watcher, type, listener) {
        // Bug with Safari re MediaQueryList not inheriting addEventListener
        // https://github.com/mdn/sprints/issues/858#issuecomment-537992077
        if (watcher.addEventListener) {
            watcher.addEventListener(type, listener);
        } else if (watcher.addListener) {
            watcher.addListener(listener);
        }
    },
    removeEventListener(watcher, type, listener) {
        // Bug with Safari re MediaQueryList not inheriting removeEventListener
        // https://github.com/mdn/sprints/issues/858#issuecomment-537992077
        if (watcher.removeEventListener) {
            watcher.removeEventListener(type, listener);
        } else if (watcher.removeListener) {
            watcher.removeListener(listener);
        }
    },

    importToComp(components) {
        // converts results of eagerGlob to actually usable components
        return Object.fromEntries(
            Object.entries(components).map(([key, comp]) => {
                let componentName = key.split("/").slice(-1)[0].split(".")[0];
                return [componentName, comp.default || comp];
            })
        );
    },

    async sleep(seconds) {
        return new Promise(resolve => {
            setTimeout(resolve, seconds * 1000);
        });
    },

    isTouch() {
        return "ontouchstart" in window;
    },

    hasMouse() {
        return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    },

    adjustedDate(ts) {
        let date = dt.datetime.combine(ts, dt.time(5));
        if (ts.hour < 5) {
            date = dt.datetime(date - dt.timedelta({days: 1}));
        }
        return date;
    },
};

utils.filters = Object.fromEntries(
    [
        "capitalize",
        "round",
        "range",
        "formatTS",
        "humanNumber",
        "humanDate",
        "humanTs",
        "emailOk",
        "urlOk",
        "addMonths",
        "toggleList",
        "pluralize",
        "pluralizeNoun",
        "sort",
        "isEmpty",
        "timeSinceUTC",
        "stripThe",
        "zeroPad",
        "normalize",
        "ordinal",
    ].map(funcName => [funcName, utils[funcName]])
);

export default utils;
