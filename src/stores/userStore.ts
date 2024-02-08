import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IUser } from "../types/IUser"

export const useUserStore = defineStore('userStore', () => {
  const userInfo = ref<IUser>({
    login: "",
    id: undefined,
    role: null
  })
  //  здесь вставить {}  в скобках



  return { userInfo }
})
