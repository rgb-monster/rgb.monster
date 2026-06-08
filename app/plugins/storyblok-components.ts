import {defineNuxtPlugin} from "#app";

function kebabCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, "-")
        .toLowerCase();
}

export default defineNuxtPlugin(async nuxtApp => {
    // Register all components in the storyblok folder, excluding private ones starting with an underscore
    let components = import.meta.glob<{default: any}>([
        "~/storyblok/*/*.vue",
        "!~/storyblok/**/_*",
    ]);

    for (let path in components) {
        // Extract path relative to "storyblok/"
        let match = path.match(/\/storyblok\/(.*)\.vue$/);
        if (!match) {
            continue;
        }

        let relativePath = match[1]; // e.g. "showpage/Banner" or "ShowPage"

        // Only register components that are in subfolders
        if (!relativePath || !relativePath.includes("/")) {
            continue;
        }

        let parts = relativePath.split("/");
        let folder = parts[0];
        let filename = parts[parts.length - 1];

        if (!folder || !filename) {
            continue;
        }

        // Format as "folder-component" (e.g. showpage-banner)
        let name = `${kebabCase(folder)}-${kebabCase(filename)}`;

        let componentLoader = components[path];
        if (!componentLoader) {
            continue;
        }

        let componentModule = await componentLoader();
        nuxtApp.vueApp.component(name, componentModule.default);
    }
});
