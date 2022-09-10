<template>
  <div v-cloak p="x-4 y-4" text="gray-700 dark:gray-200">
    <!-- <Navbar /> -->
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
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
