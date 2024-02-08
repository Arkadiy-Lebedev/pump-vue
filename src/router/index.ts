import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AddPump from '../views/AddPump.vue'
import EditPump from '../views/EditPump.vue'
import AddType from '../views/AddType.vue'
import Auth from '../views/Auth.vue'
import Settings from '../views/Settings.vue'
import PumpCalc from '../views/PumpCalc.vue'
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
          component: Home,
          meta: {
            needAuth: true
          }
        },
        {
          path: '/add-pump',
          name: 'add-pump',
          component: AddPump,
          meta: {
            needAuth: true
          }
        },
        {
          path: '/edit-pump/:id',
          name: 'edit-pump',
          component: EditPump,
          meta: {
            needAuth: true
          }
        },
        {
          path: '/settings/',
          name: 'settings',
          component: Settings,
          meta: {
            needAuth: true
          }
        },
        {
          path: '/add-type',
          name: 'add-type',
          component: AddType,
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
      ]
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth,
    },
{
      path: '/',
      name: 'pumpCalc',
      component: PumpCalc,
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
