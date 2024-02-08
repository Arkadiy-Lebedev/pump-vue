<script setup lang="ts">
defineProps<{
  title: string,
  content:string
}>()

</script>

<template>
   <div class="mt-2 flex justify-between">
        <div>
          <h3 class="text-sm text-gray-700">
            <p>
              <span  />
              {{ title }}
            </p>
          </h3>

        </div>
        <p class="text-sm font-medium text-gray-900">{{ content }}</p>
      </div>
</template>

<style scoped>
</style>
