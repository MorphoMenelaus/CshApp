<template>

	<div id="nav-container" :class="isMobile ? 'mobile' : ''">
		<div v-if="isMobile" class="mobile-menu-icon">
			<div id="hamburger" @click="showHideNav()">
				<div></div>
				<div></div>
				<div></div>
			</div>
			<div class="home-title">
				<RouterLink to="/" title="Home" @click="closeDialogs('home_title')">CSH</RouterLink>
			</div>
		</div>
		<Transition name="slide-down">
			<nav aria-label="main menu" v-if="!isMobile || mobileMenuShow" @touchstart="handleTouchStart"
				@touchend="handleTouchEnd">
				<RouterLink v-if="!isMobile" to="/" title="Home" class="home-icon" @click="closeDialogs('home_icon')">
					<img src="/favicon.ico" alt="CSH App">
				</RouterLink>
				<RouterLink to="/" @click="closeDialogs()" title="Home">Home</RouterLink>
				<RouterLink to="/movie-database" @click="closeDialogs('movie_db')" title="Movie Database">Movie DB
				</RouterLink>
				<RouterLink
					v-if="appState?.isLoggedOn && (appState?.permissions.admin || appState?.permissions.siteAdmin)"
					to="/blog-reader" @click="closeDialogs('blog')" title="Blog Reader">Blog
				</RouterLink>
				<RouterLink
					v-if="appState?.isLoggedOn && (appState?.permissions.admin || appState?.permissions.siteAdmin)"
					to="/displayusers" @click="closeDialogs('users')" title="Display Users">Users
				</RouterLink>
				<RouterLink v-if="appState?.isLoggedOn && appState?.permissions.verified" to="/displayuserlogs"
					@click="closeDialogs('user_logs')" title="Display User Logs">User
					Logs</RouterLink>
				<RouterLink to="/resume" @click="closeDialogs('resume')" title="Chris Hardwick Resume">Resume
				</RouterLink>
				<RouterLink to="/weather" @click="closeDialogs('weather')" title="Weather">Weather</RouterLink>
				<RouterLink v-if="appState?.isLoggedOn && appState?.permissions.admin" to="/toggl"
					@click="closeDialogs('toggl')" title="Toggl Time Tracker">Toggl
				</RouterLink>
				<RouterLink
					v-if="appState?.isLoggedOn && (appState?.permissions.admin || appState?.permissions.siteAdmin)"
					to="/simpleclock" @click="closeDialogs('simple_clock')" title="Simple Clock">Simple Clock
				</RouterLink>
				<RouterLink to="/about" @click="closeDialogs('about')" title="About Chris Hardwick">About</RouterLink>
			</nav>
		</Transition>
	</div>

</template>

<script>
import { inject } from "vue";

export default {
	name: "MainNavbar",
	props: {
		appState: Object,
		isMobile: Boolean,
	},
	data() {
		return {
			contactEmail: inject("contactEmail"),
			loginShowEvent: inject("loginShow"),
			registerUser: inject('registerUser'),
			mobileMenuShow: false,
			startY: 0
		};
	},
	watch: {
	},
	methods: {
		closeDialogs(link_name = 'unkown') {
			this.sendAnalyticsEvent('main_nav', link_name);
			this.loginShowEvent(false);
			this.registerUser(false);
			this.contactEmail(false);
			// this.eventBus.emit("contactEmail", false);
			this.mobileMenuShow = false;
		},
		showHideNav() {
			this.mobileMenuShow = this.mobileMenuShow ? false : true;
			// this.mobileMenuShow = this.isMobile && this.mobileMenuShow ? false : true;
		},
		handleTouchStart(event) {
			this.startY = event.touches[0].clientY;
		},
		handleTouchEnd(event) {
			let endY = event.changedTouches[0].clientY;
			let diff = this.startY - endY;

			if (diff > 50) {
				this.mobileMenuShow = false;
			}
		},
	},
	created() {
		// this.eventBus.on("closeMainNav", () => {
		// 	this.mobileMenuShow = false;
		// });
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
	z-index: -1;
	overflow: hidden;
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
	font-size: 18px;
	user-select: none;
}

.mobile .home-title {
	justify-content: center;
	align-items: center;
	width: calc(100% - 220px);
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
	font-size: 1.75em;
	text-decoration: none;
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
	z-index: 1;
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
	font-size: 18px;
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
	/* color: #100f2e; */
	color: #f2f1ff;
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
