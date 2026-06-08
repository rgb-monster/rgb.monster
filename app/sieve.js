// most of the time i don't need a fuzzy filter with typos etc.
// rather i want exact matches, and i want them matched quite specifically
// plus, because this is a filter, we don't care about ranking etc. in other words - this is more predictable

class Sieve {
    constructor(records) {
        this.sieve = records.map(rec => {
            let res = {};
            Object.keys(rec).forEach(field => {
                let vals = Array.isArray(rec[field]) ? rec[field] : [rec[field]];
                res[field.toLowerCase()] = vals.map(val => {
                    if (typeof val == "string") {
                        return val.toLowerCase();
                    } else {
                        return val ? JSON.stringify(val).toLowerCase() : "";
                    }
                });
            });
            return res;
        });
    }

    filter(q) {
        let words = (q.match(/[^\s\"']+|\"[^\"]*\"|'[^']*'/g) || [])
            .map(word => word.replace(/['"]/g, "").toLowerCase())
            .filter(word => word.trim());

        if (!words.length) {
            return this.sieve.map(match => match.id[0]);
        }

        let matches = this.sieve.filter(rec => {
            // any of the words anywhere is good enough for us
            let remaining = [...words];
            for (let word of [...remaining]) {
                let [searchField, searchVal] = word.split(":");
                // apart from field:something, also support `dynamic-<role/cat/etc>` where the field comes from
                // user input
                searchField = rec[searchField] ? searchField : `dynamic-${searchField}`;

                if (!rec[searchField]) {
                    searchField = word;
                }

                if (rec[searchField] && (searchVal || "").trim()) {
                    if (!searchVal || rec[searchField].some(val => val.includes(searchVal))) {
                        remaining.splice(remaining.indexOf(word), 1);
                    }
                } else {
                    for (let field in rec) {
                        let vals = rec[field];

                        if (vals.some(val => val.includes(searchField))) {
                            remaining.splice(remaining.indexOf(word), 1);
                            // the word has been found no need to look any further
                            break;
                        }
                    }
                }
                if (!remaining.length) {
                    // we've found all words - go home
                    break;
                }
            }

            return remaining.length == 0;
        });

        return matches.map(match => match.id[0]);
    }
}

export {Sieve};
