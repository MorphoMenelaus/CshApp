<script setup>
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>

	<Header :appState="appState" :serverVersion="serverVersion" />

	<RouterView id="view" :appState="appState" />

	<Footer />

</template>

<script>
// @ is an alias to /src
import { ref, reactive } from "vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
// import sessionMethods from "@/dependencies/sessionMethods";
// import sharedScripts from "@/dependencies/sharedScripts";

export default {
	components: {
		Header,
		Footer,
	},
	data() {
		return {
			appStatus: Object.assign({}, this.appStatus),
			serverVersion: "",
			// serverMessage: "",
			appState: {}
		};
	},
	watch: {
	},
	methods: {
		async getServrVersion() {
			try {
				const response = await fetch('/api/serverInfo');
				const data = await response.json();
				this.serverVersion = data?.version || "";
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		},
		setLoadingIcon() {
			let loadingIcon = document.getElementById("loading-icon");
			if (this.casinoList.length === 0) {
				loadingIcon.classList.add("loading");
			} else {
				loadingIcon.classList.remove("loading");
			}
		},
	},
	created() {
		this.getServrVersion();
		this.eventBus.on("updateAppState", (newState) => {
			this.appState = newState;
		});
		this.eventBus.on("eventTest", (data) => {
			console.log(data);
		});
		this.eventBus.emit("getUsers", (data) => {
			console.log(data);
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
