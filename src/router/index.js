import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import PaceCalculator from '../views/PaceCalculator.vue';

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
];

const router = new VueRouter({
  routes
});

export default router;
