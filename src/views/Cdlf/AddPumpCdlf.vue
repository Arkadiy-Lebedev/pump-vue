<script setup lang="ts">
import axios from 'axios'
import { watch, onMounted, reactive, ref } from "vue"
import type { Ref } from 'vue'
import SubHeader from "@/components/SubHeader.vue"
import InputGroup from 'primevue/inputgroup'

import OrderList from "primevue/orderlist"
import { BubbleChart, useBubbleChart } from "vue-chart-3"
import { useRouter } from 'vue-router'
import { API } from "@/api/api"
import type { IPumpCdlf } from "@/types/IPump"
import type { IType } from "@/types/IType"

import { useToastStore } from '@/stores/toastStore'
const useStore = useToastStore()

const router = useRouter()

const copyPump = ref<boolean>(false)
const isAutoName = ref<boolean>(true)
const isFormulaSucces = ref<boolean>(false)

const loadTypes = async () => {
  axios.get(`${API}api/type/read.php`)
    .then((data) => (types.value = data.data.data))
}

onMounted(() => {
  loadTypes()
})

const createPump = async () => {
  errorMessage.value = false
  if (pump.formuls == "" || pump.name == "" || pump.type == "" || pump.finish == null || pump.start == null) {
    errorMessage.value = true
    return
  }

  if (!isFormulaSucces.value) {
    useStore.showToast({ type: 'warn', title: 'Внимание', text: `Для добавления насоса, постройте график` })
    return
  }


  disabledBtn.value = true

  let formData = new FormData()
  for (let key in pump) {
    // @ts-ignore
    if (Array.isArray(pump[key])) {
      // @ts-ignore
      formData.append(key, JSON.stringify(pump[key]))
    } else {
      // @ts-ignore
      formData.append(key, pump[key])
    }
  }

  // JSON.stringify(pump)
  axios.post(`${API}api/pump-cdlf/create.php`, formData)
    .then(resp => {
      console.log("Успех:", JSON.stringify(resp.data))
      useStore.showToast({ type: 'success', title: 'Успешно!', text: `Насос ${pump.name} добавлен.` })
      if (!copyPump.value) {
        router.push({ name: 'home' })
      }


    })
    .finally(function () {
      disabledBtn.value = false
    })

}

const disabledBtn = ref<boolean>(false)
const types: Ref<IType[]> = ref([
  {
    id: 0,
    image: "",
    type: "",
  },
])

const pump: IPumpCdlf = reactive<IPumpCdlf>({
  id: 0,
  coordinates: [],
  name: "",
  type: "",

  b1: null,
  b2: null,
  b12: null,
  d1: null,
  d2: null,
  weight: null,
  power: null,
  engineMount: '',
  diffuser: '',
  innerBody: '',
  housingSupport: '',
  coupling: '',
  wheel: '',
  outerCasing: '',
  shaft: '',
  pipe: '',
  lid: '',
  base: '',
  note: '',
  error: 1,
  minx: 0,
  maxx: 50,
  miny: 0,
  maxy: 50,
  formuls: '',
  start: null,
  finish: null,
  step: 0.2,
  step_x: null,
  step_y: null,
 
})




const options = reactive({
  aspectRatio: 1,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'H(m) (Y)',
      },
      min: 0,
      max: 50,

    },
    x: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Q(м³/h) (X)',
      },
      min: 0,
      max: 50,

    },
  },
  plugins: {
    tooltip: {
      caretPadding: 10,
      callbacks: {
        label: function (context: any) {
          let label = `Q=${context.parsed.x} м³/ч, H=${context.parsed.y} м.в.ст.`
          return label
        }
      }
    }
  }
})

const chartData = reactive({

  datasets: [
    {
      type: "bubble",
      data: pump.coordinates,
      cubicInterpolationMode: "monotone",
      label: "Кривая работы насоса",
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      pointBackgroundColor: 'rgb(75, 192, 192)',
      pointRadius: 2,
      spanGaps: true,
    }
  ],
})



const coordinates = ref<any[]>([])


const createChart = () => {
  coordinates.value = []

  if (pump.start && pump.finish) {
    for (let i = +pump.start; i < +pump.finish; i = i + +pump.step) {

      try {
        let y = eval(pump.formuls.replace(/x/g, i.toString()))
        console.log(y)
        coordinates.value.push({
          x: +i.toFixed(2),
          y: +y.toFixed(2),
        })

      } catch (err) {

        console.log(err)
        isFormulaSucces.value = false
        useStore.showToast({ type: 'error', title: 'Ошибка!', text: `Проверьте правильность формулы` })
        return

      }
      isFormulaSucces.value = true

    }
    if (coordinates.value[coordinates.value.length - 1] != pump.finish) {
      let y = eval(pump.formuls.replace(/x/g, pump.finish.toString()))
      coordinates.value.push({
        x: +pump.finish,
        y: +y.toFixed(2),
      })
    }



  }
  console.log(coordinates.value)

  const options2 = {

    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'H(m) (Y)',
      },
      min: pump.miny,
      max: pump.maxy,
      ticks: {
        stepSize: pump.step_y
      }
    },
    x: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Q(м³/h) (X)',
      },
      min: pump.minx,
      max: pump.maxx,
      ticks: {
        stepSize: pump.step_x
      }
    },

  }




  const chartData2 = coordinates.value


  chartData.datasets[0].data = chartData2
  options.scales = options2

  // options.plugins = plugins
}




const errorMessage = ref(false)

const { bubbleChartProps } = useBubbleChart({
  // @ts-ignore
  chartData,
  options,
})


</script>

<template>
  <SubHeader title="Новый насос CDLF" />
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

    <Button class=" ms-5" @click="router.push({ name: 'add-cdlf-exel' })" icon="pi pi-database" label="Из файла"
      severity="secondary" />
    <div class="wrapper mt-5">
      <Card>
        <template #content>
          <p class='font-bold text-xl text-slate-800 mb-3'>Основное:</p>
          <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 ">
            <div class="input-group">
              <label class="input-group__label" for="username">Модель насоса *</label>
              <InputGroup>
                <InputText id="username" v-model="pump.name" aria-describedby="username-help"
                  :class="{ 'p-invalid': errorMessage }" />
              </InputGroup>

            </div>
            <div class="input-group">
              <label class="input-group__label">Тип *</label>
              <Dropdown v-model="pump.type" :options="types" optionLabel="type" optionValue="id" placeholder="Тип насоса"
                :class="{ 'p-invalid': errorMessage }" />
            </div>



            <div class="input-group">
              <label class="input-group__label">Питание двигателя (кВт)</label>
              <InputNumber v-model="pump.power" :minFractionDigits="1" inputId="withoutgrouping" />
            </div>

            <div class="input-group">
              <label class="input-group__label">Вес</label>
              <InputNumber v-model="pump.weight" aria-describedby="username-help" />
            </div>




            <div class="input-group">
              <label class="input-group__label">Примечание</label>

              <Textarea v-model="pump.note" autoResize rows="3" cols="30" />
            </div>


          </div>
        </template>
      </Card>
    </div>

    <Card class=" mt-5">
      <template #content>
        <p class=" font-bold text-xl text-slate-800 mb-3">Материалы:</p>
        <div class="sm:flex ">
          <div class="flex flex-col">
            <p class="  text-xl text-slate-800 mb-3">Стандарт</p>
            <div class="flex flex-wrap gap-5">
              <div class="input-group ">
                <label class="input-group__label">Опора двигателя:</label>
                <InputText v-model="pump.engineMount" aria-describedby="username-help" />
              </div>
              <div class="input-group">
                <label class="input-group__label">Диффузор:</label>
                <InputText v-model="pump.diffuser" aria-describedby="username-help" />
              </div>

              <div class="input-group">
                <label class="input-group__label">Внутренний корпус:</label>
                <InputText v-model="pump.innerBody" aria-describedby="username-help" />
              </div>
              <div class="input-group">
                <label class="input-group__label">Опора корпуса:</label>
                <InputText v-model="pump.housingSupport" aria-describedby="username-help" />
              </div>


              <div class="input-group">
                <label class="input-group__label">Муфта:</label>
                <InputText v-model="pump.coupling" aria-describedby="username-help" />
              </div>
              <div class="input-group">
                <label class="input-group__label">Рабочее колесо:</label>
                <InputText v-model="pump.wheel" aria-describedby="username-help" />
              </div>
              <div class="input-group">
                <label class="input-group__label">Внешний корпус:</label>
                <InputText v-model="pump.outerCasing" aria-describedby="username-help" />
              </div>

              <div class="input-group">
                <label class="input-group__label">Вал насоса:</label>
                <InputText v-model="pump.shaft" aria-describedby="username-help" />
              </div>
              <div class="input-group">
                <label class="input-group__label">Патрубок насоса:</label>
                <InputText v-model="pump.pipe" aria-describedby="username-help" />
              </div>
              <div class="input-group">
                <label class="input-group__label">Крышка насоса:</label>
                <InputText v-model="pump.lid" aria-describedby="username-help" />
              </div>
              <div class="input-group">
                <label class="input-group__label">Основание насоса:</label>
                <InputText v-model="pump.base" aria-describedby="username-help" />
              </div>





            </div>


          </div>

          <div class="flex flex-col">

          </div>
        </div>
      </template>
    </Card>

    <Card class=" mt-5">
      <template #content>
        <div class="flex flex-col mb-7">
          <p class='font-bold text-xl text-slate-800 mb-3'>Габариты размеры автоматической трубной муфты и насосного
            агрегата:
          </p>


          <div class="flex gap-x-5 gap-y-1 wrapper-content flex-wrap">
            <div class="input-group">
              <label class="input-group__label">B1</label>
              <InputNumber v-model="pump.b1" :minFractionDigits="1" inputId="withoutgrouping" />
            </div>
            <div class="input-group">
              <label class="input-group__label">B2</label>
              <InputNumber v-model="pump.b2" :minFractionDigits="1" inputId="withoutgrouping" />
            </div>
            <div class="input-group">
              <label class="input-group__label">B1+B2</label>
              <InputNumber v-model="pump.b12" aria-describedby="username-help" />
            </div>

            <div class="input-group">
              <label class="input-group__label">D1</label>
              <InputNumber v-model="pump.d1" :minFractionDigits="1" inputId="withoutgrouping" />
            </div>
            <div class="input-group">
              <label class="input-group__label">D2</label>
              <InputNumber v-model="pump.d2" :minFractionDigits="1" inputId="withoutgrouping" />
            </div>
            
          </div>
        </div>



      </template>
    </Card>

    <Fieldset legend="График кривой" class="mt-5">
      <div class="flex flex-col mb-5 max-w-3xl">
        <label class="input-group__label ">Формула *</label>
        <Textarea v-model="pump.formuls" autoResize rows="3" cols="30" :class="{ 'p-invalid': errorMessage }" />
        <p class="mt-2 text-xs text-gray-500">Примечание: знак возведение в степень ** (вместо ^)</p>
        <p class="text-xs text-gray-500">Пример: -0.0067 * (x**2) - 0.19 * x + 9.41</p>

      </div>
      <div class="sm:flex gap-5  mt-10 ">
        <div class="input-group">
          <label class="input-group__label">Начальная точка *</label>
          <InputNumber v-model="pump.start" :minFractionDigits="2" inputId="withoutgrouping"
            :class="{ 'p-invalid': errorMessage }" />
        </div>
        <div class="input-group">
          <label class="input-group__label">Конечная точка *</label>
          <InputNumber v-model="pump.finish" :minFractionDigits="2" inputId="withoutgrouping"
            :class="{ 'p-invalid': errorMessage }" />
        </div>
        <div class="input-group">
          <label class="input-group__label">Шаг кривой</label>
          <InputNumber v-model="pump.step" :minFractionDigits="2" inputId="withoutgrouping" />
        </div>
      </div>
      <div class="sm:flex gap-5  mt-5">

        <div class="input-group ">
          <label class="input-group__label flex items-center gap-2 cursor-pointer">Допустимая погрешность <i
              class="pi pi-info-circle" v-tooltip="{
                value: 'Погрешность при подборе насоса по оси Q (м³/ч) и H, желательно ставить минимум 1 пункт',
                pt: {
                  arrow: {
                    style: {
                      borderRightColor: 'var(--primary-color)'
                    }
                  },
                  text: 'bg-primary font-medium text-xs'
                }
              }
                "></i></label>
          <InputNumber v-model="pump.error" placeholder="количество пунктов" :minFractionDigits="1"
            inputId="withoutgrouping" />

        </div>
      </div>


      <div class="sm:flex gap-5  mt-5">
        <div class="input-group">
          <label class="input-group__label">Шкала Q (м³/ч) (X), минимум</label>
          <InputNumber v-model="pump.minx" inputId="withoutgrouping" />
        </div>
        <div class="input-group">
          <label class="input-group__label">Шкала Q (м³/ч) (X), максимум</label>
          <InputNumber v-model="pump.maxx" inputId="withoutgrouping" />
        </div>
        <div class="input-group">
          <label class="input-group__label">Шаг шкалы Q (м³/ч) (X)</label>
          <InputNumber v-model="pump.step_x" inputId="withoutgrouping" />
        </div>
      </div>
      <div class="sm:flex gap-5  mt-5 mb-2">
        <div class="input-group">
          <label class="input-group__label">Шкала H (м.в.ст.) (Y), минимум</label>
          <InputNumber v-model="pump.miny" inputId="withoutgrouping" />
        </div>
        <div class="input-group">
          <label class="input-group__label">Шкала H (м.в.ст.) (Y), максимум</label>
          <InputNumber v-model="pump.maxy" inputId="withoutgrouping" />
        </div>
        <div class="input-group">
          <label class="input-group__label">Шаг шкалы H (м.в.ст.) (Y)</label>
          <InputNumber v-model="pump.step_y" inputId="withoutgrouping" />
        </div>
      </div>




      <Button @click="createChart" label="Смотреть график" />

      <div class="w-full  mt-4 ">
        <BubbleChart class="chart-wrapper" v-bind="bubbleChartProps" />
      </div>
    </Fieldset>


    <div class="mt-5 mb-10 flex flex-col gap-4">
      <InlineMessage class="max-w-sm " v-if="errorMessage" severity="error">Заполните все обязательные поля.
      </InlineMessage>

      <div class="">
        <p class=" text-slate-800 ">Копировать насос при добавлении</p>
        <p class=" text-xs text-gray-500 mb-2">(Отменяет закрытие текущей страницы)</p>
        <InputSwitch v-model="copyPump" />
      </div>
      <Button class="w-44" :loading="disabledBtn" @click="createPump" label="Добавить насос" />

    </div>



  </div>
</template>


<style>
.chart-wrapper {
  width: 70%;
  aspect-ratio: 1 / 1;
}

.input-group {
  @apply flex flex-col max-w-xs mb-5;
}

.wrapper-content .input-group {
  @apply flex flex-col max-w-xs mb-0;
}

.input-group__label {
  @apply mb-1 w-60;
}

.input-group__label-pump {
  @apply mb-1;
}

@media (max-width: 480px) {
  .chart-wrapper {
    width: 100%;

  }
}
</style>
