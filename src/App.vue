<template>
    <Navbar />
    <RouterView v-slot="{ Component }">
        <Suspense>
    <component :is="Component" />
        </Suspense>
    </RouterView>
</template>

<style>
html {
-webkit-tap-highlight-color: transparent;
	scroll-behavior: smooth;
}

img {
	-webkit-user-drag: none;
	@apply select-none;
}
</style>
