<script setup lang="ts">
import { ref, reactive } from 'vue'
import axios from 'axios'
import { API } from "../api/api"
import { useToastStore } from '../stores/toastStore'
import type { IContact } from "../types/IContact"
import { vMaska } from "maska"


const useStore = useToastStore()

interface Props {
  pumpname: {
    name: string
  }
}
const props = defineProps<Props>()
const loading = ref<boolean>(false)
const error = ref<boolean>(false)
const errorText = ref('')

const emit = defineEmits<{
  (e: 'closeModal', status: string): void

}>()

console.log(props)

const contact: IContact = reactive<IContact>({
  inn: '',
  name: '',
  phone: '',
  mail: '',
  pump_name: props.pumpname.name
})


function validate(value: string) {
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/

  if (reg.test(value) == false) {
    errorText.value = 'Не корректный email'
    error.value = true
    return false
  } else {
    return true
  }
}

const submitForm = () => {
  error.value = false

  if (!contact.inn || contact.inn == "" || contact.phone == "" || contact.mail == '' || contact.name == '' || !contact.phone) {
    error.value = true
    errorText.value = 'Заполните все обязательные поля'
    return
  }


  if (!validate(contact.mail)) {
    return
  }


  loading.value = true

  let formData = new FormData()
  for (let key in contact) {
    // @ts-ignore
    formData.append(key, contact[key])
  }

  axios.post(`${API}api/vendor/mail.php`, formData)
    .then(response => {

      if (response.data.status) {

        useStore.showToast({ type: 'success', title: 'Спасибо!', text: `Сообщение отправлено` })
      } else {
        useStore.showToast({ type: 'warn', title: 'Ошибка!', text: `Попробуйте позднее ...` })
      }
      emit('closeModal', 'success')
      loading.value = false


    }).catch(() => {
      emit('closeModal', 'success')

      useStore.showToast({ type: 'warn', title: 'Ошибка!', text: `Попробуйте позднее ...` })
      // useStore.showToast({ type: 'error', title: 'Ошибка!', text: `Попробуйте позднее...` })
    })
    .finally(() => {
      loading.value = false
      emit('closeModal', 'success')
    })
}





</script>

<template>
  <div class=" p-5">

    <form @submit.prevent="submitForm">
      <p class=" text-lg text-center font-bold">ЗАПРОС СЧЕТА НА:</p>
      <p class=" text-lg text-center font-bold">{{ contact.pump_name }}</p>
      <p class=" mt-3 mb-2 text-base">Укажите Ваши данные:</p>
      <div class="">


      </div>
      <div class="input-group">
        <label class="input-group__label">ИНН *</label>
        <InputMask v-model="contact.inn" mask="9999999999" placeholder="" />
      </div>
      <div class="input-group">
        <label class="input-group__label">ФИО *</label>        
        <Textarea v-model="contact.name" autoResize rows="2" cols="30" />
      </div>
      <div class="input-group">
        <label class="input-group__label">Контактный телефон *</label>
        <input class="p-inputtext p-component" v-maska data-maska="+7-###-###-##-##" placeholder="+7-999-999-99-99" v-model="contact.phone">
      </div>     
      <div class="input-group">
        <label class="input-group__label">Электронная почта *</label>        
        <Textarea v-model="contact.mail" autoResize rows="2" cols="30" />
      </div>
      <p>* - обязательно к заполнению</p>

      <div class="mt-5 flex gap-5">
        <Button type="submit" label="Отправить" :loading="loading" class="p-button-raised" />
        <Button type="button" @click=" emit('closeModal', 'success')" severity="secondary" label="Отмена"
          class="p-button-raised" />
      </div>
      <InlineMessage class="mt-5" v-if="error" severity="error"> {{ errorText }}
      </InlineMessage>
    </form>
  </div>
</template>

<style>
.input-group {
  @apply flex flex-col max-w-xs mb-5;
}

.input-group__label {
  @apply mb-1;
}
</style>




