<script setup>
import { ref, watch, onMounted, onBeforeMount, onBeforeUnmount, inject, provide, reactive } from "vue";
import { sendAnalyticsEvent } from "@/dependencies/csh-libs.js";
import { useWindowEvent } from "@/composables/useCommonEvents.js";
import { appNotify } from "@/dependencies/models.js";
import urls from "../dependencies/commonUrls.json";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseTextarea from "@/components/base/BaseTextarea.vue";

defineOptions({
	inheritAttrs: false,
});

const props = defineProps({
	appState: Object,
	isMobile: Boolean,
});

const serverStatus = Object.assign({}, appNotify);
const baseUrl = inject("baseUrl");
const updateStatus = inject("sendUpdateStatus");
const showHideLoader = inject("showHideLoader");
const contactEmail = inject("contactEmail");
const forceLogout = inject("forceLogout");
const registerUser = inject("registerUser");
const siteKey = inject("reCaptchaSiteKey");
const maxlength = 1024;

const token = ref("");
const messageSent = ref(false);

const formData = reactive({
	name: "",
	email: "",
	phone: "",
	subject: "",
	message: "",
});

const formErrors = reactive({});
const fieldsToValidate = new Set();

// Allow deep nested parts to register their validation function
const registerField = (fieldId, validateFn) => {
	fieldsToValidate.add({ fieldId, validateFn });
};

const unregisterField = (fieldId) => {
	fieldsToValidate.delete(fieldId);
	delete formErrors[fieldId];
};

// Provide the centralized validation bridge to all descendants
provide("FormValidation", {
	registerField,
	unregisterField,
	errors: formErrors,
});

const sendEmail = async () => {
	showHideLoader(true);

	try {
		let body = formData;
		body.token = token.value;

		let headerObj = new Headers();
		headerObj.append("Content-Type", "application/json; charset=utf-8");
		let requestUrl = new URL("/api/mail", baseUrl);

		let request = new Request(requestUrl.toString(), {
			method: "POST",
			headers: headerObj,
			body: JSON.stringify(body),
		});

		let response = await fetch(request);
		const data = await response.json();

		if (data?.code === 403) {
			this.updateStatus(data);
			data.forced = true;
			this.forceLogout(data);
		}

		serverStatus.code = data?.code;
		serverStatus.message = data?.message;
		serverStatus.success = data?.success;

		if (data.success) {
			sendAnalyticsEvent("contact_form_send", "contact_modal");
			messageSent.value = true;
		}
	} catch (error) {
		console.error("Error posting data:", error.message);
		serverStatus.code = 400;
		serverStatus.message = `Error posting data: ${error.message}`;
		serverStatus.success = false;
	} finally {
		updateStatus(serverStatus);
		showHideLoader(false);
	}
};

const captchaHandler = async () => {
	try {
		// Ensure the reCAPTCHA API has finished loading globally
		if (!window.grecaptcha || !window.grecaptcha.enterprise) {
			console.error("reCAPTCHA script has not loaded yet.");
			return;
		}

		// Wrap execution in grecaptcha.enterprise.ready to guarantee the library is initialized
		window.grecaptcha.enterprise.ready(async () => {
			try {
				// Execute reCAPTCHA
				token.value = await window.grecaptcha.enterprise.execute(siteKey, {
					action: "sendEmail",
				});

				await sendEmail();
			} catch (error) {
				console.error("reCAPTCHA execution failed:", error);
			}
		});
	} catch (err) {
		console.error("Email failed:", err);
	}
};

const validateFields = () => {
	// Trigger all registered child validation rules in one pass
	fieldsToValidate.forEach(({ fieldId, validateFn }) => {
		const error = validateFn();
		if (error) {
			formErrors[fieldId] = error;
		} else {
			delete formErrors[fieldId];
		}
	});
};

const handleSubmit = async () => {
	// Validate fields and stop executiion if any are registered
	validateFields();
	if (Object.keys(formErrors).length > 0) {
		serverStatus.message = "Please fill in all required fields.";
		serverStatus.success = false;
		updateStatus(serverStatus);
		return serverStatus;
	}

	// Validate recaptcha and send email
	captchaHandler();
};

watch(formData, () => {
	if (Object.keys(formErrors).length > 0) validateFields();
});

onMounted(() => {
	sendAnalyticsEvent("contact_form_load", "contact_modal");
	if (!document.getElementById("recaptcha-script")) {
		const script = document.createElement("script");
		script.id = "recaptcha-script";
		script.src = `https://google.com/recaptcha/enterprise.js?render=${siteKey}`;
		script.async = true;
		script.defer = true;
		document.head.appendChild(script);
	}
});

useWindowEvent("keydown", (e) => {
	if (e.key === "Escape") contactEmail(false);
});

const handleClick = (event) => {
	if (event.target.id === "contact") contactEmail(false);
};
</script>

<template>
	<div id="contact" @mousedown="handleClick($event)" v-bind="$attrs">
		<div class="wrapper" v-if="!messageSent">
			<div id="form-header">
				<div class="email-header">
					<img v-if="!isMobile" src="/icons/EmailClean2.png" alt="Email Icon" />
					<h1>I'd love to hear from you</h1>
				</div>
				<h3 style="text-align: center">Schedule an interview or just let me know what you think.</h3>
				<small
					>Your email will not be shared or used for any other purpose.
					<br />
					See full
					<RouterLink class="privacy-link link" to="/about#privacy" @click="registerUser(false)" title="Privacy Policy">privacy policy</RouterLink>
				</small>
			</div>
			<div v-if="!isMobile" class="contact-btn">
				<a
					class="btn linkedin-icon"
					:href="urls.linkedin.url"
					:title="urls.linkedin.title"
					target="_blank"
					@click="sendAnalyticsEvent('linkedin', 'linkedin_link')"
					>{{ urls.linkedin.text }}</a
				>
				<a
					class="btn github-icon white"
					:href="urls.github.url"
					:title="urls.github.title"
					target="_blank"
					@click="sendAnalyticsEvent('hardwick_design', 'hardwick_design_link')"
					>{{ urls.github.text }}</a
				>
			</div>
			<form @submit.prevent="handleSubmit" method="post">
				<BaseInput v-model="formData.name" id="name" label="Name" :required="true" :hiddenLabel="true" :error="formErrors.name" />
				<BaseInput v-model="formData.email" id="email" label="Email" :required="true" :hiddenLabel="true" :error="formErrors.email" />
				<BaseInput v-model="formData.subject" id="subject" label="Subject" :required="true" :hiddenLabel="true" :error="formErrors.subject" />
				<BaseTextarea
					v-model="formData.message"
					id="message"
					label="Message"
					:required="true"
					:hiddenLabel="true"
					:maxlength="1024"
					:error="formErrors.message"
				/>
				<div style="display: flex">
					<button class="btn email-icon" type="submit" @click.prevent="handleSubmit" title="Send email">Send</button>
					<button class="btn" type="button" @click="contactEmail(false)" title="Cancel">Cancel</button>
				</div>
			</form>
		</div>

		<div class="wrapper" v-else>
			<div id="form-header">
				<h2>Message sent</h2>
			</div>
			<div class="response">
				<h3>I'll get back to you as soon as I can.</h3>
			</div>
			<div style="display: flex">
				<button class="btn" type="button" @click="contactEmail(false)" title="Cancel">Close</button>
			</div>
		</div>
	</div>
</template>

<style>
#contact input,
#contact textarea,
#contact select {
	color: #ddd;
	background-color: #435189;
}

#contact ::placeholder {
	color: rgb(255 255 255 / 50%);
}
</style>

<style scoped>
h2 {
	text-align: center;
}

#view {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 30px auto;
	padding: 15px 30px;
	height: fit-content;
	background-color: rgb(71 68 196 / 40%);
	border-radius: 8px;
}

.email-header {
	display: flex;
	justify-content: center;
}

.email-header img {
	object-fit: contain;
	width: 2.25em;
	margin-right: 1em;
}

form {
	display: flex;
	flex-direction: column;
	margin: 1em 0;
	padding: 1em;
	border-radius: 0.8em;
	border: 1px #9676bc solid;
	background-color: rgb(13 12 39 / 10%);
}

.login-status {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	position: fixed;
	top: 0;
	right: 0;
	padding: 5px 10px;
	font-size: 0.625em;
	background-color: #32373f;
	border-radius: 0 0 0 0.4em;
	border: 1px #5b88c0 solid;
}

.login-status button {
	user-select: none;
	margin: 8px auto;
	padding: 5px;
}

#contact {
	position: fixed;
	z-index: 10000;
	display: grid;
	width: 100%;
	height: calc(100vh - 140px);
	justify-content: center;
	background-color: rgb(0 0 0 / 30%);
	left: 0;
	top: 86px;
	align-items: center;
	color: #aaa;
	-webkit-backdrop-filter: blur(10px);
	backdrop-filter: blur(10px);
}

.wrapper {
	align-content: center;
	background-color: #313b64;
	height: fit-content;
	padding: 15px 30px;
	border-radius: 12px;
	display: flex;
	flex-direction: column;
	overflow: hidden auto;
	box-shadow: 2px 2px 6px #000;
	max-height: calc(100vh - 160px);
}

.mobile .wrapper {
	max-height: calc(100vh - 150px);
}

.btn-container {
	position: absolute;
	top: -45px;
	right: -15px;
}

#contact button {
	display: block;
	margin: auto;
	font-size: 1em;
}

#form-header {
	background-color: hsl(228 34% 40% / 1);
	position: relative;
	text-align: center;
	left: -31px;
	width: calc(100% + 62px);
	top: -16px;
	padding: 15px;
	color: #ddd;
	box-shadow: 0px 2px 3px rgb(0 0 0 / 70%);
	border-bottom: 1px #fff solid;
}

#form-header small {
	display: block;
	line-height: 1.5em;
}

.privacy-link {
	font-weight: bold;
}

a:not(.btn):visited {
	color: #f53cf5;
}

.contact-btn {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 0.25em 0;
}

.contact-btn .btn {
	font-size: 1em;
	line-height: 1.5em;
	padding: 5px 2.8em 5px 15px;
	border: 1px #000 solid;
	text-transform: uppercase;
}

.email-icon::after {
	right: 0.5em;
	top: 0.4em;
	width: 1.3em;
	height: 1.3em;
}

.email-icon {
	padding-right: 2.5em;
}

.linkedin-icon::after,
.github-icon::after {
	width: 1.5em;
	height: 1.5em;
	right: 0.5em;
	top: 0.25em;
	border: 1px #ddd solid;
}

.linkedin-icon::after {
	border-radius: 4px;
}

.github-icon::after {
	border: unset;
}

.response h3 {
	margin-bottom: 0.8em;
}

@media (max-width: 767px) {
	.wrapper {
		max-width: 24em;
	}
}
</style>
