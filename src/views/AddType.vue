<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from "vue"
import SubHeader from "../components/SubHeader.vue"
import EditType from "../components/EditType.vue"

import { API } from "../api/api"
import type { IType } from "../types/IType"

import { useToastStore } from '../stores/toastStore'
const useStore = useToastStore()

const isModal = ref(false)

const loadTypes = async () => {
  axios.get(`${API}api/type/read.php`)
    .then((data) => (types.value = data.data.data))
}

onMounted(() => {
  loadTypes()
})


const createType = async () => {
  disabledBtn.value = true
  let formData = new FormData()
  for (let key in typeItem.value) {
    formData.append(key, typeItem.value[key])
  }
  axios.post(`${API}api/type/create.php`, formData)
    .then(resp => {
      console.log("Успех:", JSON.stringify(resp.data))
      loadTypes()
      typeItem.value = {
        image: "",
        type: "",
        file: ""
      }
      filesForAvatar.value = ""
      useStore.showToast({ type: 'success', title: 'Добавлено', text: 'новый тип' })
    })
    .finally(function () {
      disabledBtn.value = false
    })

}

const type = ref<IType | null>()

const selectType = (id: number) => {
  type.value = types.value?.find((el) => el.id == id)
  isModal.value = true

}


const delType = async (id: number) => {
  axios.post(`${API}api/type/delete.php`, { id: id })
    .then(resp => {
      if (resp.status == 200) {
        loadTypes()

      }
      console.log(resp)
    })
}

const types = ref<IType[]>([
  {
    id: 0,
    image: "",
    type: "",
  },
])

const typeItem = ref<any>(
  {
    image: "",
    type: "",
    file: ""
  }
)


const disabledBtn = ref<boolean>(false)
const filesForAvatar = ref<any>(null)
const textBtnFile = ref('загрузить')
const isErrorTypeFile = ref<boolean>(false)

// const uploadImg = (e: any) => {
//   const arrType = ['jpg', 'jpeg']
//   if (e.target.result) { 
//   let file = e.target.files[0]

//   if (!arrType.includes(file.name.split('.').pop()) || file.size > 1024 * 1024 * 2) {
//     isErrorTypeFile.value = true
//     filesForAvatar.value = '' // вставить изображение заглушку
//   } else {
//     isErrorTypeFile.value = false
//     var reader = new FileReader()
//     reader.readAsDataURL(file)
//     let that = e
//     reader.onload = function (e) {
//       typeItem.value.file  = that.target.files[0]
//       filesForAvatar.value =
//         'data:image/png;base64,' + e?.target?.result.substring(e?.target?.result.indexOf(',') + 1)
//     }
//     textBtnFile.value = 'Изменить'
//   }
// }
// }

const uploadImg = (e: any) => {
  let file = e.target.files[0]
  if (

    file.size > 1024 * 1024 * 1
  ) {
    isErrorTypeFile.value = true

  } else {

    isErrorTypeFile.value = false
    var reader = new FileReader()
    reader.readAsDataURL(file)
    let that = e
    reader.onload = function (e) {
      typeItem.value.file = that.target.files[0]
      filesForAvatar.value =
        e?.target?.result
    }
    textBtnFile.value = "Изменить"
  }
}

const closeModal = (status: string) => {
    loadTypes()
  isModal.value = false 

}

</script>

<template>
  
  <SubHeader title="Типы насосов" />
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="tanle">
      <DataTable :value="types">
        <Column field="type" header="Тип"></Column>
        <Column header="">
          <template #body="slotProps">
            <img :src="`${slotProps.data.image}`" :alt="slotProps.data.image" class="w-24 drop-shadow-md rounded-lg" />
          </template>
        </Column>
        <Column header="">
          <template #body="slotProps">
            <div class="flex flex-col gap-5">
              <i class="pi pi-pencil del-trash hover:text-red-400 cursor-pointer " @click="selectType(slotProps.data.id)"></i>            
            <i class="pi pi-trash del-trash hover:text-red-400 cursor-pointer" @click="delType(slotProps.data.id)"></i>
            </div>
            
          </template>
        </Column>
      </DataTable>
    </div>


    <div class="wrapper mt-5">

      <Panel header="Добавить тип насоса:">

        <div class="input-group">
          <label class="input-group__label" for="type">Тип</label>
          <InputText id="type" v-model="typeItem.type" aria-describedby="username-help" />
        </div>

        <div class="filegroup">
          <div>
            <p class="mb-3">Изображение:</p>
            <label for="file"><i class="pi pi-upload form__icons"></i> {{ textBtnFile }}</label>
            <input hidden id="file" class="select" ref="imgInput" type="file" accept="image/jpeg,image/jpg"
              @change="uploadImg($event)" />
          </div>
          <div class="mt-3">
            <InlineMessage v-if="isErrorTypeFile" severity="error">Допустимый формат: только ".jpg, .jpeg". <br />
              Максимальный размер файла: 2мб</InlineMessage>
          </div>
        </div>
        <div class="mt-5">
          <Image v-if="filesForAvatar" :src="filesForAvatar" alt="Image" width="250" preview />
        </div>
        <Button :loading="disabledBtn" class="mt-5" @click="createType" label="Добавить" />
      </Panel>
    </div>   

  </div>
   <Dialog
        header="Редактировать:"
        v-model:visible="isModal"
        :breakpoints="{ '640px': '80vw' }"
        :style="{ width: '450px' }"
        :modal="true"
        dismissable-mask
      >

        <EditType :type="type ? type : { id: 0, image: '', type: '' }" @closeModal="closeModal"></EditType>
      </Dialog>
</template>


<style>
.input-group {
  @apply flex flex-col max-w-xs mb-5;
}

.input-group__label {
  @apply mb-1;
}
</style>
