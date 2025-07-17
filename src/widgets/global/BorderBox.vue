<script>
    export default {
        name: "BorderBox",
        props: {
            // these are optional props for if your button has a linkable state
            type: {
                type: String,
                default: "normal",
            },
            shadow: [Boolean, String],
            radius: {
                type: Number,
                default: 10,
            },
            jaggedness: {
                type: Number,
                default: 6,
            },
            pointDensity: {
                type: Number,
                default: 0.3,
            },
        },

        data() {
            return {
                seed: 0,
            };
        },

        watch: {
            radius() {
                this.generateNewMask();
            },
            jagedness() {
                this.generateNewMask();
            },
            pointDensity() {
                this.generateNewMask();
            },
        },

        methods: {
            // --- PRNG and Hashing (Unchanged) ---
            hashString(str) {
                let hash = 5381;
                for (let i = 0; i < str.length; i++) {
                    hash = (hash << 5) + hash + str.charCodeAt(i);
                }
                return hash;
            },

            createSeededRandom(seed) {
                return function () {
                    let t = (seed += 0x6d2b79f5);
                    t = Math.imul(t ^ (t >>> 15), t | 1);
                    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
                    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
                };
            },

            /**
             * Creates a CSS-ready Data URI for a jagged rectangle MASK.
             * @returns {string} A string like 'url("data:image/svg+xml;base64,...")'
             */
            createJaggedRectMask(width, height, randomFunc, options = {}) {
                let {cornerRadius = 40, jaggedness = 12, pointDensity = 0.2, maxSpikeFactor = 0.6} = options;

                let d = "";
                let PI = Math.PI;
                let lastRandomOffset = 0;

                let jaggedLineTo = (x1, y1, x2, y2, numPoints) => {
                    let lineData = "";
                    let dx = x2 - x1,
                        dy = y2 - y1;
                    for (let i = 1; i <= numPoints; i++) {
                        let newRandomOffset = (randomFunc() - 0.5) * jaggedness;
                        let maxChange = jaggedness * maxSpikeFactor;
                        let delta = newRandomOffset - lastRandomOffset;
                        if (Math.abs(delta) > maxChange) {
                            newRandomOffset = lastRandomOffset + Math.sign(delta) * maxChange;
                        }
                        lastRandomOffset = newRandomOffset;
                        let t = i / numPoints;
                        let pointX = x1 + dx * t + newRandomOffset * (dx === 0 ? 1 : 0);
                        let pointY = y1 + dy * t + newRandomOffset * (dy === 0 ? 1 : 0);
                        lineData += `L ${pointX.toFixed(2)} ${pointY.toFixed(2)} `;
                    }
                    return lineData;
                };
                let jaggedArcTo = (centerX, centerY, radius, startAngle, endAngle, numPoints) => {
                    let arcData = "";
                    let angleRange = endAngle - startAngle;
                    for (let i = 1; i <= numPoints; i++) {
                        let newRandomOffset = (randomFunc() - 0.5) * jaggedness;
                        let maxChange = jaggedness * maxSpikeFactor;
                        let delta = newRandomOffset - lastRandomOffset;
                        if (Math.abs(delta) > maxChange) {
                            newRandomOffset = lastRandomOffset + Math.sign(delta) * maxChange;
                        }
                        lastRandomOffset = newRandomOffset;
                        let t = i / numPoints;
                        let angle = startAngle + angleRange * t;
                        let currentRadius = radius + newRandomOffset;
                        let pointX = centerX + currentRadius * Math.cos(angle);
                        let pointY = centerY + currentRadius * Math.sin(angle);
                        arcData += `L ${pointX.toFixed(2)} ${pointY.toFixed(2)} `;
                    }
                    return arcData;
                };

                let topEdgeLength = width - 2 * cornerRadius;
                let sideEdgeLength = height - 2 * cornerRadius;
                let arcLength = cornerRadius * (PI / 2);
                let topEdgePoints = Math.max(1, Math.round(topEdgeLength * pointDensity));
                let sideEdgePoints = Math.max(1, Math.round(sideEdgeLength * pointDensity));
                let arcPoints = Math.max(1, Math.round(arcLength * pointDensity));
                let topRight = {cx: width - cornerRadius, cy: cornerRadius, start: -PI / 2, end: 0};
                let bottomRight = {cx: width - cornerRadius, cy: height - cornerRadius, start: 0, end: PI / 2};
                let bottomLeft = {cx: cornerRadius, cy: height - cornerRadius, start: PI / 2, end: PI};
                let topLeft = {cx: cornerRadius, cy: cornerRadius, start: PI, end: (3 * PI) / 2};

                d += `M ${cornerRadius} ${0 + (randomFunc() - 0.5) * jaggedness} `;
                d += jaggedLineTo(cornerRadius, 0, width - cornerRadius, 0, topEdgePoints);
                d += jaggedArcTo(topRight.cx, topRight.cy, cornerRadius, topRight.start, topRight.end, arcPoints);
                d += jaggedLineTo(width, cornerRadius, width, height - cornerRadius, sideEdgePoints);
                d += jaggedArcTo(
                    bottomRight.cx,
                    bottomRight.cy,
                    cornerRadius,
                    bottomRight.start,
                    bottomRight.end,
                    arcPoints
                );
                d += jaggedLineTo(width - cornerRadius, height, cornerRadius, height, topEdgePoints);
                d += jaggedArcTo(
                    bottomLeft.cx,
                    bottomLeft.cy,
                    cornerRadius,
                    bottomLeft.start,
                    bottomLeft.end,
                    arcPoints
                );
                d += jaggedLineTo(0, height - cornerRadius, 0, cornerRadius, sideEdgePoints);
                d += jaggedArcTo(topLeft.cx, topLeft.cy, cornerRadius, topLeft.start, topLeft.end, arcPoints);
                d += "Z";

                let svgString = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'><path d='${d}' fill='black'/></svg>`;

                // Reverted to basic URL encoding
                let encoded = svgString.replace(/>/g, "%3E").replace(/</g, "%3C").replace(/#/g, "%23"); // Included for robustness

                return `url("data:image/svg+xml,${encoded}")`;
            },

            generateNewMask() {
                let box = this.$el.getBoundingClientRect();
                let randomFunc = this.createSeededRandom(this.seed);

                // Generate the mask using the full jagged edge logic
                let radius = this.radius < 1 ? this.radius * 100 * Math.min(window.innerWidth / 1000, 1) : this.radius;
                let jaggedness = this.jaggedness * Math.max(Math.min(window.innerWidth / 500, 1), 0.1);

                let maskUrl = this.createJaggedRectMask(box.width, box.height, randomFunc, {
                    cornerRadius: radius,
                    jaggedness: jaggedness,
                    pointDensity: this.pointDensity,
                    maxSpikeFactor: 0.2,
                });

                document.documentElement.style.setProperty(`--jagged-mask-${this.seed}`, maskUrl);
            },

            onResize() {
                this.generateNewMask();
            },
        },

        mounted() {
            this.seed = Math.round(Math.random() * 1000000);

            this.resizeObserver = new ResizeObserver(this.onResize);
            this.resizeObserver.observe(this.$el);
        },

        beforeUnmount() {
            this.resizeObserver.disconnect();
            document.documentElement.style.removeProperty(`--jagged-mask-${this.seed}`);
        },
    };
</script>

<template>
    <div class="border-box">
        <div class="shadow" v-if="shadow" :style="{'background-image': `var(--jagged-mask-${seed})`}" />
        <div class="contents" :style="{'mask-image': `var(--jagged-mask-${seed})`}">
            <slot />
        </div>
    </div>
</template>

<style lang="scss">
    .border-box {
        position: relative;
        display: inline-block;
        width: 100%;

        .background {
            position: absolute;
            width: 100%;
            height: 100%;

            svg {
                width: 100%;
                height: 100%;
            }
        }

        .contents {
            mask-size: 100% 100%;
            mask-repeat: no-repeat;
            position: relative;
        }

        .shadow {
            pointer-events: none;
            position: absolute;
            background-size: cover;
            height: 100%;
            width: 100%;
            top: 0px;
            left: 0px;
            filter: blur(2px);
            opacity: 0.8;

            &.faint {
                filter: blur(5px);
                opacity: 0.4;
            }
        }
    }
</style>
