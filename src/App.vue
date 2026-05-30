<script setup>
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
	<header>
		<img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

		<div class="wrapper">
			<HelloWorld msg="You did it!" />
			<p>
				Data from backend: <strong>{{ serverMessage }}</strong>
			</p>

			<nav>
				<RouterLink to="/">Home</RouterLink>
				<RouterLink to="/tic-tac-toe">Tic-Tac-Toe</RouterLink>
				<RouterLink to="/registerser">Register User</RouterLink>
				<RouterLink to="/nodeservertest">Node Server Test</RouterLink>
				<RouterLink to="/about">About</RouterLink>
			</nav>
		</div>
	</header>

	<RouterView />
</template>

<script>
// @ is an alias to /src
import { ref, reactive } from "vue";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import sessionMethods from "@/dependencies/sessionMethods";
// import sharedScripts from "@/dependencies/sharedScripts";

export default {
	components: {
		// Header,
		// Footer,
	},
	data() {
		return {
		};
	},
	watch: {
	},
	methods: {
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
		this.eventBus.on("eventTest", (data) => {
			console.log(data);
		});
		this.eventBus.on("userRegistered", (data) => {
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
		display: flex;
		place-items: center;
		padding-right: calc(var(--section-gap) / 2);
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
