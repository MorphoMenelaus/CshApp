<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>

	<div v-if="!appState?.isLoggedOn" id="dark-mode-check">
		<label for="uiDarkMode" title="Toggle dark mode">Dark Mode</label>
		<input id="uiDarkMode" title="Toggle dark mode" type="checkbox" v-model="uiDarkMode" />
	</div>

	<Header :appState="appState" :isMobile="isMobile" />

	<Login :appState="appState" />

	<RouterView :appState="appState" id="view" :isMobile="isMobile" :windowWidth="windowWidth" :class="isMobile ? 'mobile' : ''" />

	<Footer :serverVersion="serverVersion" :isMobile="isMobile" />

	<component :is="currentComponent" :appState="appState" />

</template>

<script>
// @ is an alias to /src
// import { ref, reactive } from "vue";
// import sharedScripts from "@/dependencies/sharedScripts";
import session from "@/dependencies/sessionMethods.js";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";
import ContactForm from "@/components/ContactForm.vue";

export default {
	components: {
		Header,
		Footer,
		Login,
		Register,
		ContactForm
	},
	data() {
		return {
			serverStatus: Object.assign({}, this.appNotify),
			body: document.getElementsByTagName('body'),
			serverVersion: "",
			appState: {},
			guestLoginDoc: false,
			currentComponent: null,
			isMobile: window.innerWidth < 1024,
			windowWidth: window.innerWidth,
			uiDarkMode: false
		};
	},
	watch: {
		uiDarkMode() {
			if (this.uiDarkMode) {
				this.body[0].classList.add("uiDarkMode");
			} else {
				this.body[0].classList.remove("uiDarkMode");
			}
		}
	},
	methods: {
		recallAppState() {
			this.appState = session.recall.get();
			this.uiDarkMode = this.appState?.user?.uiDarkMode || false;
		},
		// createNewStorage() {
		// 	// Create a new storage if it doesn't already exist
		// 	let currentStorage = session.storage.get();
		// 	let storageEmpty = Object.keys(currentStorage).length <= 0;
		// 	if (storageEmpty)
		// 		session.storage.save(this.storageState);
		// },
		// addRequiredDocs() {
		// 	// if properties don't exit, create one
		// 	let currentStorage = session.storage.get();
		// 	if(currentStorage?.guestLoginDoc)
		// 	session.storage.add(false, "guestLoginDoc");
		// },
		async getServerVersion() {
			try {
				const response = await fetch('/api/serverInfo');
				const data = await response.json();
				this.serverVersion = data?.version || "";
			} catch (error) {
				console.error('Error fetching server version:', error);
			}
		},
	},
	created() {
		this.getServerVersion();
		this.recallAppState();
		// this.createNewStorage();
		this.eventBus.on("updateAppState", (payload) => {
			this.appState = payload;
			session.recall.save(this.appState);
			this.uiDarkMode = this.appState?.user?.uiDarkMode || false;
		});
		this.eventBus.on("registerUser", (payload) => {
			this.currentComponent = payload.register ? "Register" : null;
		});
		this.eventBus.on("contactEmail", (bool) => {
			this.currentComponent = bool ? "ContactForm" : null;
		});
		window.addEventListener("resize", () => {
			this.isMobile = window.innerWidth < 1024;
			this.windowWidth = window.innerWidth;
		});
	},
	mounted() {
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#dark-mode-check {
	position: absolute;
	top: 15px;
	left: 15px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 8em;
	/* color: #000; */
	z-index: 1;
}

/* .uiDarkMode #dark-mode-check {
	color: #ddd;
} */

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
