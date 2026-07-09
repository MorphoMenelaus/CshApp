import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import session from "./sessionMethods";
// import sharedScripts from "./sharedScripts";

import mitt from 'mitt'

const eventBus = mitt()
const app = createApp(App)
app.use(router)

const allowedDomains = [
	import.meta.env.VITE_API_BASE_URL,
	import.meta.env.VITE_API_STAGING_URL
];
const origin = window.location.origin;
const baseUrl = allowedDomains.includes(origin) ? origin : "";

const appCurrentVersion = APP_VERSION;
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
	// strictly enforces a trailing Z or +00:00/ -00:00 offset
	let utcRegex = /^(?:.+)(Z|[+-]00:?00)$/;
	if (!utcRegex.test(str)) return false;

	// ensure the string can be successfully parsed into a real date
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

		await fetch(request);

	} catch (error) {
		let serverStatus = {};
		console.error('Error posting data:', error);
		serverStatus.code = 400;
		serverStatus.message = `Error posting data: ${error}`;
		serverStatus.success = false;
	}
}

const refreshAuthTokenAsNeeded = async (appState) => {
	let serverStatus = Object.assign({}, appNotify);

	// Server settings for Token expire is 1h
	// Give it 1 minute of wiggle room on expire time (60000ms)
	// Better to refresh a minute early than to cause a race condition error
	let expireMS = appState?.accessTokenExpiration - 60000;
	let currTime = new Date().getTime();
	if (currTime < expireMS) {
		serverStatus.code = 304;
		serverStatus.message = "Access Token unchanged";
		serverStatus.success = true;
		return serverStatus;
	}

	let body = {
		accessToken: appState?.accessToken,
		refreshToken: appState?.refreshToken,
	};

	try {

		let headerObj = new Headers();
		headerObj.append("Content-Type", "application/json; charset=utf-8");
		let requestUrl = new URL('/api/auth/refresh', baseUrl);

		let request = new Request(
			requestUrl.toString(), {
			method: 'POST',
			headers: headerObj,
			body: JSON.stringify(body)
		});

		let response = await fetch(request);
		const dataObj = await response.json();

		if (dataObj?.success) {
			let updateAppState = appState;
			updateAppState.accessToken = dataObj.authorization.accessToken;
			updateAppState.accessTokenExpiration = dataObj.authorization.accessTokenExpiration;
			updateAppState.refreshToken = dataObj.authorization.refreshToken;
			updateAppState.isLoggedOn = true;
			eventBus.emit("updateAppState", updateAppState);

			serverStatus.code = 200;
			serverStatus.message = "Access Token refeshed";
			serverStatus.success = true;
		} else {
			serverStatus = dataObj;
			eventBus.emit("updateStatus", serverStatus);
			eventBus.emit("forceLogout");
		}
		return serverStatus;
	} catch (e) {
		console.error(e);
	}
}

const sendAnalyticsEvent = (eventType, method) => {
	gtag('event', eventType, {
		'method': method,
		'page_location': window.location.href
	});
}

// Global variables
app.config.globalProperties.appCurrentVersion = appCurrentVersion;
app.config.globalProperties.baseUrl = baseUrl;
app.config.globalProperties.eventBus = eventBus;
app.config.globalProperties.reCaptchaSiteKey = reCaptchaSiteKey;
app.config.globalProperties.appNotify = appNotify;
app.config.globalProperties.dateOptions = dateOptions;
app.config.globalProperties.timeOptions = timeOptions;
app.config.globalProperties.toTitleCase = toTitleCase;
app.config.globalProperties.isUTCtime = isUTCtime;
app.config.globalProperties.addUserLog = addUserLog;
app.config.globalProperties.refreshAuthTokenAsNeeded = refreshAuthTokenAsNeeded;
app.config.globalProperties.sendAnalyticsEvent = sendAnalyticsEvent;

app.provide('sendAnalyticsEvent', sendAnalyticsEvent);

app.mount('#app')
