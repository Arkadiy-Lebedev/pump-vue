<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import SubHeader from "../components/SubHeader.vue"
import type { IPump } from "../types/IPump"
import Item from "../components/Item.vue"
import { API } from "../api/api"
import axios from 'axios'
import { useConfirm } from "primevue/useconfirm"
import { useToastStore } from '../stores/toastStore'
const useStore = useToastStore()

import { useRouter } from 'vue-router'

const router = useRouter()


const pumps = ref<IPump[]>([])
const loading = ref(false)


const loadAllPump = async () => {
  loading.value = true
  fetch(`${API}/api/pump/read.php`)
    .then((response) => response.json())
    .then((data) => {
        pumps.value = data.data
        loading.value = false
    })
}

const pampForTable = computed((): IPump[] => {
  const newArray = [...pumps.value]

for (let i = 0; i < newArray.length; i++) {
        const obj = newArray[i]       
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {   
              // @ts-ignore      
            if (obj[key] == "" | obj[key] == null | obj[key] == "null") {    
               // @ts-ignore      
              obj[key] = "---"
            }
          }
        }
      }

  
  return newArray
})




const delPump = async (id: number) => {
  axios.post(`${API}api/pump/delete.php`, { id: id })
    .then(resp => {
      if (resp.status == 200) {
        loadAllPump()
        visibleRight.value = false
      }
      console.log(resp)
    })
}

const copyPump = async (id: number) => {
  axios.post(`${API}api/pump/copy.php`, { id: id })
    .then(resp => {
      if (resp.status == 200) {
        loadAllPump()
        useStore.showToast({ type: 'success', title: 'Успешно!', text: `Выбранный насос скопирован.` })
    
      }
      console.log(resp)
    })
}

const confirm = useConfirm()

const confirm1 = (event: any, id: number) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Удалить насос?',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger p-button-sm',
    accept: () => {

      delPump(id)
    },
    reject: () => {

    },
    acceptLabel: 'Да',
    rejectLabel: 'Нет'
  })
}

onMounted(() => {
  loadAllPump()
})

const visibleRight = ref(false)

const itemPump = ref<IPump>()

const showPanel = (id: number) => {
  visibleRight.value = true
  itemPump.value = pumps.value.find(el => el.id == id)

}


interface IData {
  field: string,
  header: string,
  warn: number
}

const columns = ref<IData[]>([
  { field: 'type', header: 'Тип', warn: 1 },
  { field: 'nominal_q', header: 'Расход (Q)' , warn: 2 },
  { field: 'nominal_h', header: 'Напор (H)' , warn: 3 },
  { field: 'diameter', header: 'Диаметр выхода' , warn: 4 },
  { field: 'power', header: 'Мощность кВт' , warn: 5 },
  { field: 'speed', header: 'Скорость' , warn: 6 },
  { field: 'phase', header: 'Фаза' , warn: 7 },
  { field: 'note', header: 'Комментарий' , warn: 8 },
  { field: 'date_update', header: 'Дата' , warn: 9 },
  { field: 'frequency', header: 'Частота (Hz)' , warn: 10 },
  { field: 'voltage', header: 'Напряжение (V)' , warn: 11 },
  { field: 'launch', header: 'Запуск' , warn: 12 },
  { field: 'efficiency', header: 'КПД (%)' , warn: 13 },
  { field: 'pole', header: 'Количество полюсов' , warn: 13 },
])
const selectedColumns = ref<IData[]>([
  { field: 'type', header: 'Тип', warn: 1 },
  { field: 'nominal_q', header: 'Расход (Q)', warn: 2 },
  { field: 'nominal_h', header: 'Напор (H)', warn: 3 },
  { field: 'diameter', header: 'Диаметр выхода', warn: 4 },
  { field: 'power', header: 'Мощность кВт', warn: 5 },
  { field: 'speed', header: 'Скорость', warn: 6 },
  { field: 'phase', header: 'Фаза', warn: 7 },
  { field: 'note', header: 'Комментарий', warn: 8 },
  { field: 'date_update', header: 'Дата', warn: 9 },
])



 
const onToggle = (val: IData[]) => {
  const selectedFieldNames = selectedColumns.value.map(col => col.field)

  columns.value.forEach(column => {
    if (!selectedFieldNames.includes(column.field) && val.some(selectedCol => selectedCol.field === column.field)) {
      selectedColumns.value.push(column)
    }
  })

  
  selectedColumns.value = selectedColumns.value.filter(col => val.includes(col))
  selectedColumns.value = selectedColumns.value.sort((a, b) => a.warn - b.warn)
}




</script>

<template>
  <SubHeader title="Насосы" />


  <div class="mx-auto max-w-full px-4 py-6 sm:px-4 lg:px-4">
    <DataTable showGridlines resizableColumns columnResizeMode="expand" :loading="loading" :value="pampForTable" stripedRows tableStyle="min-width: 50rem"   >

      <template #header>
                    <div style="text-align:left" >
                        <MultiSelect  class="w-full " filter emptyFilterMessage="Не найдено" :modelValue="selectedColumns" :options="columns" optionLabel="header" @update:modelValue="onToggle"
                            display="chip" placeholder="Выберете столбец" />
                    </div>
                </template>
                <Column field="name" header="Название" style="width: 250px" :pt="{
                  root: { style: { textAlign: 'center' } },
                  headerTitle: { style: { textAlign: 'center', width: '100%' } }
                }">
          <template #body="slotProps">
            <p class="cursor-pointer text-blue-700 underline hover:text-blue-900" @click="showPanel(slotProps.data.id)"> {{
              slotProps.data.name }}
            </p>
            <div class="flex justify-between gap-4 mt-2">
              <i class="pi pi-pencil del-trash hover:text-red-400 cursor-pointer text-xs" @click="router.push({ name: 'edit-pump', params: { id: slotProps.data.id ? slotProps.data.id : 0 } })"></i>
              <i class="pi pi-copy del-trash hover:text-red-400 cursor-pointer text-xs" @click="copyPump(slotProps.data.id ? slotProps.data.id : 0)"></i>
              <i class="pi pi-trash del-trash hover:text-red-400 cursor-pointer text-xs" @click="confirm1($event, slotProps.data.id ? slotProps.data.id : 0)"></i>
            
              <ConfirmPopup></ConfirmPopup>
            </div>
          </template>
        </Column>
                 <Column sortable v-for="(col, index) of selectedColumns" :field="col.field" :header="col.header" :key="col.field + '_' + index" :pt="{
                   root: { style: { textAlign: 'center' } },
                   headerTitle: { style: { textAlign: 'center', width: '100%' } }
                 }">                
                
                </Column>
      <!-- <Column field="name" header="Название" style="width: 250px" :pt="{
        root: { style: { textAlign: 'center' } },
        headerTitle: { style: { textAlign: 'center', width: '100%' } }
      }">
        <template #body="slotProps">
          <p class="cursor-pointer text-blue-700 underline hover:text-blue-900" @click="showPanel(slotProps.data.id)"> {{
            slotProps.data.name }}
          </p>
          <div class="flex justify-between gap-4 mt-2">
            <i class="pi pi-pencil del-trash hover:text-red-400 cursor-pointer text-xs" @click="router.push({ name: 'edit-pump', params: { id: slotProps.data.id ? slotProps.data.id : 0 } })"></i>
            <i class="pi pi-copy del-trash hover:text-red-400 cursor-pointer text-xs" @click="copyPump(slotProps.data.id ? slotProps.data.id : 0)"></i>
            <i class="pi pi-trash del-trash hover:text-red-400 cursor-pointer text-xs" @click="confirm1($event, slotProps.data.id ? slotProps.data.id : 0)"></i>
            
            <ConfirmPopup></ConfirmPopup>
          </div>
        </template>
      </Column>
      <Column sortable field="type" header="Тип" style="width: 100px" :pt="{
        root: { style: { textAlign: 'center' } },
        headerTitle: { style: { textAlign: 'center', width: '100%' } }
      }">
        <template #body="slotProps">
          <p>{{ slotProps.data.type }}</p>
        </template>
      </Column>


      <Column sortable field="nominal_q" header="Расход (Q)" :pt="{
        root: { style: { textAlign: 'center' } },
        headerTitle: { style: { textAlign: 'center', width: '100%' } }
      }"></Column>
 <Column sortable field="nominal_h" header="Напор (H)" :pt="{
        root: { style: { textAlign: 'center' } },
        headerTitle: { style: { textAlign: 'center', width: '100%' } }
      }"></Column>
 <Column sortable field="diameter" header="Диаметр выхода" :pt="{
        root: { style: { textAlign: 'center' } },
        headerTitle: { style: { textAlign: 'center', width: '100%' } }
      }"></Column>
      <Column sortable field="power" header="Мощность кВт" :pt="{
        root: { style: { textAlign: 'center' } },
        headerTitle: { style: { textAlign: 'center', width: '100%' } }
      }"></Column>
      <Column sortable field="speed" header="Скорость" :pt="{
        root: { style: { textAlign: 'center' } },
        headerTitle: { style: { textAlign: 'center', width: '100%' } }
      }"></Column>
     
      <Column sortable field="phase" header="Фаза" :pt="{
        root: { style: { textAlign: 'center' } },
        headerTitle: { style: { textAlign: 'center', width: '100%' } }
      }"></Column>  
      <Column field="note" header="Комментарий" :pt="{
        root: { style: { textAlign: 'center' } },
        headerTitle: { style: { textAlign: 'center', width: '100%' } }
      }"></Column>  

<Column sortable field="date_update" header="Дата" :pt="{
  root: { style: { textAlign: 'center' } },
  headerTitle: { style: { textAlign: 'center', width: '100%' } }
}"></Column> -->
  
    </DataTable>
  </div>
  <Sidebar v-model:visible="visibleRight" header="Описание" position="right">
    <Item title="Название" :content="itemPump?.name ? itemPump?.name : ''" />
    <Item title="Тип" :content="itemPump?.type ? String(itemPump?.type) : ''" />
    <Item title="Серия" :content="itemPump?.series ? itemPump.series : ''" />
    <Item title="Диаметр" :content="itemPump?.diameter ? String(itemPump?.diameter) : ''" />
    <Item title="КПД" :content="itemPump?.efficiency ? String(itemPump?.efficiency) : ''" />
    <Item title="Мощность" :content="itemPump?.power ? String(itemPump?.power) : ''" />
    <Item title="Скорость" :content="itemPump?.speed ? String(itemPump?.speed) : ''" />
    <Item title="Частота" :content="itemPump?.frequency ? String(itemPump?.frequency) : ''" />
    <Item title="Фаза" :content="itemPump?.phase ? String(itemPump?.phase) : ''" />
    <Item title="Напряжение" :content="itemPump?.voltage ? String(itemPump?.voltage) : ''" />
    <Item title="Запуск" :content="itemPump?.launch ? itemPump?.launch : ''" />
    <Item title="Уплотнение" :content="itemPump?.seal ? itemPump?.seal : ''" />
    <Item title="Вал" :content="itemPump?.shaft ? itemPump?.shaft : ''" />
    <Item title="Насос" :content="itemPump?.pump ? itemPump?.pump : ''" />
    <Item title="Погрешность" :content="itemPump?.error ? String(itemPump?.error) : ''" />

    <div class="mt-6">
      <Button @click="router.push({ name: 'edit-pump', params: { id: itemPump?.id ? itemPump?.id : 0 } })"
        icon="pi pi-pencil" label="Редактировать" size="small" />
    </div>
    <div class="mt-3">
      <Button @click="confirm1($event, itemPump?.id ? itemPump?.id : 0)" icon="pi pi-times" label="Удалить"
        severity="danger" size="small"></Button>
      <ConfirmPopup></ConfirmPopup>
    </div>

  </Sidebar>
</template>

<style scope>
.p-datatable-resizable-table > .p-datatable-thead > tr > th, .p-datatable-resizable-table > .p-datatable-tfoot > tr > td, .p-datatable-resizable-table > .p-datatable-tbody > tr > td {
 
    white-space: wrap;
}
</style>
