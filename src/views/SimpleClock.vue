<script setup>
import { ref, reactive, provide, inject, watch, onBeforeMount, onMounted } from "vue";
import { isUTCtime, toTitleCase, tokenInterceptFetch } from "@/dependencies/csh-libs.js";
import { appNotify } from "@/dependencies/models.js";
import BaseTextarea from "@/components/base/BaseTextarea.vue";
import BaseSelect from "@/components/base/BaseSelect.vue";

const props = defineProps({
	appState: Object,
	isMobile: Boolean,
});

const baseUrl = inject("baseUrl");
const copyright = inject("copyright");
const showHideLoader = inject("showHideLoader");
const updateStatus = inject("sendUpdateStatus");
const serverStatus = Object.assign({}, appNotify);
const limit = ref(10);
const offset = ref(0);
const currentPage = ref(1);
const dayLocal = ref("");
const dateLocal = ref("");
const timeLocal = ref("");
const eventLogList = ref([]);
const boolOptions = [
	{ text: "True", value: "1" },
	{ text: "False", value: "0" },
];
const eventOptions = [
	{ text: "Go to bed", value: "toBed" },
	{ text: "Get out of bed", value: "fromBed" },
	{ text: "Wake up", value: "wakeUp" },
	{ text: "Dinner time", value: "dinnerTime" },
];
const limitOptions = [
	{ text: "5", value: 5 },
	{ text: "10", value: 10 },
	{ text: "15", value: 15 },
	{ text: "25", value: 25 },
	{ text: "50", value: 50 },
	{ text: "100", value: 100 },
	{ text: "200", value: 200 },
];

const formData = reactive({
	eventType: "",
	isWakeupEvent: "0",
	message: "",
});

const formErrors = reactive({});
const fieldsToValidate = new Set();

// Allow deep nested parts to register their validation function
const registerField = (fieldId, validateFn) => {
	fieldsToValidate.add({ fieldId, validateFn });
};

const unregisterField = (fieldId) => {
	fieldsToValidate.delete(fieldId);
	delete formErrors[fieldId];
};

// Provide the centralized validation bridge to all descendants
provide("FormValidation", {
	registerField,
	unregisterField,
	errors: formErrors,
});

const validateFields = () => {
	// Trigger all registered child validation rules in one pass
	fieldsToValidate.forEach(({ fieldId, validateFn }) => {
		const error = validateFn();
		if (error) {
			formErrors[fieldId] = error;
		} else {
			delete formErrors[fieldId];
		}
	});
};

const handleSubmit = async () => {
	// Validate fields and stop executiion if any are registered
	validateFields();

	if (Object.keys(formErrors).length > 0) {
		serverStatus.message = "Please complete in all required fields.";
		serverStatus.success = false;
		updateStatus(serverStatus);
		return serverStatus;
	}

	// Log event
	logSimpleClock();
};

const getClockLog = async () => {
	showHideLoader(true);

	let headerObj = new Headers();
	headerObj.append("Authorization", `Bearer ${props.appState.accessToken}`);
	headerObj.append("Content-Type", "application/json; charset=utf-8");
	let requestUrl = new URL("/api/userlogs/clock/log", baseUrl);

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

		eventLogList.value = setWakeupBool(data?.clockLogs);
	} catch (error) {
		console.error("Error posting data:", error);
		serverStatus.code = 500;
		serverStatus.message = `Error getting data: ${error}`;
		serverStatus.success = false;
		updateStatus(serverStatus);
	} finally {
		showHideLoader(false);
	}
};

const logSimpleClock = async () => {
	let data;
	try {
		showHideLoader(true);
		let body = {
			userId: props.appState.user.userId,
			userName: props.appState.user.userName,
			eventType: formData.eventType,
			isWakeupEvent: formData.isWakeupEvent,
			notes: formData.message,
		};

		let headerObj = new Headers();
		headerObj.append("Authorization", `Bearer ${props.appState.accessToken}`);
		headerObj.append("Content-Type", "application/json; charset=utf-8");
		let requestUrl = new URL("/api/userlogs/clock", baseUrl);

		let request = new Request(requestUrl.toString(), {
			method: "POST",
			headers: headerObj,
			body: JSON.stringify(body),
		});

		const response = await tokenInterceptFetch(request);
		data = await response.json();

		serverStatus.code = data?.code;
		serverStatus.message = data?.message;
		serverStatus.success = data?.success;
		updateStatus(serverStatus);

		formData.isWakeupEvent = false;
		formData.notes = "";
		getClockLog();
	} catch (error) {
		console.error("Error posting data:", error);
		serverStatus.code = 400;
		serverStatus.message = `Error posting data: ${error}`;
		serverStatus.success = false;
		updateStatus(serverStatus);
	} finally {
		showHideLoader(false);
	}
};

const updateDateTime = () => {
	let date = new Date();
	dayLocal.value = date.toLocaleDateString("en-US", { weekday: "long" });
	dateLocal.value = date.toLocaleDateString("en-US");
	timeLocal.value = date.toLocaleTimeString();
};

const previousPage = () => {
	if (currentPage.value == 1) return;
	currentPage.value--;
	offset.value = offset.value - limit.value;
	getClockLog();
};

const nextPage = () => {
	if (eventLogList.value?.length < limit.value) return;
	offset.value = offset.value + limit.value;
	currentPage.value++;
	getClockLog();
};

const setWakeupBool = (array = []) => {
	array.forEach((item) => {
		item.isWakeupEvent = item?.isWakeupEvent === 1 ? true : false;
	});
	return array;
};

watch(
	() => formData,
	() => {
		formData.isWakeupEvent = formData.eventType === "fromBed" || formData.eventType === "wakeUp" ? "1" : "0";
		if (Object.keys(formErrors).length > 0) validateFields();
	},
	{ deep: true },
);

watch(limit, () => {
	currentPage.value = 1;
	offset.value = null;
	getClockLog();
});

onBeforeMount(() => {
	updateDateTime();
	getClockLog();
});

onMounted(() => {
	setInterval(() => {
		updateDateTime();
	}, 1000);
});
</script>

<template>
	<main v-bind="$attrs">
		<h1 class="page-header julius-sans">Simple Event Log</h1>
		<div id="clock">
			<div id="time-container">
				<span id="time">{{ timeLocal }}</span>
			</div>
			<div id="date-container">
				<span id="dayLong">{{ dayLocal }},&nbsp;</span><br />
				<span id="dateLong">{{ dateLocal }}</span>
			</div>
		</div>
		<form method="post" @submit.prevent="handleSubmit">
			<div class="checkbox-container">
				<BaseSelect
					v-model="formData.eventType"
					:options="eventOptions"
					id="eventType"
					defaultSelect="Select Event"
					label="Event Type"
					:required="true"
					:hiddenLabel="false"
					:error="formErrors.eventType"
				/>
				<BaseSelect
					v-model="formData.isWakeupEvent"
					:options="boolOptions"
					id="wakeup"
					label="Wakeup Event"
					:required="true"
					:hiddenLabel="false"
					:error="formErrors.wakeup"
				/>
			</div>
			<div class="notes-container">
				<BaseTextarea
					v-model="formData.message"
					id="notes"
					label="Notes"
					:required="false"
					:hiddenLabel="true"
					:maxlength="512"
					:error="formErrors.notes"
				/>
			</div>
			<button @click.prevent="handleSubmit()" class="btn time-log" type="submit" name="submit" value="submit" title="Submit Time Log">
				Submit Time Log
			</button>
		</form>

		<div id="paging">
			<label for="limitOptions">Limit List</label>
			<select v-model="limit">
				<option v-for="(item, index) in limitOptions" :key="index" :value="item.value">{{ item.value }}</option>
			</select>
			<button class="prev-button btn" type="button" @click="previousPage()" title="Previous Page">previous</button>
			<button class="next-button btn" type="button" @click="nextPage()" title="Next Page">next</button>
			<span :currentPage="currentPage">page {{ currentPage }}</span>
		</div>

		<div class="user-lists-container">
			<div v-if="eventLogList?.length > 0">
				<div id="non-mobile" v-if="!isMobile">
					<table v-if="eventLogList && eventLogList.length > 0">
						<thead>
							<tr class="header-row">
								<th v-for="(label, index) in Object.keys(eventLogList[0])" :key="index">{{ toTitleCase(label) }}</th>
							</tr>
						</thead>
						<tbody>
							<tr class="data-row" v-for="(event, index) in eventLogList" :key="index">
								<td v-for="(column, index) in event" :key="index" :class="column === true ? 'true' : ''">
									{{ isUTCtime(column) ? new Date(column).toLocaleString() : column }}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div id="mobile" v-if="isMobile && eventLogList?.length > 0">
					<table v-for="(item, index) in eventLogList" :key="index">
						<tr class="header-row" v-for="(key, event, index) in Object.keys(item)" :key="index">
							<th>{{ toTitleCase(key) }}</th>
							<td :class="item[key] === true ? 'true' : ''">{{ isUTCtime(item[key]) ? new Date(item[key]).toLocaleString() : item[key] }}</td>
						</tr>
					</table>
				</div>
			</div>
			<div v-else>
				<h1>Nothing more to display.</h1>
			</div>
		</div>
		<div id="copyright">
			<small v-html="copyright"></small>
		</div>
	</main>
</template>

<style scoped>
h1 {
	text-align: center;
}

#view {
	padding-bottom: 60px;
}

#clock {
	width: 15em;
	margin: 30px auto;
	padding: 15px;
	align-self: center;
	align-content: center;
	background-color: #ddd;
	color: #000;
	text-align: center;
	font-size: 1.5em;
	user-select: none;
	border-radius: 12px;
	border: 1px #000 solid;
}

.uiDarkMode #clock {
	background-color: #000;
	color: inherit;
	border: 1px #fff solid;
}

#date-container {
	display: flex;
	align-items: center;
	justify-content: center;
}

#clock form {
	display: flex;
	align-items: center;
	flex-direction: column;
}

.notes-container {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.checkbox-container {
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-around;
	align-items: center;
	width: 25%;
	margin: auto;
	text-align: center;
}

select {
	margin-left: 0.8em;
}

#time {
	font-size: 2em;
}

#time {
	text-align: center;
}

button.time-log {
	display: block;
	margin: 15px auto 0;
	cursor: pointer;
}

table {
	background-color: #ddd;
	color: #000;
}

.uiDarkMode table {
	background-color: inherit;
	color: inherit;
}

table {
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

.grid-border-bg > div {
	background-color: #555;
	display: flex;
	flex-flow: column nowrap;
	justify-content: space-between;
}

#paging {
	color: #000;
	max-width: 30em;
}

.uiDarkMode #paging {
	color: #c1c1c1;
}
</style>
