<script setup>
import { ref, inject, onBeforeUnmount } from "vue";
import WeatherBasic from "@/components/WeatherBasic.vue";
import StockCharts from "@/components/StockCharts.vue";

defineProps({
	appState: Object,
	isMobile: Boolean,
	windowWidth: Number,
});

const theme = ref(localStorage.getItem("theme") || "light");

const handleThemeChange = (e) => {
	theme.value = e.detail ? "dark" : "light";
};

window.addEventListener("uiDarkModeChange", (e) => handleThemeChange(e));
onBeforeUnmount(() => {
	window.removeEventListener("uiDarkModeChange", (e) => handleThemeChange(e));
});
</script>

<template>
	<div>
		<div id="charts-header">
			<h1 class="julius-sans center stroke">Visualizing Data</h1>
			<h2>ChartJS Examples</h2>
			<h3>Weather data and Market data represented in graphs using the ChartJS library</h3>
		</div>
		<WeatherBasic :appState="appState" :isMobile="isMobile" :windowWidth="windowWidth" :theme="theme" />
		<StockCharts :appState="appState" :isMobile="isMobile" :windowWidth="windowWidth" :theme="theme" />
	</div>
</template>

<style scoped>
#view {
	padding-bottom: 4em;
}

h1,
h2,
h3 {
	text-align: center;
}

h2 {
	font-size: 2.25em;
}

h3 {
	font-size: 1.8em;
}

h1.julius-sans {
	margin-top: 0.5em;
	font-size: 3.5em;
	font-weight: bold;
	color: var(--vt-c-text-light-3);
}

.uiDarkMode .stroke {
	color: #aaa;
}

#charts-header {
	width: 95%;
	margin: auto;
}

@media (max-width: 767px) {
	#view {
		margin: 0 0.5em;
	}
}

@media (min-width: 768px) {
	#charts-header {
		width: 80%;
	}
}

@media (min-width: 992px) {
	#charts-header {
		width: 90%;
	}
}

@media (min-width: 1200px) {
	#charts-header {
		width: 80%;
	}
}

@media (min-width: 1800px) {
	#charts-header {
		width: 70%;
	}
}

@media (min-width: 2200px) {
	#charts-header {
		width: 60%;
	}
}
</style>
