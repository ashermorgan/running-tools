import { createApp } from 'vue';

import App from '@/App.vue';
import router from '@/router';
import * as storage from '@/utils/storage';

import '@/assets/global.css';

storage.migrate();

const app = createApp(App);
app.use(router);
app.mount('#app');
