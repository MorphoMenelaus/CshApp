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
			path: '/tic-tac-toe',
			name: 'TicTacToe',
			component: () => import('../views/TicTacToe.vue'),
			meta: { requiresAuth: true }
		},
		{
			path: '/userpreferences',
			name: 'User Preferences',
			component: () => import('../views/UserPreferences.vue'),
			meta: { requiresAuth: true }
		},
		{
			path: '/displayusers',
			name: 'DisplayUsers',
			component: () => import('../views/DisplayUsers.vue'),
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
