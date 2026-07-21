<template>
	<div>
		<!-- <div>{{ project }}</div> -->
		<div class="proj-container">
			<h1>Timer: {{ hours }}:{{ minutes }}:{{ seconds }}</h1>
			<div id="start-stop">
				<h3 class="proj-name" :style="`background-color: ${project.color}`">{{ project.name }}</h3>
				<div class="input-container" v-if="!started">
					<div class="form-group">
						<label for="description">What are you working on?</label>
						<input id="description" v-model="description" />
					</div>
					<!-- <div class="form-group">
						<label for="created_with">Created with</label>
						<input id="created_with" v-model="created_with" />
					</div> -->
					<div class="form-group">
						<label for="tagsString">Tags</label>
						<input id="tagsString" v-model="tagsString" />
					</div>
					<button class="btn small" @click="reset()">Change Project</button>
				</div>
				<div class="btn-container">
					<button class="btn start" :title="`Start Timer ${started ? '(disabled)' : ''}`" :disabled="started"
						@click="startTime()">Start</button>
					<button class="btn stop" :title="`Stop Timer ${started ? '' : '(disabled)'}`" :disabled="!started"
						@click="stopTime()">Stop</button>
				</div>
			</div>
		</div>
		<div id="project">
			<div class="proj-name" :style="`background-color: ${project.color}`">{{ project.name }}
				<span class="running" v-if="started">Started</span>
			</div>
			<div class="descrip" v-if="startInstance?.start">
				<div>{{ startInstance.description }}</div>
				<div>Started: {{ new Date(startInstance.start).toLocaleString() }}</div>
			</div>
			<div class="descrip" v-else>
				<div>{{ project.client_name }}</div>
				<div>Created: {{ new Date(project.created_at).toLocaleString() }}</div>
				<div>Hours: {{ (project.actual_seconds / 60 / 60).toFixed(2) }}</div>
			</div>
		</div>
		<!-- <div v-if="startInstance?.id">{{ startInstance }}</div> -->
	</div>
</template>

<script>
import { Storage } from "@/dependencies/csh-libs.js";

export default {
	name: "TimeTracker",
	props: {
		appState: Object,
		project: Object,
		openTracker: Object,
	},
	data() {
		return {
			serverStatus: Object.assign({}, this.appNotify),
			togglStore: new Storage("togglStore"),
			togglRecall: {},
			workspace_id: null,
			elapsedTime: 0,
			created_with: "CSH App",
			description: "",
			tagsString: "",
			tags: [],
			billable: false,
			// To create a time entry that started and continues to be running, the duration field must be negative.
			// https://engineering.toggl.com/docs/track/tracking/
			duration: -1,
			start: null, // "2026-07-19T12:18:30.315Z" formated time
			stop: null, // Must be null for a continuous entry.
			startInstance: {},
			interval: null,
			started: false,
			seconds: "00",
			minutes: "00",
			hours: 0,
		};
	},
	watch: {
		tagsString() {
			let newArray = [];
			let arr = this.tagsString.split(',');
			arr.forEach(tag => {
				newArray.push(tag.trim());
			});
			this.tags = newArray;
		}
	},
	methods: {
		reset() {
			this.startInstance = {};
			this.description = "";
			// this.created_with = "";
			this.tags = [];
			this.started = false;
			if (this.togglRecall?.startInstance)
				this.togglStore.delete("startInstance");
			this.eventBus.emit("deselectTogglProject");
		},
		async startTime() {
			this.eventBus.emit("showHideLoader", true);

			const refreshResponse = await this.refreshAuthTokenAsNeeded(this.appState);
			if (refreshResponse?.code === 403) this.eventBus.emit("forceLogout");
			if (!refreshResponse?.success) {
				this.eventBus.emit("updateStatus", refreshResponse);
				return;
			} else if (refreshResponse?.code !== 304) {
				this.eventBus.emit("updateAppState", refreshResponse.appState);
			};

			try {

				this.start = new Date().toISOString();

				let body = {
					project_id: this.project.id,
					created_with: this.created_with,
					description: this.description,
					tags: this.tags,
					billable: this.billable,
					workspace_id: this.workspace_id,
					duration: this.duration,
					start: this.start,
					stop: this.stop
				};

				let headerObj = new Headers();
				headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
				headerObj.append("Content-Type", "application/json; charset=utf-8");
				let requestUrl = new URL("/api/toggl/start", this.baseUrl);

				let request = new Request(
					requestUrl.toString(), {
					method: 'POST',
					headers: headerObj,
					body: JSON.stringify(body)
				});

				const response = await fetch(request);
				const data = await response.json();

				if (data?.code === 403) {
					this.eventBus.emit("updateStatus", data);
					this.eventBus.emit("forceLogout");
				}

				if (data.code === 402) {
					this.serverStatus.code = 402;
					this.serverStatus.message = "Hourly API quota reached. Resets in 12 min.";
					this.serverStatus.success = false;
					this.eventBus.emit("updateStatus", (this.serverStatus));
					return;
				}

				this.started = true;

				let updateAppState = this.appState;
				updateAppState.togglStarted = {
					started: this.started,
					project_id: this.project.id
				}
				this.eventBus.emit("updateAppState", updateAppState);

				this.startInstance = data.startInstance;
				this.togglStore.add("startInstance", data.startInstance);

				this.start = this.startInstance.start;
				this.setInterval();

				this.serverStatus.code = data?.code;
				this.serverStatus.message = data?.message;
				this.serverStatus.success = data?.success;
				this.eventBus.emit("updateStatus", this.serverStatus);
			} catch (error) {
				this.started = false;
				console.error('Error posting data:', error);
				this.serverStatus.code = 400;
				this.serverStatus.message = `Error posting data: ${error}`;
				this.serverStatus.success = false;
				this.eventBus.emit("updateStatus", (this.serverStatus));
			} finally {
				this.eventBus.emit("showHideLoader", false);
			}
		},
		async stopTime() {
			this.eventBus.emit("showHideLoader", true);

			const refreshResponse = await this.refreshAuthTokenAsNeeded(this.appState);
			if (refreshResponse?.code === 403) this.eventBus.emit("forceLogout");
			if (!refreshResponse?.success) {
				this.eventBus.emit("updateStatus", refreshResponse);
				return;
			} else if (refreshResponse?.code !== 304) {
				this.eventBus.emit("updateAppState", refreshResponse.appState);
			};

			try {

				let body = {
					"workspace_id": this.workspace_id,
					"time_entry_id": this.startInstance.id
				};

				let headerObj = new Headers();
				headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
				headerObj.append("Content-Type", "application/json; charset=utf-8");
				let requestUrl = new URL("/api/toggl/stop", this.baseUrl);

				let request = new Request(
					requestUrl.toString(), {
					method: 'PATCH',
					headers: headerObj,
					body: JSON.stringify(body)
				});

				const response = await fetch(request);
				const data = await response.json();

				if (data?.code === 403) {
					this.eventBus.emit("updateStatus", data);
					this.eventBus.emit("forceLogout");
				}

				if (data.code === 402) {
					this.serverStatus.code = 402;
					this.serverStatus.message = "Hourly API quota reached. Resets in 12 min.";
					this.serverStatus.success = false;
					this.eventBus.emit("updateStatus", (this.serverStatus));
					return;
				}

				clearInterval(this.interval);
				this.start = 0;
				this.started = false;
				this.togglStore.delete("startInstance");

				let updateAppState = this.appState;
				delete updateAppState.togglStarted;
				this.eventBus.emit("updateAppState", updateAppState);

				this.serverStatus.code = data?.code;
				this.serverStatus.message = data?.message;
				this.serverStatus.success = data?.success;
				this.eventBus.emit("updateStatus", this.serverStatus);
			} catch (error) {
				console.error('Error posting data:', error);
				this.serverStatus.code = 400;
				this.serverStatus.message = `Error posting data: ${error}`;
				this.serverStatus.success = false;
				this.eventBus.emit("updateStatus", (this.serverStatus));
			} finally {
				this.started = false;
				this.eventBus.emit("showHideLoader", false);
			}
		},
		setInterval() {
			this.updateDateTime();
			if (this.interval) clearInterval(this.interval);
			this.interval = setInterval(this.updateDateTime, 1000);
		},
		updateDateTime() {
			let date = new Date(this.start);
			let now = new Date();
			let elapsed = now - date;

			this.seconds = Math.floor((elapsed / 1000) % 60).toString().padStart(2, '0');
			this.minutes = Math.floor((elapsed / (1000 * 60)) % 60).toString().padStart(2, '0');
			this.hours = Math.floor(elapsed / (1000 * 60 * 60));


			this.elapsedTime = Number((elapsed / 1000).toFixed());
		},
	},
	mounted() {
		if (Object.keys(this.openTracker).length > 0) {
			this.startInstance = { ...this.startInstance, ...this.openTracker };
			this.togglStore.add("startInstance", this.startInstance);
			this.start = this.openTracker.start;
			this.started = true;
			this.setInterval();
		}
		this.workspace_id = this.project.workspace_id;
		if (this.togglRecall?.startInstance?.start) {
			this.startInstance = this.togglRecall.startInstance;
			this.start = this.togglRecall.startInstance.start;
			this.description = this.togglRecall.startInstance.description;
			this.started = true;
			this.setInterval();
		}
	},
	created() {
		if (Object.keys(this.togglStore.get()).length === 0)
			this.togglStore.save({});
		this.togglRecall = this.togglStore.get();
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.small {
	font-size: 1em;
}

.proj-container h1 {
	font-size: 2.5em;
}

.proj-container h4 {
	font-weight: 500;
	background-color: #e5e5e5;
	padding: 0 5px;
	border-radius: 6px;
	margin: 15px auto 0;
}

#project {
	display: flex;
	justify-content: space-between;
	width: 90%;
	max-width: 75em;
	align-items: baseline;
	background-color: #000;
	margin: 30px auto 15px;
	padding: 10px;
	border-radius: 12px;
}

.proj-container {
	flex-direction: column;
	align-items: center;
	display: flex;
	background-color: #c1c1c1;
	margin: auto;
	width: fit-content;
	padding: 15px;
	border-radius: 12px;
	border: 1px #000 solid;
	color: #333;
	position: fixed;
	top: 115px;
	right: 15px;
	z-index: 500;
}

.input-container {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	font-size: 1.25em;
}

.form-group {
	display: flex;
	flex-direction: column;
	width: 100%;
}

.btn-container {
	display: flex;
	justify-content: center;
	margin: 15px 0;
}

.descrip {
	align-self: center;
	width: 100%;
	font-weight: 700;
	display: flex;
	justify-content: space-evenly;
}

.descrip div {
	/* flex: 1 0 auto; */
	padding: 0 15px;
}

#start-stop {
	width: 100%;
}

#start-stop input {
	font-size: .9em;
}

#start-stop .btn {
	font-size: 2em;
	margin: 0 15px;
}

#start-stop .btn.small {
	justify-self: center;
	margin-top: 15px;
	font-size: .8em;
	align-self: center;
}

.start {
	background-color: green;
}

.stop {
	background-color: #cb501c;
}

.proj-name {
	text-align: center;
	border-radius: 12px;
	margin: 5px;
	padding: 5px 15px;
	font-weight: bold;
	color: #000;
	box-shadow: inset -3px -3px 6px 1px rgb(0 0 0 / 80%),
		inset 2px 2px 6px rgb(255 255 255 / 80%);
}

.running {
	color: #fff;
	background-color: green;
	border: 1px solid #fff;
	border-radius: 10px;
	padding: 0 10px;
	font-weight: 500;
	line-height: 1.4em;
	/* margin-left: 15px; */
}

@media (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 768px) {}

@media (min-width: 992px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) {}
</style>