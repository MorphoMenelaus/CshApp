<template>

	<div id="nav-container" :class="isMobile ? 'mobile' : ''">
		<div v-if="isMobile" class="mobile-menu-icon">
			<div id="hamburger" @click="showHideNav()">
				<div></div>
				<div></div>
				<div></div>
			</div>
			<div class="home-title">
				<RouterLink to="/" title="Home" @click="mobileMenuShow = false">CSH App</RouterLink>
			</div>
		</div>
		<nav aria-label="main menu" v-if="!isMobile || mobileMenuShow">
			<RouterLink v-if="!isMobile" to="/" title="Home" class="home-icon" @click="mobileMenuShow = false"><img
					src="/favicon.ico" alt="CSH App">
			</RouterLink>
			<RouterLink to="/" @click="mobileMenuShow = false">Home</RouterLink>
			<RouterLink v-if="appState?.isLoggedOn" to="/movie-database" @click="mobileMenuShow = false">Movie Database
			</RouterLink>
			<RouterLink v-if="appState?.isLoggedOn" to="/userpreferences" @click="mobileMenuShow = false">
				UserPreferences</RouterLink>
			<RouterLink v-if="appState?.isLoggedOn" to="/displayusers" @click="mobileMenuShow = false">Display Users
			</RouterLink>
			<RouterLink v-if="appState?.isLoggedOn && appState?.permissions.admin" to="/displayuserlogs"
				@click="mobileMenuShow = false">Display User
				Logs</RouterLink>
			<RouterLink v-if="appState?.isLoggedOn && appState?.permissions.admin" to="/simpleclock"
				@click="mobileMenuShow = false">Simple Clock
			</RouterLink>
			<RouterLink to="/about" @click="mobileMenuShow = false">About</RouterLink>
		</nav>
	</div>

</template>

<script>
export default {
	name: "MainNavbar",
	props: {
		appState: Object,
		isMobile: Boolean
	},
	data() {
		return {
			mobileMenuShow: false
		};
	},
	watch: {
		// isMobile() {
		// 	this.mobileMenuShow = !this.isMobile;
		// }
	},
	methods: {
		showHideNav() {
			console.log("showHideNav");
			this.mobileMenuShow = this.mobileMenuShow ? false : true;
			// this.mobileMenuShow = this.isMobile && this.mobileMenuShow ? false : true;
		}
	},
	created() {
		this.eventBus.on("closeMainNav", () => {
			this.mobileMenuShow = false;
		});
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mobile nav {
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-flow: column;
	width: 100%;
	margin: auto;
	padding: 15px;
	background-color: #313b64;
	border-bottom: 1px solid #fff;
	z-index: 100;
}

#nav-container.mobile {
	background-color: #313b64;
	border-bottom: 1px #fff solid;
}

.mobile-menu-icon {
	margin: 15px;
}

#hamburger {
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 56px;
	height: 56px;
	margin: 20px 10px;
	padding: 5px;
	border: 1px solid #aaa;
	border-radius: 100%;
}

#hamburger div {
	margin: 5px;
	border: 1px #fff solid;
}

.mobile .home-title {
	position: absolute;
	top: 20px;
	left: 98px;
	display: flex;
	align-items: center;
	font-size: 1.75em;
}

.mobile .home-title {
	justify-content: center;
	align-items: center;
	width: calc(100% - 220px);
	font-size: 1.75em;
	display: flex;
	position: absolute;
	top: 25px;
	left: 100px;
	margin: auto;
}

.home-title a {
	/* font-weight: bold; */
	background-color: unset;
	color: #fff;
	box-shadow: unset;
}

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
	/* position: absolute; */
	position: fixed;
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

.mobile nav a {
	width: 90%;
	text-align: center;
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
