<script>
    export default {
        name: "Icon",
        props: {
            name: String,
        },
    };
</script>

<template>
    <span class="icon material-icons">{{ name }}</span>
</template>

<style lang="scss">
    .icon {
    }
</style>
