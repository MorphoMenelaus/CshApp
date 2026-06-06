import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { readFileSync } from 'fs'

// Read package.json explicitly to get the current version
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		vueDevTools(),
	],
	base: './',
	define: {
		// Wrap the string value in JSON.stringify so it compiles as a raw string literal
		APP_VERSION: JSON.stringify(packageJson.version),
		__VUE_PROD_DEVTOOLS__: JSON.stringify(false) // true or false
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		},
	},
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3000', // Node server port
				changeOrigin: true,
				secure: false,
			}
		}
	}
})
