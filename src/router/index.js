import { createRouter, createWebHistory } from "vue-router";
import { dispatchCustomEvent, routerStateService } from "@/dependencies/csh-libs.js";
import HomeView from "@/views/HomeView.vue";

// requiredPermissions(array): list of all permissions required for a path location
// public(bool): Public path overrides any permissions declared in requiredPermissions
// public = false: Requires loggedIn(true) minimum
const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
			meta: { public: true, requiredPermissions: [], title: "Hardwick Web Development | Home" },
		},
		{
			path: "/movie-database",
			name: "MovieDatabase",
			component: () => import("../views/MovieDatabase.vue"),
			meta: { public: true, requiredPermissions: [], title: "Movie Database | Hardwick Web Development" },
		},
		{
			path: "/blog-reader",
			name: "BlogReader",
			component: () => import("../views/BlogReader.vue"),
			meta: { public: false, requiredPermissions: ["siteAdmin", "admin"], title: "Blog Reader | Hardwick Web Development" },
		},
		{
			path: "/verify",
			name: "Verify",
			component: () => import("../views/Verify.vue"),
			meta: { public: false, requiredPermissions: [], title: "Verify Code | Hardwick Web Development" },
		},
		{
			path: "/userpreferences",
			name: "User Preferences",
			component: () => import("../views/UserPreferences.vue"),
			meta: { public: false, requiredPermissions: [], title: "User Preferences | Hardwick Web Development" },
		},
		{
			path: "/chartjs",
			name: "ChartJS",
			component: () => import("../views/ChartJS.vue"),
			meta: { public: true, requiredPermissions: [], title: "ChartJS | Hardwick Web Development" },
		},
		{
			path: "/displayusers",
			name: "DisplayUsers",
			component: () => import("../views/DisplayUsers.vue"),
			meta: { public: false, requiredPermissions: ["siteAdmin", "admin"], title: "Display Users | Hardwick Web Development" },
		},
		{
			path: "/displayuserlogs",
			name: "DisplayUserLogs",
			component: () => import("../views/DisplayUserLogs.vue"),
			meta: { public: false, requiredPermissions: ["verified"], title: "Display User Logs | Hardwick Web Development" },
		},
		{
			path: "/resume",
			name: "ResumeView",
			component: () => import("../views/ResumeView.vue"),
			meta: { public: true, requiredPermissions: [], title: "Chris Hardwick Resume | Hardwick Web Development" },
		},
		{
			path: "/toggl",
			name: "Toggl",
			component: () => import("../views/Toggl.vue"),
			meta: { public: false, requiredPermissions: ["admin"], title: "Toggl Time Tracker | Hardwick Web Development" },
		},
		{
			path: "/simpleclock",
			name: "SimpleClock",
			component: () => import("../views/SimpleClock.vue"),
			meta: { public: false, requiredPermissions: ["siteAdmin", "admin"], title: "Simple Clock | Hardwick Web Development" },
		},
		{
			path: "/about",
			name: "about",
			component: () => import("../views/AboutView.vue"),
			meta: { public: true, requiredPermissions: [], title: "About Chris Hardwick | Hardwick Web Development" },
		},
		{
			path: "/:pathMatch(.*)*",
			name: "NotFound",
			component: () => import("@/views/NotFound.vue"),
			meta: { public: true, requiredPermissions: [], title: "404 - Not Found | Hardwick Web Development" },
		},
	],
	scrollBehavior(to, from, savedPosition) {
		if (to.hash) {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve({
						el: to.hash,
						behavior: "smooth",
					});
				}, 200);
			});
		}
		// If the browser back/forward button is pressed, maintain the saved position
		if (savedPosition) {
			return savedPosition;
		}
		// Otherwise, always scroll to the top of the page
		return { top: 0 };
	},
});

router.beforeEach((to, from) => {
	// Force Canonical Route
	// Strips trailing slash and triggers a clean redirect loop before permission parsing
	if (to.path !== "/" && to.path.endsWith("/")) {
		return {
			path: to.path.slice(0, -1),
			query: to.query,
			hash: to.hash,
		};
	}

	// Dispatch event must happen after the Force Canonical Route to prevent multiple events from executing
	dispatchCustomEvent("routerPathChange");

	document.title = to.meta.title || "Hardwick Web Development";

	// Checks for public path. Anything after this check requires loggedIn(true) minimum
	if (to.meta.public) return true;

	// Prevents crashes if a route configuration forgets to define 'requiredPermissions'
	const requiredPerms = to.meta.requiredPermissions || [];

	const permissions = routerStateService.getPermissions();

	switch (true) {
		case requiredPerms.includes("admin") && permissions.admin:
			return true;
		case requiredPerms.includes("siteAdmin") && permissions.siteAdmin:
			return true;
		case requiredPerms.includes("siteEditor") && permissions.siteEditor:
			return true;
		case requiredPerms.includes("contributor") && permissions.contributor:
			return true;
		case requiredPerms.includes("verified") && permissions.verified:
			return true;
		case requiredPerms.length === 0 && permissions.loggedIn:
			return true;
		default:
			let res = {
				message: "You do not have permission to access the requested location. Please, try logging in again.",
				success: false,
			};
			dispatchCustomEvent("routerNotify", res);
			// If from.path exists and isn't the current destination, go back. Otherwise drop to root.
			return from.path && from.path !== to.path ? from.path : { path: "/" };
	}
});

router.afterEach((to, from) => {
	const container = document.getElementById("app");

	if (container) {
		container.scrollTo({ top: 0, left: 0, behavior: "instant" });
	}
});

export default router;
