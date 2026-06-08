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
				<input v-model="isWakeupEvent" id="wakeup-event" type="checkbox" name="iswakeupevent"
					title="Wakeup Event" />
				<label for="iswakeupevent" title="Wakeup Event">Wakeup Event</label>
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

		<div class="user-lists-container">
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
						<td v-for="(column, index) in event" :key="index">{{ this.handleLogStringFormat(column,
							event[index]) }}</td>
					</tr>
				</tbody>
			</table>
		</div>

	</div>

</template>

<script>
// @ is an alias to /src
import { onBeforeUnmount } from "vue";

export default {
	name: "SimpleClock",
	props: {
		appState: Object
	},
	components: {},
	data() {
		return {
			postStatus: Object.assign({}, this.appNotify),
			dayLocal: "",
			dateLocal: "",
			timeLocal: "",
			eventLogList: [],
			maxlength: 512,
			charRemaining: 512,
			isWakeupEvent: false,
			notes: ""
		};
	},
	watch: {
	},
	methods: {
		handleLogStringFormat(str, event = "") {
			if (this.isUTCtime(str)) str = new Date(str).toLocaleString();
			if (event === "isWakeupEvent") str = str === 1 ? true : false;
			return str;
		},
		// convertUTCtoLocale() { },
		charCounter() {
			let currCount = this.notes.length;
			if (this.charRemaining <= this.maxlength)
				this.charRemaining = this.maxlength - currCount;
		},
		async getClockLog() {
			try {

				let response = await fetch('/api/users/clock/log', {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				});

				let data = await response.json();

				this.eventLogList = data;

			} catch (error) {
				console.error('Error posting data:', error);
				this.postStatus.code = 500;
				this.postStatus.message = `Error getting data: ${error}`;
				this.postStatus.success = false;
				this.eventBus.emit("updateStatus", (this.postStatus));
			}
		},
		async logSimpleClock() {
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
				let requestUrl = new URL("/api/users/clock", this.baseUrl);

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
			}
		},
		updateDateTime() {
			let date = new Date();
			this.dayLocal = date.toLocaleDateString('en-US', { weekday: 'long' });
			this.dateLocal = date.toLocaleDateString("en-US");
			this.timeLocal = date.toLocaleTimeString();
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
#view {
	position: absolute;
	left: 0;
	top: 80px;
	right: 0;
	bottom: 40px;
	padding: 15px 60px;
	overflow: auto;
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
	position: relative;
	width: 15em;
	margin: 30px auto;
	padding: 15px;
	align-self: center;
	align-content: center;
	background-color: #000;
	text-align: center;
	font-size: 200%;
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

#notes {
	height: 5em;
	width: 30em;
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
	margin: 30px auto;
	padding: 5px;
	text-align: center;
	background-color: rgb(0 0 0 / 25%);
	border-radius: 10px;
	border: 1px rgb(255 255 255 / 50%) solid;
	backdrop-filter: blur(5px);
}

th {
	padding: 5px 15px;
	background-color: #fff;
	color: #000;
	font-weight: bold;
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
</style>