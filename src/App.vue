<template>
  <div v-cloak>
    <Navbar />
    <RouterView v-slot="{ Component }">
      <Suspense>
        <component :is="Component" />
      </Suspense>
    </RouterView>
  </div>
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
