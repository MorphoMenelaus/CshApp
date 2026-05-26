import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// createApp(App).use(store).use(router).mount('#app')

import mitt from 'mitt'

const eventBus = mitt()
const app = createApp(App)

app.use(router)

app.config.globalProperties.eventBus = eventBus
app.mount('#app')

const appCurrentVersion = APP_VERSION;

const object = {
    something: "word",
    somethingelse: "Silence"
};

// Global variables
app.config.globalProperties.appCurrentVersion = appCurrentVersion;
app.config.globalProperties.testingGlobals = object;