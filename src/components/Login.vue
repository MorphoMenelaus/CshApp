<template>

	<div class="login-status">
		<div v-if="appState?.isLoggedOn">
			<span>{{ appState.userName }}</span>
			<button class="btn" type="button" @click="openConfirmDialog()">Logout</button>
			<span v-if="userName !== 'guest'" id="delete-button" class="link"
				@click="currentComponent = 'DeleteUser'">Delete Account</span>
			<RouterLink class="unverified link" v-if="!appState?.permissions.verified" to="/verify">Click to Verify
				Account</RouterLink>
		</div>
		<div v-else>
			<button class="btn" type="button" @click="showRegisterUserComponent(true, false)">Login</button>
			<span @click="showRegisterUserComponent(false, true)">New User? <span class="link">Click to
					register</span>.</span>
		</div>
	</div>

	<div id="login" class="input-heading" :class="appState.isLoggedOn ? 'logged-on' : ''"
		v-if="!appState?.isLoggedOn && loginShow" @click="handleClick($event)">
		<form class="input-section">
			<div id="form-header">
				<h1>Chris Hardwick's SPA</h1>
				<h2>Welcome</h2>
			</div>
			<h2>Login to continue</h2>
			<div class="inputs">
				<label for="username">User Name</label>
				<input id="username" type="text" name="username" v-model="userName" placeholder="User Name"
					autocomplete="username" />
				<label for="password">Password</label>
				<input id="password" type="password" name="password" v-model="password" placeholder="Password"
					autocomplete="current-password" />
			</div>
			<div class="login-buttons">
				<button class="btn login-btn" type="button" @click="login()">Login</button>
				<button class="btn" type="button" @click="loginShow = false">Cancel</button>
			</div>
			<span @click="showRegisterUserComponent(false, true)">New User? <span class="link">Click to
					register</span>.</span>
		</form>
	</div>

	<div id="dialog-container">
		<dialog id="confirmDialog">
			<div>
				<h2>
					Are you sure you want to logout?
				</h2>
				<div class="dialog-buttons">
					<button class="btn" @click="logout()">Confirm</button>
					<button class="btn cancel" @click="dialog.close()">Cancel</button>
				</div>
			</div>
		</dialog>
	</div>

	<component :is="currentComponent" :appState="appState" />

</template>

<script>
// @ is an alias to /src
import session from "@/dependencies/sessionMethods.js";
// import sharedScripts from "@/dependencies/sharedScripts";
import { onBeforeUnmount } from "vue";
import router from "@/router";
import DeleteUser from "@/components/DeleteUser.vue";

const user = import.meta.env.VITE_APP_GUEST_USER;
const password = import.meta.env.VITE_APP_GUEST_PASS;
const guestUser = {
	userName: user,
	password: password
}

export default {
	name: "Login",
	props: {
		appState: Object,
	},
	components: {
		DeleteUser
	},
	data() {
		return {
			appNotify: Object.assign({}, this.appNotify),
			loginShow: false,
			activeSession: null,
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
			currentComponent: null,
			dialog: null
		};
	},
	watch: {
		userName() {
			if (this.userName === guestUser.userName) {
				this.password = guestUser.password;
				this.login();
			}
		}
	},
	methods: {
		showRegisterUserComponent(login = false, register = false) {
			// Control the state of both components
			let payload = {
				register: register,
				login: login
			}
			this.eventBus.emit("registerUser", payload);
		},
		async login() {
			this.eventBus.emit("showHideLoader", true);
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
					updateAppState.accessToken = dataObj.authorization.accessToken;
					updateAppState.accessTokenExpiration = dataObj.authorization.accessTokenExpiration;
					updateAppState.refreshToken = dataObj.authorization.refreshToken;
					updateAppState.userName = this.userName;
					updateAppState.user = dataObj.authorization.user
					updateAppState.permissions = dataObj.authorization.user.permissions;
					updateAppState.isLoggedOn = true;
					this.eventBus.emit("updateAppState", updateAppState);

					this.appNotify.code = 200;
					this.appNotify.message = "Access Token acquired: Login Success";
					this.appNotify.success = true;
					router.push("/");
					this.loginShow = false;
				} else {
					this.appNotify.code = dataObj.code;
					this.appNotify.message = dataObj.message;
					this.appNotify.success = dataObj.success;
				}

				this.eventBus.emit("updateStatus", this.appNotify);

			} catch (e) {
				console.error(e);
			} finally {
				this.eventBus.emit("showHideLoader", false);
			}
		},
		async refreshAuthentication() {

			let body = {
				accessToken: this.appState?.accessToken,
				refreshToken: this.appState?.refreshToken,
			};

			try {

				const response = await fetch('/api/auth/refresh', {
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
					updateAppState.isLoggedOn = true;
					this.eventBus.emit("updateAppState", updateAppState);

					this.appNotify.code = 200;
					this.appNotify.message = "Access Token refeshed";
					this.appNotify.success = true;
				} else {
					this.appNotify.code = dataObj.code;
					this.appNotify.message = dataObj.message;
					this.appNotify.success = dataObj.success;
				}

				this.eventBus.emit("updateStatus", this.appNotify);

			} catch (e) {
				console.error(e);
			}
		},
		openConfirmDialog() {
			this.dialog.showModal()
		},
		async logout() {
			this.eventBus.emit("showHideLoader", true);

			let body = {
				userName: this.appState.userName,
			};

			try {

				this.dialog.close();

				const response = await fetch('/api/auth/logout', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body)
				});

				let dataObj = await response.json();

				let updateAppState = {};
				this.eventBus.emit("updateAppState", updateAppState);
				session.recall.deleteAll();

				router.push("/");

			} catch {
				console.error(e);
			} finally {
				this.eventBus.emit("showHideLoader", false);
			}
		},
		handleKeyDown(event) {
			if (event.key === "Escape")
				this.loginShow = false;
		},
		handleClick(event) {
			if (event.target.id === "login")
				this.loginShow = false;
		},
	},
	mounted() {
		this.dialog = document.getElementById("confirmDialog");
		window.addEventListener("keydown", this.handleKeyDown);
	},
	created() {
		this.eventBus.on("cancelDeleteUser", () => {
			this.currentComponent = null;
		});
		this.eventBus.on("UserDeleted", () => {
			this.currentComponent = null;
			this.logout();
		});
		this.eventBus.on("forceLogout", () => {
			this.logout();
		});
		this.eventBus.on("registerUser", (payload) => {
			this.loginShow = payload.login;
		});
		onBeforeUnmount(() => {
			window.removeEventListener("keydown", this.handleKeyDown);
			this.eventBus.off("cancelDeleteUser");
			this.eventBus.off("UserDeleted");
			this.eventBus.off("forceLogout");
			this.eventBus.off("registerUser");
		});
	},
};
</script>

<!-- scoped attribute to limit CSS to this component only -->
<style scoped>
.login-status,
#login {
	color: #ebebeba3;
	font-size: 18px;
}

h2 {
	text-align: center;
}

#dialog-container dialog {
	margin: auto;
	padding: 30px;
	color: #bda5af;
	background-color: #313b64;
	border-radius: 12px;
	border-width: 1px;
}

::backdrop {
	background-color: rgb(0 0 0 / 60%);
	-webkit-backdrop-filter: blur(10px);
	backdrop-filter: blur(10px);
}

.dialog-buttons {
	display: flex;
	justify-content: space-evenly;
	margin: 30px auto 0;
}

.login-buttons {
	display: flex;
	justify-content: space-between;
	width: 9em;
	align-items: baseline;
}

.cancel {
	background-color: #3f445f;
}

.err,
.unverified {
	border: 2px #f00 solid;
}

#login {
	position: fixed;
	display: grid;
	align-items: center;
	width: 100%;
	/* height: calc(100% - 139px); */
	top: 0;
	right: 0;
	bottom: 45px;
	left: 0;
	background-color: rgb(0 0 0 / 80%);
	/* z-index: 500200; */
	z-index: 10000;
}

.login-btn {
	margin-top: 15px !important;
}

@supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
	#login {
		background-color: unset;
		-webkit-backdrop-filter: blur(10px);
		backdrop-filter: blur(10px);
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
	width: 90%;
	max-width: 30em;
	padding: 30px 30px 45px;
	margin: 30px auto;
	background: rgb(49 59 100 / 90%);
	border-radius: 8px;
	box-shadow: inset -1px -1px 15px 1px rgb(13 28 37 / 50%);
	overflow: hidden;
}

.uiDarkMode .input-section[data-v-3bd1a200] {
	background: rgb(49 59 100 / 70%);
}

.input-section>* {
	margin: 15px 15px 0;
}

.login-status>div {
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

.inputs {
	text-align: left;
	display: flex;
	flex-direction: column;
}

#username {
	margin-bottom: 15px;
}

#delete-button {
	font-size: 1.25em;
}

#form-header {
	background-color: hsl(228 34% 40% / 1);
	position: relative;
	text-align: center;
	left: 0;
	width: calc(100% + 62px);
	top: -46px;
	padding: 15px;
	color: #ddd;
	box-shadow: 1px 1;
}

@media (min-width: 768px) {
	.input-section {
		width: unset;
	}
}
</style>
