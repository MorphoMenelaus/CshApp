<template>

	<div id="register">
		<div class="wrapper">
			<h2>Register</h2>
			<p>Please fill this form to create an account.</p>
			<!-- @submit.prevent blocks page reloads and executes your logic -->
			<form @submit.prevent="registerHandler" method="post">
				<div class="form-group" :class="errState && !userName.length > 0 ? 'err' : ''">
					<label>Username</label>
					<input autocomplete="username" v-model.trim="userName" type="text" name="userName"
						class="form-control">
				</div>
				<div class="form-group" :class="errState && !password.length > 0 ? 'err' : ''">
					<label>Password</label>
					<input autocomplete="new-password" v-model.trim="password" type="password" name="password"
						class="form-control">
				</div>
				<div class="form-group">
					<label>Confirm Password</label>
					<input autocomplete="new-password" v-model.trim="confirmPassword" type="password"
						name="confirmPassword" class="form-control">
				</div>
				<div style="display: flex;">
					<button class="btn" type="submit" @click.prevent="registerHandler">
						Register
					</button>
					<button class="btn" type="button" @click="eventBus.emit('registerUser', false)">Cancel</button>
				</div>
				<p>Already have an account? <span class="link" title="Login here"
						@click="removeRegisterUserComponent()">Login here.</span>
				</p>
			</form>
		</div>
	</div>

</template>

<script>
// @ is an alias to /src
// import { onBeforeUnmount } from 'vue';
// import session from "@/dependencies/sessionMethods";
// import sharedScripts from "@/dependencies/sharedScripts";

export default {
	name: "RegisterUser",
	props: {
		appState: Object,
	},
	data() {
		return {
			serverStatus: Object.assign({}, this.appNotify),
			userName: "",
			password: "",
			confirmPassword: "",
			errState: false,
			isLoggedOn: false,
			siteKey: this.reCaptchaSiteKey,
			token: ""
		};
	},
	watch: {
	},
	methods: {
		removeRegisterUserComponent() {
			// Control the state of both components
			let payload = {
				register: false,
				login: true
			}
			this.eventBus.emit("registerUser", payload);
		},
		async register() {
			this.eventBus.emit("showHideLoader", true);

			try {
				let body = {
					userName: this.userName,
					password: this.password,
					token: this.token,
				};

				if (!this.userName || !this.password) {
					this.serverStatus.message = "Please provide a user name and password.";
					this.serverStatus.success = false;
					this.eventBus.emit("updateStatus", this.serverStatus);
					this.errState = true;
					return this.serverStatus;
				}

				const response = await fetch('/api/users/register', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body)
				});

				const data = await response.json();

				this.serverStatus.code = data?.code;
				this.serverStatus.message = data?.message;
				this.serverStatus.success = data?.success;
				this.eventBus.emit("updateStatus", (this.serverStatus));

				if (data?.success) {
					// Control the state of both components
					let payload = {
						register: false,
						login: false
					}
					this.eventBus.emit("registerUser", payload);
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
		async registerHandler() {
			try {
				// Ensure the reCAPTCHA API has finished loading globally
				if (!window.grecaptcha || !window.grecaptcha.enterprise) {
					console.error("reCAPTCHA script has not loaded yet.");
					return;
				}

				// Wrap execution in grecaptcha.enterprise.ready to guarantee the library is initialized
				window.grecaptcha.enterprise.ready(async () => {
					try {
						// Execute reCAPTCHA programmatically
						const token = await window.grecaptcha.enterprise.execute(this.siteKey, {
							action: 'register' // Match your expected backend action
						});

						// Send token to your backend along with your registration form data
						this.token = token;
						await this.register();

					} catch (error) {
						console.error("reCAPTCHA execution failed:", error);
					}
				});

			} catch (err) {
				console.error("Registration failed:", err);
			}
		},
	},
	mounted() {
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
	},
};
</script>

<!-- scoped attribute to limit CSS to this component only -->
<style scoped>
h2 {
	text-align: center;
}

.err {
	border: 2px #f00 solid;
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
	backdrop-filter: blur(8px);
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

#register {
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
}

/* .uiDarkMode #register {
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
}

.wrapper .form-group {
	display: flex;
	align-content: center;
	flex-direction: column;
}

#register button {
	display: block;
	margin: 15px auto;
}
</style>
