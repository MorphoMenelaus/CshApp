<template>

	<div id="nav-container">
		<nav aria-label="main menu">
			<RouterLink to="/" title="Home" class="home-icon"><img src="/favicon.ico" alt="CSH App"></RouterLink>
			<RouterLink to="/">Home</RouterLink>
			<RouterLink v-if="appState?.isLoggedOn" to="/tic-tac-toe">Tic-Tac-Toe</RouterLink>
			<RouterLink v-if="appState?.isLoggedOn" to="/userpreferences">UserPreferences</RouterLink>
			<RouterLink v-if="appState?.isLoggedOn" to="/displayusers">Display Users</RouterLink>
			<RouterLink v-if="appState?.isLoggedOn && appState?.permissions.admin" to="/simpleclock">Simple Clock</RouterLink>
			<RouterLink to="/about">About</RouterLink>
			<span id="loading-icon"></span>
		</nav>
	</div>

</template>

<script>
export default {
	name: "MainNavbar",
	props: {
		appState: {
			type: Object,
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a.home-icon {
	display: contents;
}

.home-icon img {
	margin-right: 15px;
	height: 56px;
	width: 56px;
	cursor: pointer;
}

#nav-container {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	margin: auto;
}

nav {
	width: 100%;
	margin: auto;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	justify-content: center;
	padding: 15px;
	border-bottom: 1px #fff solid;
	background-color: #313b64;
}

/* #nav {
	position: relative;
	top: 0;
	width: 20%;
	height: calc(100vh - 150px);
	background-color: #bccfe5;
	float: left;
	box-shadow: 1px 0px 6px rgb(0 0 0 / 50%);
	overflow: hidden auto;
	list-style: none;
	padding: 0;
} */

nav a.router-link-exact-active {
	color: #100f2e;
}

nav a {
	display: block;
	background-color: #5b88c0;
	margin: 10px;
	padding: 10px;
	border-radius: 6px;
	font-weight: bold;
	text-decoration: none;
	transition: 0.3s;
	color: #dceeff;
	user-select: none;
	cursor: pointer;
	box-shadow: inset -1px -1px 15px 0px rgb(0 0 0 / 40%);
}

nav a:hover,
.login-link:hover {
	transform: scale(1.025);
	background-color: #3b67a1;
	color: white;
}

.router-link-active,
.router-link-active:hover {
	transform: scale(1);
	background-color: green;
	box-shadow: inset 0px 0px 14px rgb(0 0 0 / 44%);
	cursor: default;
}
</style>
