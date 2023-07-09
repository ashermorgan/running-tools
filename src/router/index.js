import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        title: null,
        back: null,
      },
    },
    {
      path: '/calculate',
      redirect: '/home',
    },
    {
      path: '/calculate/paces',
      name: 'calculate-paces',
      component: () => import('../views/PaceCalculator.vue'),
      meta: {
        title: 'Pace Calculator',
        back: 'home',
      },
    },
    {
      path: '/calculate/races',
      name: 'calculate-races',
      component: () => import('../views/RaceCalculator.vue'),
      meta: {
        title: 'Race Calculator',
        back: 'home',
      },
    },
    {
      path: '/calculate/splits',
      name: 'calculate-splits',
      component: () => import('../views/SplitCalculator.vue'),
      meta: {
        title: 'Split Calculator',
        back: 'home',
      },
    },
    {
      path: '/calculate/units',
      name: 'calculate-units',
      component: () => import('../views/UnitCalculator.vue'),
      meta: {
        title: 'Unit Calculator',
        back: 'home',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../views/Error404.vue'),
    },
  ]
})

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - Running Tools`
  } else {
    document.title = 'Running Tools'
  }
})

export default router
