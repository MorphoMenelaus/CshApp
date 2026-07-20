import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
			meta: { requiresAuth: false }
		},
		{
			path: '/movie-database',
			name: 'MovieDatabase',
			component: () => import('../views/MovieDatabase.vue'),
			meta: { requiresAuth: true }
		},
		{
			path: '/blog-reader',
			name: 'BlogReader',
			component: () => import('../views/BlogReader.vue'),
			meta: { requiresAuth: true }
		},
		{
			path: '/verify',
			name: 'Verify',
			component: () => import('../views/Verify.vue'),
			meta: { requiresAuth: false }
		},
		{
			path: '/userpreferences',
			name: 'User Preferences',
			component: () => import('../views/UserPreferences.vue'),
			meta: { requiresAuth: true }
		},
		{
			path: '/weather',
			name: 'Weather',
			component: () => import('../views/WeatherBasic.vue'),
			meta: { requiresAuth: true }
		},
		{
			path: '/displayusers',
			name: 'DisplayUsers',
			component: () => import('../views/DisplayUsers.vue'),
			meta: { requiresAuth: true }
		},
		{
			path: '/displayuserlogs',
			name: 'DisplayUserLogs',
			component: () => import('../views/DisplayUserLogs.vue'),
			meta: { requiresAuth: true }
		},
		{
			path: '/resume',
			name: 'ResumeView',
			component: () => import('../views/ResumeView.vue'),
			meta: { requiresAuth: true }
		},
		{
			path: '/toggl',
			name: 'Toggl',
			component: () => import('../views/Toggl.vue'),
			meta: { requiresAuth: true }
		},
		{
			path: '/simpleclock',
			name: 'SimpleClock',
			component: () => import('../views/SimpleClock.vue'),
			meta: { requiresAuth: true }
		},
		{
			path: '/about',
			name: 'about',
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import('../views/AboutView.vue'),
			meta: { requiresAuth: false }
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'NotFound',
			component: () => import('@/views/NotFound.vue')
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

// router.beforeEach((to, from) => {
// 	let hide = false;
// 	if (to.meta.requiresAuth) {
// 		hide = false;
// 	} else {
// 		hide = true;
// 	}
// })

export default router
