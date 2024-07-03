

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { PDFPlugin } from 'vue3-pdfmake'
import router from './router'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Sidebar from 'primevue/sidebar'
import ConfirmPopup from 'primevue/confirmpopup'
import ConfirmationService from 'primevue/confirmationservice'
import Image from 'primevue/image'
import InlineMessage from 'primevue/inlinemessage'
import Panel from 'primevue/panel'
import Toast from 'primevue/toast';
import Fieldset from 'primevue/fieldset';
import Card from 'primevue/card';
import Divider from 'primevue/divider';

import Textarea from 'primevue/textarea';
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab';
import Dialog from 'primevue/dialog';
import InputSwitch from 'primevue/inputswitch';
import Tooltip from 'primevue/tooltip';
import MultiSelect from 'primevue/multiselect';
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputMask from 'primevue/inputmask';


import ToastService from 'primevue/toastservice';


import { Chart, registerables } from "chart.js"
Chart.register(...registerables)

import './index.css'
import 'primevue/resources/themes/saga-blue/theme.css'
// import "primevue/resources/primevue.min.css" /* Deprecated */
import 'primeicons/primeicons.css'


const app = createApp(App)
app.use(PrimeVue)

app.use(router)
app.use(ConfirmationService)
app.use(ToastService);
app.use(createPinia())
app.use(PDFPlugin);

app.directive('tooltip', Tooltip);

app.component('Button', Button)
app.component('InputText', InputText)
app.component('InputNumber', InputNumber)
app.component('Dropdown', Dropdown)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Sidebar', Sidebar)
app.component('ConfirmPopup', ConfirmPopup)
app.component('Image', Image)
app.component('InlineMessage', InlineMessage)
app.component('Panel', Panel)
app.component('Toast', Toast)
app.component('Fieldset', Fieldset)
app.component('Textarea', Textarea)
app.component('Card', Card)
app.component('Accordion', Accordion)
app.component('AccordionTab', AccordionTab)
app.component('Dialog', Dialog)
app.component('InputSwitch', InputSwitch)
app.component('MultiSelect', MultiSelect)
app.component('InputGroup', InputGroup)
app.component('InputGroupAddon', InputGroupAddon)
app.component('InputMask', InputMask)
app.component('Divider', Divider)

app.mount('#app')


window.addEventListener('vite:preloadError', () => {
    window.location.reload();
  });