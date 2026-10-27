<template>
	<div id="contact" @mousedown="handleClick($event)">
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
			<form @submit.prevent="contactHandler" method="post">
				<div class="form-group" :class="{ err: errState && !name.length > 0 }">
					<label for="name" title="Name">Name<span v-if="!name && errState" class="err"> * required</span></label>
					<input v-model.trim="name" id="name" type="text" name="name" class="form-control" placeholder="Your Name" />
				</div>

				<div class="form-group" :class="{ err: errState && !email.length > 0 }">
					<label for="email" title="Email Address">Email Address<span v-if="!email && errState" class="err"> * required</span></label>
					<input v-model.trim="email" id="email" type="text" name="email" class="form-control" placeholder="Your Email" />
				</div>

				<div class="form-group" title="Subject" :class="{ err: errState && !subject.length > 0 }">
					<label for="subject">Subject<span v-if="!subject && errState" class="err"> * required</span></label>
					<input v-model.trim="subject" id="subject" type="text" name="subject" class="form-control" placeholder="Subject" />
				</div>

				<div class="form-group" :class="{ err: errState && !message.length > 0 }">
					<label for="message" title="Message">Message<span v-if="!message && errState" class="err"> * required</span></label>
					<small>Characters remaining: {{ charRemaining }}</small>
					<textarea
						v-model.trim="message"
						id="message"
						type="text"
						name="message"
						placeholder="Your Message"
						class="form-control"
						:maxlength="maxlength"
						@keyup="charCounter()"
					/>
				</div>
				<div style="display: flex">
					<button class="btn email-icon" type="submit" @click.prevent="contactHandler" title="Send email">Send</button>
					<button class="btn" type="button" @click="contactEmail(false)" title="Cancel">Cancel</button>
				</div>
			</form>
		</div>

		<div class="wrapper" v-else>
			<div id="form-header">
				<h2>Message sent</h2>
			</div>
			<div>
				<h3>I'll get back to you as soon as I can.</h3>
			</div>
			<div style="display: flex">
				<button class="btn" type="button" @click="contactEmail(false)" title="Cancel">Close</button>
			</div>
		</div>
	</div>
</template>

<script>
import { onBeforeUnmount, inject } from "vue";
import { sendAnalyticsEvent } from "@/dependencies/csh-libs.js";
import { appNotify } from "@/dependencies/models.js";
import urls from "../dependencies/commonUrls.json";

export default {
	name: "ContactForm",
	props: {
		appState: Object,
		isMobile: Boolean,
	},
	data() {
		return {
			baseUrl: inject("baseUrl"),
			updateStatus: inject("sendUpdateStatus"),
			showHideLoader: inject("showHideLoader"),
			contactEmail: inject("contactEmail"),
			forceLogout: inject("forceLogout"),
			registerUser: inject("registerUser"),
			siteKey: inject("reCaptchaSiteKey"),
			sendAnalyticsEvent: sendAnalyticsEvent,
			serverStatus: Object.assign({}, appNotify),
			urls: urls,
			token: "",
			name: this.appState?.userName || "",
			email: this.appState?.user?.email || "",
			phone: "",
			subject: "",
			message: "",
			errState: false,
			maxlength: 1024,
			charRemaining: 1024,
			messageSent: false,
		};
	},
	watch: {},
	methods: {
		charCounter() {
			let currCount = this.message.length;
			if (this.charRemaining <= this.maxlength) this.charRemaining = this.maxlength - currCount;
		},
		async sendEmail() {
			this.showHideLoader(true);

			try {
				let body = {
					name: this.name,
					email: this.email,
					phone: this.phone,
					subject: this.subject,
					message: this.message,
					token: this.token,
				};

				if (!this.name || !this.email || !this.subject || !this.message) {
					this.serverStatus.message = "Please fill in all required fields.";
					this.serverStatus.success = false;
					this.updateStatus(this.serverStatus);
					this.errState = true;
					return this.serverStatus;
				}

				let headerObj = new Headers();
				headerObj.append("Content-Type", "application/json; charset=utf-8");
				let requestUrl = new URL("/api/mail", this.baseUrl);

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

				this.serverStatus.code = data?.code;
				this.serverStatus.message = data?.message;
				this.serverStatus.success = data?.success;

				if (data.success) {
					sendAnalyticsEvent("contact_form_send", "contact_modal");
					this.messageSent = true;
				}
				this.errState = data?.success;
			} catch (error) {
				console.error("Error posting data:", error.message);
				this.serverStatus.code = 400;
				this.serverStatus.message = `Error posting data: ${error.message}`;
				this.serverStatus.success = false;
			} finally {
				this.updateStatus(this.serverStatus);
				this.showHideLoader(false);
			}
		},
		async contactHandler() {
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
						this.token = await window.grecaptcha.enterprise.execute(this.siteKey, {
							action: "sendEmail",
						});

						await this.sendEmail();
					} catch (error) {
						console.error("reCAPTCHA execution failed:", error);
					}
				});
			} catch (err) {
				console.error("Email failed:", err);
			}
		},
		keyDown(e) {
			if (e.key === "Escape") this.contactEmail(false);
		},
		handleClick(event) {
			if (event.target.id === "contact") this.contactEmail(false);
		},
	},
	mounted() {
		sendAnalyticsEvent("contact_form_load", "contact_modal");
		if (!document.getElementById("recaptcha-script")) {
			const script = document.createElement("script");
			script.id = "recaptcha-script";
			script.src = `https://google.com/recaptcha/enterprise.js?render=${this.siteKey}`;
			script.async = true;
			script.defer = true;
			document.head.appendChild(script);
		}
	},
	created() {
		window.addEventListener("keydown", this.keyDown);
		onBeforeUnmount(() => {
			window.removeEventListener("keydown", this.keyDown);
		});
	},
};
</script>

<style scoped>
.email-header {
	display: flex;
	justify-content: center;
}

.email-header img {
	object-fit: contain;
	width: 2.25em;
	margin-right: 1em;
}

h2 {
	text-align: center;
}

.err {
	color: #f00;
	font-weight: bold;
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

form {
	display: flex;
	flex-direction: column;
	margin: 1em 0;
	padding: 1em;
	border-radius: 0.8em;
	border: 1px #9676bc solid;
	background-color: rgb(13 12 39 / 10%);
}

label {
	display: none;
}

.input-section {
	background: rgb(49 59 100 / 90%);
	padding: 30px;
	position: relative;
	top: 0;
	-webkit-backdrop-filter: blur(10px);
	backdrop-filter: blur(10px);
	border-radius: 12px;
	box-shadow: inset -1px -1px 15px 1px rgb(13 28 37 / 50%);
	max-width: 30em;
}

.uiDarkMode .input-section[data-v-3bd1a200] {
	background: rgb(49 59 100 / 70%);
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

label[for="casinoId"] {
	text-align: center;
	text-transform: uppercase;
	text-shadow:
		-1px -1px 0px #000,
		1px -1px 0px #000,
		-1px 1px 0px #000,
		1px 1px 0px #000;
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
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	overflow: hidden auto;
	box-shadow: 2px 2px 6px #000;
	max-height: calc(100vh - 160px);
}

.mobile .wrapper {
	max-height: calc(100vh - 150px);
}

.wrapper .form-group {
	display: flex;
	align-content: center;
	flex-direction: column;
	margin-bottom: 15px;
}

.btn-container {
	position: absolute;
	top: -45px;
	right: -15px;
}

#contact button {
	display: block;
	margin: 1em auto;
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

.form-group small {
	color: rgb(221 221 221 / 60%);
}

textarea#message {
	min-height: 5em;
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
	margin: 1em 0;
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

.err {
	border: 2px #f00 solid;
}

@media (max-width: 767px) {
	.wrapper {
		max-width: 24em;
	}
}

@media (min-width: 768px) {
}
</style>
