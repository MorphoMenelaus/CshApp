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
const baseUrl = "https://cshapp.hardwick.design";

const appNotify = {
	code: null,
	message: null,
	success: true,
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

const toTitleCase = (str) => {
	let spaced = str.replace(/([a-z])([A-Z])/g, '$1 $2');
	return `${spaced.charAt(0).toUpperCase()}${spaced.slice(1)}`;
}

const isUTCtime = (str) => {
	// Regex strictly enforces a trailing Z or +00:00/ -00:00 offset
	let utcRegex = /^(?:.+)(Z|[+-]00:?00)$/;
	if (!utcRegex.test(str)) return false;

	// Ensure the string can be successfully parsed into a real date
	let date = new Date(str);
	return !isNaN(date.getTime());
}

// Global variables
app.config.globalProperties.appCurrentVersion = appCurrentVersion;
app.config.globalProperties.baseUrl = baseUrl;
app.config.globalProperties.appNotify = appNotify;
app.config.globalProperties.dateOptions = dateOptions;
app.config.globalProperties.timeOptions = timeOptions;
app.config.globalProperties.toTitleCase = toTitleCase;
app.config.globalProperties.isUTCtime = isUTCtime;
