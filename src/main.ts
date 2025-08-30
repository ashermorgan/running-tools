import { createApp } from 'vue';

import App from '@/App.vue';
import router from '@/router';
import { migrateLocalStorage } from '@/core/migrations';

import '@/assets/global.css';

migrateLocalStorage();

const app = createApp(App);
app.use(router);
app.mount('#app');
