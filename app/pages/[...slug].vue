<script setup>
    import {computed} from "vue";
    import showTypeTitlesStatic from "~/show-types-titles.json";
    import showTypeSlugsStatic from "~/show-types-generated.json";
    import showTypeMetadataStatic from "~/show-types-metadata.json";

    let slug = useRoute().params.slug;
    let slugStr = slug && slug.length > 0 ? slug.join("/") : "home";

    // Normalize slugStr by stripping leading and trailing slashes
    slugStr = slugStr.replace(/^\/+|\/+$/g, "");
    if (!slugStr) {
        slugStr = "home";
    }

    let config = useRuntimeConfig();

    // In development, use the live dynamic in-memory list. In production/SSG, use the static build-time file.
    let showTypeSlugs = import.meta.dev ? config.public.showTypeSlugs : showTypeSlugsStatic;
    let isShowTypePage = showTypeSlugs.includes(slugStr);

    let story = null;
    if (!isShowTypePage) {
        ({story} = await useAsyncStoryblok(slugStr, {
            api: {
                version: import.meta.dev ? "draft" : "published",
            },
        }));
    }

    // Set page title dynamically (completely synchronously on both server and client!)
    let pageTitle;
    if (isShowTypePage) {
        let title = showTypeTitlesStatic[slugStr];
        if (title) {
            pageTitle = title + " - RGB Monster";
        }
    } else if (story?.value && story.value.name && story.value.name.toLowerCase() != "home") {
        pageTitle = story.value.name + " - RGB Monster";
    } else {
        pageTitle = `RGB Monster - An Unusual Comedy Production`;
    }

    // Resolve description and sharing image for social cards dynamically
    let pageDescription =
        "RGB Monster is an unusual comedy production. Live comedy, interactive shows, and spectacular events.";
    let pageImage = "https://rgb.monster/new/monstervision.webp";
    let showTypeMetadata = import.meta.dev ? config.public.showTypeMetadata : showTypeMetadataStatic;

    if (isShowTypePage) {
        let meta = showTypeMetadata[slugStr] || {};
        if (meta.description) {
            pageDescription = meta.description;
        }
        if (meta.coverImage) {
            pageImage = meta.coverImage;
        }
    } else if (story?.value && story.value.content) {
        let content = story.value.content;
        let metaDesc = content.meta_description || content.description || content.summary;
        if (metaDesc) {
            pageDescription = metaDesc.replace(/<[^>]*>/g, "");
        }
        let metaImg = content.meta_image || content.image || content.og_image;
        if (metaImg) {
            pageImage = metaImg;
        }
    }

    let pageUrl = "https://rgb.monster/" + (slugStr == "home" ? "" : slugStr);

    useHead({
        title: pageTitle,
        meta: [
            {name: "description", content: pageDescription},
            {property: "og:title", content: pageTitle},
            {property: "og:description", content: pageDescription},
            {property: "og:image", content: pageImage},
            {property: "og:url", content: pageUrl},
            {property: "og:type", content: "website"},
            {name: "twitter:card", content: "summary_large_image"},
            {name: "twitter:title", content: pageTitle},
            {name: "twitter:description", content: pageDescription},
            {name: "twitter:image", content: pageImage},
        ],
        link: [{rel: "canonical", href: pageUrl}],
    });

    let mockBlok = {
        component: "ShowPage",
        body: [],
    };
</script>

<template>
    <component v-if="isShowTypePage" :is="'ShowPage'" :blok="mockBlok" />
    <StoryblokComponent v-else-if="story" :blok="story.content" />
</template>
