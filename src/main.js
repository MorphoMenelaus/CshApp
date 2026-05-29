import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import sessionMethods from "./sessionMethods";
// import sharedScripts from "./sharedScripts";

// createApp(App).use(store).use(router).mount('#app')

import mitt from 'mitt'

const eventBus = mitt()
const app = createApp(App)

app.use(router)

app.config.globalProperties.eventBus = eventBus
app.mount('#app')

const appCurrentVersion = APP_VERSION;

// Global variables
app.config.globalProperties.appCurrentVersion = appCurrentVersion;
