<script setup>
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>

	<Header :appState="appState" />

	<Login :appState="appState" />

	<RouterView :appState="appState" id="view" />

	<Footer :serverVersion="serverVersion" />

	<component :is="currentComponent" :appState="appState" />

</template>

<script>
// @ is an alias to /src
// import { ref, reactive } from "vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";

import session from "@/dependencies/sessionMethods.js";
// import sharedScripts from "@/dependencies/sharedScripts";

export default {
	components: {
		Header,
		Footer,
		Login,
		Register
	},
	data() {
		return {
			appNotify: Object.assign({}, this.appNotify),
			serverVersion: "",
			appState: {},
			currentComponent: null
		};
	},
	watch: {
		currentComponent() {
		},
	},
	methods: {
		recallAppState(){
			this.appState = session.recall.get();
		},
		// async refreshSessionData() {

		// 	// this.appState = this.appState || session.recall.get();
		// 	this.appState = session.recall.get();
		// 	console.log(this.appState)


		// 	try {
		// 		// let sessionRefreshedStatus = await this.checkAndRefreshSession();

		// 		// if (sessionRefreshedStatus?.success) {
		// 		let mergedSession = {
		// 			...this.appState,
		// 			...session.recall.get(),
		// 		};
		// 		let updateState = mergedSession;
		// 		this.appState = updateState;

		// 		session.recall.save(updateState);

		// 		// if (await this.checkAndRefreshSession()) this.sessionRefreshCheck = new Date().getTime();

		// 		await this.eventBus.emit("updateStatus", await sessionRefreshedStatus);
		// 		// return sessionRefreshedStatus;
		// 		// } else {
		// 		// 	await this.eventBus.emit("updateStatus", sessionRefreshedStatus);
		// 		// 	return sessionRefreshedStatus;
		// 		// }
		// 	} catch (e) {
		// 		console.error(e);
		// 		return false;
		// 	}
		// },
		async checkTokenExpireAndRefresh() {
			// accessTokenExpiration in milliseconds
			let accessTokenExpiration = this.appState.accessTokenExpiration;
			let currentTime = new Date().getTime();
			let minute = 60000; // refresh a minute early to prevent expiration overlap

			if (currentTime - minute > accessTokenExpiration)
				this.refreshToken();
		},
		async refreshToken() {

			try {
				let body = {
					accessToken: this.appState.accessToken,
					refreshToken: this.appState.refreshToken,
				};

				const response = await fetch('/api/auth/refresh', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body)
				});

				let dataObj = await response.json();

				console.log(dataObj);

				let updateAppState = this.appState;
				if (dataObj?.success) {
					updateAppState.accessToken = dataObj.accessToken;
					updateAppState.accessTokenExpiration = dataObj.accessTokenExpiration;
					updateAppState.refreshToken = dataObj.refreshToken;
					this.eventBus.emit("updateAppState", updateAppState);

					this.appNotify.code = 200;
					this.appNotify.message = "New Access Token acquired: Refresh Success";
					this.appNotify.success = true;
				} else {
					this.appNotify.code = 400;
					this.appNotify.message = "Refresh Failed. Please, log in again.";
					this.appNotify.success = false;
					this.eventBus.emit("updateAppState", {});
				}

				this.eventBus.emit("updateStatus", this.appNotify);

			} catch (e) {
				console.error(e);
			}
		},
		async getServrVersion() {
			try {
				const response = await fetch('/api/serverInfo');
				const data = await response.json();
				this.serverVersion = data?.version || "";
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		},
	},
	created() {
		this.getServrVersion();
		this.recallAppState();
		// this.refreshSessionData();
		this.eventBus.on("updateAppState", (payload) => {
			this.appState = payload;
			session.recall.save(this.appState);
		});
		this.eventBus.on("registerUser", (payload) => {
			this.currentComponent = payload ? "Register" : null;
		});
		this.eventBus.on("getUsers", (payload) => {
			console.log(payload);
		});
	},
	mounted() {
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#view {
	margin-top: 15px;
	padding: 15px;
}

header {
	line-height: 1.5;
	max-height: 100vh;
}

.logo {
	display: block;
	margin: 0 auto 2rem;
}

nav {
	width: 100%;
	font-size: 12px;
	text-align: center;
	margin-top: 2rem;
}

nav a.router-link-exact-active {
	color: var(--color-text);
}

nav a.router-link-exact-active:hover {
	background-color: transparent;
}

nav a {
	display: inline-block;
	padding: 0 1rem;
	border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
	border: 0;
}

@media (min-width: 1024px) {
	/* header {
		display: flex;
		place-items: center;
		padding-right: calc(var(--section-gap) / 2);
	} */

	header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100000;
	}

	.logo {
		margin: 0 2rem 0 0;
	}

	header .wrapper {
		display: flex;
		place-items: flex-start;
		flex-wrap: wrap;
	}

	nav {
		text-align: left;
		margin-left: -1rem;
		font-size: 1rem;

		padding: 1rem 0;
		margin-top: 1rem;
	}
}
</style>
