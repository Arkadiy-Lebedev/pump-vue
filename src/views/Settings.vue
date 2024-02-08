<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import SubHeader from "../components/SubHeader.vue"
import type { IUser } from "../types/IUser"
import { API } from "../api/api"
import axios from 'axios'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'

const router = useRouter()

const userStore = useUserStore()

const users = ref<IUser[]>([])
const user: IUser = reactive<IUser>({
  name: '',
  role: 'user',
  login: "",
  password: "",
})

const repeatPassword = ref<string>("")
const isError = ref(false)
const textError = ref('')

const loadUsers = async () => {
  axios.get(`${API}api/user/read.php`)
    .then((data) => (users.value = data.data.data))
}

onMounted(() => {
  loadUsers()
})


const roles = ref<any[]>([
  {
    role: "admin",
    value: "Администратор"
  },
  {
    role: "user",
    value: "Пользователь"
  }
])

const createUser = async () => {
isError.value = false

  if (user.password != repeatPassword.value || user.password == "" || repeatPassword.value == "" ) {
    isError.value = true
    textError.value = "Пароли не совпадают и не должны быть пустыми."
    return
  }

  if (user.name == "" || user.login == "" ) {
    isError.value = true
    textError.value = "Заполните все поля."
    return
  }


  axios.post(`${API}api/user/create.php`, JSON.stringify(user))
    .then(resp => {
      console.log("Успех:", JSON.stringify(resp.data))
      console.log(resp.data)
      loadUsers()

    })
    .finally(function () {
    })
}



const delUser = async (id: number) => {
  axios.post(`${API}api/user/delete.php`, { id: id })
    .then(resp => {
      if (resp.status == 200) {
        if (id == userStore.userInfo.id) {
          router.push({ name: 'auth' })
        }
        loadUsers()

      }
      console.log(resp)
    })
}


</script>

<template>
  <SubHeader title="Настройки" />
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <Card v-if="userStore.userInfo.role == 'admin'">
      <template #content>
        <p class="m-0 text-base font-bold">
          Пользователи:
        </p>
        <div>
          <DataTable :value="users">
            <Column field="name" header="Имя"></Column>
            <Column field="login" header="Логин"></Column>
            <Column field="role" header="Роль"></Column>
            <Column header="">
              <template #body="slotProps">
                <i class="pi pi-trash del-trash hover:text-red-400 cursor-pointer"
                  @click="delUser(slotProps.data.id)"></i>
              </template>
            </Column>
          </DataTable>
        </div>
   
        <div class="mt-8 mb-3">

           <Accordion >
          <AccordionTab header="Добавить пользователя">
            <div class="input-group">
              <label class="input-group__label">Имя</label>
              <InputText v-model="user.name" aria-describedby="username-help" />
            </div>
            <div class="input-group">
              <label class="input-group__label">Логин</label>
              <InputText v-model="user.login" aria-describedby="username-help" />
            </div>
            <div class="input-group">
              <label class="input-group__label">Пароль</label>
              <InputText v-model="user.password" aria-describedby="username-help" />
            </div>
            <div class="input-group">
              <label class="input-group__label">Повторный пароль</label>
              <InputText v-model="repeatPassword" aria-describedby="username-help" />
            </div>
            <div class="input-group">
              <label class="input-group__label">Роль</label>
              <Dropdown v-model="user.role" :options="roles" optionLabel="value" optionValue="role"
                placeholder="Тип насоса" />
            </div>
            <div class=" mb-5"> 
<InlineMessage v-if="isError" severity="error">{{ textError }}</InlineMessage>
            </div>
   
            <Button @click="createUser()" label="Добавить"></Button>

          </AccordionTab>

        </Accordion>
        </div>
       



      </template>
    </Card>




  </div>
</template>
