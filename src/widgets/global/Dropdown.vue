<script>
    import utils from "/src/scripts/utils.js";

    export default {
        name: "Dropdown",
        props: {
            closeOnClick: {
                type: Boolean,
                default: true,
            },
            // showMenu allows parent to close the menu if necessary. check filteredDropdown for how to do it!
            showMenu: Boolean,

            // by default we close dropdown on escape. set to false if you want to control it yourself
            handleEsc: {
                type: Boolean,
                default: true,
            },

            attach: String,

            autoPosition: {
                type: String,
                default: "true",
            },

            disabled: Boolean,

            // sometimes the popups can end up in a parent container that has overflow rules and so it becomes obvious
            // that the menu is not a true-popup. in such cases set menuClass to a value. this prop doubles both
            // as a flag and as a class name - this is because the teleported menu parent's won't be the dropdown
            // anymore and you'll need a class handle to style it.
            menuClass: [String, Array],
        },
        emits: ["open", "close", "toggle"],
        data() {
            return {
                open: this.showMenu,
                downed: false,
            };
        },
        computed: {
            toggler: state => state.$refs.dropdown.getElementsByClassName("toggle")[0],
        },

        watch: {
            showMenu(show) {
                this.toggle(show);
            },
        },

        methods: {
            toggle(event) {
                if (event?.button != null && event.button != 0) {
                    return;
                }

                if (event && this.downed) {
                    // down is followed by click and we don't want that
                    this.downed = false;
                    return;
                }

                this.open = event === false || event === true ? event : !this.open;
                this.listen(this.open);

                this.$emit(this.open ? "open" : "close");
                this.$emit("toggle", this.open);

                if (this.open) {
                    this.$nextTick(this.positionMenu);

                    if (window.innerWidth > 500) {
                        window.setTimeout(() => {
                            // when showing menu, put keyboard focus on the first element;
                            let first = utils.focusables(this.$refs.menu)[0];
                            first ? first.focus() : null;
                        });
                    }
                } else {
                    if (this.toggler & !event) {
                        window.setTimeout(() => {
                            this.toggler.focus();
                        });
                    }
                }
            },
            positionMenu() {
                if (this.autoPosition == "false" || !this.open) {
                    return;
                }

                let menu = this.$refs.menu;
                if (!menu) {
                    return;
                }

                menu.style.top = "";

                if (this.autoPosition != "vertical") {
                    menu.style.left = "";
                    menu.style.right = "";
                }
                let menuBox = menu.getBoundingClientRect();

                let containerBox = this.$refs.dropdown.getBoundingClientRect();
                let [height, width] = [window.innerHeight, document.body.clientWidth];
                let padding = 10;

                if (this.menuClass) {
                    let top = Math.min(
                        containerBox.bottom + window.scrollY,
                        height - menuBox.height - padding + window.scrollY
                    );
                    menu.style.top = `${top}px`;

                    if (this.autoPosition != "vertical") {
                        if (this.attach == "right") {
                            menu.style.right = `${width - containerBox.right}px`;
                        } else {
                            let menuWidth = Math.max(containerBox.width, menuBox.width);
                            menu.style.width = `${menuWidth}px`;

                            let left = Math.min(containerBox.left, width - menuWidth - padding);
                            menu.style.left = `${left}px`;
                        }
                    }

                    return;
                }

                if (this.autoPosition != "vertical") {
                    if (this.attach == "right") {
                        menu.style.right = "0px";
                    } else if (this.attach == "center") {
                        let x = parseInt((containerBox.width - menuBox.width) / 2);
                        x = Math.max(x, -containerBox.left + padding);
                        x = Math.min(x, -containerBox.left + width - menuBox.width - padding);
                        menu.style.left = `${x}px`;
                    } else {
                        let left = Math.min(menuBox.x, width - menuBox.width - padding);
                        menu.style.left = `${left - containerBox.x}px`;
                    }
                }

                let top = Math.min(menuBox.y, height - menuBox.height - padding);
                if (top != menuBox.y) {
                    // if we don't fit below, see if we maybe fit above
                    if (containerBox.y - menuBox.height - 5 > 0) {
                        top = containerBox.y - menuBox.height - 5;
                    }
                    menu.style.top = `${top - containerBox.y}px`;
                }
            },
            onDocumentMouseDown(event) {
                // we hide the menu on mouse down so there isn't a weird "it's gonna disappear but not just yet
                // matches behavior of most OS'es
                if (this.toggler && (event.target == this.toggler || this.toggler.contains(event.target))) {
                    // clicked on toggle - nice and easy
                    this.downed = true;
                    this.toggle();
                } else if (this.open && event.target != this.$refs.menu && !this.$refs.menu.contains(event.target)) {
                    // clicked someplace else - consider if maybe they clicked on a nested menu
                    if (!event.target.closest("#popups")) {
                        // the target is not part of a teleported menu, we can close in peace
                        this.toggle(false);
                    } else {
                        // otherwise figure out if this is our child
                        function getTopMenu(elem) {
                            // menus can be infinitely nested, so climb way up
                            let menu = elem.closest(".menu");
                            while (menu && menu.parentNode.closest(".menu")) {
                                menu = menu.parentNode.closest(".menu");
                            }
                            return menu;
                        }

                        let teleportedMenus = [...document.getElementById("popups").children];
                        let ourMenu = getTopMenu(this.$refs.menu);
                        let targetMenu = getTopMenu(event.target);

                        if (!targetMenu || teleportedMenus.indexOf(ourMenu) > teleportedMenus.lastIndexOf(targetMenu)) {
                            this.toggle(false);
                        }
                    }
                }
            },

            onDocumentKeyDown(event) {
                if (this.handleEsc && event.key == "Escape") {
                    event.preventDefault();
                    event.stopPropagation();
                    this.toggle(false);
                }
            },

            listen(listen) {
                if (listen) {
                    document.addEventListener("keydown", this.onDocumentKeyDown, true);
                    document.addEventListener("mousedown", this.onDocumentMouseDown);
                    window.addEventListener("scroll", this.positionMenu);
                    window.addEventListener("resize", this.positionMenu);
                } else {
                    document.removeEventListener("keydown", this.onDocumentKeyDown, true);
                    document.removeEventListener("mousedown", this.onDocumentMouseDown);
                    window.removeEventListener("scroll", this.positionMenu);
                    window.removeEventListener("resize", this.positionMenu);
                }
            },
            async onMenuClick(event) {
                if (event?.button != null && event.button != 0) {
                    // we want left-click only
                    return;
                }

                if (this.closeOnClick) {
                    if (
                        (event.target.closest("button") || event.target.closest("a")) &&
                        !event.target.closest(".toggle")
                    ) {
                        // hide menu unless what we clicked on is a nested menu toggle, or it's an input element
                        this.toggle(false);
                    }
                } else {
                    // clicking inside the dropdown can trigger dropdown content changes, so we reposition after each
                    // interaction
                    await this.$nextTick();
                    this.positionMenu();
                }
            },
        },

        mounted() {
            if (this.showMenu == true) {
                this.toggle(this.showMenu);
            }
            if (this.open) {
                this.listen(true);
            }
        },
        beforeUnmount() {
            this.listen(false);
        },
    };
</script>

<template>
    <div class="dropdown" :class="{open}" ref="dropdown">
        <slot name="toggle-container">
            <button class="toggle" @click.stop="toggle" :disabled="disabled">
                <div>
                    <div class="label">
                        <slot name="toggle"></slot>
                    </div>
                    <div class="dropper">
                        <Icon name="keyboard_arrow_down" />
                    </div>
                </div>
            </button>
        </slot>

        <ClientOnly>
            <teleport to="#popups" :disabled="!menuClass || !open">
                <div class="menu" ref="menu" v-if="open" :class="menuClass" @click="onMenuClick" v-tab-trap>
                    <slot name="menu"></slot>
                </div>
            </teleport>
        </ClientOnly>

        <!-- in case if you need some non-dropdown-style elements outside of the dropdown, you can use the default slot -->
        <slot />
    </div>
</template>

<style lang="scss">
    @mixin menuStyles() {
        position: absolute;
        z-index: 1500;
        width: auto;
        max-width: 95vw;
        margin-top: 3px;

        box-shadow: 0px 2px 5px 1px var(--shadow);
        background: var(--base);
        border: 1px solid var(--border);
        max-height: calc(min(30em, 95vh));
        overflow-y: auto;
        @include mixins.scrollbar;

        hr {
            margin: 0;
        }

        .menu-item {
            display: block;
            width: 100%;
            white-space: nowrap;
            padding: 10px 18px;
            color: var(--base-text);
            align-items: center;
            display: flex;
            gap: 5px;

            &:hover {
                background: var(--focus-fill);
                color: var(--base-text);
            }

            &.with-icon {
                padding-left: 10px;
                display: flex;
                align-items: center;
            }

            &:disabled {
                opacity: 0.5;
            }

            &.destructive {
                color: var(--destructive);
            }

            &.constructive {
                color: var(--constructive);
            }
        }

        hr {
            border: none;
            border-top: 1px solid var(--border);
            margin: 0;
        }

        & > hr:last-child {
            display: none;
        }

        & > header {
            color: var(--label);
            font-size: 0.85em;
            padding: 10px;
            padding-bottom: 3px;
        }

        .extra {
            background: var(--base-1);
            border-top: 1px solid var(--border);
            font-size: 0.85em;
            padding: 0;
            width: 100%;
        }
    }

    .dropdown {
        position: relative;
        display: inline-block;

        & > .toggle {
            height: 100%;
            border: none;
            background: none;
            padding: 0;
            text-transform: initial;

            &:hover {
                background: none;
            }
        }

        &.plain {
            & > .toggle {
                .dropper {
                    display: none;
                }
                .label {
                    display: flex;
                    align-items: center;
                    user-select: none;
                }
            }

            &.link > .toggle {
                color: var(--control);
                text-decoration: underline;
            }
        }

        &:not(.plain) {
            & > .toggle {
                width: 100%;
                border: 1px solid var(--border);
                border-radius: 3px;
                background: var(--input-base);
                color: var(--base-text);
                padding: 3px;

                & > div {
                    padding: 2px 0;
                    display: grid;
                    grid-template-columns: 1fr auto;
                    // button is sending us for a ride and eating up 1 outer pixel for some reason
                    // compensate so that if simple dropper and token stuff is next to each other, they align
                    align-items: center;
                }

                &:disabled {
                    background: var(--input-disabled);
                    color: var(--input-disabled-text);
                    .dropper .icon {
                        color: var(--input-disabled-text);
                    }
                }

                &:hover:not(:disabled) {
                    background: var(--input-hover);
                }

                .label {
                    flex-grow: 1;
                    display: flex;
                    align-items: center;
                    padding: 4px 10px;
                    padding-right: 0;
                    text-align: left;
                    width: 100%;
                    @include mixins.ellipsize;
                    user-select: none;
                }

                .placeholder-text {
                    opacity: 0.35;
                }

                .dropper {
                    display: flex;
                    padding-right: 6px;
                    align-items: center;

                    .icon {
                        color: var(--base-text);
                    }
                }
            }

            .toggle:focus-visible {
                outline: none;
                box-shadow: none;

                & > div {
                    height: 100%;
                    outline: 1px dashed var(--outline);
                }
            }
        }

        &.right-edge {
            & > .menu {
                right: 0;
            }
        }
    }
</style>
