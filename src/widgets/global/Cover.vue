<script>
    export default {
        name: "Cover",
        props: {
            show: Object,
        },
    };
</script>

<template>
    <img class="cover" :src="show.cover" />
</template>
