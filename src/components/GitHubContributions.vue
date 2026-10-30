<script setup>
import { ref, inject, onBeforeMount } from "vue";
import { appNotify } from "@/dependencies/models.js";
import CommitsOverTimeGraph from "@/components/CommitsOverTimeGraph.vue";

const props = defineProps({
	isMobile: Boolean,
	windowWidth: Number,
});

const serverStatus = Object.assign({}, appNotify);
const baseUrl = inject("baseUrl");
const updateStatus = inject("sendUpdateStatus");
const forceLogout = inject("forceLogout");

const blueTheme = ref(true);
const contributionWeeks = ref([]);
const currentIso = ref(new Date().toISOString());
const weekOffest = ref(24);
const eventTotalCount = ref(0);
const contributionsCount = ref(0);
const firstEntryMonth = ref("");
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const bgColors = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];

const getEventTotalCount = (eventWeeks = []) => {
	let newArr = [];
	let weeksArr = [];
	let contCount = 0;
	weeksArr = eventWeeks.flatMap((week) => week.contributionDays);
	newArr = [...newArr, ...weeksArr];
	newArr.forEach((event) => {
		contCount += event.contributionCount;
	});
	contributionsCount.value = contCount;
	eventTotalCount.value = newArr.length;
};

const getGitHubEvents = async () => {
	let headerObj = new Headers();
	headerObj.append("Content-Type", "application/json; charset=utf-8");
	let requestUrl = new URL("/api/git/events", baseUrl);

	let params = requestUrl.searchParams;
	params.set("currentIso", currentIso.value);
	params.set("weekOffest", weekOffest.value);
	requestUrl.search = params.toString();

	let request = new Request(requestUrl.toString(), {
		method: "GET",
		headers: headerObj,
	});

	try {
		let response = await fetch(request);
		let data = await response.json();

		if (data?.code === 403) {
			data.forced = true;
			forceLogout(data);
		}

		getEventTotalCount(data.contributionWeeks);

		contributionWeeks.value = data.contributionWeeks;
		firstEntryMonth.value = getMonthName(contributionWeeks.value[0].contributionDays[0]);
	} catch (error) {
		console.error("Error posting data:", error);
		serverStatus.code = 500;
		serverStatus.message = `Error getting data: ${error}`;
		serverStatus.success = false;
		updateStatus(serverStatus);
	}
};

const getTooltipText = (day) => {
	return `${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"} on ${day.date}`;
};

const isFirstWeek = (day) => {
	let dayNum = day.date.split("-")[2];
	return dayNum <= 7;
};

const getMonthName = (day) => {
	let month = day.date.split("-")[1];
	return months[month - 1];
};

onBeforeMount(() => {
	getGitHubEvents();
});
</script>

<template>
	<div id="github-grid">
		<h2 class="julius-sans text-center">
			<i class="devicon-github-original" title="GitHub"></i>
			<i class="devicon-github-original colored" title="GitHub"></i>
			Project Contributions
		</h2>
		<div class="calendar-wrapper" v-if="contributionWeeks.length > 0">
			<h3 class="text-center">{{ contributionsCount }} contributions merged since {{ firstEntryMonth }}</h3>
			<div class="flex-row">
				<div class="day-labels">
					<span v-for="(day, dayI) in days" :key="dayI">{{ day }}</span>
				</div>
				<div class="calendar-grid">
					<div v-for="(week, wIndex) in contributionWeeks" :key="wIndex" class="calendar-column">
						<div
							v-for="(day, di) in week.contributionDays"
							:key="di"
							:class="[
								'calendar-cell',
								{
									lvl0: day.color === bgColors[0],
									lvl1: day.color === bgColors[1],
									lvl2: day.color === bgColors[2],
									lvl3: day.color === bgColors[3],
									lvl4: day.color === bgColors[4],
									blue: blueTheme,
								},
							]"
							:title="getTooltipText(day)"
						>
							<span v-if="di === 0 && isFirstWeek(day)" class="month-name">{{ getMonthName(day) }}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="legend" v-if="contributionWeeks.length > 0">
				<span class="label">Fewer</span>
				<div v-for="(color, ci) in bgColors" :key="ci" :class="['calendar-cell', `lvl${ci}`, { blue: blueTheme }]"></div>
				<span class="label">More</span>
			</div>
		</div>
		<div v-else>
			<h1 class="text-center">No Contributions Found</h1>
			<h3 class="text-center">Please Refresh Page</h3>
		</div>
		<div v-if="contributionWeeks.length > 0">
			<CommitsOverTimeGraph :isMobile="isMobile" :windowWidth="windowWidth" :contributionWeeks="contributionWeeks" />
		</div>
	</div>
</template>

<style scoped>
h2 {
	font-weight: bold;
}

h3 {
	margin-top: -1em;
	margin-bottom: 1.2em;
}

#github-grid {
	margin: 1em auto;
	background-color: #e7e7e7;
	width: fit-content;
	padding: 1em;
	border: 1px #555 solid;
	border-radius: 12px;
	width: 100%;
}

i.colored,
.uiDarkMode i:not(.colored) {
	display: inline;
}

.uiDarkMode i.colored,
i:not(.colored) {
	display: none;
}

.uiDarkMode #github-grid {
	background-color: #222;
}

.calendar-wrapper {
	display: flex;
	font-size: 1em;
	user-select: none;
	margin-top: 0.65em;
	margin-bottom: 0.5em;
	padding: 1.75em 0.5em 0.8em;
	background-color: aliceblue;
	border: 1px solid rgb(128 128 128 / 50%);
	border-radius: 12px;
	flex-direction: column;
}

.uiDarkMode .calendar-wrapper {
	background-color: #1c2138;
}

.flex-row {
	display: flex;
	justify-content: center;
}

.day-labels {
	display: grid;
	grid-template-rows: repeat(7, 1fr);
	gap: 1px;
	font-size: 0.75em;
	justify-content: space-between;
	padding-right: 0.5em;
	text-align: right;
}

.month-name {
	position: relative;
	top: -2em;
	font-size: 0.75em;
}

.calendar-grid {
	display: grid;
	grid-template-columns: repeat(26, 1fr);
	gap: 4px;
}

.calendar-column {
	display: grid;
	grid-template-rows: repeat(7, 1fr);
	gap: 2px;
}

.calendar-cell {
	width: 1em;
	height: 1em;
	border-radius: 0.2em;
	outline: 1px solid rgba(27, 31, 35, 0.8);
	outline-offset: -1px;
	transition: background-color 0.1s ease;
}

.uiDarkMode .calendar-cell {
	outline: 1px solid rgb(89 102 115 / 80%);
}

.calendar-cell:hover {
	outline: 1px solid rgb(0 90 255 / 80%);
	filter: brightness(0.8);
}

.uiDarkMode .calendar-cell:hover {
	outline: 1px solid #24292f;
}

.uiDarkMode .calendar-cell.blue:hover {
	outline: 1px solid #4e5865;
}

.legend {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	user-select: none;
	margin-top: 0.5em;
}

.legend .calendar-cell {
	margin: 0 0.1em;
}

.legend .label {
	margin: auto 0.25em;
	font-size: 0.75em;
}

.calendar-cell.lvl0 {
	background-color: #eff2f5;
}

.calendar-cell.lvl1 {
	background-color: #aceebb;
}

.calendar-cell.lvl2 {
	background-color: #4ac26b;
}

.calendar-cell.lvl3 {
	background-color: #2da44e;
}

.calendar-cell.lvl4 {
	background-color: #116329;
}

.uiDarkMode .calendar-cell.lvl0 {
	background-color: #151b23;
}

.uiDarkMode .calendar-cell.lvl1 {
	background-color: #033a16;
}

.uiDarkMode .calendar-cell.lvl2 {
	background-color: #196c2e;
}

.uiDarkMode .calendar-cell.lvl3 {
	background-color: #2ea043;
}

.uiDarkMode .calendar-cell.lvl4 {
	background-color: #56d364;
}

.calendar-cell.lvl4.blue {
	background-color: #1f66ad;
}

.calendar-cell.lvl3.blue {
	background-color: #2d7ca4;
}

.calendar-cell.lvl2.blue {
	background-color: #4b9bc3;
}

.calendar-cell.lvl1.blue {
	background-color: #9dd1ec;
}

.calendar-cell.lvl0.blue {
	background-color: #eff2f5;
}

.uiDarkMode .calendar-cell.lvl4.blue {
	background-color: #55a9d3;
}

.uiDarkMode .calendar-cell.lvl3.blue {
	background-color: #2e799e;
}

.uiDarkMode .calendar-cell.lvl2.blue {
	background-color: #19506b;
}

.uiDarkMode .calendar-cell.lvl1.blue {
	background-color: #043249;
}

.uiDarkMode .calendar-cell.lvl0.blue {
	background-color: #151e23;
}
</style>
