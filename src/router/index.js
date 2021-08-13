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
  },
  {
    path: '/calculate',
    redirect: '/home',
  },
  {
    path: '/calculate/paces',
    name: 'calculate-paces',
    component: PaceCalculator,
  },
  {
    path: '/calculate/units',
    name: 'calculate-units',
    component: UnitCalculator,
  },
];

const router = new VueRouter({
  routes
});

export default router;
