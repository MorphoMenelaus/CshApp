<script setup>
import { ref, watch, onMounted, onBeforeMount, onBeforeUnmount } from "vue";
import Chart from "chart.js/auto";

const props = defineProps({
	isMobile: Boolean,
	windowWidth: Number,
	contributionWeeks: Array,
});

const CHART_COLORS = {
	red: "rgb(255, 99, 132)",
	orange: "rgb(255, 159, 64)",
	yellow: "rgb(255, 205, 86)",
	green: "rgb(75, 192, 192)",
	blue: "rgb(54, 162, 235)",
	purple: "rgb(153, 102, 255)",
	grey: "rgb(201, 203, 207)",
	medWhite: "rgb(200, 200, 200)",
	white: "rgb(255, 255, 255)",
	medBlack: "rgb(60, 60, 60)",
	black: "rgb(0, 0, 0)",
	siteThemeWhite: "rgb(235 235 235 / 64%)",
	siteThemeBlack: "rgb(32 32 32 / 80%)",
	siteThemeBlue: "rgb(90 135 191)",
	siteThemeGray: "rgb(128 128 128 / 50%)",
};
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const theme = ref(localStorage.getItem("theme") || "light");
const chartElem = ref(null);
const barData = ref([]);

const drawChart = () => {
	theme.value = localStorage.getItem("theme") || "light";

	setupForGraph();

	const existingChart = Chart.getChart("contributions-graph");
	if (existingChart) {
		existingChart.destroy();
	}

	const extractedValues = barData.value.map((item) => Number(item.total));
	const extractedDates = barData.value.map((item) => item.weekOf);

	const data = {
		labels: extractedDates,
		datasets: [
			{
				type: "bar",
				label: "Contributions",
				data: extractedValues,
				backgroundColor: CHART_COLORS.siteThemeBlue,
				borderColor: CHART_COLORS.siteThemeBlue,
				hoverBackgroundColor: CHART_COLORS.purple,
			},
		],
	};

	const chartConfig = {
		data: data,
		options: {
			responsive: true,
			maintainAspectRatio: false,
			interaction: {
				mode: "index", // Snaps line to the closest date point
				intersect: false,
			},
			plugins: {
				tooltip: {
					enabled: true, // Keeps default hover text visible
					callbacks: {
						// Customize the body/description string
						// label: (context) => {
						// 	let label = context.dataset.label || "";
						// 	if (label) {
						// 		label += ": ";
						// 	}
						// 	if (context.parsed.y !== null) {
						// 		label += `${context.parsed.y} counts (Verified)`;
						// 	}
						// 	return label;
						// },
						// Customize the title string
						title: (context) => {
							return `Week of ${context[0].label}`;
						},
					},
				},
				legend: {
					display: false,
					// labels: {
					// 	color: theme.value === "light" ? CHART_COLORS.grey : CHART_COLORS.medBlack,
					// },
				},
				title: {
					display: true,
					text: "Weekly Contributions",
					font: {
						weight: 400,
						size: 22,
					},
				},
			},
			scales: {
				x: {
					display: true,
					title: {
						display: true,
						text: "Week of",
						// color: CHART_COLORS.blue,
						font: {
							size: 16,
						},
					},
					grid: {
						color: theme.value === "light" ? CHART_COLORS.medBlack : CHART_COLORS.siteThemeGray,
					},
				},
				y: {
					display: true,
					title: {
						display: false,
						text: "Contributions",
						// color: CHART_COLORS.blue,
						font: {
							size: 22,
						},
					},
					grid: {
						color: theme.value === "light" ? CHART_COLORS.medBlack : CHART_COLORS.siteThemeGray,
					},
					suggestedMin: 0,
					suggestedMax: Math.max(...extractedValues) + 5,
				},
			},
		},
	};

	Chart.defaults.font.size = 16;
	Chart.defaults.color = theme.value === "light" ? CHART_COLORS.siteThemeBlack : CHART_COLORS.siteThemeWhite;
	new Chart(chartElem.value, chartConfig);
};

const handleThemeChange = (e) => {
	theme.value = e.detail ? "dark" : "light";
};

const setupForGraph = () => {
	barData.value = [];
	props.contributionWeeks.forEach((week) => {
		let weekObj = {};
		let date = week.contributionDays[0].date.split("-");
		weekObj.weekOf = `${months[Number(date[1]) - 1]} ${Number(date[2])}`;
		weekObj.total = week.contributionDays.reduce((sum, day) => sum + day.contributionCount, 0);
		barData.value.push(weekObj);
	});
	chartElem.value = document.getElementById("contributions-graph");
};

watch([theme, () => props.windowWidth, () => props.contributionWeeks], () => {
	drawChart();
});

onBeforeMount(() => {
	window.addEventListener("uiDarkModeChange", (e) => handleThemeChange(e));
});

onMounted(() => {
	drawChart();
});

onBeforeUnmount(() => {
	window.removeEventListener("uiDarkModeChange", (e) => handleThemeChange(e));
	const existingChart = Chart.getChart("contributions-graph");
	if (existingChart) {
		existingChart.destroy();
	}
});
</script>

<template>
	<div>
		<div id="contributions-container">
			<canvas id="contributions-graph"></canvas>
		</div>
	</div>
</template>

<style scoped>
#contributions-container {
	margin-top: 1em;
	background-color: aliceblue;
	border: 1px solid rgb(128 128 128 / 50%);
	border-radius: 12px;
	padding: 0.5em;
}

.uiDarkMode #contributions-container {
	background-color: #1c2138;
}

canvas#contributions-graph {
	width: 100%;
	height: calc(100vw / 2);
	max-height: 300px;
}

@media (max-width: 767px) {
}

@media (min-width: 768px) and (max-width: 991px) {
}

@media (min-width: 768px) {
	canvas#contributions-graph {
		height: calc(100vw / 3);
	}
}

@media (min-width: 992px) {
	canvas#contributions-graph {
		height: calc(100vw / 3);
	}
}

@media (min-width: 992px) and (max-width: 1199px) {
}

@media (min-width: 1200px) {
}
</style>
