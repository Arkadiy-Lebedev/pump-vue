<script setup lang="ts">
import { watch } from "vue"
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'


import { useToastStore } from './stores/toastStore'
const useStore = useToastStore()

import { useToast } from "primevue/usetoast"
const toast = useToast()

const show = () => {
  toast.add({ severity: useStore.toastStoreData.type, summary: useStore.toastStoreData.title, detail: useStore.toastStoreData.text, life: 3000 })
}

watch(useStore.toastStore, (state) => {
  if (state.status) {
    console.log(state)
    console.log(useStore.toastStoreData)
    show()
    useStore.hideToast()
  }

})

</script>

<template>
   <Toast />
  <RouterView />
</template>

<style scoped>

</style>
