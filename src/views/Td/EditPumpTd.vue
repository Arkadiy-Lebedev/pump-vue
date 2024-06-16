<script setup lang="ts">
import axios from 'axios'
import { onMounted, reactive, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import SubHeader from "@/components/SubHeader.vue"

import { useToastStore } from '@/stores/toastStore'
const useStore = useToastStore()

const router = useRouter()

import { BubbleChart, useBubbleChart } from "vue-chart-3"

import { API } from "@/api/api"
import type { IPumpTd } from "@/types/IPump"
import type { IType } from "@/types/IType"


const route = useRoute()
const errorMessage = ref(false)
const isFormulaSucces = ref(false)

const loadPumpOne = async (id: string[] | string) => {
  fetch(`${API}api/pump-td/read_one.php?id=${id}`)
    .then((response) => response.json())
    .then((data) => {

      for (var key in data) {
        if (data[key] == " " || data[key] == "") {
          data[key] = null
        }

      }

      pump.id = data.id
      pump.coordinates = JSON.parse(data.coordinates)
      pump.name = data.name
      pump.type = data.type
      pump.nominal_q = JSON.parse(data.nominal_q)
      pump.nominal_h = JSON.parse(data.nominal_h)
      pump.frame = data.frame
      pump.wheel_order = data.wheel_order
      pump.base = data.base
      pump.lid = data.lid
      pump.shaft_standart = data.shaft_standart
      pump.airVent = data.airVent
      pump.oring = data.oring
      pump.bolt = data.bolt
      pump.coupling = data.coupling
      pump.seal_order = data.seal_order
      pump.seal = data.seal
      pump.d = data.d
      pump.b1 = JSON.parse(data.b1)
      pump.b2 = JSON.parse(data.b2)
      pump.b3 = JSON.parse(data.b3)
      pump.b4 = JSON.parse(data.b4)
      pump.b5 = JSON.parse(data.b5)
      pump.h1 = JSON.parse(data.h1)
      pump.h2 = JSON.parse(data.h2)
      pump.h3 = JSON.parse(data.h3)
      pump.l1 = JSON.parse(data.l1)
      pump.l2 = JSON.parse(data.l2)
      pump.error = JSON.parse(data.error)
      pump.minx = +data.minx
      pump.miny = +data.miny
      pump.maxy = +data.maxy
      pump.maxx = +data.maxx
      pump.formuls = data.formuls
      pump.start = +data.start
      pump.finish = +data.finish
      pump.step = +data.step
      pump.note = data.note
      pump.power = JSON.parse(data.power)
      pump.weight = JSON.parse(data.weight)
      pump.step_x = +data.step_x
      pump.step_y = +data.step_y

      loadTypes()
      console.log(pump)
    })
}


const pump = reactive<IPumpTd>({
  id: 0,
  coordinates: [],
  name: "",
  type: "",
  nominal_q: null,
  nominal_h: null,
  frame: '',
  wheel_order: '',
  base: '',
  lid: '',
  shaft_standart: '',
  airVent: '',
  oring: '',
  bolt: '',
  coupling: '',
  seal_order: '',
  seal: '',
  d: '',
  b1: null,
  b2: null,
  b3: null,
  b4: null,
  b5: null,
  h1: null,
  h2: null,
  h3: null,
  l1: null,
  l2: null,
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
  weight: null,
  power: null,
  note: ''
})

watch(() => pump.formuls, (formula) => {
  console.log(123)
  isFormulaSucces.value = false
})

const loadTypes = async () => {
  axios.get(`${API}api/type/read.php`)
    .then(resp => {
      types.value = resp.data.data

      const typeId = types.value.find(el => el.type == pump.type)
      if (typeId) {
        pump.type = typeId.id
      }

      createChart()


    })

}

onMounted(() => {
  loadPumpOne(route.params.id)
})

const updatePump = async () => {
  if (pump.formuls == "" || pump.name == "" || pump.type == "" || pump.finish == null || pump.start == null) {
    errorMessage.value = true
    return
  }

  if (!isFormulaSucces.value) {
    useStore.showToast({ type: 'warn', title: 'Внимание', text: `Для добавления насоса, нажмите построить график, проверить на валидность формулы` })
    return
  }

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

  axios.post(`${API}api/pump-td/update.php`, formData)
    .then(response => {
      console.log(response)
      useStore.showToast({ type: 'success', title: 'Успешно!', text: `Изменения внесены в насос: ${pump.name}` })
      router.push({ name: 'home' })
    })
}


const types = ref<IType[]>([
  {
    id: 0,
    image: "",
    type: "",
  },
])








const options = reactive({

  aspectRatio: 1,
  // maintainAspectRatio: false,
  // responsive: false,
  // maintainAspectRatio: false,
  // responsive: true,
  // maintainAspectRatio: false,
  scales: {

    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'H(m) (Y)',
      },
      min: 0,
      max: 50
    },
    x: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Q(м³/h) (X)',
      },
      min: 0,
      max: 50
    },
  },
  plugins: {
    tooltip: {
      caretPadding: 10,
      callbacks: {
        label: function (context: any) {
          let label = `  Q=${context.parsed.x} м³/ч,  H=${context.parsed.y} м.в.ст.`
          return label
        }
      }
    },
    legend: {
      // @ts-ignore
      onClick: function (even, legendItem) {
        console.log(even)
        console.log(legendItem)
        return null
      }
    },
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
    },
  ],
})

const coordinates = ref<any[]>([])

const createChart = () => {
  coordinates.value = []


  if (pump.start && pump.finish) {
    for (let i = pump.start; i < pump.finish; i = i + pump.step) {
      try {
        let y = eval(pump.formuls.replace(/x/g, i.toString()))
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


  const chartData2 = [
    {
      type: "bubble",
      data: coordinates.value,
      cubicInterpolationMode: "monotone",
      label: "Кривая работы насоса",
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      pointBackgroundColor: 'rgb(75, 192, 192)',
      pointRadius: 2,
      spanGaps: true,
    }
  ]


  chartData.datasets = chartData2
  options.scales = options2

}

const { bubbleChartProps } = useBubbleChart({
  // @ts-ignore
  chartData,
  options,
})




</script>

<template>
  <SubHeader title="Редактировать" />

  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

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
              <label class="input-group__label">Номинальная рабочая точка Q (м³/ч)
              </label>
              <InputNumber v-model="pump.nominal_q" :minFractionDigits="1" inputId="withoutgrouping" />

              <!-- <small id="username-help">Enter your username to reset your password.</small> -->
            </div>
            <div class="input-group">
              <label class="input-group__label">Номинальная рабочая точка H (м.в.ст.)
              </label>
              <InputNumber v-model="pump.nominal_h" :minFractionDigits="1" inputId="withoutgrouping" />

              <!-- <small id="username-help">Enter your username to reset your password.</small> -->
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
                <label class="input-group__label">Гидравлический корпус:</label>
                <InputText v-model="pump.frame" aria-describedby="username-help" />
              </div>
              <div class="input-group">
                <label class="input-group__label">Рабочее колесо:</label>
                <InputText v-model="pump.wheel_order" aria-describedby="username-help" />
              </div>

              <div class="input-group">
                <label class="input-group__label">Основание насоса:</label>
                <InputText v-model="pump.base" aria-describedby="username-help" />
              </div>
              <div class="input-group">
                <label class="input-group__label">Торцевое уплотнение вала:</label>
                <InputText v-model="pump.seal_order" aria-describedby="username-help" />
              </div>


              <div class="input-group">
                <label class="input-group__label">Крышка:</label>
                <InputText v-model="pump.lid" aria-describedby="username-help" />
              </div>
              <div class="input-group">
                <label class="input-group__label">Вал:</label>
                <InputText v-model="pump.shaft_standart" aria-describedby="username-help" />
              </div>
              <div class="input-group">
                <label class="input-group__label">Воздухоотводчик:</label>
                <InputText v-model="pump.airVent" aria-describedby="username-help" />
              </div>

              <div class="input-group">
                <label class="input-group__label">Уплотнение O-ring:</label>
                <InputText v-model="pump.oring" aria-describedby="username-help" />
              </div>
              <div class="input-group">
                <label class="input-group__label">Болт:</label>
                <InputText v-model="pump.bolt" aria-describedby="username-help" />
              </div>
              <div class="input-group">
                <label class="input-group__label">Муфта:</label>
                <InputText v-model="pump.coupling" aria-describedby="username-help" />
              </div>
              <div class="input-group">
                <label class="input-group__label">Опора торцевого уплотнения:</label>
                <InputText v-model="pump.seal" aria-describedby="username-help" />
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
              <label class="input-group__label">D</label>
              <InputNumber v-model="pump.d" :minFractionDigits="1" inputId="withoutgrouping" />
            </div>
            <div class="input-group">
              <label class="input-group__label">B1</label>
              <InputNumber v-model="pump.b1" :minFractionDigits="1" inputId="withoutgrouping" />
            </div>
            <div class="input-group">
              <label class="input-group__label">B2</label>
              <InputText v-model="pump.b2" aria-describedby="username-help" />
            </div>

            <div class="input-group">
              <label class="input-group__label">B3</label>
              <InputNumber v-model="pump.b3" :minFractionDigits="1" inputId="withoutgrouping" />
            </div>
            <div class="input-group">
              <label class="input-group__label">B4</label>
              <InputNumber v-model="pump.b4" :minFractionDigits="1" inputId="withoutgrouping" />
            </div>
            <div class="input-group">
              <label class="input-group__label">B5</label>
              <InputNumber v-model="pump.b5" :minFractionDigits="1" inputId="withoutgrouping" />
            </div>

            <div class="input-group">
              <label class="input-group__label">H1</label>
              <InputNumber v-model="pump.h1" :minFractionDigits="1" inputId="withoutgrouping" />
            </div>
            <div class="input-group">
              <label class="input-group__label">H2</label>
              <InputText v-model="pump.h2" aria-describedby="username-help" />
            </div>
            <div class="input-group">
              <label class="input-group__label">H3</label>
              <InputNumber v-model="pump.h3" :minFractionDigits="1" inputId="withoutgrouping" />
            </div>

            <div class="input-group">
              <label class="input-group__label">L1</label>
              <InputNumber v-model="pump.l1" :minFractionDigits="1" inputId="withoutgrouping" />
            </div>
            <div class="input-group">
              <label class="input-group__label">L2</label>
              <InputNumber v-model="pump.l2" :minFractionDigits="1" inputId="withoutgrouping" />
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
      <Button class="w-44" @click="updatePump" label="Отправить" />
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
