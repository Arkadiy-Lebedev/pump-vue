<script setup lang="ts">
import { onMounted, ref } from "vue"
import axios from 'axios'
import type { Ref } from 'vue'
import { API } from "../api/api"
import { read, utils } from "xlsx"
import type { IPump } from "../types/IPump"
import type { IType } from "../types/IType"
import { itemPumpForExel } from "../services/itemPumpForExel"
import { useToastStore } from '../stores/toastStore'
import { useRouter } from 'vue-router'
const useStore = useToastStore()

const router = useRouter()


const types: Ref<IType[]> = ref([
  {
    id: 0,
    image: "",
    type: "",
  },
])

const fileInput = ref(null)
const label = ref('Загрузить')

const loadTypes = async () => {
  axios.get(`${API}api/type/read.php`)
    .then((data) => (types.value = data.data.data))
}

onMounted(() => {
  loadTypes()
})



let pumpsData = []
let errorsArray = ref([])

const loadFile = (evt) => {
  console.log(evt)
label.value = evt.target.files[0].name
  pumpsData = []
  errorsArray.value = []

  var selectedFile = evt.target.files[0]
  var reader = new FileReader()
  reader.onload = function (event) {
    var data = event.target.result
    var workbook = read(data, {
      type: 'binary'
    })

    workbook.SheetNames.forEach(function (sheetName) {

      console.log(456456)

      var XL_row_object = utils.sheet_to_row_object_array(workbook.Sheets[sheetName])
      XL_row_object.splice(0, 2)
      console.log(XL_row_object)



      // проверка на ошибка   

      XL_row_object.forEach((el, i) => {

        let resp: any = itemPumpForExel(el, types, i)

        // console.log(resp)

        if (resp?.status) {
          errorsArray.value.push(resp)

        } else {
          pumpsData.push(resp)
        }


      })

      if (errorsArray.value.length) {
        fileInput.value.value = ''
        
        return
      } else {
        example(pumpsData)
      }

      console.log(errorsArray)
      console.log(pumpsData)

    })

  }
  reader.readAsBinaryString(selectedFile)      
 
}

const example = async (data) => {
  await Promise.all(data.map(item => {
    let formData = new FormData()
    for (let key in item) {
      // @ts-ignore
      if (Array.isArray(item[key])) {
        // @ts-ignore
        formData.append(key, JSON.stringify(item[key]))
      } else {
        // @ts-ignore
        formData.append(key, item[key])
      }
    }

    
    return axios.post(`${API}api/pump/create.php`, formData)

   }))

  useStore.showToast({ type: 'success', title: 'Успешно!', text: `Добавлено ${pumpsData.length} шт.` })
     router.push({ name: 'home' })
}

</script>

<template>
  <!-- <SubHeader title="Exel" /> -->
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <Card class=" mt-5">
      <template #content>
        <div class="download__wrapper mb-2">

          <div class="" id="download-file">
  <div>
              <p class="mb-3">Загрузите файл Excel:</p>
              <label for="file"><i class="pi pi-upload form__icons"></i> {{ label }}</label>
              <input hidden class="select" ref="fileInput" id="file" type="file" accept=".xls, .xlsx"
                @change="loadFile" />
            </div>

            <!-- <span class="">Загрузите файл Excel: </span>
            <input ref="fileInput" @change="loadFile" type="file" id="fileUploader" name="fileUploader"
              accept=".xls, .xlsx" /> -->
          </div>
        </div>

        <div class="mb-3 mt-5" v-for="(elem, index) of errorsArray" :key=elem.index>
          <InlineMessage severity="error">Строка {{ elem.index + 4 }},
            насос: {{ elem.pump.name }}. <div>Ошибка: {{ elem.message.join(", ") }}</div>
          </InlineMessage>
        </div>
      </template>
    </Card>

  </div>
</template>


<style></style>
