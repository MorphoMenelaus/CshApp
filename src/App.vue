<template>

	<div id="loading-icon" :class="showHideLoader ? 'loading' : ''">
		<div class="spinner-comet"></div>
	</div>

	<div v-if="isMobileLandscape" class="rotate-warning background-img">
		<h2>For best user experience,<br />landscape view is not supported on mobile devices.</h2>
		<p>Please rotate your mobile device to portrait view.</p>
	</div>

	<div v-if="!appState?.isLoggedOn || appState?.userName == 'guest'" id="dark-mode-check">
		<label for="uiDarkMode" title="Toggle dark mode">Dark Mode</label>
		<input id="uiDarkMode" title="Toggle dark mode" type="checkbox" v-model="uiDarkMode" />
	</div>

	<div class="register-link" v-if="!appState?.isLoggedOn && !isMobile">
		<span>New User? <span class="link" @click="showRegisterUserComponent(false, true)"
				title="Click to register">Click to register</span>.<br />Or login with username "guest"</span>
	</div>

	<HeaderMain :appState="appState" :isMobile="isMobile" :sharedUpdateStatus="sharedUpdateStatus"
		:mobileDropdownClose="mobileDropdownClose" />

	<Login :appState="appState" :loginShow="loginShow" :forceLogoutEvent="forceLogoutEvent" :isMobile="isMobile" />

	<RouterView id="view" :appState="appState" :isMobile="isMobile" :windowWidth="windowWidth"
		:forceLogoutEvent="forceLogoutEvent" :class="isMobile ? 'mobile' : ''" />

	<FooterMain :serverVersion="serverVersion" :isMobile="isMobile" />

	<Transition name="fade">
		<component :is="currentComponent" :appState="appState" :class="isMobile ? 'mobile' : ''" />
	</Transition>

</template>

<script>
import { provide, inject } from 'vue';
import HeaderMain from "@/components/HeaderMain.vue";
import FooterMain from "@/components/FooterMain.vue";
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";
import ContactForm from "@/components/ContactForm.vue";
import { Storage, stateUpdateService } from "@/dependencies/csh-libs.js";

export default {
	components: {
		HeaderMain,
		FooterMain,
		Login,
		Register,
		ContactForm
	},
	data() {
		return {
			sharedUpdateStatus: {},
			forceLogoutEvent: {},
			mobileDropdownClose: null,
			recall: new Storage(),
			body: document.getElementsByTagName('body'),
			serverVersion: "",
			appState: {},
			appDevDuties: [],
			currentComponent: null,
			isMobile: window.innerWidth < 1024,
			isMobileLandscape: screen.orientation.type.includes("landscape") && window.innerHeight < 600,
			windowWidth: window.innerWidth,
			uiDarkMode: false,
			isHidden: false,
			lastScrollTop: 0,
			threshold: 50,
			showHideLoader: false,
			loginShow: false,
		};
	},
	watch: {
		uiDarkMode() {
			if (this.uiDarkMode) {
				this.body[0].classList.add("uiDarkMode");
			} else {
				this.body[0].classList.remove("uiDarkMode");
			}
		},
		currentComponent() {
			this.mobileDropdownClose = this.currentComponent ? true : false;
		}
	},
	methods: {
		checkOrientation() {
			this.isMobileLandscape = screen.orientation.type.includes("landscape") && window.innerHeight < 600;
		},
		async initialSetup() {
			this.getServerVersion();
			this.recallAppState();
			if (this.appState?.accessToken) {
				let checkTokens = await this.tokenCheck(this.appState);
				if (!checkTokens?.tokenValid) {
					let res = {
						code: 403,
						message: "Refresh Token Expired. Please login again.",
						success: false,
						forced: true
					};
					this.forceLogoutEvent = res;
				}
			}
			// The order of this getAppRolesData() call is important.
			// The recall and access token check should be done first.
			this.getAppRolesData();
		},
		showRegisterUserComponent(login = false, register = false) {
			this.currentComponent = register ? "Register" : null
			this.loginShow = login;
		},
		recallAppState() {
			this.appState = this.recall.get();
			this.uiDarkMode = this.appState?.user?.uiDarkMode || false;
		},
		handleStateUpdateEvent() {
			this.updateAppState(stateUpdateService.getState());
		},
		updateAppState(newState) {
			this.appState = newState;
			this.recall.save(this.appState);
			this.uiDarkMode = this.appState?.user?.uiDarkMode || false;
		},
		async getServerVersion() {
			try {
				const response = await fetch(`${this.baseUrl}/api/serverInfo`);
				if (response?.ok) {
					let data = await response.json();
					this.serverVersion = data?.version || "";
				}
			} catch (error) {
				console.error('Error fetching server version:', error);
			}
		},
		async getAppRolesData() {

			let headerObj = new Headers();
			headerObj.append("Content-Type", "application/json; charset=utf-8");
			let requestUrl = new URL("/api/blog/appduties/", this.baseUrl);

			let params = requestUrl.searchParams;
			params.set("time", new Date().getTime());
			requestUrl.search = params.toString();

			let request = new Request(
				requestUrl.toString(), {
				method: 'GET',
				headers: headerObj,
			});

			try {

				let response = await fetch(request);
				let data = await response.json();
				if (data?.success) {
					this.appDevDuties = data.appDevDuties;
					let updateAppState = this.appState;
					updateAppState.appDevDuties = this.appDevDuties = data.appDevDuties;
					this.updateAppState(updateAppState);
				}

			} catch (error) {
				console.error('Error reading data:', error);
			}
		},
		handleScroll(e) {
			// Not implemented yet.
			// Will require some layout and CSS changes
			const currentScrollTop = e.target.scrollTop;

			if (Math.abs(currentScrollTop - this.lastScrollTop) <= this.threshold) return;

			if (currentScrollTop > this.lastScrollTop && currentScrollTop > this.threshold) {
				this.isHidden = true; // Scrolling down
			} else {
				this.isHidden = false; // Scrolling up
			}
			this.lastScrollTop = currentScrollTop;
		},
	},
	async created() {
		/* BEGIN NEW EVENT HANDLING SECTION */
		let defaultStatus = {
			code: 403,
			message: "Session Expired. Please login again.",
			success: false,
			forced: true
		};
		provide("forceLogout", (status = defaultStatus) => this.forceLogoutEvent = status);
		provide("updateAppState", this.updateAppState);
		provide("initialSetup", this.initialSetup);
		provide("showHideLoader", (bool) => this.showHideLoader = bool);
		provide("loginShow", (bool) => this.loginShow = bool);
		provide("registerUser", (bool) => this.currentComponent = bool ? "Register" : null);
		provide("contactEmail", (bool) => this.currentComponent = bool ? "ContactForm" : null);
		provide("sendUpdateStatus", (payload) => this.sharedUpdateStatus = payload);
		provide("mobileDropdownEvent", (bool) => this.mobileDropdownClose = bool);
		/* END NEW EVENT HANDLING SECTION */

		screen.orientation.addEventListener("change", this.checkOrientation);
		window.addEventListener("appStateChange", this.handleStateUpdateEvent);
		window.addEventListener("forceLogout", (e) => this.forceLogoutEvent = e?.detail);
		window.addEventListener("keydown", (down) => {
			if (down.key === "Escape")
				this.currentComponent = null;
		});
		window.addEventListener("resize", () => {
			this.isMobile = window.innerWidth < 1024;
			this.windowWidth = window.innerWidth;
			this.checkOrientation();
		});
		window.addEventListener('storage', (event) => {
			if (event.key === this.recall.getstorageKey()) {
				this.recallAppState();
			}
		});

		this.checkOrientation();
		this.initialSetup();
	},
};
</script>

<style scoped>
span.link {
	font-weight: bold;
}

#dark-mode-check {
	position: absolute;
	top: 15px;
	left: 15px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: column;
	width: 6em;
	/* color: #000; */
	z-index: 1;
}

.register-link {
	right: 15px;
	position: absolute;
	font-weight: bold;
	z-index: 1;
	color: #000;
}

.uiDarkMode .register-link {
	color: #fff;
}

#dark-mode-check label {
	cursor: pointer;
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

.rotate-warning {
	position: fixed;
	inset: 0;
	background-color: #1a1a1a;
	color: #fff;
	z-index: 999999;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: 15px;
	background-position-y: top;
}

#loading-icon {
	display: none;
	align-content: center;
	justify-content: center;
	position: fixed;
	top: 94px;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100vw;
	background-color: rgb(0 0 0 / 50%);
	backdrop-filter: blur(5px);
	transition: background-color .3 ease-in-out;
	z-index: 15000;
}

.loader-icon {
	height: 48px;
	width: 48px;
	border: 3px solid;
	border-radius: 100%;
	border-color: red white blue black;
	animation: loader 0.5s linear infinite;
}

#loading-icon.loading {
	display: grid;
}

@media (min-width: 1024px) {
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
