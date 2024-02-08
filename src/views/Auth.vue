<script setup lang="ts">
import { ref } from "vue"
import axios from 'axios'
import { API } from "../api/api"
import Logo from '../assets/image/logo2.png'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

interface IUser {  
  login: string,
  password: string
}

const user = ref<IUser>({
  login: "",
  password: ""
}) 

const isErrorText = ref(false)

const createUser = async () => {
  
  axios.post(`${API}api/user/create.php`, JSON.stringify(user.value))
    .then(resp => {
      console.log("Успех:", JSON.stringify(resp.data))
      console.log(resp.data)
      userStore.userInfo.id = resp.data.data.id
      userStore.userInfo.login = resp.data.data.name
      userStore.userInfo.role = resp.data.data.role

    })
    .finally(function () {    
    })
}

const loginUser = async () => {
  isErrorText.value = false;
  axios.post(`${API}api/user/login.php`, JSON.stringify(user.value))
    .then(resp => {
       console.log(resp.data.error)
      if (resp.data.error == 401) {
         isErrorText.value = true
      } else {          
         console.log("Успех:", JSON.stringify(resp.data))
          console.log(resp)
          userStore.userInfo.id = resp.data.id
          userStore.userInfo.login = resp.data.login
          localStorage.setItem('jwt', resp.data.jwt)
          router.push({ name: 'home' })
      }    
    })
    .catch(error => {     
      if (error.response.status) {
        isErrorText.value = true;
      }
    })
    .finally(function () {    
    })

}
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto" :src="Logo" alt="logo" />
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Введите данные для входа</h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" >
          <div class="input-group">
          <label class="input-group__label" for="username">Логин:</label>
          <InputText id="username" v-model="user.login" aria-describedby="username-help" />
          <!-- <small id="username-help">Enter your username to reset your password.</small> -->
        </div>

          <div>
            <div class="input-group">
            <label class="input-group__label" for="username">Пароль:</label>
            <InputText id="username" v-model="user.password" aria-describedby="username-help" />
            <!-- <small id="username-help">Enter your username to reset your password.</small> -->
          </div>
            
          </div>

          <div class="flex flex-col gap-3">
            <button type="button" @click="loginUser" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Войти</button>
          <InlineMessage v-if="isErrorText" severity="error">Неверный логин или пароль.</InlineMessage>
          </div>
        </form>
       
      </div>
    </div>
</template>


<style>
.input-group {
  @apply flex flex-col max-w-sm mb-5;
}

.input-group__label {
  @apply mb-1;
}
</style>
