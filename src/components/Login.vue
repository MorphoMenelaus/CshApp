<template>
	<div id="login" class="input-heading">
		<div class="login-status" v-if="isLoggedOn">
			<span>{{ displayName }}</span>
			<button type="button" @click="logout()">Logout</button>
		</div>
		<form class="input-section" v-if="!isLoggedOn">
			<!-- <span class="loader"></span> -->
			<label for="casinoId">Please select a casino: </label>
			<input type="text" name="userName" v-model="userName" placeholder="Username" autocomplete="userName" />
			<input type="password" name="password" v-model="password" placeholder="Password"
				autocomplete="current-password" />
			<button type="button" @click="login()">Login</button>
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
		appState: {
			handler(val, oldVal) {
				this.updateUserInfo();
			},
			deep: true,
		},
	},
	data() {
		return {
			appStatus: Object.assign({}, this.appStatus),
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
		updateUserInfo() { },
		async login() {
			let globalState = this.$store.state;
			try {
				let body = {
					phoneNumber: this.userName,
					password: this.password,
				};

				if (!this.userName || !this.password) {
					this.appStatus.message =
						"Please provide a valid phone number and password.";
					this.appStatus.ok = false;
					this.eventBus.emit("updateStatus", this.appStatus);
					return this.appStatus;
				}

				let requestUrl = new URL(
					"/api/v1/authentication/login",
					sessionMethods.baseUrl
				);
				let headerObj = new Headers();
				headerObj.append("Content-Type", "application/json; charset=utf-8");
				let request = new Request(requestUrl.toString(), {
					method: "POST",
					body: JSON.stringify(body),
					headers: headerObj,
				});
				const response = await fetch(request);

				let fetchStatus = sharedScripts.checkFetchErrors(response);

				if (fetchStatus && !fetchStatus.ok) {
					this.eventBus.emit("updateStatus", fetchStatus);
					return;
				}
				let dataObj = await response.json();

				globalState.casinoName = this.casinoName =
					this.casinoList[this.casinoId - 1].name; // casino id is not zero indexed
				globalState.casinoId = this.casinoId;
				globalState.accessToken = dataObj.accessToken;
				globalState.accessTokenExpiration = dataObj.accessTokenExpiration;
				globalState.refreshToken = dataObj.refreshToken;
				globalState.userId = dataObj.userId;
				globalState.userName = this.userName;
				globalState.displayName = this.displayName = dataObj.displayName;
				globalState.isLoggedOn = this.isLoggedOn = true;
				this.userPermissions = await sessionMethods.getUserPermissions(
					globalState.userId,
					globalState.accessToken
				);
				this.userPermissions =
					this.userPermissions.ok && !this.userPermissions.ok
						? {}
						: this.userPermissions;
				this.sitePermissions = this.userPermissions.sitePermissions;
				globalState.userPermissions = this.userPermissions;
				this.isSiteAdmin =
					this.sitePermissions?.[globalState.casinoId]?.includes("SiteAdmin");
				this.isCashier =
					this.sitePermissions?.[globalState.casinoId]?.includes("Cashier");
				this.isReporter =
					this.sitePermissions?.[globalState.casinoId]?.includes("Reporter");
				globalState.isSiteAdmin = this.isSiteAdmin;
				globalState.isCashier = this.isCashier;
				globalState.isReporter = this.isReporter;

				sessionMethods.session.save({
					accessToken: globalState.accessToken,
					refreshToken: globalState.refreshToken,
					accessTokenExpiration: globalState.accessTokenExpiration,
					casinoList: globalState.casinoList,
					casinoId: globalState.casinoId, // casino id is not zero indexed
					casinoName: globalState.casinoName,
					userId: globalState.userId,
					userName: globalState.userName,
					displayName: globalState.displayName,
					userPermissions: globalState.userPermissions,
					isSiteAdmin: globalState.isSiteAdmin,
					isCashier: globalState.isCashier,
					isReporter: globalState.isReporter,
					isLoggedOn: globalState.isLoggedOn,
				});

				this.activeSession = globalState;

				this.eventBus.emit("updateStatus", fetchStatus);
				this.eventSync.time = new Date().getTime();
				this.eventBus.emit("checkAndRefreshSession");
				if (this.userPermissions)
					this.eventBus.emit("updateSession", globalState);

				this.eventBus.emit("updateCashierState", globalState);
			} catch (e) {
				console.error(e);
			}
		},
		logout() {
			let confirmLogout = confirm(
				`Are you sure you want to logout, ${this.displayName}`
			);
			if (!confirmLogout) return false;
			sharedScripts.logout(this);
			this.isLoggedOn =
				this.isCashier =
				this.isReporter =
				this.isSiteAdmin =
				false;
			this.displayName = this.userName = "";
			this.userPermissions = this.activeSession = {};
			this.$store.replaceState({
				casinoList: this.casinoList,
			});
			this.$forceUpdate();
			this.eventBus.emit("updateSession", this.$store.state);
		},
	},
	async mounted() {
		// this.isLoggedOn = this.cashierState?.isLoggedOn || false;
		// this.userId = this.cashierState?.userId || "";
		// this.userName = this.cashierState?.userName || "";
		// this.displayName = this.cashierState?.displayName || "";
		// this.userPermissions = this.cashierState?.userPermissions || {};
		// this.sitePermissions =
		//   this.cashierState?.userPermissions?.sitePermissions || {};
		// if (Object.keys(this.sitePermissions).length > 0) {
		//   this.isSiteAdmin =
		//     this.sitePermissions[this.cashierState.casinoId]?.includes("SiteAdmin");
		//   this.isCashier =
		//     this.sitePermissions[this.cashierState.casinoId]?.includes("Cashier");
		//   this.isReporter =
		//     this.sitePermissions[this.cashierState.casinoId]?.includes("Reporter");
		// }
		// this.eventBus.emit("updateSession", this.cashierState);
		// this.eventBus.emit("checkAndRefreshSession");
	},
	created() {
		// this.$store.replaceState(sessionMethods.session.get());
	},
};
</script>

<!-- scoped attribute to limit CSS to this component only -->
<style scoped>
#login {
	position: absolute;
	top: 230px;
	right: 0;
	width: 80%;
}

#login .input-section {
	background: rgb(71 68 196 / 40%);
	padding: 30px;
	position: relative;
	top: 0;
	/* left: 10vw; */
	backdrop-filter: blur(8px);
	border-radius: 12px;
	box-shadow: inset -1px -1px 15px 1px rgb(13 28 37 / 50%);
	max-width: 30em;
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
