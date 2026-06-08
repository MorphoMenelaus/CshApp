<template>

	<div class="login-status" v-if="appState?.isLoggedOn">
		<span>{{ appState.userName }}</span>
		<button class="btn" type="button" @click="openConfirmDialog()">Logout</button>
		<span id="delete-button" class="link" @click="currentComponent = 'DeleteUser'">Delete Account</span>
	</div>

	<div id="login" class="input-heading" :class="appState.isLoggedOn ? 'logged-on' : ''" v-if="!appState.isLoggedOn">
		<form class="input-section">
			<h1>Welcome</h1>
			<!-- <span class="loader"></span> -->
			<label for="userName">Login to continue</label>
			<input type="text" name="userName" v-model="userName" placeholder="Username" autocomplete="userName" />
			<input type="password" name="password" v-model="password" placeholder="Password"
				autocomplete="current-password" />
			<button class="btn login-btn" type="button" @click="login()">Login</button>
			<span @click="showRegisterUserComponent()">New User? <span class="link">Click to register</span>.</span>
		</form>
	</div>

	<div id="dialog-container">
		<dialog id="confirmDialog">
			<div>
				<h2>
					Are you sure you want to logout, {{ userName }}?
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
					updateAppState.isLoggedOn = true;
					this.eventBus.emit("updateAppState", updateAppState);

					this.appNotify.code = 200;
					this.appNotify.message = "Access Token acquired: Login Success";
					this.appNotify.success = true;
				} else {
					this.appNotify.code = 400;
					this.appNotify.message = "Invalid credentials";
					this.appNotify.success = false;
				}

				this.eventBus.emit("updateStatus", this.appNotify);

			} catch (e) {
				console.error(e);
			}
		},
		openConfirmDialog() {
			this.dialog.showModal()
		},
		async logout(forcedLogout = false) {

			let body = {
				userName: this.appState.userName,
			};

			try {

				this.dialog.close();

				// if (!forcedLogout) {
				// 	let confirmLogout = confirm(
				// 		`Are you sure you want to logout, ${this.displayName}`
				// 	);
				// 	if (!confirmLogout) return false;
				// }

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
			}
		},
	},
	mounted() {
		this.dialog = document.getElementById("confirmDialog");
	},
	created() {
		this.eventBus.on("cancelDeleteUser", () => {
			this.currentComponent = null;
		});
		this.eventBus.on("UserDeleted", () => {
			this.currentComponent = null;
			this.logout(true);
		});
		onBeforeUnmount(() => {
			this.eventBus.off("cancelDeleteUser");
			this.eventBus.off("UserDeleted");
		});
	},
};
</script>

<!-- scoped attribute to limit CSS to this component only -->
<style scoped>
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
	backdrop-filter: blur(8px);
}

.dialog-buttons {
	display: flex;
	justify-content: space-evenly;
	margin: 30px auto 0;
}

.cancel {
	background-color: #3f445f;
}

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

.login-btn {
	margin-top: 15px !important;
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
	padding: 30px 30px 45px;
	margin: 30px auto;
	background: rgb(49 59 100 / 70%);
	border-radius: 8px;
	box-shadow: inset -1px -1px 15px 1px rgb(13 28 37 / 50%);
}

.input-section>* {
	margin: 15px 15px 0;
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
	user-select: none;
}

.link:hover {
	color: #ff6600;
}

#delete-button {
	font-size: 1.25em;
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
