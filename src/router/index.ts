import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import AboutPage from '@/views/AboutPage.vue';
import BatchCalculator from '@/views/BatchCalculator.vue';
import ChangeLog from '@/views/ChangeLog.vue';
import PaceCalculator from '@/views/PaceCalculator.vue';
import RaceCalculator from '@/views/RaceCalculator.vue';
import SplitCalculator from '@/views/SplitCalculator.vue';
import WorkoutCalculator from '@/views/WorkoutCalculator.vue';
import UnitCalculator from '@/views/UnitCalculator.vue';
import NotFoundPage from '@/views/NotFoundPage.vue';

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
      component: HomePage,
      meta: {
        title: null,
        back: null,
      },
    },
    {
      path: '/about',
      name: 'about',
      component: AboutPage,
      meta: {
        title: 'About',
        back: 'home',
      },
    },
    {
      path: '/changelog',
      name: 'changelog',
      component: ChangeLog,
      meta: {
        title: 'Change Log',
        back: 'home',
      },
    },
    {
      path: '/calculate',
      redirect: '/home',
    },
    {
      path: '/calculate/batch',
      name: 'calculate-batch',
      component: BatchCalculator,
      meta: {
        title: 'Batch Calculator',
        back: 'home',
      },
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
      path: '/calculate/workouts',
      name: 'calculate-workouts',
      component: WorkoutCalculator,
      meta: {
        title: 'Workout Calculator',
        back: 'home',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      component: NotFoundPage,
    },
  ]
});

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - Running Tools`;
  } else {
    document.title = 'Running Tools';
  }
});

export default router;
