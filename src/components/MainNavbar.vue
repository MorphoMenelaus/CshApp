<script setup>
import { ref, onMounted, watch, inject } from "vue";
import { permissionsModel } from "@/dependencies/models.js";

const props = defineProps({
	appState: Object,
	isMobile: Boolean,
	mobileDropdownClose: Boolean,
});

const sendAnalyticsEvent = inject("sendAnalyticsEvent");
const mobileDropdownEvent = inject("mobileDropdownEvent");
const contactEmail = inject("contactEmail");
const personalRestricted = inject("personalRestricted");
const loginShow = inject("loginShow");
const registerUser = inject("registerUser");
const permissions = ref(permissionsModel);
const mobileMenuShow = ref(false);
const startY = ref(0);

const closeDialogs = (link_name = "unkown") => {
	sendAnalyticsEvent("main_nav", link_name);
	loginShow(false);
	registerUser(false);
	contactEmail(false);
	mobileMenuShow.value = false;
};

const showHideNav = () => {
	mobileMenuShow.value = mobileMenuShow.value ? false : true;
};

const handleTouchStart = (event) => {
	startY.value = event.touches[0].clientY;
};

const handleTouchEnd = (event) => {
	let endY = event.changedTouches[0].clientY;
	let diff = startY.value - endY;

	if (diff > 50) {
		mobileMenuShow.value = false;
	}
};

const allowed = (required = []) => {
	let userPermissions = permissions.value;

	// If account is not verirfied, reject. Even accounts with elevated priveleges.
	// Right now this is the most convenient way to disable an account without changing any other account settings.
	if (required.includes("verified") && !userPermissions.verified) return false;

	switch (true) {
		case required.includes("admin") && userPermissions.admin:
			return true;
		case required.includes("siteAdmin") && userPermissions.siteAdmin:
			return true;
		case required.includes("siteEditor") && userPermissions.siteEditor:
			return true;
		case required.includes("contributor") && userPermissions.contributor:
			return true;
		case required.includes("verified") && userPermissions.verified:
			return true;
		case required.length === 0 && userPermissions.loggedIn:
			return true;
		default:
			return false;
	}
};

watch(
	[() => props.mobileDropdownClose, () => props.appState],
	([newMobile, newState], [oldMobile, oldState]) => {
		if (newMobile !== oldMobile) {
			if (props.mobileDropdownClose) {
				mobileMenuShow.value = false;
				mobileDropdownEvent(false);
			}
		}
		permissions.value = newState?.permissions || permissionsModel;
	},
	{ deep: true },
);

onMounted(() => {
	permissions.value = props?.appState?.permissions || permissionsModel;
});
</script>

<template>
	<div id="nav-container" :class="isMobile ? 'mobile' : ''">
		<div v-if="isMobile" class="mobile-menu-icon">
			<div id="hamburger" @click="showHideNav()">
				<div></div>
				<div></div>
				<div></div>
			</div>
			<div class="home-title">
				<RouterLink to="/" title="Home" @click="closeDialogs('home_title')">
					<img src="/icons/CS20260822_128.png" alt="CSH App" />
				</RouterLink>
			</div>
		</div>
		<Transition name="slide-down">
			<nav aria-label="main menu" v-if="!isMobile || mobileMenuShow" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
				<RouterLink v-if="!isMobile" to="/" title="Home" class="home-icon" @click="closeDialogs('home_icon')">
					<img src="/icons/CS20260822_128.png" alt="CSH App" />
				</RouterLink>
				<RouterLink to="/" @click="closeDialogs()" title="Home">Home</RouterLink>
				<RouterLink to="/movie-database" @click="closeDialogs('movie_db')" title="Movie Database">Movie DB</RouterLink>
				<RouterLink
					v-if="appState?.isLoggedOn && allowed(['verified', 'admin', 'siteAdmin']) && !personalRestricted"
					to="/blog-reader"
					@click="closeDialogs('blog')"
					title="Blog Reader"
					>Blog
				</RouterLink>
				<RouterLink
					v-if="appState?.isLoggedOn && allowed(['verified', 'admin', 'siteAdmin']) && !personalRestricted"
					to="/displayusers"
					@click="closeDialogs('users')"
					title="Display Users"
					>Users
				</RouterLink>
				<RouterLink
					v-if="appState?.isLoggedOn && allowed(['verified'])"
					to="/displayuserlogs"
					@click="closeDialogs('user_logs')"
					title="Display User Logs"
					>User Logs</RouterLink
				>
				<RouterLink to="/resume" @click="closeDialogs('resume')" title="Chris Hardwick Resume">Resume </RouterLink>
				<RouterLink to="/weather" @click="closeDialogs('weather')" title="Weather">Weather</RouterLink>
				<RouterLink
					v-if="appState?.isLoggedOn && allowed(['verified', 'admin']) && !personalRestricted"
					to="/toggl"
					@click="closeDialogs('toggl')"
					title="Toggl Time Tracker"
					>Toggl
				</RouterLink>
				<RouterLink
					v-if="appState?.isLoggedOn && allowed(['verified', 'admin', 'siteAdmin'])"
					to="/simpleclock"
					@click="closeDialogs('simple_clock')"
					title="Simple Clock"
					>Simple Clock
				</RouterLink>
				<RouterLink to="/about" @click="closeDialogs('about')" title="About Chris Hardwick">About</RouterLink>
			</nav>
		</Transition>
	</div>
</template>

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

.home-title a {
	display: flex;
	align-items: center;
}

.home-title a img {
	height: 48px;
}

a.home-icon {
	display: contents;
}

.home-icon img {
	margin-right: 15px;
	height: 64px;
	cursor: pointer;
	object-fit: contain;
}

#nav-container {
	/* position: absolute; */
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	margin: auto;
	/* z-index: 1; */
	z-index: 15000;
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
