import Vue from 'vue';
import VueRouter from 'vue-router';
import Error404 from '@/views/Error404.vue';
import Home from '@/views/Home.vue';
import PaceCalculator from '@/views/PaceCalculator.vue';
import RaceCalculator from '@/views/RaceCalculator.vue';
import SplitCalculator from '@/views/SplitCalculator.vue';
import UnitCalculator from '@/views/UnitCalculator.vue';

Vue.use(VueRouter);

const routes = [
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
];

const router = new VueRouter({
  routes,
});

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - Running Tools`;
  } else {
    document.title = 'Running Tools';
  }
});

export default router;
