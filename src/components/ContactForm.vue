<template>

	<div id="contact">
		<div class="wrapper">
			<!-- <div class="btn-container">
				<button @click="eventBus.emit('contactEmail', false)" class="close-modal" title="Close This Dialog">❌</button>
			</div> -->
			<div id="form-header">
				<h2>I'd love to hear from you</h2>
				<h4 style="text-align: center;">Please, let me know what you think.</h4>
				<p style="text-align: center;">Your info will not be shared with anyone.</p>
			</div>
			<form @submit.prevent="contactHandler" method="post">
				<div class="form-group">
					<label for="name" title="Name">Name<span v-if="!name && errState" class="err"> *
							required</span></label>
					<input v-model.trim="name" id="name" type="text" name="name" class="form-control" />
				</div>

				<div class="form-group">
					<label for="email" title="Email Address">Email Address<span v-if="!email && errState" class="err"> *
							required</span></label>
					<input v-model.trim="email" id="email" type="text" name="email" class="form-control" />
				</div>

				<div class="form-group">
					<label for="phone" title="Phone (optional)">Phone (optional)</label>
					<input v-model.trim="phone" id="phone" type="text" name="phone" class="form-control" />
				</div>

				<div class="form-group" title="Subject">
					<label for="subject">Subject<span v-if="!subject && errState" class="err"> *
							required</span></label>
					<input v-model.trim="subject" id="subject" type="text" name="subject" class="form-control" />
				</div>

				<div class="form-group">
					<label for="message" title="Message">Message<span v-if="!message && errState" class="err"> *
							required</span></label>
					<small>(characters remaining: {{ charRemaining }})</small>
					<textarea v-model.trim="message" id="message" type="text" name="message" class="form-control"
						:maxlength="maxlength" @keyup="charCounter()" />
				</div>
				<div style="display: flex;">
					<button class="btn" type="submit" @click.prevent="contactHandler" title="Send email">
						Send
					</button>
					<button class="btn" type="button" @click="eventBus.emit('contactEmail', false)"
						title="Cancel">Cancel</button>
				</div>
			</form>
		</div>
	</div>

</template>

<script>
// @ is an alias to /src
import { onBeforeUnmount } from 'vue';
// import session from "@/dependencies/sessionMethods";
// import sharedScripts from "@/dependencies/sharedScripts";

export default {
	name: "ContactForm",
	props: {
		appState: Object,
	},
	data() {
		return {
			serverStatus: Object.assign({}, this.appNotify),
			siteKey: this.reCaptchaSiteKey,
			token: "",
			name: this.appState?.userName || "",
			email: this.appState?.user?.email || "",
			phone: "",
			subject: "",
			message: "",
			errState: false,
			maxlength: 1024,
			charRemaining: 1024,
		};
	},
	watch: {
	},
	methods: {
		charCounter() {
			let currCount = this.message.length;
			if (this.charRemaining <= this.maxlength)
				this.charRemaining = this.maxlength - currCount;
		},
		async sendEmail() {
			this.eventBus.emit("showHideLoader", true);

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
					this.eventBus.emit("updateStatus", this.serverStatus);
					this.errState = true;
					return this.serverStatus;
				}

				const response = await fetch('/api/mail', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body)
				});

				const data = await response.json();

				if (data.success) {
					this.serverStatus.code = data?.code;
					this.serverStatus.message = data?.message;
					this.serverStatus.success = data?.success;
					this.eventBus.emit("updateStatus", (this.serverStatus));
					this.eventBus.emit("contactEmail", false);
				}
				this.errState = data?.success;

			} catch (error) {
				console.error('Error posting data:', error);
				this.serverStatus.code = 400;
				this.serverStatus.message = `Error posting data: ${error}`;
				this.serverStatus.success = false;
				this.eventBus.emit("updateStatus", (this.serverStatus));
			} finally {
				this.eventBus.emit("showHideLoader", false);
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
							action: "sendEmail"
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
		handleKeyDown(event) {
			if (event.key === "Escape")
				this.eventBus.emit('contactEmail', false);
		},
	},
	mounted() {
		window.addEventListener("keydown", this.handleKeyDown);
		if (!document.getElementById('recaptcha-script')) {
			const script = document.createElement('script');
			script.id = 'recaptcha-script';
			script.src = `https://google.com/recaptcha/enterprise.js?render=${this.siteKey}`;
			script.async = true;
			script.defer = true;
			document.head.appendChild(script);
		}
	},
	created() {
		onBeforeUnmount(() => {
			window.removeEventListener("keydown", this.handleKeyDown);
		});
	},
};
</script>

<!-- scoped attribute to limit CSS to this component only -->
<style scoped>
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
}

.input-section {
	background: rgb(49 59 100 / 90%);
	padding: 30px;
	position: relative;
	top: 0;
	/* left: 10vw; */
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
	text-shadow: -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000,
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

/* .uiDarkMode #contact {
} */

.wrapper {
	max-width: 30em;
	align-content: center;
	background-color: #313b64;
	height: fit-content;
	padding: 15px 30px;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	box-shadow: 2px 2px 6px #000;
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
	margin: 15px auto;
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
	box-shadow: 1px 1;
}

textarea#message {
	min-height: 5em;
}
</style>
