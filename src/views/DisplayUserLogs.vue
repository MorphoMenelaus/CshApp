<script setup>
import { ref, inject, watch, onMounted } from "vue";
import { isUTCtime, toTitleCase, tokenInterceptFetch } from "@/dependencies/csh-libs";
import { appNotify } from "@/dependencies/models.js";

const props = defineProps({
	appState: Object,
	isMobile: Boolean,
});

const baseUrl = inject("baseUrl");
const showHideLoader = inject("showHideLoader");
const serverStatus = Object.assign({}, appNotify);
const limit = ref(10);
const offset = ref(0);
const currentPage = ref(1);
const responseStatus = ref("");
const logs = ref([]);
const limitOptions = [
	{ text: "5", value: 5 },
	{ text: "10", value: 10 },
	{ text: "15", value: 15 },
	{ text: "20", value: 20 },
	{ text: "50", value: 50 },
];

const getUserLogs = async () => {
	showHideLoader(true);

	let headerObj = new Headers();
	headerObj.append("Authorization", `Bearer ${props.appState.accessToken}`);
	headerObj.append("Content-Type", "application/json; charset=utf-8");
	let requestUrl = new URL("/api/userlogs/", baseUrl);

	let params = requestUrl.searchParams;
	params.set("limit", limit.value);
	params.set("offset", offset.value);
	params.set("time", new Date().getTime());
	requestUrl.search = params.toString();

	let request = new Request(requestUrl.toString(), {
		method: "GET",
		headers: headerObj,
	});

	try {
		const response = await tokenInterceptFetch(request);
		const data = await response.json();

		if (data.success) {
			logs.value = data.logs;
		}
	} catch (error) {
		console.error("Error fetching data:", error);
	} finally {
		showHideLoader(false);
	}
};

const previousPage = () => {
	if (currentPage.value == 1) return;
	currentPage.value--;
	offset.value = offset.value - limit.value;
	getUserLogs();
};

const nextPage = () => {
	if (logs.value.length < limit.value) return;
	offset.value = offset.value + limit.value;
	currentPage.value++;
	getUserLogs();
};

watch(limit, () => {
	currentPage.value = 1;
	offset.value = null;
	getUserLogs();
});

onMounted(() => {
	getUserLogs();
});
</script>

<template>
	<div id="listUsersLogs" class="input-heading">
		<h1>User Logs</h1>

		<div id="paging">
			<label for="limitOptions">Limit{{ isMobile ? "" : " List" }}</label>
			<select v-model="limit">
				<option v-for="(item, index) in limitOptions" :key="index" :value="item.value">{{ item.value }}</option>
			</select>
			<button class="prev-button btn" type="button" @click="previousPage()" title="Previous Page">previous</button>
			<button class="next-button btn" type="button" @click="nextPage()" title="Next Page">next</button>
			<span :currentPage="currentPage">page {{ currentPage }}</span>
		</div>

		<div class="user-lists-container">
			<div v-if="logs.length > 0">
				<div id="non-mobile" v-if="!isMobile">
					<table v-if="logs && logs.length > 0">
						<thead>
							<tr class="header-row">
								<th v-for="(label, index) in Object.keys(logs[0])" :key="index">{{ toTitleCase(label) }}</th>
							</tr>
						</thead>
						<tbody>
							<tr class="data-row" v-for="(user, index) in logs" :key="index">
								<td v-for="(column, index) in user" :key="index">{{ isUTCtime(column) ? new Date(column).toLocaleString() : column }}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div id="mobile" v-if="isMobile">
					<table v-for="(item, index) in logs" :key="index">
						<tr class="header-row" v-for="(key, event, index) in Object.keys(item)" :key="index">
							<th>{{ toTitleCase(key) }}</th>
							<td>{{ isUTCtime(item[key]) ? new Date(item[key]).toLocaleString() : item[key] }}</td>
						</tr>
					</table>
				</div>
			</div>
			<div v-else>
				<h1>Nothing more to display.</h1>
			</div>
		</div>
	</div>
</template>

<style scoped>
#view {
	padding-bottom: 90px;
}

h1 {
	font-weight: bold;
	text-align: center;
}

#listUsersLogs {
	padding: 15px 15px 60px;
}

.header-row {
	color: #222;
}

.uiDarkMode .header-row {
	color: #fff;
}

#paging {
	color: #000;
	max-width: 30em;
}

.uiDarkMode #paging {
	color: #c1c1c1;
}

table {
	background-color: #ddd;
	color: #000;
}

.uiDarkMode table {
	background-color: inherit;
	color: inherit;
}

#non-mobile table {
	width: 80%;
	padding: 15px;
}

#mobile table {
	position: unset;
	width: 100%;
	padding: 10px;
}

tbody {
	color: #000;
	background-color: #e7e7e7;
}

.uiDarkMode tbody {
	background-color: rgb(100 100 100/ 50%);
	color: #eee;
}

th {
	padding: 5px 15px;
	background-color: #aaa;
	color: #000;
	font-weight: bold;
}

td {
	border-bottom: 1px #aaa solid;
}
</style>
