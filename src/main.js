import './assets/global.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// TODO: fix service worker
// import './registerServiceWorker.js'

const app = createApp(App)

app.use(router)

app.mount('#app')
