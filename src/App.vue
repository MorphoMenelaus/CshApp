<script setup>
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>

	<div v-if="!appState?.isLoggedOn" id="dark-mode-check">
		<label for="uiDarkMode" title="Toggle dark mode">Dark Mode</label>
		<input id="uiDarkMode" title="Toggle dark mode" type="checkbox" v-model="uiDarkMode" />
	</div>

	<Header :appState="appState" :isMobile="isMobile" />

	<Login :appState="appState" />

	<RouterView :appState="appState" id="view" :isMobile="isMobile" :class="isMobile ? 'mobile' : ''" />

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
import ContactForm from "@/components/ContactForm.vue";

import session from "@/dependencies/sessionMethods.js";
// import sharedScripts from "@/dependencies/sharedScripts";

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
			currentComponent: null,
			isMobile: window.innerWidth < 1024,
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
	top: 110px;
	left: 15px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 8em;
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
