import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
		},
		{
			path: '/tic-tac-toe',
			name: 'TicTacToe',
			component: () => import('../views/TicTacToe.vue'),
		},
		{
			path: '/getuser',
			name: 'GetUser',
			component: () => import('../views/GetUser.vue'),
		},
		// {
		// 	path: '/registeruser',
		// 	name: 'RegisterUser',
		// 	component: () => import('../views/RegisterUser.vue'),
		// },
		{
			path: '/displayusers',
			name: 'DisplayUsers',
			component: () => import('../views/DisplayUsers.vue'),
		},
		{
			path: '/register',
			name: 'Register',
			component: () => import('../views/Register.vue'),
		},
		{
			path: '/login',
			name: 'Login',
			component: () => import('../views/Login.vue'),
		},
		{
			path: '/about',
			name: 'about',
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import('../views/AboutView.vue'),
		},
	],
})

export default router
