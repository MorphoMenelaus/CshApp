import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { onsiteUrlService } from "@/dependencies/csh-libs.js";

const app = createApp(App);
app.use(router);

onsiteUrlService.set(API_ONSITE);
const onsiteServer = onsiteUrlService.get();

const allowedDomains = [
	import.meta.env.VITE_API_BASE_URL,
	import.meta.env.VITE_API_STAGING_URL,
	import.meta.env.VITE_API_CSH_URL,
	onsiteServer, // Empty string unless built in dev mode - which loads .env.development
];

const origin = onsiteServer || window.location.origin;
const personalRestricted = origin === import.meta.env.VITE_API_CSH_URL;
const baseUrl = allowedDomains.includes(origin) ? origin : "";

const appCurrentVersion = APP_VERSION;
const reCaptchaSiteKey = import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY;

app.provide("reCaptchaSiteKey", reCaptchaSiteKey);
app.provide("appCurrentVersion", appCurrentVersion);
app.provide("personalRestricted", personalRestricted);
app.provide("baseUrl", baseUrl);

app.mount("#app");
