import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import session from "./sessionMethods";
// import sharedScripts from "./sharedScripts";

// createApp(App).use(store).use(router).mount('#app')

import mitt from 'mitt'

const eventBus = mitt()
const app = createApp(App)

app.use(router)

app.config.globalProperties.eventBus = eventBus
app.mount('#app')

const appCurrentVersion = APP_VERSION;
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const reCaptchaSiteKey = import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY;

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

const addUserLog = async (appState, actionPerformed = "") => {
	try {
		let body = {
			userId: appState.user.userId,
			userName: appState.user.userName,
			actionPerformed: actionPerformed,
		};

		let headerObj = new Headers();
		headerObj.append("Authorization", `Bearer ${appState.accessToken}`);
		headerObj.append("Content-Type", "application/json; charset=utf-8");
		let requestUrl = new URL("/api/userlogs", baseUrl);

		let request = new Request(
			requestUrl.toString(), {
			method: 'POST',
			headers: headerObj,
			body: JSON.stringify(body)
		});

		const response = await fetch(request);
		data = await response.json();

		console.log(data);

	} catch (error) {
		let postStatus = {};
		console.error('Error posting data:', error);
		postStatus.code = 400;
		postStatus.message = `Error posting data: ${error}`;
		postStatus.success = false;
		console.log(postStatus);
	}
}

// Global variables
app.config.globalProperties.appCurrentVersion = appCurrentVersion;
app.config.globalProperties.baseUrl = baseUrl;
app.config.globalProperties.reCaptchaSiteKey = reCaptchaSiteKey;
app.config.globalProperties.appNotify = appNotify;
app.config.globalProperties.dateOptions = dateOptions;
app.config.globalProperties.timeOptions = timeOptions;
app.config.globalProperties.toTitleCase = toTitleCase;
app.config.globalProperties.isUTCtime = isUTCtime;
app.config.globalProperties.addUserLog = addUserLog;
