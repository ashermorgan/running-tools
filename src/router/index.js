import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import PaceCalculator from '../views/PaceCalculator.vue';
import UnitCalculator from '../views/UnitCalculator.vue';

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
    redirect: '/home',
  },
];

const router = new VueRouter({
  routes,
});

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - running-calculator`;
  } else {
    document.title = 'running-calculator';
  }
});

export default router;
