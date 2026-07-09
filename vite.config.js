import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { readFileSync } from 'fs'

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const staging = env.VITE_API_STAGING_URL;

	return {
		plugins: [
			vue(),
			vueDevTools(),
		],
		base: './',
		define: {
			APP_VERSION: JSON.stringify(packageJson.version),
			__VUE_PROD_DEVTOOLS__: `window.location.origin === '${staging}'`
		},
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url))
			},
		},
		// server: {
		// 	proxy: {
		// 		'/api': {
		// 			target: 'http://localhost:3000', // Node server port
		// 			changeOrigin: true,
		// 			secure: false,
		// 		}
		// 	}
		// }
	}
})
