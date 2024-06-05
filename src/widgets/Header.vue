<template>
    <header class="site">
        <a href="/whats-on">What's On</a>
        <a href="/kids">Kids</a>
        <a href="/card">Card</a>
        <a href="/fringe">Fringe</a>
    </header>
</template>

<style>
    header.site {
        display: flex;
        gap: 5px;

        background: var(--chrome);

        position: sticky;
        top: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        a {
            color: var(--chrome-text);
            padding: 10px;

            font-family: var(--rgb-font);
            text-decoration: none;
            font-weight: 400;
            font-size: 1.2em;
        }
    }
</style>
