<script setup>
import { ref, inject, onBeforeUnmount } from "vue";
import { useWindowEvent } from "@/composables/useCommonEvents.js";
import WeatherBasic from "@/components/WeatherBasic.vue";
import StockCharts from "@/components/StockCharts.vue";

defineProps({
	appState: Object,
	isMobile: Boolean,
	windowWidth: Number,
});

const copyright = inject("copyright");
const theme = ref(localStorage.getItem("theme") || "light");

useWindowEvent("uiDarkModeChange", (e) => {
	theme.value = e.detail ? "dark" : "light";
});
</script>

<template>
	<main v-bind="$attrs">
		<div id="charts-header">
			<h1 class="page-header julius-sans center stroke">Visualizing Data</h1>
			<h2 class="page-header">ChartJS Demos <i class="icon devicon-chartjs-plain" title="ChartJS"></i></h2>
			<h3 class="page-header">Hourly Weather data and Daily Market data visualized using the ChartJS library</h3>
		</div>
		<WeatherBasic :appState="appState" :isMobile="isMobile" :windowWidth="windowWidth" :theme="theme" />
		<StockCharts :appState="appState" :isMobile="isMobile" :windowWidth="windowWidth" :theme="theme" />
		<div id="copyright">
			<small v-html="copyright"></small>
		</div>
	</main>
</template>

<style scoped>
#view {
	padding-bottom: 4em;
}

#charts-header {
	width: 95%;
	margin: auto;
}

.icon {
	top: 0.1em;
	position: relative;
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
