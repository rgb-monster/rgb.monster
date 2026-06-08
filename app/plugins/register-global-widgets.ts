export default defineNuxtPlugin(nuxtApp => {
    const widgets = import.meta.glob("../widgets/global/*.vue", {eager: true});

    Object.entries(widgets).forEach(([path, definition]) => {
        const componentName = path
            .split("/")
            .pop()
            ?.replace(/\.\w+$/, "");

        if (componentName) {
            const componentModule = (definition as any).default || definition;
            nuxtApp.vueApp.component(componentName, componentModule);
        }
    });
});
