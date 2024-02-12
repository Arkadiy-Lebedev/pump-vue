<script setup lang="ts">

const today = new Date() // Mon Nov 23 2020 15:23:46 GMT+0300 (Москва, стандартное время)
const year = today.getFullYear()

</script>

<template>
  <footer class="bg-gray-200">
    <div class="mx-auto max-w-7xl px-4  sm:px-6 lg:px-8 relative">
      <div class=" w-full pt-5 pb-5 flex justify-center lg:justify-between flex-wrap">
        <div class="text-gray-500"> &copy {{ year }} VOLGA</div>
        <div class=" flex flex-wrap justify-center lg:justify-between">
          <a class="text-center text-gray-500  hover:text-gray-800 border-solid border-r-[1px] border-gray-500 pl-5 pr-5"
            href="volga.su/personal_information" target="_blank">Обработка пероснальный данных</a>
          <a class="text-center text-gray-500  hover:text-gray-800 border-solid border-r-[1px] border-gray-500 pl-5 pr-5"
            href="volga.su/privacy_policy" target="_blank">Политика конфиденциальности</a>
            <a class="text-center text-gray-500  hover:text-gray-800  pl-5 pr-5"
            href="volga.su/terms_of_use" target="_blank">Пользовательское соглашение</a>
        </div>
      </div>

    </div>

  </footer>
</template>

<style scoped></style>
