<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { FilterMatchMode } from 'primevue/api'
import axios from 'axios'
import type { IPump, IPumpsAll } from "../types/IPump"
import type { IPumpSelect, IworkPointSelect } from "../types/IPumpSelect"
import { BubbleChart, useBubbleChart } from "vue-chart-3"
import { Chart, registerables } from 'chart.js'
import ChartAnnotation from 'chartjs-plugin-annotation'
import { API, APIPDF } from "../api/api"
import { usePDF } from 'vue3-pdfmake'
import Logo from '../assets/image/logo2.png'
import ContactForm from '../components/ContactForm.vue'
import Footer from '../components/Footer.vue'
import { useToastStore } from '../stores/toastStore'
import { useWidthChart } from '../services/useWidthChart'
import { useFetchAllPumps } from '../hooks/useFetch'
import { useDefaultRow } from '../hooks/useDefaultRow'
import { isSeriesPump } from '../services/helpers'
import { pdfGenerate } from "../services/pdfGenerate"

interface ITypeCalc {
  image: string,
  type: string
}

const widthChart = useWidthChart()
console.log(widthChart)
const useStore = useToastStore()




const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  representative: { value: null, matchMode: FilterMatchMode.IN },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  verified: { value: null, matchMode: FilterMatchMode.EQUALS }
})

// @ts-ignore
const pdfmake = usePDF({
  autoInstallVFS: true
})



const getImage = () => {
  const img = new Image()
  img.src = Logo
  return img
}


const pumpSelect = reactive<IPumpSelect>({
  type: 'Любой',
  image: '../api/image/image_all.jpg',
  pumpX: null,
  pumpY: null,
})


const workPointSelect = reactive<IworkPointSelect>({
  pumpX: null,
  pumpY: null,
})


const message = reactive({
  title: '',
  text: ''
})
const xKw = ref<number | null>(null)
const xNpsh = ref<number | null>(null)
const pumps = ref<IPumpsAll[]>([])
const pumpsEvent = ref<IPumpsAll[]>([])
const pumpsEventModal = ref<IPumpsAll[]>([])
const loading = ref(false)
const itemPump = ref<IPumpsAll | null>(null)
const coordinates = ref<any[]>([])
const coordinatesKw = ref<any[]>([])
const coordinatesNpsh = ref<any[]>([])
const errorModal = ref<boolean>(false)
const pumpsModal = ref<boolean>(false)
const messageModal = ref<boolean>(false)
const contactModal = ref<boolean>(false)
const isShowChartsWQA = ref<boolean>(false)
const messageTextForSend = ref<string>('')
const loadingPdf = ref<boolean>(false)
const orderList = ref<string | null>(null)
const isWorkPointBlock = ref<boolean>(false)

const date = new Date().toLocaleDateString('ru-RU')

const closeModal = (status: string) => {
  contactModal.value = false
}

// преобразование  формулы
function formulaCreate(formula: string, x: string, name: string) {
  try {
    return eval(formula.replace(/x/g, x))
  } catch (err) {
    console.log(err)
    useStore.showToast({ type: 'error', title: 'Ошибка!', text: `Не  верная формула в насосе ${name}` })
    return
  }
}

// function isWqaName(name: string | undefined) {
//   if (name && name.indexOf("WQA")) {
//     let newName = name.replace('-', '').replace('-', '')
//     return newName
//   } else {
//     return name
//   }
// }



const resetCharts = () => {
  chartData.datasets[0].data = []
  chartData.datasets[1].data = []
  // @ts-ignore
  options.plugins.annotation.annotations = {
    line1: {
      type: 'label',
      width: widthChart?.width,
      height: widthChart?.height,
      content: getImage(),
      font: {
        size: 60,
      },

      opacity: 0.1
    },
  }
}



const newarray = ref<IPumpsAll[] | []>([])

const findPump = () => {
  isShowChartsWQA.value = false
workPointSelect.pumpX = pumpSelect.pumpX
 workPointSelect.pumpY =   pumpSelect.pumpY

  resetCharts()

  isWorkPointBlock.value = false

  newarray.value = []
  if (!pumpSelect.pumpY || !pumpSelect.pumpX || pumpSelect.pumpY == 0 || pumpSelect.pumpX == 0) {
    message.text = 'Введите рабочую характеристику насосного агрегата'
    message.title = 'Характеристика не задана'
    errorModal.value = true
    return
  }

  let temp = pumpsEvent.value

  if (pumpSelect.type == 'Любой') {
    pumpsEvent.value = pumps.value
  } else {
    // pumpsEvent.value = pumps.value.filter(el => el.type == pumpSelect.type)

    // проверка на совпадение в названиях типа массива
    let arrayType = pumpSelect.type.split('/')
    pumpsEvent.value = pumps.value.filter(el => {
      let arrayTypeEl = el.type.toString().split('/')
      return arrayType.every((e) => arrayTypeEl.includes(e))
    })

  }

  if (pumpSelect.pumpX) {
    pumpsEvent.value.forEach(elem => {
      // @ts-ignore
      let pointPumpY = formulaCreate(elem.formuls, pumpSelect.pumpX.toString(), elem.name)



      if (pumpSelect.pumpX && pumpSelect?.pumpY && elem?.error && elem?.start && elem?.finish &&
        pumpSelect?.pumpY <= pointPumpY + +elem?.error &&
        pumpSelect?.pumpY >= pointPumpY - +elem?.error &&
        pumpSelect.pumpX <= +elem?.finish + +elem?.error &&
        pumpSelect.pumpX >= +elem?.start - +elem?.error
      ) {
        // @ts-ignore
        newarray.value.push(elem)
      }


    }
    )

    if (newarray.value.length <= 0) {
      message.title = 'Нет подходящего насосного агрегата'
      message.text = 'Рабочая характеристика не соответствует имеющимся насосным агрегатам, введите другую рабочую характеристику'
      errorModal.value = true

      pumpsEvent.value = temp
      return
    }


    pumpsEvent.value = [...newarray.value]


  }
}

const types = ref<ITypeCalc[]>([
  {
    image: "../api/image/image_all.jpg",
    type: "Любой",
  },
])



const loadAllPump = async () => {
  loading.value = true
  loadTypes()
  const { data, pending } = await useFetchAllPumps()
  useDefaultRow(data.value)
  pumps.value = data.value
  loading.value = pending.value

}

const loadTypes = async () => {
  axios.get(`${API}api/type/read.php`)
    .then((data) => (types.value = [...types.value, ...data.data.data]))
}





onMounted(() => {

  loadAllPump()

})


const options = reactive({
  aspectRatio: 1,
  maintainAspectRatio: true,
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'H(m)',
      },
      min: 0,
      max: 50
    },
    x: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Q(м³/h)',
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
          let label = `Q=${context.parsed.x} м³/ч, H=${context.parsed.y} м.в.ст.`
          return label
        }
      }
    },
    annotation: {
      annotations: {
        line1: {
          type: 'label',
          width: widthChart?.width,
          height: widthChart?.height,
          content: getImage(),
          font: {
            size: 60,
          },

          opacity: 0.1
        },
      }
    },
    legend: {
      // @ts-ignore
      onClick: function (even, legendItem, legend) {
        const index = legendItem.datasetIndex
        const ci = legend.chart
        if (legendItem.text != "Рабочая точка") {
          if (ci.isDatasetVisible(index)) {
            ci.hide(index)
            legendItem.hidden = true
          } else {
            ci.show(index)
            legendItem.hidden = false
          }
        } else {
          return null
        }
        return null

      }
    },
  },

})

Chart.register(ChartAnnotation, ...registerables)


const showChartDataInModal = (id: number) => {

  const reset = {
    line4: {
      type: 'label',
      width: widthChart?.width,
      height: widthChart?.height,
      content: getImage(),
      font: {
        size: 60,
      },

      opacity: 0.1
    },
  }
  pumpsEvent.value = []
  workPointSelect.pumpX = null
  workPointSelect.pumpY = null

    chartDataKw.datasets[1].data = []
  // @ts-ignore
  optionsKw.plugins.annotation.annotations = reset
  chartDataNpsh.datasets[1].data = []
  // @ts-ignore
  optionsNpsh.plugins.annotation.annotations = reset




  // @ts-ignore
  pumpsEvent.value = [pumps.value.find(el => el.id == id)]


  pumpSelect.pumpY = null
  pumpSelect.pumpX = null
  showChartData(id)
  pumpsModal.value = false
  isWorkPointBlock.value = true
}

// console.log(isSeriesPump(itemPump.value.name))
// if (itemPump.value.name && isSeriesPump(itemPump.value.name) == "TD") {
//   isShowChartsWQA.value = true
// } else {
//   isShowChartsWQA.value = false
// }

const showChartData = (id: number) => {
  isShowChartsWQA.value = false
  // @ts-ignore
  itemPump.value = pumps.value.find(el => el.id == id)
  if (itemPump.value && itemPump.value.minx && itemPump.value.maxx && itemPump.value.maxy && itemPump.value.miny && pumpSelect) {

    orderList.value = `ЗАПРОСИТЬ СЧЕТ НА ${itemPump.value.name}`
    coordinates.value = []
    coordinatesKw.value = []
    coordinatesNpsh.value = []
 

    if (itemPump.value && itemPump.value.start && itemPump.value.finish) {
      for (let i = +itemPump.value.start; i < +itemPump.value.finish; i = i + +itemPump.value.step) {

        try {
          let y = eval(itemPump.value.formuls.replace(/x/g, i.toString()))
        
          coordinates.value.push({
            x: +i.toFixed(2),
            y: +y.toFixed(2),
          })

        } catch (err) {
          console.log(err)
          return

        }

      }
      if (coordinates.value[coordinates.value.length - 1] != itemPump.value.finish) {
        let y = eval(itemPump.value.formuls.replace(/x/g, itemPump.value.finish.toString()))
        coordinates.value.push({
          x: +itemPump.value.finish,
          y: +y.toFixed(2),
        })
      }

    }

    if (isSeriesPump(itemPump.value.name) == "TD") {
      isShowChartsWQA.value = true
      if (itemPump.value && itemPump.value.start_kw && itemPump.value.finish_kw) {
        for (let i = +itemPump.value.start_kw; i < +itemPump.value.finish_kw; i = i + +itemPump.value.step_kw) {

          try {
            let y = eval(itemPump.value.formuls_kw.replace(/x/g, i.toString()))
            console.log(y)
            coordinatesKw.value.push({
              x: +i.toFixed(2),
              y: +y.toFixed(2),
            })

          } catch (err) {
            console.log(err)
            return

          }

        }
        if (coordinatesKw.value[coordinatesKw.value.length - 1] != itemPump.value.finish_kw) {
          let y = eval(itemPump.value.formuls_kw.replace(/x/g, itemPump.value.finish_kw.toString()))
          coordinatesKw.value.push({
            x: +itemPump.value.finish_kw,
            y: +y.toFixed(2),
          })
        }

      }

      optionsKw.scales = {y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'H(Kw)',
        },
        min: +itemPump.value.miny_kw.toString(),
          max: +itemPump.value.maxy_kw.toString(),
            ticks: {
        // @ts-ignore
        stepSize: itemPump.value.step_y_kw != "---" ? itemPump.value.step_y_kw : '10'
      }
    },
    x: {
      beginAtZero: true,
        title: {
        display: true,
          text: 'Q(м³/h)',
        },
      min: +itemPump.value.minx_kw.toString(),
        max: +itemPump.value.maxx_kw.toString(),
          ticks: {
        // @ts-ignore
        stepSize: itemPump.value.step_x_kw != "---" ? itemPump.value.step_x_kw : '10'
      }
    }
  }
      chartDataKw.datasets[0].data = coordinatesKw

      if (itemPump.value && itemPump.value.start_npsh && itemPump.value.finish_npsh) {
        for (let i = +itemPump.value.start_npsh; i < +itemPump.value.finish_npsh; i = i + +itemPump.value.step_npsh) {

          try {
            let y = eval(itemPump.value.formuls_npsh.replace(/x/g, i.toString()))
            console.log(y)
            coordinatesNpsh.value.push({
              x: +i.toFixed(2),
              y: +y.toFixed(2),
            })

          } catch (err) {
            console.log(err)
            return

          }

        }
        if (coordinatesNpsh.value[coordinatesNpsh.value.length - 1] != itemPump.value.finish_npsh) {
          let y = eval(itemPump.value.formuls_npsh.replace(/x/g, itemPump.value.finish_npsh.toString()))
          coordinatesNpsh.value.push({
            x: +itemPump.value.finish_npsh,
            y: +y.toFixed(2),
          })
        }

      }


        optionsNpsh.scales = {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'H(%)',
          },
          min: +itemPump.value.miny_npsh.toString(),
          max: +itemPump.value.maxy_npsh.toString(),
          ticks: {
            // @ts-ignore
            stepSize: itemPump.value.step_y_npsh != "---" ? itemPump.value.step_y_npsh : '10'
          }
        },
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Q(м³/h)',
          },
          min: +itemPump.value.minx_npsh.toString(),
          max: +itemPump.value.maxx_npsh.toString(),
          ticks: {
            // @ts-ignore
            stepSize: itemPump.value.step_x_npsh != "---" ? itemPump.value.step_x_npsh : '10'
          }
        }
      }
      chartDataNpsh.datasets[0].data = coordinatesNpsh


      
    }

    console.log(itemPump)

    const options2 = {

      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'H(m)',
        },
        min: +itemPump.value.miny.toString(),
        max: +itemPump.value.maxy.toString(),
        ticks: {
          // @ts-ignore
          stepSize: itemPump.value.step_y != "---" ? itemPump.value.step_y : '10'
        }
      },
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Q(м³/h)',
        },
        min: +itemPump.value.minx.toString(),
        max: +itemPump.value.maxx.toString(),
        ticks: {
          // @ts-ignore
          stepSize: itemPump.value.step_x != "---" ? itemPump.value.step_x : '10'
        }
      },

    }


    const chartData2 = coordinates.value


    chartData.datasets[0].data = chartData2
    chartData.datasets[0].label = `${itemPump.value.name}`
    options.scales = options2

    // @ts-ignore
    if (pumpSelect.pumpY && pumpSelect.pumpY) {
      addWorkPoint()
      // chartData.datasets[1].data = [{ 'x': pumpSelect.pumpX, 'y': pumpSelect.pumpY }]
      // // @ts-ignore
      // options.plugins.annotation.annotations = {
      //   // @ts-ignore
      //   line1: {
      //     type: 'line',
      //     yMin: pumpSelect.pumpY,
      //     yMax: pumpSelect.pumpY,
      //     xMin: 0,
      //     xMax: pumpSelect.pumpX,
      //     borderColor: 'rgb(255, 99, 132)',
      //     borderWidth: 2,
      //     borderDash: [5, 5],
      //   },
      //   line2: {
      //     type: 'line',
      //     yMin: 0,
      //     yMax: pumpSelect.pumpY,
      //     xMin: pumpSelect.pumpX,
      //     xMax: pumpSelect.pumpX,
      //     borderColor: 'rgb(255, 99, 132)',
      //     borderWidth: 2,
      //     borderDash: [5, 5],
      //   },
      //   line3: {
      //     type: 'label',
      //     // @ts-ignore
      //     xValue: pumpSelect.pumpX + 15,
      //     // @ts-ignore
      //     yValue: pumpSelect?.pumpY + 15,
      //     borderColor: 'rgb(255, 99, 132)',
      //     borderWidth: 1,
      //     // borderDash: [5, 5],
      //     backgroundColor: 'rgba(255,255,255)',
      //     content: [`Q(м³/h) = ${pumpSelect.pumpX}, H(m) = ${pumpSelect.pumpY}`],
      //     font: {
      //       size: 12,
      //     },
      //   },
      //   line4: {
      //     type: 'label',
      //     width: widthChart?.width,
      //     height: widthChart?.height,
      //     content: getImage(),
      //     font: {
      //       size: 60,
      //     },

      //     opacity: 0.1
      //   },
      // }
    } else {
      chartData.datasets[1].data = []
      // @ts-ignore
      options.plugins.annotation.annotations = {
        // @ts-ignore
        line1: {
          type: 'label',
          width: widthChart?.width,
          height: widthChart?.height,
          content: getImage(),
          font: {
            size: 60,
          },

          opacity: 0.1
        },
      }
    }


  }
}




interface IData {
  field: string,
  header: string,
  warn: number
}

const columns = ref<IData[]>([
  { field: 'type', header: 'Тип', warn: 1 },
  { field: 'nominal_q', header: 'Расход Q (м³/ч)', warn: 2 },
  { field: 'nominal_h', header: 'Напор H (м.в.ст.)', warn: 3 },
  { field: 'diameter', header: 'Диаметр выхода', warn: 4 },
  { field: 'power', header: 'Мощность кВт', warn: 5 },
  { field: 'speed', header: 'Скорость', warn: 6 },
  { field: 'phase', header: 'Фаза', warn: 7 },
  { field: 'frequency', header: 'Частота (Hz)', warn: 8 },
  { field: 'voltage', header: 'Напряжение (V)', warn: 9 },
  { field: 'launch', header: 'Запуск', warn: 10 },
  { field: 'efficiency', header: 'КПД (%)', warn: 11 },
  { field: 'pole', header: 'Количество полюсов', warn: 12 },
  { field: 'note', header: 'Комментарий', warn: 13 },
])
const selectedColumns = ref<IData[]>([
  { field: 'type', header: 'Тип', warn: 1 },
  { field: 'nominal_q', header: 'Расход Q (м³/ч)', warn: 2 },
  { field: 'nominal_h', header: 'Напор H (м.в.ст.)', warn: 3 },
  { field: 'diameter', header: 'Диаметр выхода', warn: 4 },
  { field: 'power', header: 'Мощность кВт', warn: 5 },
  { field: 'speed', header: 'Скорость', warn: 6 },
  { field: 'phase', header: 'Фаза', warn: 7 },
  { field: 'note', header: 'Комментарий', warn: 13 },

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
// @ts-ignore
const changes = (e) => {
  // @ts-ignore
  pumpSelect.image = types.value.find(elem => elem.type == e.value).image
}




const chartData = reactive({

  datasets: [
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
      order: 2,
    },
    {
      label: 'Рабочая точка',
      data: [],
      borderColor: 'red',
      borderWidth: 2,
      pointBackgroundColor: 'red', // Цвет точек
      order: 1,
      // pointRadius: [5, 5, 5, 10, 0, 5, 5], // Размеры точек (0 для между точек)
    },
  ],
})


const { bubbleChartProps } = useBubbleChart({
  // @ts-ignore
  chartData,
  options,
})

const textForNull = (item: string | number | null | undefined) => {
  if (!item || item == '' || item == 'null') {
    return '---'
  } else {
    return item
  }
}

const downloadPdf = async () => {

  options.plugins.annotation.annotations.line1.opacity = 0


  setTimeout(() => {

    if (!itemPump.value) {
      message.title = 'Выберите насос'
      message.text = 'Для скачивания листа подбора, выберите насос из списка'
      errorModal.value = true
      return
    }

    pdfmake.fonts = {
      DaysSansBlack: {
        normal: `${APIPDF}fonts/Days-Sans-Black.ttf`,
        bold: `${APIPDF}fonts/Days-Sans-Black.ttf`,
        italics: `${APIPDF}fonts/Days-Sans-Black.ttf`,
        bolditalics: `${APIPDF}fonts/Days-Sans-Black.ttf`
      },
      Roboto: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
      },
    }


    loadingPdf.value = true
    let canvas = document.getElementById('bubble-chart')
    // @ts-ignore
    let docinfo = pdfGenerate(itemPump, pumpSelect, date, canvas.toDataURL())

    pdfmake.createPdf(docinfo).download(`Волга ${itemPump.value.name}.pdf`)
      .then(() => {
        loadingPdf.value = false
        options.plugins.annotation.annotations.line1.opacity = 0.1
      })



  }, 300)




}


const allPump = () => {
  if (pumpSelect.type == 'Любой') {
    pumpsEventModal.value = pumps.value
  } else {
    let arrayType = pumpSelect.type.split('/')
    // pumpsEventModal.value = pumps.value.filter(el => el.type == pumpSelect.type)
    pumpsEventModal.value = pumps.value.filter(el => {
      let arrayTypeEl = el.type.toString().split('/')
      return arrayType.every((e) => arrayTypeEl.includes(e))
    })

  }
  pumpsModal.value = true
}

const sendMessage = () => {

  let formData = new FormData()

  formData.append("msg", messageTextForSend.value)

  axios.post(`${API}api/vendor/send.php`, formData)
    .then(response => {
      console.log(response)
      messageTextForSend.value = ''
      useStore.showToast({ type: 'success', title: 'Спасибо!', text: `Сообщение отправлено` })
      messageModal.value = false
    }).catch(() => {

      useStore.showToast({ type: 'error', title: 'Ошибка!', text: `Попробуйте позднее...` })
    })
    .finally(() => {
      messageTextForSend.value = ''
      messageModal.value = false
    })
}

// const ttt = () => {
//   document.querySelector(".p-multiselect-filter-container").innerHTML="Все столбцы"
// }

const valueWithRowNumbers = computed(() => {
  // @ts-ignore 
  return pumpsEvent.value.map((item, index) => {
    return { ...item, rowNumber: index + 1 }
  })
})

const valueWithRowNumbersModal = computed(() => {

  if (pumpsEventModal.value) {
    return pumpsEventModal.value.map((item, index) => {
      return { ...item, rowNumber: index + 1 }
    })
  } else {
    return []
  }

})

// workPointSelect.pumpY
const getOptionsForWorkPoint = (q: string, h: string, formuls:string, seriasWQA: boolean) => {
  const x = workPointSelect.pumpX
  return {
    line1: {
      type: 'line',
      yMin: seriasWQA ? workPointSelect.pumpY : eval(formuls.toString()),
      yMax: seriasWQA ? workPointSelect.pumpY : eval(formuls.toString()),
      xMin: 0,
      xMax: workPointSelect.pumpX,
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 2,
      borderDash: [5, 5],
    },
    line2: {
      type: 'line',
      yMin: 0,
      yMax: seriasWQA ? workPointSelect.pumpY : eval(formuls.toString()),
      xMin: workPointSelect.pumpX,
      xMax: workPointSelect.pumpX,
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 2,
      borderDash: [5, 5],
    },
    line3: {
      type: 'label',
      // @ts-ignore
      xValue: workPointSelect.pumpX ,
      // @ts-ignore
      yValue: seriasWQA ? workPointSelect.pumpY : eval(formuls.toString()),
      yAdjust: -30,
      xAdjust: 20,
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 1,
      // borderDash: [5, 5],
      backgroundColor: 'rgba(255,255,255)',
      content: [`${q} = ${workPointSelect.pumpX}, ${h} = ${seriasWQA ? workPointSelect.pumpY : eval(formuls.toString()).toFixed(2)}`],
      font: {
        size: 12,
      },
    },
    line4: {
      type: 'label',
      width: widthChart?.width,
      height: widthChart?.height,
      content: getImage(),
      font: {
        size: 60,
      },

      opacity: 0.1
    }
  }
}

const addWorkPoint = () => {
  const x = workPointSelect.pumpX
  

  chartData.datasets[1].data = [{ 'x': workPointSelect.pumpX, 'y': workPointSelect.pumpY }]
  options.plugins.annotation.annotations = getOptionsForWorkPoint('Q(м³/h)', 'H(m)', itemPump.value?.formuls, true)

  if (isSeriesPump(itemPump.value.name) == "TD") {
    xKw.value = eval(itemPump.value?.formuls_kw).toFixed(2)
    xNpsh.value = eval(itemPump.value?.formuls_npsh).toFixed(2)

      chartDataKw.datasets[1].data = [{ 'x': workPointSelect.pumpX, 'y': eval(itemPump.value?.formuls_kw) }]
  optionsKw.plugins.annotation.annotations = getOptionsForWorkPoint('Q(м³/h)', 'H(Kw)', itemPump.value?.formuls_kw, false )

  chartDataNpsh.datasets[1].data = [{ 'x': workPointSelect.pumpX, 'y': eval(itemPump.value?.formuls_npsh) }]
  optionsNpsh.plugins.annotation.annotations = getOptionsForWorkPoint('Q(м³/h)', 'H(%)', itemPump.value?.formuls_npsh, false)
  }


  
  pumpSelect.pumpX = workPointSelect.pumpX
  pumpSelect.pumpY = workPointSelect.pumpY

}





const optionsKw = reactive({
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
    },
     annotation: {
    annotations: {
      line1: {
        type: 'label',
        width: widthChart?.width,
        height: widthChart?.height,
        content: getImage(),
        font: {
          size: 60,
        },

        opacity: 0.1
      },
    }
  }
  },

})

const chartDataKw = reactive({

  datasets: [
    {
      type: "bubble",
      data: [],
      cubicInterpolationMode: "monotone",
      label: "Питание двигателя KW",
      fill: false,
      borderColor: 'rgb(245, 129, 66)',
      pointBackgroundColor: 'rgb(245, 129, 66)',
      pointRadius: 2,
      spanGaps: true,
      order: 2,
    },
      {
      label: 'Рабочая точка',
      data: [],
      borderColor: 'red',
      borderWidth: 2,
      pointBackgroundColor: 'red', // Цвет точек
      order: 1,
      // pointRadius: [5, 5, 5, 10, 0, 5, 5], // Размеры точек (0 для между точек)
    },
  ],
})

const optionsNpsh = reactive({
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
    },
      annotation: {
    annotations: {
      line1: {
        type: 'label',
        width: widthChart?.width,
        height: widthChart?.height,
        content: getImage(),
        font: {
          size: 60,
        },

        opacity: 0.1
      },
    }
  },
  },

})

const chartDataNpsh = reactive({

  datasets: [
    {
      type: "bubble",
      data: [],
      cubicInterpolationMode: "monotone",
      label: "NPSH в рабочей точке",
      fill: false,
      borderColor: 'rgb(11, 41, 230)',
      pointBackgroundColor: 'rgb(11, 41, 230)',
      pointRadius: 2,
      spanGaps: true,
      order: 2,
    },
      {
      label: 'Рабочая точка',
      data: [],
      borderColor: 'red',
      borderWidth: 2,
      pointBackgroundColor: 'red', // Цвет точек
      order: 1,
      // pointRadius: [5, 5, 5, 10, 0, 5, 5], // Размеры точек (0 для между точек)
    },
  ],
})

</script>

<template>
  {{ workPointSelect.pumpX }}
  <div class=" relative  flex flex-col h-dvh">

    <div class=" grow shrink-0">
      <div class="mx-auto max-w-7xl px-4 py-11 sm:px-6 lg:px-8 relative 2xl:max-w-screen-2xl">
        <div class="wrapper-logo">
          <a href="https://volga.su" target="_blank">
            <img class="wrapper-logo__img" :src="Logo" alt="logo" />
          </a>

        </div>

        <h4 class="text-center text-2xl font-semibold">ПРОГРАММА ПОДБОРА НАСОСНЫХ АГРЕГАТОВ</h4>
        <h4 class="text-center text-2xl font-semibold">"ВОЛГА" SELECT</h4>
        <h5 class="text-center text-xl font-semibold mt-12">ВЫБЕРИТЕ ТИП НАСОСНОГО АГРЕГАТА</h5>


        <div class="mt-10 sm:mt-20">
          <div class="flex flex-col flex-col-reverse sm:flex-row justify-center items-center gap-5">
            <div>
              <Dropdown class=" w-72" @change="changes" v-model="pumpSelect.type" :options="types" optionLabel="type"
                optionValue="type" placeholder="Тип насоса" />
            </div>
            <Image :src="pumpSelect.image" alt="насос" width="150" preview />
          </div>
        </div>

        <h5 class="text-center text-lg font-semibold mt-12">УКАЖИТЕ ВАШУ РАБОЧУЮ ТОЧКУ:</h5>

        <div>
          <div class="flex justify-center items-center gap-5 mt-5">
            <label>Расход (Q)
            </label>
            <InputGroup class=" w-48 sm:w-60">
              <InputNumber v-model="pumpSelect.pumpX" :minFractionDigits="1" inputId="withoutgrouping" />
              <InputGroupAddon class=" w-16">м³/ч</InputGroupAddon>
            </InputGroup>

          </div>
          <div class="flex justify-center items-center gap-5 mt-5">
            <label>Напор (H)
            </label>
            <InputGroup class=" w-48 sm:w-60">
              <InputNumber v-model="pumpSelect.pumpY" :minFractionDigits="1" inputId="withoutgrouping" />
              <InputGroupAddon class=" w-16">м.в.ст.</InputGroupAddon>
            </InputGroup>
          </div>

        </div>
        <div class="flex justify-center items-center gap-5 mt-5">
          <Button class=" w-full sm:w-1/3" @click="findPump" label="ПОДОБРАТЬ" />
        </div>

        <div class="flex justify-center items-center gap-5 mt-5">
          <Button class="w-3/4 sm:w-1/4" severity="secondary" @click="allPump" label="СПИСОК ВСЕХ НАСОСОВ" />
        </div>

      </div>

      <div v-if="pumpsEvent.length > 0" class="mx-auto max-w-full px-4 py-6 sm:px-4 lg:px-4 ">
        <DataTable paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} до {last}, из {totalRecords}" v-model:filters="filters"
          :globalFilterFields="['name', 'type']" showGridlines resizableColumns columnResizeMode="expand"
          :loading="loading" :value="valueWithRowNumbers" stripedRows tableStyle="min-width: 50rem">

          <template #header>
            <div class="flex justify-content-end mb-3">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="filters['global'].value" placeholder="Поиск" />
              </span>
            </div>
            <div style="text-align:left">
              <p class="mb-2">Выбранные поля:</p>
              <MultiSelect class="w-full " emptyFilterMessage="Не найдено" filter :modelValue="selectedColumns"
                :options="columns" optionLabel="header" @update:modelValue="onToggle" display="chip"
                placeholder="Выберете столбец" />
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
            <template #body="slotProps">
              <a href="#chart" class="cursor-pointer text-blue-700 underline hover:text-blue-900"
                @click="showChartData(slotProps.data.id)">
                {{
                  slotProps.data.name }}
              </a>
            </template>
          </Column>
          <Column sortable v-for="(col, index) of selectedColumns" :field="col.field" :header="col.header"
            :key="col.field + '_' + index" :pt="{
              root: { style: { textAlign: 'center' } },
              headerTitle: { style: { textAlign: 'center', width: '100%' } }
            }">

          </Column>


        </DataTable>
        <div class="mx-auto max-w-7xl py-6 sm:px-6 mt-10 2xl:max-w-screen-2xl max-w">
          <div class="flex flex-col lg:flex-row items-center lg:items-start justify-center  gap-5">
            <div class="flex flex-col justify-center items-center gap-5 sm:w-1/2">
              <div id="chart" class="w-full ">
              <BubbleChart class="chart-wrapper" ref="chartRef" v-bind="bubbleChartProps" />

              <div>
                <div v-if="isWorkPointBlock">
                  <div class="flex justify-center items-center gap-5 mt-5">
                    <label>Расход (Q)
                    </label>
                    <InputGroup class=" w-48 sm:w-60">
                      <InputNumber v-model="workPointSelect.pumpX" :minFractionDigits="1" inputId="withoutgrouping" />
                      <InputGroupAddon class=" w-16">м³/ч</InputGroupAddon>
                    </InputGroup>

                  </div>
                  <div class="flex justify-center items-center gap-5 mt-5">
                    <label>Напор (H)
                    </label>
                    <InputGroup class=" w-48 sm:w-60">
                      <InputNumber v-model="workPointSelect.pumpY" :minFractionDigits="1" inputId="withoutgrouping" />
                      <InputGroupAddon class=" w-16">м.в.ст.</InputGroupAddon>
                    </InputGroup>
                  </div>
                  <div class="flex justify-center items-center gap-5 mt-5">
                    <Button class=" w-full sm:w-1/3" @click="addWorkPoint" label="НАНЕСТИ ТОЧКУ" />
                  </div>

                </div>
              </div>


            </div>
        
       
              <div id="chartKw" v-if="isShowChartsWQA" class="w-full  ">
              <BubbleChart class="chart-wrapper" :chartData="chartDataKw" :options="optionsKw" />

             </div>
             <div id="chartNpsh" v-if="isShowChartsWQA" class="w-full  ">
                <BubbleChart class="chart-wrapper" :chartData="chartDataNpsh" :options="optionsNpsh" />

               </div>
            </div>
            
        
             
            <div class=" w-full sm:w-1/2 ">
              <table class="table">
                <tbody>
                  <tr>
                    <td colspan="2">Модель насоса</td>
                    <td data-settings="name">{{ itemPump?.name }}</td>
                  </tr>
                  <tr>
                    <td colspan="2">Тип насоса</td>
                    <td class="type-out">{{ textForNull(itemPump?.type) }}</td>
                  </tr>
                  <tr>
                    <td rowspan="3" class="text-vertical">Фактическая характеристика</td>
                    <td>Расход Q (м³/ч)</td>
                    <td data-settings="x">{{ textForNull(pumpSelect.pumpX) }}</td>
                  </tr>
                  <tr>
                    <td>Напор H (м.в.ст.)</td>
                    <td data-settings="y"> {{ textForNull(pumpSelect.pumpY) }}</td>
                  </tr>
                  <tr>
                    <td>Диаметр выхода</td>
                    <td class="diameter-out">{{ textForNull(itemPump?.diameter) }}</td>
                  </tr>

                  <tr v-if="itemPump?.efficiency">
                      <td colspan="2">КПД (%)</td>
                      <td class="efficiency-out">{{ textForNull(itemPump?.efficiency) }}</td>
                    </tr>
                  <tr v-if="itemPump?.formuls_kw">
                    <td colspan="2">Питание двигателя в рабочей точке, кВт</td>
                    <td class="efficiency-out">{{ xKw }}</td>
                  </tr>
                  <tr v-if="itemPump?.formuls_npsh">
                    <td colspan="2">NPSH в рабочей точке</td>
                    <td class="efficiency-out">{{ xNpsh }}</td>
                  </tr>
                  <tr v-if="itemPump?.power">
                    <td colspan="2">Мощность (кВт)</td>
                    <td class="power-out">{{ textForNull(itemPump?.power) }}</td>
                  </tr>
                  <tr v-if="itemPump?.speed">
                    <td colspan="2">Скорость вращения вала (rpm)</td>
                    <td class="speed-out">{{ textForNull(itemPump?.speed) }}</td>
                  </tr>
                  <tr v-if="itemPump?.frequency">
                    <td colspan="2">Частота переменного тока (Hz)</td>
                    <td class="frequency-out">{{ textForNull(itemPump?.frequency) }}</td>
                  </tr>
                  <tr v-if="itemPump?.phase">
                    <td colspan="2">Количество фаз</td>
                    <td class="phase-out">{{ textForNull(itemPump?.phase) }}</td>
                  </tr>
                  <tr v-if="itemPump?.pole">
                    <td colspan="2">Количество полюсов</td>
                    <td class="pole-out">{{ textForNull(itemPump?.pole) }}</td>
                  </tr>
                  <tr v-if="itemPump?.voltage">
                    <td colspan="2">Номинальное напряжение, V</td>
                    <td class="voltage-out">{{ textForNull(itemPump?.voltage) }}</td>
                  </tr>
                  <tr v-if="itemPump?.launch">
                    <td colspan="2">Способ запуска</td>
                    <td class="launch-out">{{ textForNull(itemPump?.launch) }}</td>
                  </tr>
                  <tr v-if="itemPump?.seal">
                    <td colspan="2">Торцевое уплотнение</td>
                    <td class="seal-out">{{ textForNull(itemPump?.seal) }}</td>
                  </tr>
                  <tr v-if="itemPump?.shaft_standart">
                    <td colspan="2">Материал вала</td>
                    <td class="shaft-out">{{ textForNull(itemPump?.shaft_standart) }}</td>
                  </tr>
                  <tr v-if="itemPump?.wheel_standart">
                    <td colspan="2">Материал насоса и рабочего колеса</td>
                    <td class="pump-out">{{ textForNull(itemPump?.wheel_standart) }}</td>
                  </tr>
                  <tr v-if="itemPump?.bar">
                    <td colspan="2">Рабочее давление, бар</td>
                    <td class="bar-out">{{ textForNull(itemPump?.bar) }}</td>
                  </tr>
                  <tr v-if="itemPump?.current_strength">
                    <td colspan="2">Номинальная сила тока, А</td>
                    <td class="strength-out">{{ textForNull(itemPump?.current_strength) }}</td>
                  </tr>
                  <tr v-if="itemPump?.ip">
                    <td colspan="2">Степень защиты, IP</td>
                    <td class="ip-out">{{ textForNull(itemPump?.ip) }}</td>
                  </tr>
                  <tr v-if="itemPump?.bolt">
                      <td colspan="2">Болт</td>
                      <td class="ip-out">{{ textForNull(itemPump?.bolt) }}</td>
                    </tr>
                    <tr v-if="itemPump?.coupling">
                      <td colspan="2">Муфта</td>
                      <td class="ip-out">{{ textForNull(itemPump?.coupling) }}</td>
                    </tr>
                    <tr v-if="itemPump?.rpm">
                      <td colspan="2">Обороты</td>
                      <td class="ip-out">{{ textForNull(itemPump?.rpm) }}</td>
                    </tr>
                    <tr v-if="itemPump?.dn">
                        <td colspan="2">Диаметр выпускного коллектора, DN</td>
                        <td class="ip-out">{{ textForNull(itemPump?.dn) }}</td>
                      </tr>
                  <tr v-if="itemPump?.weight">
                    <td colspan="2">Вес</td>
                    <td class="weight-out">{{ textForNull(itemPump?.weight) }}</td>
                  </tr>
                  <tr>
                    <td colspan="2">Примечание</td>
                    <td class="note-out">{{ textForNull(itemPump?.note) }}</td>
                  </tr>

                  <tr>
                    <td colspan="3">
                      <p class="text-center">
                        С дополнительными данными, можно ознакомиться в каталоге
                        насосных агрегатов по ссылке -
                        <a class="text-center text-sky-600 underline hover:text-sky-800" href="https://volga.su/catalog"
                          target="_blank">КАТАЛОГ</a>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3">
                      <p class="text-center">
                        Ознакомится с ценами на насосные агрегаты -
                        <a class="text-center text-sky-600 underline hover:text-sky-800" href="https://volga.su/price"
                          target="_blank">Прайс</a>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>

              <Button class=" w-full" :loading="loadingPdf" @click="downloadPdf" label="СКАЧАТЬ ЛИСТ ПОДБОРА" />
              <Button v-if="orderList" class="mt-5 w-full" @click="contactModal = true" :label="orderList" />
            </div>
          </div>
        </div>


      </div>

      <div class="mt-5 flex justify-center pb-10">
        <div @click="messageModal = true"
          class="mt-10 pt-4 pb-4 pr-8 pl-8 border border-red-600 text-red-500 hover:text-red-700 hover:border-red-700 cursor-pointer">
          <p class="text-center text-danger">СООБЩИТЬ ОБ ОШИБКЕ</p>
          <p class="text-center text-danger">ВНЕСТИ ПРЕДЛОЖЕНИЕ</p>
        </div>
      </div>
    </div>


    <Footer></Footer>

  </div>


  <Dialog v-model:visible="pumpsModal" dismissableMask modal :header="pumpSelect.type" :pt="{
    root: { class: 'w-full' }
  }">
    <DataTable paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} до {last}, из {totalRecords}" v-model:filters="filters"
      :globalFilterFields="['name', 'type']" showGridlines resizableColumns columnResizeMode="expand" :loading="loading"
      :value="valueWithRowNumbersModal" stripedRows tableStyle="min-width: 50rem">

      <template #header>
        <div class="flex justify-content-end mb-3">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Поиск" />
          </span>
        </div>
        <div style="text-align:left">
          <p class="mb-2">Выбранные поля:</p>
          <MultiSelect class="w-full " filter emptyFilterMessage="Не найдено" :modelValue="selectedColumns"
            :options="columns" optionLabel="header" @update:modelValue="onToggle" display="chip"
            placeholder="Выберете столбец" />
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

      <Column field="name" header="Название" style="width: 350px" :pt="{
        root: { style: { textAlign: 'center' } },
        headerTitle: { style: { textAlign: 'center', width: '100%' } }
      }">
        <template #body="slotProps">
          <p class="cursor-pointer text-blue-700 underline hover:text-blue-900"
            @click="showChartDataInModal(slotProps.data.id)"> {{
              slotProps.data.name }}
          </p>
        </template>
      </Column>
      <Column sortable v-for="(col, index) of selectedColumns" :field="col.field" :header="col.header"
        :key="col.field + '_' + index" :pt="{
          root: { style: { textAlign: 'center' } },
          headerTitle: { style: { textAlign: 'center', width: '100%' } }
        }">

      </Column>


    </DataTable>
  </Dialog>


  <Dialog v-model:visible="errorModal" modal :header="message.title" dismissableMask :closable="false" :pt="{
    root: 'border-none',
    title: {
      style: 'text-align: center;width: 100%'
    },
    footer: {
      style: 'text-align: center;width: 100%'
    }
  }">
    <div class="flex flex-col justify-center items-center">
      <InlineMessage severity="error"> {{ message.text }} </InlineMessage>

    </div>
    <template #footer>
      <Button class="w-20" severity="secondary" label="OK" @click="errorModal = false" />
    </template>
  </Dialog>

  <Dialog v-model:visible="messageModal" modal header="ЗАМЕЧАНИЯ И ПРЕДЛОЖЕНИЯ" :style="{ width: '30rem' }"
    dismissableMask :closable="false" :pt="{
      root: 'border-none',
      title: {
        style: 'text-align: center;width: 100%'
      },
      footer: {
        style: 'text-align: center;width: 100%'
      }
    }">
    <p>Опишите ваше замечание или предложение:</p>
    <Textarea class=" w-full" v-model="messageTextForSend" autoResize rows="5" />
    <template #footer>
      <Button label="Отправить" @click="sendMessage" />
      <Button severity="secondary" label="Отмена" @click="messageModal = false" />
    </template>

  </Dialog>

  <Dialog v-model:visible="contactModal" modal :showHeader="false" dismissableMask :closable="false" :pt="{
    root: 'border-none',
    title: {
      style: 'text-align: center;width: 100%'
    },
    footer: {
      style: 'text-align: center;width: 100%'
    }
  }">
    <ContactForm :pumpname="itemPump?.name ? { name: itemPump.name } : { name: '' }" @closeModal="closeModal">
    </ContactForm>
  </Dialog>
</template>

<style scope>
.chart-wrapper {
  width: 100%;
  aspect-ratio: 1 / 1;
}

.table {
  border: 1px solid #eee;
  table-layout: fixed;
  width: 100%;
  margin-bottom: 20px;
}

.table th {
  font-weight: bold;
  padding: 5px;
  background: #efefef;
  border: 1px solid #dddddd;
  width: 350px;
}

.table td {
  padding: 5px 10px;
  border: 1px solid #eee;
  text-align: left;
  width: 150px;
}

.table tbody tr:nth-child(odd) {
  background: #fff;
}

.table tbody tr:nth-child(even) {
  background: #f7f7f7;
}

.w-full.p-dialog {
  width: 100vw !important;
  height: 100vh !important;
  top: 0px;
  left: 0px;
  max-height: 100%;
}

.w-full .p-dialog-content {

  height: 100%;
}

.wrapper-logo__img {
  position: absolute;
  width: 200px;
  top: 39px;
  left: 83px;
}

.p-datatable-resizable-table>.p-datatable-thead>tr>th,
.p-datatable-resizable-table>.p-datatable-tfoot>tr>td,
.p-datatable-resizable-table>.p-datatable-tbody>tr>td {

  white-space: wrap;
}

@media (max-width: 1200px) {

  .text-vertical {
    transform: rotate(-90deg);
    align-items: center;
    text-align: center;
    padding: 0 !important;
    font-size: 14px;
  }

  .wrapper-logo {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  .wrapper-logo__img {
    position: static;
    margin: 0 auto;
    width: 200px;
  }
}

@media (max-width: 480px) {
  .chart-wrapper {
    width: 100%;

  }
}</style>
