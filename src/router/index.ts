import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '../layout/MainLayout.vue'
import AddPumpsExel from '../views/AddPumpsExel.vue'
import axios from 'axios'
import { API } from "../api/api"

import { useUserStore } from '../stores/userStore'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/admin-select',
      component: MainLayout,
      children: [
        {
          path: '/admin-select',
          name: 'home',
          component: () => import('@/views/Home.vue'),
          meta: {
            needAuth: true
          }
        },
        {
          path: '/add-pump',
          name: 'add-pump-list',
          component: () => import('@/views/AddPumpList.vue'),
          meta: {
            needAuth: true
          }
        },
        {
          path: '/add-pump/wqa',
          name: 'add-pump',
          component: () => import('@/views/AddPump.vue'),
          meta: {
            needAuth: true
          }
        },
        {
          path: '/add-pump/td',
          name: 'add-pump-td',
          component: () => import('@/views/Td/AddPumpTd.vue'),
          meta: {
            needAuth: true
          }
        },
        {
          path: '/add-pump/cdlf',
          name: 'add-pump-cdlf',
          component: () => import('@/views/Cdlf/AddPumpCdlf.vue'),
          meta: {
            needAuth: true
          }
        },
        {
          path: '/edit-pump/wqa/:id',
          name: 'edit-pump',
          component: () => import('@/views/EditPump.vue'),
          meta: {
            needAuth: true
          }
        },
        {
          path: '/edit-pump/td/:id',
          name: 'edit-pump-td',
          component: () => import('@/views/Td/EditPumpTd.vue'),
          meta: {
            needAuth: true
          }
        },
        {
          path: '/edit-pump/cdlf/:id',
          name: 'edit-pump-cdlf',
          component: () => import('@/views/Cdlf/EditPumpCdlf.vue'),
          meta: {
            needAuth: true
          }
        },
        {
          path: '/settings/',
          name: 'settings',
          component: () => import('@/views/Settings.vue'),
          meta: {
            needAuth: true
          }
        },
        {
          path: '/add-type',
          name: 'add-type',
          component: () => import('@/views/AddType.vue'),
          meta: {
            needAuth: true
          }
        },
         {
          path: '/add-pamps-data',
          name: 'add-type-data',
           component: AddPumpsExel,
          meta: {
            needAuth: true
          }
        },
         {
          path: '/add-td-exel',
          name: 'add-td-exel',
           component: () => import('@/views/Td/AddPumpsExelTd.vue'),
          meta: {
            needAuth: true
          }
        },
         {
          path: '/add-cdlf-exel',
          name: 'add-cdlf-exel',
           component: () => import('@/views/Cdlf/AddPumpsExelCdlf.vue'),
          meta: {
            needAuth: true
          }
        },
      ]
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/Auth.vue'),
    },
{
      path: '/',
      name: 'pumpCalc',
      component: () => import('@/views/PumpCalc.vue'),
    },
  ]
})



router.beforeEach(async (to, from) => {
  const userStore = useUserStore()
if (to.meta.needAuth && !localStorage.getItem('jwt')) {
      return { name: "auth" }
} 

  if (to.meta.needAuth && localStorage.getItem('jwt')) {
    if (userStore.userInfo.id) {
      return
    } else {

  const resp = await axios.post(`${API}api/token/validate.php`, JSON.stringify({ "jwt": localStorage.getItem('jwt') }))
      if (resp.data.auth) {    
      console.log(resp.data)
      userStore.userInfo.id = resp.data.data.id
        userStore.userInfo.login = resp.data.data.name
      userStore.userInfo.role = resp.data.data.role
     return
    } else {
       return { name: "auth" }
    }

    }
 
  }
})

export default router
