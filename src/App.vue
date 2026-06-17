<script setup>
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>

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
			serverStatus: Object.assign({}, this.appNotify),
			serverVersion: "",
			appState: {},
			currentComponent: null,
			isMobile: window.innerWidth < 1024
		};
	},
	watch: {
	},
	methods: {
		recallAppState() {
			this.appState = session.recall.get();
		},
		async getServrVersion() {
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
		this.getServrVersion();
		this.recallAppState();
		this.eventBus.on("updateAppState", (payload) => {
			this.appState = payload;
			session.recall.save(this.appState);
		});
		this.eventBus.on("registerUser", (payload) => {
			this.currentComponent = payload ? "Register" : null;
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
