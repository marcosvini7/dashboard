import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect: 'participacao-investidores',
    children: [
      {
        path: 'participacao-investidores',
        name: 'participacao-investidores',
        component: Home
      }, 
      {
        path: 'contratos-em-aberto',
        name: 'contratos',
        component: Home
      },  
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
