import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: {
        title: null,
        back: null,
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: 'About',
        back: 'home',
      }
    },
    /*
     * TODO: add back in all routes
    {
      path: '/calculate',
      redirect: '/home',
    },
    {
      path: '/calculate/paces',
      name: 'calculate-paces',
      component: PaceCalculator,
      meta: {
        title: 'Pace Calculator',
        back: 'home',
      },
    },
    {
      path: '/calculate/races',
      name: 'calculate-races',
      component: RaceCalculator,
      meta: {
        title: 'Race Calculator',
        back: 'home',
      },
    },
    {
      path: '/calculate/splits',
      name: 'calculate-splits',
      component: SplitCalculator,
      meta: {
        title: 'Split Calculator',
        back: 'home',
      },
    },
    {
      path: '/calculate/units',
      name: 'calculate-units',
      component: UnitCalculator,
      meta: {
        title: 'Unit Calculator',
        back: 'home',
      },
    },
    {
      path: '*',
      component: Error404,
    },
    */
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
