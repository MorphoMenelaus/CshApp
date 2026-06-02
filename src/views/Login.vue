<template>
	<div id="login" class="input-heading">
		<div class="login-status" v-if="isLoggedOn">
			<span>{{ displayName }}</span>
			<button type="button" @click="logout()">Logout</button>
		</div>
		<form class="input-section" v-if="!isLoggedOn">
			<!-- <span class="loader"></span> -->
			<label for="userName">Please type user name and password: </label>
			<input type="text" name="userName" v-model="userName" placeholder="Username" autocomplete="userName" />
			<input type="password" name="password" v-model="password" placeholder="Password"
				autocomplete="current-password" />
			<button class="btn" type="button" @click="login()">Login</button>
		</form>
	</div>
</template>

<script>
// @ is an alias to /src
import sessionMethods from "@/dependencies/sessionMethods";
import sharedScripts from "@/dependencies/sharedScripts";

export default {
	name: "Login",
	props: {
		appState: Object,
	},
	watch: {
		// appState: {
		// 	handler(val, oldVal) {
		// 		console.log("appState Changed");
		// 		console.log(this.appState);
		// 	},
		// 	deep: true,
		// },
	},
	data() {
		return {
			appStatus: Object.assign({}, this.appStatus),
			messageResetTimer: null,
			isLoggedOn: false,
			activeSession: null, //sessionMethods.session.get(),
			accessToken: "",
			accessTokenExpiration: "",
			refreshToken: "",
			userPermissions: {
				userId: "",
				globalPermissions: "",
				sitePermissions: {},
			},
			sitePermissions: {},
			isCashier: false,
			isReporter: false,
			isSiteAdmin: false,
			userName: "",
			displayName: "",
			password: "",
			userId: "",
			activeSession: {},
			userPermissions: "",
			usersList: [],
		};
	},
	methods: {
		async login() {
			try {
				let body = {
					userName: this.userName,
					password: this.password,
				};

				if (!this.userName || !this.password) {
					this.appStatus.message =
						"Please provide a valid phone number and password.";
					this.appStatus.success = false;
					this.eventBus.emit("updateStatus", this.appStatus);
					return this.appStatus;
				}

				const response = await fetch('/api/auth/login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body)
				});

				let dataObj = await response.json();

				if (dataObj?.success) {
					let updateAppState = this.appState;
					updateAppState.authenticationToken = dataObj.authenticationToken;
					updateAppState.tokenExpiration = dataObj.tokenExpiration;
					this.eventBus.emit("updateAppState", updateAppState);

					this.appStatus.code = 200;
					this.appStatus.message = "Access Token acquired: Login Success";
					this.appStatus.success = true;
				} else {
					this.appStatus.code = 400;
					this.appStatus.message = "Invalid credentials";
					this.appStatus.success = false;
				}

				console.log(this.appStatus);

				this.eventBus.emit("updateStatus", this.appStatus);

			} catch (e) {
				console.error(e);
			}
		},
		logout() {
			let confirmLogout = confirm(
				`Are you sure you want to logout, ${this.displayName}`
			);
			if (!confirmLogout) return false;
			// this.$forceUpdate();
		},
	},
	mounted() {
	},
	created() {
		// this.$store.replaceState(sessionMethods.session.get());
	},
};
</script>

<!-- scoped attribute to limit CSS to this component only -->
<style scoped>
.err {
	border: 2px #f00 solid;
}

#login {
	position: absolute;
	top: 230px;
	right: 0;
	width: 80%;
}

.input-section {
	margin: 30px auto;
	background: rgb(71 68 196 / 40%);
	padding: 30px;
	position: relative;
	backdrop-filter: blur(8px);
	border-radius: 12px;
	box-shadow: inset -1px -1px 15px 1px rgb(13 28 37 / 50%);
	max-width: 30em;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.input-section > * {
	margin: 5px;
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

/* .loader {
	display: none;
	content: "";
	position: absolute;
	top: 15px;
	right: 15px;
	height: 32px;
	width: 32px;
	border: 2px solid;
	border-radius: 100%;
	border-color: red white blue black;
	animation: loader 0.5s linear infinite;
}
.loader.loading {
	display: block;
}
@keyframes loader {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(359deg);
	}
} */
</style>
