<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import SubHeader from "../components/SubHeader.vue"
import type { IPump, IPumpTd } from "../types/IPump"
import Item from "../components/Item.vue"
import { API } from "../api/api"
import axios from 'axios'
import { useConfirm } from "primevue/useconfirm"
import { useToastStore } from '../stores/toastStore'
import { FilterMatchMode } from 'primevue/api'
const useStore = useToastStore()

import { useRouter } from 'vue-router'

const router = useRouter()


const pumps = ref<IPump[] | []>([])
const loading = ref(false)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  representative: { value: null, matchMode: FilterMatchMode.IN },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  verified: { value: null, matchMode: FilterMatchMode.EQUALS }
})



const loadAllPump = async () => {
  pumps.value = []
  loading.value = true
  fetch(`${API}/api/pump/read.php`)
    .then((response) => response.json())
    .then((data) => {

      // if (!data.data) {
      //   return
      // }
      // @ts-ignore
        pumps.value.push(...data.data)
        loading.value = false
    })
    .catch((err) => {
      
      loading.value = false
      console.log(err)
    })
    .finally(() => {
      
       loading.value = false
    })

  fetch(`${API}/api/pump-td/read.php`)
    .then((response) => response.json())
    .then((data) => {

      // if (!data.data) {
      //   return
      // }
     // @ts-ignore
      pumps.value.push(...data.data)
      loading.value = false
    })
    .catch((err) => {

      loading.value = false
      console.log(err)
    })
    .finally(() => {

      loading.value = false
    })

    fetch(`${API}/api/pump-cdlf/read.php`)
    .then((response) => response.json())
    .then((data) => {

      // if (!data.data) {
      //   return
      // }
      // @ts-ignore     
      pumps.value.push(...data.data)
      loading.value = false
    })
    .catch((err) => {

      loading.value = false
      console.log(err)
    })
    .finally(() => {

      loading.value = false
    })

}

const pampForTable = computed(()=> {
  const newArray = pumps.value
  

for (let i = 0; i < newArray?.length; i++) {
        const obj = newArray[i]       
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {   
              // @ts-ignore      
            if (obj[key] == "" || obj[key] == null || obj[key] == "null" || obj[key] == " ") {    
               // @ts-ignore      
              obj[key] = "---"
            }
          }
        }
      }
// @ts-ignore 
  const nr =  newArray.map((item, index) => {
    return { ...item, rowNumber: index + 1 }
  })
  
  return nr
})


const linkForPamps = (name: string) => {
  if (name.indexOf("WQA") !== -1) {
    return 'pump'
  }
  if (name.indexOf("TD") !== -1) {
    return 'pump-td'
  }
  if (name.indexOf("CDLF") !== -1) {
    return 'pump-cdlf'
  }
  return null
}

const delPump = async (id: number, name: string) => {
const link = linkForPamps(name)
  if (link) {
    axios.post(`${API}api/${link}/delete.php`, { id: id })
    .then(resp => {
      if (resp.status == 200) {
        loadAllPump()
        visibleRight.value = false
      }
      console.log(resp)
    })
  } else {
    useStore.showToast({ type: 'warn', title: 'Ошибка!', text: `Не верный тип насоса...` })
  }
  
}

const copyPump = async (id: number, name: string) => {
  const link = linkForPamps(name)
  if (link) {
     axios.post(`${API}api/${link}/copy.php`, { id: id })
    .then(resp => {
      if (resp.status == 200) {
        loadAllPump()
        useStore.showToast({ type: 'success', title: 'Успешно!', text: `Выбранный насос скопирован.` })
    
      }
      console.log(resp)
    })
  } else {
    useStore.showToast({ type: 'warn', title: 'Ошибка!', text: `Не верный тип насоса...` })
  }
 
}

const confirm = useConfirm()

const confirm1 = (event: any, id: number, name:string) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Удалить насос?',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger p-button-sm',
    accept: () => {

      delPump(id, name)
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
  { field: 'nominal_q', header: 'Расход Q (м³/ч)' , warn: 2 },
  { field: 'nominal_h', header: 'Напор H (м.в.ст.)' , warn: 3 },
  { field: 'diameter', header: 'Диаметр выхода' , warn: 4 },
  { field: 'power', header: 'Мощность кВт' , warn: 5 },
  { field: 'speed', header: 'Скорость' , warn: 6 },
  { field: 'phase', header: 'Фаза' , warn: 7 },  
  { field: 'date_update', header: 'Дата' , warn: 8 },
  { field: 'frequency', header: 'Частота (Hz)' , warn: 9 },
  { field: 'voltage', header: 'Напряжение (V)' , warn: 10 },
  { field: 'launch', header: 'Запуск' , warn: 11 },
  { field: 'efficiency', header: 'КПД (%)' , warn: 12 },
  { field: 'pole', header: 'Количество полюсов' , warn: 13 },
  { field: 'note', header: 'Комментарий' , warn: 14 },
])
const selectedColumns = ref<IData[]>([
  { field: 'type', header: 'Тип', warn: 1 },
  { field: 'nominal_q', header: 'Расход Q (м³/ч)', warn: 2 },
  { field: 'nominal_h', header: 'Напор H (м.в.ст.)', warn: 3 },
  { field: 'diameter', header: 'Диаметр выхода', warn: 4 },
  { field: 'power', header: 'Мощность кВт', warn: 5 },
  { field: 'speed', header: 'Скорость', warn: 6 },
  { field: 'phase', header: 'Фаза', warn: 7 }, 
  { field: 'date_update', header: 'Дата', warn: 8 },
   { field: 'note', header: 'Комментарий', warn: 14 },
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


const seriesPump = (name: string) => {
 
  if (name.indexOf("WQA") !== -1) {
   
        return 'edit-pump'
  } 
    if (name.indexOf("TD") !== -1) {
        return 'edit-pump-td'
  }   
      if (name.indexOf("CDLF") !== -1) {
    return 'edit-pump-cdlf'
  }
  return null
}

const goToPumps = (names: string, id: number | undefined) => {
  const link = seriesPump(names)
  if (link) {
   router.push({ name: link, params: { id: id ? id : 0 } })
}
  else {
     useStore.showToast({ type: 'warn', title: 'Ошибка!', text: `Не верный тип насоса...` })

 }
 
}

</script>

<template>
  <SubHeader title="Насосы" />


  <div class="mx-auto max-w-full px-4 py-6 sm:px-4 lg:px-4">
    <DataTable paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} до {last}, из {totalRecords}"
    v-model:filters="filters" :globalFilterFields="['name', 'type']" showGridlines resizableColumns columnResizeMode="expand" :loading="loading" :value="pampForTable" stripedRows tableStyle="min-width: 50rem"   >

      <template #header>
         <div class="flex justify-content-end mb-3">
                  <span class="p-input-icon-left">
                      <i class="pi pi-search" />
                      <InputText v-model="filters['global'].value" placeholder="Поиск" />
                  </span>
              </div>
                    <div style="text-align:left" >
                        <MultiSelect  class="w-full " filter emptyFilterMessage="Не найдено" :modelValue="selectedColumns" :options="columns" optionLabel="header" @update:modelValue="onToggle"
                            display="chip" placeholder="Выберете столбец" />
                    </div>
                </template>
                 <Column header="№" style="width: 20px" :pt="{
                   root: { style: { textAlign: 'center' } },
                   headerTitle: { style: { textAlign: 'center', width: '100%' } }
                 }">
              <template #body="slotProps">
                
              {{ slotProps.data.rowNumber }}
            
              </template>
            </Column>
                <Column field="name" header="Название" style="width: 250px" :pt="{
                  root: { style: { textAlign: 'center' } },
                  headerTitle: { style: { textAlign: 'center', width: '100%' } }
                }">
          <template #body="{data}">
            <p class="cursor-pointer text-blue-700 underline hover:text-blue-900" @click="showPanel(data.id)"> {{
              data.name }}
            </p>
            <div class="flex justify-between gap-4 mt-2">
             
              <i class="pi pi-pencil del-trash hover:text-red-400 cursor-pointer text-xs" @click="goToPumps(data.name, data.id)"></i>
              <i class="pi pi-copy del-trash hover:text-red-400 cursor-pointer text-xs" @click="copyPump(data.id ? data.id : 0, data.name)"></i>
              <i class="pi pi-trash del-trash hover:text-red-400 cursor-pointer text-xs" @click="confirm1($event, data.id ? data.id : 0, data.name)"></i>
            
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
      <Button @click="goToPumps(itemPump?.name ? itemPump?.name : '', itemPump?.id ? itemPump?.id : 0)"
        icon="pi pi-pencil" label="Редактировать" size="small" />
    </div>
    <div class="mt-3">
      <Button @click="confirm1($event, itemPump?.id ? itemPump?.id : 0, itemPump?.name ? itemPump?.name : '')" icon="pi pi-times" label="Удалить"
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
