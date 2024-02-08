import { ref, reactive} from 'vue'
import { defineStore } from 'pinia'

interface IToast {
  type: "success" | "info" | "warn" | "error" | undefined,
    title: string,
    text: string
}

interface IStatusToast {
  status: boolean
}

export const useToastStore = defineStore('toastStore', () => {
  const toastStore: IStatusToast = reactive<IStatusToast>({
    status: false
  })
  const toastStoreData: IToast = reactive<IToast>({
    type: undefined,
    title: "",
    text: ""
  })


  const showToast = (data: IToast) => {
    console.log(data)
    toastStore.status = true
    toastStoreData.type = data.type
    toastStoreData.title = data.title
    toastStoreData.text = data.text
    
  }

  const hideToast = () => {
  console.log(879845646)
   toastStore.status = false
  }


  return { toastStore, toastStoreData, showToast, hideToast }
})
