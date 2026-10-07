import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { readFileSync } from "fs";

const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));
const jsonLdString = readFileSync("./JSON+LD.json", "utf-8");

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const staging = env.VITE_API_STAGING_URL;
	const onsiteServer = env?.VITE_API_ONSITE_SERVER_URL || "";

	return {
		plugins: [
			vue(),
			vueDevTools(),
			{
				name: "inject-json-ld",
				transformIndexHtml(html) {
					const scriptTag = `\n\t<script type="application/ld+json">${jsonLdString}</script>`;
					return html.replace("</head>", `${scriptTag}\n</head>`);
				},
			},
		],
		base: "./",
		define: {
			APP_VERSION: JSON.stringify(packageJson.version),
			API_ONSITE: JSON.stringify(onsiteServer),
			__VUE_PROD_DEVTOOLS__: `window.location.origin === '${staging}'`,
		},
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
			},
		},
	};
});
