<script setup lang="ts">
const pages = ['mvfile']
const tabName = ref('mvfile')

const router = useRouter()
watchEffect(() => {
  router.push({ name: tabName.value })
})
</script>
<template>
  <n-tabs v-model:value="tabName" type="segment">
    <n-tab v-for="page in pages" :key="page" :name="page">
      {{ page }}
    </n-tab>
  </n-tabs>
</template>
