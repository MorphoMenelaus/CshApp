import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { addUserLog, toTitleCase, isUTCtime, sendAnalyticsEvent, isObjNullOrEmpty, refreshAuthTokenAsNeeded, tokenCheck } from "@/dependencies/csh-libs.js";

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
app.config.globalProperties.tokenCheck = tokenCheck;
app.config.globalProperties.sendAnalyticsEvent = sendAnalyticsEvent;
app.config.globalProperties.isObjNullOrEmpty = isObjNullOrEmpty;

app.provide('sendAnalyticsEvent', sendAnalyticsEvent);

app.mount('#app')
