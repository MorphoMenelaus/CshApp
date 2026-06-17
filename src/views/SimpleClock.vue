<template>

	<div id="clocklog-container">
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
				<!-- <input v-model="isWakeupEvent" id="wakeup-event" type="checkbox" name="iswakeupevent"
					title="Wakeup Event" /> -->
				<label for="iswakeupevent" title="Wakeup Event">Wakeup Event</label>
				<select v-model="isWakeupEvent">
					<option v-for="(item, index) in boolOptions" :key="index" :value="item.value">
						{{ item.text }}
					</option>
				</select>
			</div>

			<div class="notes-container">
				<label for="notes">
					<small>(characters remaining: {{ charRemaining }})</small>
				</label>
				<textarea v-model="notes" class="notes" name="notes" id="notes" :maxlength="maxlength"
					placeholder="Type notes here..." @keyup="charCounter()"></textarea>
			</div>
			<button @click="logSimpleClock()" class='btn time-log' type='submit' name='submit' value='submit'
				title='Submit Time Log'>Submit Time
				Log</button>
		</form>

		<div id="paging">
			<label for="limitOptions">Limit List</label>
			<select v-model="limit">
				<option v-for="(item, index) in limitOptions" :key="index" :value="item.value">{{ item.value }}
				</option>
			</select>
			<button class="prev-button btn" type="button" @click="previousPage()">previous</button>
			<button class="next-button btn" type="button" @click="nextPage()">next</button>
			<span :currentPage="currentPage">page {{ currentPage }}</span>
		</div>

		<div class="user-lists-container">

			<div v-if="eventLogList.length > 0">
				<div id="non-mobile" v-if="!isMobile">
					<table v-if="eventLogList && eventLogList.length > 0">
						<thead>
							<tr class="header-row">
								<th v-for="(label, index) in Object.keys(eventLogList[0])" :key="index">{{
									this.toTitleCase(label)
								}}
								</th>
							</tr>
						</thead>
						<tbody>
							<tr class="data-row" v-for="(event, index) in eventLogList" :key="index">
								<td v-for="(column, index) in event" :key="index"
									:class="column === true ? 'true' : ''">{{
										isUTCtime(column) ? new
											Date(column).toLocaleString() : column
									}}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div id="mobile" v-if="isMobile">
					<table v-for="(item, index) in eventLogList" :key="index">
						<tr class="header-row" v-for="(key, event, index) in Object.keys(item)" :key="index">
							<th>{{ this.toTitleCase(key) }}</th>
							<td :class="item[key] === true ? 'true' : ''">{{ isUTCtime(item[key]) ? new Date(item[key]).toLocaleString() : item[key] }}</td>
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

<script>
// @ is an alias to /src
import { onBeforeUnmount } from "vue";

export default {
	name: "SimpleClock",
	props: {
		appState: Object,
		isMobile: Boolean
	},
	components: {},
	data() {
		return {
			postStatus: Object.assign({}, this.appNotify),
			limit: 5,
			offset: 0,
			currentPage: 1,
			boolOptions: [
				{ text: "true", value: "1" },
				{ text: "false", value: "0" },
			],
			limitOptions: [
				{ text: "5", value: 5 },
				{ text: "10", value: 10 },
				{ text: "15", value: 15 },
				{ text: "20", value: 20 },
				{ text: "50", value: 50 },
			],
			dayLocal: "",
			dateLocal: "",
			timeLocal: "",
			eventLogList: [],
			maxlength: 512,
			charRemaining: 512,
			isWakeupEvent: 0,
			notes: ""
		};
	},
	watch: {
		limit() {
			this.currentPage = 1;
			this.offset = null;
			// this.limit = this.limit;
			this.getClockLog();
		},
		eventLogList() {
			this.eventLogList.forEach(event => {
				event.isWakeupEvent = event?.isWakeupEvent === 1 ? true : false;
			});
		}
	},
	methods: {
		// handleLogStringFormat(str, event = "") {
		// 	if (this.isUTCtime(str)) str = new Date(str).toLocaleString();
		// 	if (event === "isWakeupEvent") str = str === 1 ? true : false;
		// 	// console.log(str);
		// 	return str;
		// },
		// convertUTCtoLocale() { },
		charCounter() {
			let currCount = this.notes.length;
			if (this.charRemaining <= this.maxlength)
				this.charRemaining = this.maxlength - currCount;
		},
		async getClockLog() {
			this.eventBus.emit("showHideLoader", true);
			this.eventBus.emit("checkIfRefreshNeeded");

			let headerObj = new Headers();
			headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
			headerObj.append("Content-Type", "application/json; charset=utf-8");
			let requestUrl = new URL("/api/userlogs/clock/log", this.baseUrl);

			let params = requestUrl.searchParams;
			params.set("limit", this.limit);
			params.set("offset", this.offset);
			requestUrl.search = params.toString();

			let request = new Request(
				requestUrl.toString(), {
				method: 'GET',
				headers: headerObj,
			});

			try {
				let response = await fetch(request);
				let data = await response.json();
				this.eventLogList = [];
				this.eventLogList = data;

			} catch (error) {
				console.error('Error posting data:', error);
				this.postStatus.code = 500;
				this.postStatus.message = `Error getting data: ${error}`;
				this.postStatus.success = false;
				this.eventBus.emit("updateStatus", (this.postStatus));
			} finally {
				this.eventBus.emit("showHideLoader", false);
			}
		},
		async logSimpleClock() {
			this.eventBus.emit("showHideLoader", true);
			this.eventBus.emit("checkIfRefreshNeeded");

			let data;
			try {

				let body = {
					userId: this.appState.user.userId,
					userName: this.appState.user.userName,
					isWakeupEvent: this.isWakeupEvent,
					notes: this.notes,

				};

				let headerObj = new Headers();
				headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
				headerObj.append("Content-Type", "application/json; charset=utf-8");
				let requestUrl = new URL("/api/userlogs/clock", this.baseUrl);

				let request = new Request(
					requestUrl.toString(), {
					method: 'POST',
					headers: headerObj,
					body: JSON.stringify(body)
				});

				const response = await fetch(request);
				data = await response.json();

				this.postStatus.code = data?.code;
				this.postStatus.message = data?.message;
				this.postStatus.success = data?.success;
				this.eventBus.emit("updateStatus", this.postStatus);

				this.isWakeupEvent = false;
				this.notes = "";
				this.getClockLog();

			} catch (error) {
				console.error('Error posting data:', error);
				this.postStatus.code = 400;
				this.postStatus.message = `Error posting data: ${error}`;
				this.postStatus.success = false;
				this.eventBus.emit("updateStatus", (this.postStatus));
			} finally {
				this.addUserLog(this.appState, "Add Entry to Simple Clock Log");
				this.eventBus.emit("showHideLoader", false);
			}
		},
		updateDateTime() {
			let date = new Date();
			this.dayLocal = date.toLocaleDateString('en-US', { weekday: 'long' });
			this.dateLocal = date.toLocaleDateString("en-US");
			this.timeLocal = date.toLocaleTimeString();
		},
		previousPage() {
			if (this.currentPage == 1) return;
			this.currentPage--;
			this.offset = this.offset - this.limit;
			this.getClockLog();
		},
		nextPage() {
			if (this.eventLogList.length < this.limit) return;
			this.offset = this.offset + this.limit;
			this.currentPage++;
			this.getClockLog();
		},
	},
	mounted() {
		setInterval(() => {
			this.updateDateTime();
		}, 1000);
	},
	created() {
		this.updateDateTime();
		this.getClockLog();
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
	text-align: center;
}

#view {
	padding-bottom: 60px;
}

#clocklog-container {
	overflow: hidden auto;
}

.form-container {
	margin: auto;
	width: 80%;
	max-width: 800px;
}

#wakeup-event+label {
	margin-left: 15px;
}

#clock {
	/* position: relative; */
	width: 15em;
	margin: 30px auto;
	padding: 15px;
	align-self: center;
	align-content: center;
	background-color: #000;
	text-align: center;
	font-size: 1.5em;
	user-select: none;
	border-radius: 12px;
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
	justify-content: center;
	align-items: center;
}

select {
	margin-left: 15px;
}

#notes {
	height: 5em;
	width: 25em;
	align-items: center;
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
	width: 80%;
	padding: 15px;
}

#mobile table {
	position: unset;
	width: 100%;
	padding: 10px;
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

.thumbs td,
.thumbs th {
	width: 50%;
}

.thumbs:hover {
	transform: scale(2, 2);
}

.thumbs img {
	margin-bottom: 15px;
}

.slideContainer img {
	height: unset;
}

.grid-border-bg>div {
	background-color: #555;
	display: flex;
	flex-flow: column nowrap;
	justify-content: space-between;
}

#paging {
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	width: 40%;
	margin: 30px auto 15px;
}

.mobile #paging {
	width: 90%;
	margin: 30px auto 0;
}
</style>