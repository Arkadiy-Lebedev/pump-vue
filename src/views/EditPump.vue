<script setup lang="ts">
import axios from 'axios'
import { onMounted, reactive, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import SubHeader from "../components/SubHeader.vue"

import { useToastStore } from '../stores/toastStore'
const useStore = useToastStore()

const router = useRouter()

import { BubbleChart, useBubbleChart } from "vue-chart-3"

import { API } from "../api/api"
import type { IPump } from "../types/IPump"
import type { IType } from "../types/IType"


const route = useRoute()
const errorMessage = ref(false)
const isFormulaSucces = ref(false)

const loadPumpOne = async (id: string[] | string) => {
  fetch(`${API}api/pump/read_one.php?id=${id}`)
    .then((response) => response.json())
    .then((data) => {
      pump.id = data.id
      pump.coordinates = JSON.parse(data.coordinates)
      pump.name = data.name
      pump.series = data.series
      pump.diameter = JSON.parse(data.diameter)
      pump.efficiency = JSON.parse(data.efficiency)
      pump.note = data.note
      pump.power = JSON.parse(data.power)
      pump.speed = JSON.parse(data.speed)
      pump.frequency = JSON.parse(data.frequency)
      pump.phase = JSON.parse(data.phase)
      pump.voltage = JSON.parse(data.voltage)
      pump.launch = data.launch
      pump.seal = data.seal
      pump.shaft = data.shaft
      pump.pump = data.pump
      pump.type = data.type
      pump.error = JSON.parse(data.error)
      pump.minx = +data.minx
      pump.miny = +data.miny
      pump.maxy = +data.maxy
      pump.maxx = +data.maxx
      pump.formuls = data.formuls
      pump.start = +data.start
      pump.finish = +data.finish
      pump.step = +data.step

      pump.nominal_q = JSON.parse(data.nominal_q)
      pump.nominal_h = JSON.parse(data.nominal_h)
      pump.bar = JSON.parse(data.bar)
      pump.material_standart = data.material_standart
      pump.material_order = data.material_order
      pump.isolation_standart = data.isolation_standart
      pump.isolation_order = data.isolation_order
      pump.shaft_standart = data.shaft_standart
      pump.shaft_order = data.shaft_order
      pump.bearing_standart = data.bearing_standart
      pump.bearing_order = data.bearing_order
      pump.bearing_up_standart = data.bearing_up_standart
      pump.bearing_up_order = data.bearing_up_order
      pump.bearing_down_standart = data.bearing_down_standart
      pump.bearing_down_order = data.bearing_down_order
      pump.spring_standart = data.spring_standart
      pump.spring_order = data.spring_order
      pump.seal_order = data.seal_order
      pump.oring_standart = data.oring_standart
      pump.oring_order = data.oring_order
      pump.protect_standart = data.protect_standart
      pump.protect_order = data.protect_order
      pump.ip = JSON.parse(data.ip)
      pump.current_strength = JSON.parse(data.current_strength)
      pump.weight = JSON.parse(data.weight)
      pump.size = data.size
      pump.l10 = JSON.parse(data.l10)
      pump.l6 = JSON.parse(data.l6)
      pump.l4 = JSON.parse(data.l4)
      pump.l3 = JSON.parse(data.l3)
      pump.de = data.de
      pump.m = JSON.parse(data.m)
      pump.l2 = JSON.parse(data.l2)
      pump.l1 = JSON.parse(data.l1)
      pump.l = JSON.parse(data.l)
      pump.h7 = JSON.parse(data.h7)
      pump.h6 = JSON.parse(data.h6)
      pump.h5 = JSON.parse(data.h5)
      pump.h4 = JSON.parse(data.h4)
      pump.h3 = JSON.parse(data.h3)
      pump.n2 = data.n2
      pump.j = JSON.parse(data.j)
      pump.b1 = JSON.parse(data.b1)
      pump.b = JSON.parse(data.b)
      pump.a1 = JSON.parse(data.a1)
      pump.a = JSON.parse(data.a)
      pump.n1 = data.n1
      pump.d1 = JSON.parse(data.d1)
      pump.d = JSON.parse(data.d)
      pump.g_l5 = JSON.parse(data.g_l5)
      pump.g_b2 = JSON.parse(data.g_b2)
      pump.g_h = JSON.parse(data.g_h)
      pump.g_h1 = JSON.parse(data.g_h1)
      pump.g_h2 = JSON.parse(data.g_h2)
      pump.g_l8 = JSON.parse(data.g_l8)
      pump.g_l9 = JSON.parse(data.g_l9)
      pump.g_l7 = JSON.parse(data.g_l7)
      pump.flange = JSON.parse(data.flange)
      pump.wheel_standart = data.wheel_standart
      pump.wheel_order = data.wheel_order
      pump.pole = JSON.parse(data.pole)

      loadTypes()
      console.log(pump)
    })
}


const pump = reactive<IPump>({
  id: 0,
  coordinates: [],
  name: "",
  series: "",
  diameter: null,
  efficiency: null,
  note: "",
  power: null,
  speed: null,
  frequency: null,
  phase: null,
  voltage: null,
  launch: "",
  seal: "",
  shaft: "",
  pump: "",
  type: "",
  error: null,
  minx: 0,
  maxx: 50,
  miny: 0,
  maxy: 50,
  formuls: '',
  start: null,
  finish: null,
  step: 0.2,
  nominal_q: null,
  nominal_h: null,
  bar: null,
  material_standart: '',
  material_order: '',
  isolation_standart: '',
  isolation_order: '',
  shaft_standart: '',
  shaft_order: '',
  bearing_standart: '',
  bearing_order: '',
  bearing_up_standart: '',
  bearing_up_order: '',
  bearing_down_standart: '',
  bearing_down_order: '',
  spring_standart: '',
  spring_order: '',
  seal_order: '',
  oring_standart: '',
  oring_order: '',
  protect_standart: '',
  protect_order: '',
  ip: null,
  current_strength: null,
  weight: null,
  size: '',
  l10: null,
  l6: null,
  l4: null,
  l3: null,
  de: '',
  m: null,
  l2: null,
  l1: null,
  l: null,
  h7: null,
  h6: null,
  h5: null,
  h4: null,
  h3: null,
  n2: '',
  j: null,
  b1: null,
  b: null,
  a1: null,
  a: null,
  n1: '',
  d1: null,
  d: null,
  g_l5: null,
  g_b2: null,
  g_h: null,
  g_h1: null,
  g_h2: null,
  g_l8: null,
  g_l9: null,
  g_l7: null,
  flange: null,
  wheel_standart: '',
  wheel_order: '',
  pole: null
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

  axios.post(`${API}api/pump/update.php`, formData)
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
      max: pump.maxy
    },
    x: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Q(м³/h) (X)',
      },
      min: pump.minx,
      max: pump.maxx
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
        
              <InputText id="username" v-model="pump.name" aria-describedby="username-help"
                :class="{ 'p-invalid': errorMessage }" />
           
            
          </div>
          <div class="input-group">
            <label class="input-group__label">Тип *</label>
            <Dropdown v-model="pump.type" :options="types" optionLabel="type" optionValue="id" placeholder="Тип насоса"
              :class="{ 'p-invalid': errorMessage }" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Серия</label>
            <InputText v-model="pump.series" aria-describedby="username-help" />
            <!-- <small id="username-help">Enter your username to reset your password.</small> -->
          </div>
          <div class="input-group">
            <label class="input-group__label">Диаметр выхода насоса (DN)</label>
            <InputNumber v-model="pump.diameter" placeholder="мм." :minFractionDigits="1" inputId="withoutgrouping" />

            <!-- <small id="username-help">Enter your username to reset your password.</small> -->
          </div>
          <div class="input-group">
            <label class="input-group__label">Номинальная рабочая точка Q
            </label>
            <InputNumber v-model="pump.nominal_q" :minFractionDigits="1" inputId="withoutgrouping" />

            <!-- <small id="username-help">Enter your username to reset your password.</small> -->
          </div>
          <div class="input-group">
            <label class="input-group__label">Номинальная рабочая точка H
            </label>
            <InputNumber v-model="pump.nominal_h" :minFractionDigits="1" inputId="withoutgrouping" />

            <!-- <small id="username-help">Enter your username to reset your password.</small> -->
          </div>
          <div class="input-group">
            <label class="input-group__label">КПД двигателя (%)</label>
            <InputNumber v-model="pump.efficiency" :minFractionDigits="1" inputId="withoutgrouping" />

            <!-- <small id="username-help">Enter your username to reset your password.</small> -->
          </div>
          <div class="input-group">
            <label class="input-group__label">Питание двигателя (кВт)</label>
            <InputNumber v-model="pump.power" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Рабочее давление, бар</label>
            <InputNumber v-model="pump.bar" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Скорость вращения вала (rpm)</label>
            <InputNumber v-model="pump.speed" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>

          <div class="input-group">
            <label class="input-group__label">Частота переменного тока (Hz)</label>
            <InputNumber v-model="pump.frequency" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Количество фаз</label>
            <InputNumber v-model="pump.phase" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Номинальное напряжение (V)</label>
            <InputNumber v-model="pump.voltage" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>

          <div class="input-group">
            <label class="input-group__label">Способ запуска</label>
            <InputText id="username" v-model="pump.launch" aria-describedby="username-help" />

          </div>


          <div class="input-group">
            <label class="input-group__label">Материал вала</label>
            <InputText v-model="pump.shaft" aria-describedby="username-help" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Материал насоса</label>
            <InputText v-model="pump.pump" aria-describedby="username-help" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Степень защиты, IP</label>
            <InputNumber v-model="pump.ip" aria-describedby="username-help" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Номинальная сила тока, А</label>
            <InputNumber v-model="pump.current_strength" aria-describedby="username-help" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Вес</label>
            <InputNumber v-model="pump.weight" aria-describedby="username-help" />
          </div>
          <div class="input-group ">
                <label class="input-group__label flex items-center gap-2 cursor-pointer">Допустимая погрешность <i class="pi pi-info-circle" v-tooltip="{
                    value: 'Погрешность при подборе насоса по оси Q и H, желательно ставить минимум 1 пункт',
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
              <div class="input-group">
                <label class="input-group__label">Количество полюсов</label>
                <InputNumber v-model="pump.pole" aria-describedby="username-help" />
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
      <div class="sm:flex">
        <div class="flex flex-col">
          <p class="  text-xl text-slate-800 mb-3">Стандарт</p>
           <div class="flex flex-wrap gap-5">
          <div class="input-group">
            <label class="input-group__label">Корпус насоса</label>
            <InputText v-model="pump.material_standart" aria-describedby="username-help" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Класс изоляции двигателя:</label>
            <InputText v-model="pump.isolation_standart" aria-describedby="username-help" />
          </div>
          <div class="input-group">
                <label class="input-group__label">Рабочее колесо:</label>
                <InputText v-model="pump.wheel_standart" aria-describedby="username-help" />
              </div>
          <div class="input-group">
            <label class="input-group__label">Вал насоса:</label>
            <InputText v-model="pump.shaft_standart" aria-describedby="username-help" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Производитель подшипника:</label>
            <InputText v-model="pump.bearing_standart" aria-describedby="username-help" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Верхний подшипник:</label>
            <InputText v-model="pump.bearing_up_standart" aria-describedby="username-help" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Нижний подшипник:</label>
            <InputText v-model="pump.bearing_down_standart" aria-describedby="username-help" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Материал пружины:</label>
            <InputText v-model="pump.spring_standart" aria-describedby="username-help" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Уплотнитель торцевой:</label>
            <InputText v-model="pump.seal" aria-describedby="username-help" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Уплотнение O-ring:</label>
            <InputText v-model="pump.oring_standart" aria-describedby="username-help" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Устройство защиты насоса:</label>
            
            <Textarea v-model="pump.protect_standart" autoResize rows="3" cols="30" />
          </div>
  </div>
        </div>

        <div class="flex flex-col">
          <p class="  text-xl text-slate-800 mb-3">Под заказ</p>
          <div class="flex flex-wrap gap-5">
          <div class="input-group">
            <label class="input-group__label">Корпус насоса</label>
            <InputText v-model="pump.material_order" aria-describedby="username-help" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Класс изоляции двигателя:</label>
            <InputText v-model="pump.isolation_order" aria-describedby="username-help" />
          </div>
          <div class="input-group">
                <label class="input-group__label">Рабочее колесо:</label>
                <InputText v-model="pump.wheel_order" aria-describedby="username-help" />
              </div>
          <div class="input-group">
            <label class="input-group__label">Вал насоса:</label>
            <InputText v-model="pump.shaft_order" aria-describedby="username-help" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Производитель подшипника:</label>
            <InputText v-model="pump.bearing_order" aria-describedby="username-help" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Верхний подшипник:</label>
            <InputText v-model="pump.bearing_up_order" aria-describedby="username-help" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Нижний подшипник:</label>
            <InputText v-model="pump.bearing_down_order" aria-describedby="username-help" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Материал пружины:</label>
            <InputText v-model="pump.spring_order" aria-describedby="username-help" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Уплотнитель торцевой:</label>
            <InputText v-model="pump.seal_order" aria-describedby="username-help" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Уплотнение O-ring:</label>
            <InputText v-model="pump.oring_order" aria-describedby="username-help" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Устройство защиты насоса:</label>
            
            <Textarea v-model="pump.protect_order" autoResize rows="3" cols="30" />
          </div>
  </div>
        </div>
      </div>
            </template>
      </Card>

         <Card class=" mt-5">
          <template #content>
      <div class="flex flex-col mb-7">
        <p class='font-bold text-xl text-slate-800 mb-3'>Габариты размеры автоматической трубной муфты и насосного агрегата:</p>
         <div class="sm:flex gap-5">
                 <div class="input-group">
              <label class="input-group__label-pump">Размер трубной направляющей (Ø)</label>
              <InputText v-model="pump.size" aria-describedby="username-help" />
            </div>
            <div class="input-group">
                <label class="input-group__label">Фланец насоса</label>
                <InputNumber v-model="pump.flange" placeholder="мм." :minFractionDigits="1" inputId="withoutgrouping" />
              </div>
            </div>
        <div class="flex gap-x-5 gap-y-1 wrapper-content flex-wrap ">
          <div class="input-group">
            <label class="input-group__label">L10</label>
            <InputNumber v-model="pump.l10" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">L6</label>
            <InputNumber v-model="pump.l6" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>

          <div class="input-group">
            <label class="input-group__label">L4</label>
            <InputNumber v-model="pump.l4" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">L3</label>
            <InputNumber v-model="pump.l3" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Øe</label>
            <InputText v-model="pump.de" />
          </div>
          <div class="input-group">
            <label class="input-group__label">M</label>
            <InputNumber v-model="pump.m" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">L2</label>
            <InputNumber v-model="pump.l2" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">L1</label>
            <InputNumber v-model="pump.l1" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">L</label>
            <InputNumber v-model="pump.l" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">H7</label>
            <InputNumber v-model="pump.h7" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">H6</label>
            <InputNumber v-model="pump.h6" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">H5</label>
            <InputNumber v-model="pump.h5" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">H4</label>
            <InputNumber v-model="pump.h4" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">H3</label>
            <InputNumber v-model="pump.h3" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">n2-Ød</label>
            <InputText v-model="pump.n2" aria-describedby="username-help" />
          </div>
          <div class="input-group">
            <label class="input-group__label">J</label>
            <InputNumber v-model="pump.j" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">B1</label>
            <InputNumber v-model="pump.b1" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">B</label>
            <InputNumber v-model="pump.b" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">A1</label>
            <InputNumber v-model="pump.a1" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">A</label>
            <InputNumber v-model="pump.a" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">N1-Ød1</label>
            <InputText v-model="pump.n1" aria-describedby="username-help" />
          </div>
          <div class="input-group">
            <label class="input-group__label">D1</label>
            <InputNumber v-model="pump.d1" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">D</label>
            <InputNumber v-model="pump.d" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
        </div>
      </div>

      <div class="flex flex-col mb-7">
        <p class='font-bold text-xl text-slate-800 mb-3'>Габариты разных типов насосных агрегатов с указанием минимального
          уровня жидкости:</p>
        <div class="flex gap-x-5 gap-y-1 wrapper-content flex-wrap">
          <div class="input-group">
            <label class="input-group__label">L5</label>
            <InputNumber v-model="pump.g_l5" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">B2</label>
            <InputNumber v-model="pump.g_b2" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">H</label>
            <InputNumber v-model="pump.g_h" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">H1</label>
            <InputNumber v-model="pump.g_h1" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">H2</label>
            <InputNumber v-model="pump.g_h2" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">L8</label>
            <InputNumber v-model="pump.g_l8" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">L9</label>
            <InputNumber v-model="pump.g_l9" :minFractionDigits="1" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">L7</label>
            <InputNumber v-model="pump.g_l7" :minFractionDigits="1" inputId="withoutgrouping" />
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
            <label class="input-group__label">Шаг</label>
            <InputNumber v-model="pump.step" :minFractionDigits="2" inputId="withoutgrouping" />
          </div>
        </div>
        <div class="sm:flex gap-5  mt-5">
          <div class="input-group">
            <label class="input-group__label">Шкала Q (X), минимум</label>
            <InputNumber v-model="pump.minx" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Шкала Q (X), максимум</label>
            <InputNumber v-model="pump.maxx" inputId="withoutgrouping" />
          </div>
        </div>
        <div class="sm:flex gap-5  mt-5 mb-2">
          <div class="input-group">
            <label class="input-group__label">Шкала H (Y), минимум</label>
            <InputNumber v-model="pump.miny" inputId="withoutgrouping" />
          </div>
          <div class="input-group">
            <label class="input-group__label">Шкала H (Y), максимум</label>
            <InputNumber v-model="pump.maxy" inputId="withoutgrouping" />
          </div>
        </div>



        <Button @click="createChart" label="Смотреть график" />

        <div class="w-full sm:w-7/12 mt-4">
          <BubbleChart v-bind="bubbleChartProps" />
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
.input-group {
  @apply flex flex-col max-w-xs mb-5;
}


.input-group__label {
  @apply mb-1 w-60;
}

.input-group__label-pump {
  @apply mb-1 ;
}

</style>
