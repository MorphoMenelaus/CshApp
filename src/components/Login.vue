<template>

	<div class="login-status" v-if="appState.isLoggedOn">
		<span>{{ appState.userName }}</span>
		<button class="btn" type="button" @click="logout()">Logout</button>
	</div>

	<div id="login" class="input-heading" :class="appState.isLoggedOn ? 'logged-on' : ''" v-if="!appState.isLoggedOn">
		<form class="input-section">
			<h1>Welcome</h1>
			<!-- <span class="loader"></span> -->
			<label for="userName">Login to continue</label>
			<input type="text" name="userName" v-model="userName" placeholder="Username" autocomplete="userName" />
			<input type="password" name="password" v-model="password" placeholder="Password"
				autocomplete="current-password" />
			<button class="btn" type="button" @click="login()">Login</button>
			<span @click="showRegisterUserComponent()">New User? <span class="link">Click to register</span>.</span>
		</form>
	</div>

</template>

<script>
// @ is an alias to /src
import sessionMethods from "@/dependencies/sessionMethods";
import sharedScripts from "@/dependencies/sharedScripts";
import router from "@/router";

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
			appNotify: Object.assign({}, this.appNotify),
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
			isSiteAdmin: false,
			userName: "",
			displayName: "",
			password: "",
			userId: "",
			activeSession: {},
			usersList: [],
		};
	},
	methods: {
		showRegisterUserComponent() {
			this.eventBus.emit("registerUser", true);
		},
		async login() {
			try {
				let body = {
					userName: this.userName,
					password: this.password,
				};

				if (!this.userName || !this.password) {
					this.appNotify.message =
						"Please provide a user name and password.";
					this.appNotify.success = false;
					this.eventBus.emit("updateStatus", this.appNotify);
					return this.appNotify;
				}

				const response = await fetch('/api/auth/login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body)
				});

				let dataObj = await response.json();

				if (dataObj?.success) {
					let updateAppState = this.appState;
					updateAppState.accessToken = dataObj.accessToken;
					updateAppState.accessTokenExpiration = dataObj.accessTokenExpiration;
					updateAppState.refreshToken = dataObj.refreshToken;
					updateAppState.userName = this.userName;
					updateAppState.user = dataObj.user
					updateAppState.permissions = dataObj.user.permissions;
					this.eventBus.emit("updateAppState", updateAppState);
					updateAppState.isLoggedOn = true;

					this.appNotify.code = 200;
					this.appNotify.message = "Access Token acquired: Login Success";
					this.appNotify.success = true;
				} else {
					this.appNotify.code = 400;
					this.appNotify.message = "Invalid credentials";
					this.appNotify.success = false;
				}

				console.log(this.appNotify);

				this.eventBus.emit("updateStatus", this.appNotify);

			} catch (e) {
				console.error(e);
			}
		},
		async logout() {

			let body = {
				userName: this.appState.userName,
			};

			try {
				let confirmLogout = confirm(
					`Are you sure you want to logout, ${this.displayName}`
				);
				if (!confirmLogout) return false;

				const response = await fetch('/api/auth/logout', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body)
				});

				let dataObj = await response.json();

				console.log(dataObj);

				let updateAppState = {};
				this.eventBus.emit("updateAppState", updateAppState);

				router.push("/");

			} catch {
				console.error(e);
			}
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
	display: grid;
	align-items: center;
	width: 100%;
	height: calc(100% - 139px);
	top: 94px;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgb(0 0 0 / 80%);
	z-index: 5000;
}

@supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
	#login {
		background-color: unset;
		-webkit-backdrop-filter: blur(12px) saturate(140%);
		backdrop-filter: blur(12px) saturate(140%);
	}
}

#login.logged-on {
	background-color: unset;
	-webkit-backdrop-filter: unset;
	backdrop-filter: unset;
}

.input-section {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	max-width: 30em;
	padding: 30px;
	margin: 30px auto;
	background: rgb(49 59 100 / 70%);
	border-radius: 8px;
	box-shadow: inset -1px -1px 15px 1px rgb(13 28 37 / 50%);
}

.input-section>* {
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
	z-index: 100000;
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

.link {
	text-decoration: underline;
	color: #4c88ff;
	cursor: pointer;
}

.link:hover {
	color: #ff6600;
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
