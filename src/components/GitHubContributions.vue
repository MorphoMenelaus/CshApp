<script setup>
import { ref, inject, onBeforeMount } from "vue";
import { appNotify } from "@/dependencies/models.js";

const serverStatus = Object.assign({}, appNotify);
const baseUrl = inject("baseUrl");
const updateStatus = inject("sendUpdateStatus");
const forceLogout = inject("forceLogout");

const contributionWeeks = ref([]);
const currentIso = ref(new Date().toISOString());
const weekOffest = ref(24);
const eventTotalCount = ref(0);
const contributionsCount = ref(0);
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
		<h2 class="text-center">
			<i class="devicon-github-original"></i>
			<i class="devicon-github-original colored"></i>
			GitHub contributions for this project
		</h2>
		<h4 class="text-center">{{ contributionsCount }} commits in the last 6 months</h4>
		<div class="calendar-wrapper" v-if="contributionWeeks.length > 0">
			<div class="day-labels">
				<span v-for="(day, dayI) in days" :key="dayI">{{ day }}</span>
			</div>
			<div class="calendar-grid">
				<div v-for="(week, wIndex) in contributionWeeks" :key="wIndex" class="calendar-column">
					<div
						v-for="(day, i) in week.contributionDays"
						:key="i"
						class="calendar-cell"
						:style="{ '--cell-bg': day?.color && day.color != '#ebedf0' ? day.color : 'rgb(128 128 128 / 20%)' }"
						:title="getTooltipText(day)"
					>
						<span v-if="i === 0 && isFirstWeek(day)" class="month-name">{{ getMonthName(day) }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
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
	justify-content: center;
	font-size: 1em;
	user-select: none;
	margin-top: 1em;
	padding: 0.5em;
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
	grid-template-columns: repeat(25, 1fr);
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
	background-color: var(--cell-bg);
	outline: 1px solid rgba(27, 31, 35, 0.8);
	outline-offset: -1px;
	transition: background-color 0.1s ease;
}

.calendar-cell:hover {
	outline: 1px solid #24292f;
}
</style>
