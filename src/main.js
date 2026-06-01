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

const appStatus = {
	code: null,
	message: null,
	ok: true,
	userMustDismiss: false,
}

const dateOptions = {
	weekday: "long",
	year: "numeric",
	month: "long",
	day: "numeric",
	hour: "numeric",
	minute: "2-digit",
	second: "2-digit",
	hour12: false
}

const timeOptions = {
	hour: "numeric",
	minute: "2-digit",
	second: "2-digit"
}

const appCurrentVersion = APP_VERSION;

// Global variables
app.config.globalProperties.appCurrentVersion = appCurrentVersion;
app.config.globalProperties.appStatus = appStatus;
app.config.globalProperties.dateOptions = dateOptions;
app.config.globalProperties.timeOptions = timeOptions;
