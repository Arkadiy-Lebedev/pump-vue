<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from "vue";
import Logo from '../assets/image/logo.png';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()


const navigation = ref([
  { name: 'Главная', href: '/admin-select', current: true },
  { name: 'Насос +', href: '/add-pump', current: false },

])

navigation.value.forEach(el => {
  el.current = false
  if(el.href == route.fullPath){
    el.current = true
  }
})

const activeItem = (index: any) => {
  console.log(index)
  navigation.value.forEach((el, i) => {
    if (i == index) {      
el.current = true
    } else {
      el.current = false
    }
  })


}

const logOut = () => {
   localStorage.removeItem('jwt')
   router.push({ name: 'auth' })
}


</script>

<template>
  <header>
     <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
        <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div class="relative flex h-16 items-center justify-between">
            <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <!-- Mobile menu button-->
              <DisclosureButton class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span class="absolute -inset-0.5" />
                <span class="sr-only">Открыть меню</span>
                <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
                <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
              </DisclosureButton>
            </div>
            <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div class="flex flex-shrink-0 items-center cursor-pointer">
                <img @click="router.push({ name: 'home' })" class="w-32 hidden sm:block" :src="Logo" alt="Your Company" />
              </div>
              <div class="hidden sm:ml-6 sm:block">
                <div class="flex space-x-4">
                  <RouterLink  v-for="(item, i) in navigation" @click="activeItem(i)" :key="item.name" :to="item.href" :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</RouterLink>
                 
                </div>
             
              </div>
            </div>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <p class=" text-slate-300 tracking-wider text-sm">{{ userStore.userInfo.login }}</p>

              <!-- Profile dropdown -->
              <Menu as="div" class="relative ml-3">                
                <div>
                  <MenuButton class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span class="absolute -inset-1.5" />
                    <span class="sr-only">Открыть</span>
                    <img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  </MenuButton>
                </div>
                <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                  <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <MenuItem v-slot="{ active }" v-if="userStore.userInfo.role == 'admin'">
                      <p @click="router.push({ name: 'settings' })" class="cursor-pointer hover:text-blue-900" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Настройки</p>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <p @click="logOut" class="cursor-pointer hover:text-blue-900" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Выйти</p>
                    </MenuItem>
                     
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </div>
        </div>

        <DisclosurePanel class="sm:hidden">
          <div class="space-y-1 px-2 pb-3 pt-2">          
           <RouterLink  v-for="(item, i) in navigation" @click="activeItem(i)" :key="item.name" :to="item.href" :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</RouterLink></div>
        </DisclosurePanel>
      </Disclosure>
    
    </header>
</template>

<style scoped>
</style>
