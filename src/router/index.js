import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
			meta: { requiresAuth: false, title: 'Hardwick Web Development | Home' }
		},
		{
			path: '/movie-database',
			name: 'MovieDatabase',
			component: () => import('../views/MovieDatabase.vue'),
			meta: { requiresAuth: true, title: 'Movie Database | Hardwick Web Development' }
		},
		{
			path: '/blog-reader',
			name: 'BlogReader',
			component: () => import('../views/BlogReader.vue'),
			meta: { requiresAuth: true, title: 'Blog Reader | Hardwick Web Development' }
		},
		{
			path: '/verify',
			name: 'Verify',
			component: () => import('../views/Verify.vue'),
			meta: { requiresAuth: false, title: 'Verify Code | Hardwick Web Development' }
		},
		{
			path: '/userpreferences',
			name: 'User Preferences',
			component: () => import('../views/UserPreferences.vue'),
			meta: { requiresAuth: true, title: 'User Preferences | Hardwick Web Development' }
		},
		{
			path: '/weather',
			name: 'Weather',
			component: () => import('../views/WeatherBasic.vue'),
			meta: { requiresAuth: true, title: 'Weather | Hardwick Web Development' }
		},
		{
			path: '/displayusers',
			name: 'DisplayUsers',
			component: () => import('../views/DisplayUsers.vue'),
			meta: { requiresAuth: true, title: 'Display Users | Hardwick Web Development' }
		},
		{
			path: '/displayuserlogs',
			name: 'DisplayUserLogs',
			component: () => import('../views/DisplayUserLogs.vue'),
			meta: { requiresAuth: true, title: 'Display User Logs | Hardwick Web Development' }
		},
		{
			path: '/resume',
			name: 'ResumeView',
			component: () => import('../views/ResumeView.vue'),
			meta: { requiresAuth: true, title: 'Chris Hardwick Resume | Hardwick Web Development' }
		},
		{
			path: '/toggl',
			name: 'Toggl',
			component: () => import('../views/Toggl.vue'),
			meta: { requiresAuth: true, title: 'Toggl Time Tracker | Hardwick Web Development' }
		},
		{
			path: '/simpleclock',
			name: 'SimpleClock',
			component: () => import('../views/SimpleClock.vue'),
			meta: { requiresAuth: true, title: 'Simple Clock | Hardwick Web Development' }
		},
		{
			path: '/about',
			name: 'about',
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import('../views/AboutView.vue'),
			meta: { requiresAuth: false, title: 'About Chris Hardwick | Hardwick Web Development' }
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'NotFound',
			component: () => import('@/views/NotFound.vue'),
			meta: { title: '404 - Not Found | Hardwick Web Development' }
		}
	],
	scrollBehavior(to, from, savedPosition) {
		// If the browser back/forward button is pressed, maintain the saved position
		if (savedPosition) {
			return savedPosition
		}
		// Otherwise, always scroll to the top of the page
		return { top: 0 }
	},
});

router.beforeEach((to, from, next) => {
	const defaultTitle = 'Hardwick Web Development';
	document.title = to.meta.title || defaultTitle;
	// 	let hide = false;
	// 	if (to.meta.requiresAuth) {
	// 		hide = false;
	// 	} else {
	// 		hide = true;
	// 	}
	next();
});

export default router
