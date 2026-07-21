<template>
	<div>
		<Transition name="fade">
			<TimeTracker v-if="project?.client_id" :appState="appState" :project="project" :openTracker="openTracker" />
		</Transition>
		<table>
			<thead>
				<tr class="header-row">
					<th>Project</th>
					<th>Client</th>
					<th>Project Id</th>
					<th>Created</th>
					<th>Hours</th>
					<th>Status</th>
					<th>Start_date</th>
				</tr>
			</thead>
			<tbody>
				<tr class="data-row" v-for="(item, index) in projects" :key="index">
					<td @click="!projectOpen ? project = item : null"
						:title="projectOpen && !openTracker?.stop ? `A project is already running` : `Select ${item.name}`">
						<div :class="projectOpen && project?.id !== item.id ? 'disabled' : ''"
							:style="`background-color: ${item.color}`">{{ item.name }}</div>
						<span class="running"
							v-if="projectOpen && !openTracker?.stop && project?.id === item.id">Started</span>
					</td>
					<td>
						<div>{{ item.client_name }}</div>
					</td>
					<td>
						<div>{{ item.id }}</div>
					</td>
					<td>
						<div>{{ new Date(item.created_at).toLocaleString() }}</div>
					</td>
					<td>
						<div>{{ (item.actual_seconds / 60 / 60).toFixed(2) }}</div>
					</td>
					<td>
						<div>{{ item.status }}</div>
					</td>
					<td>
						<div>{{ item.start_date }}</div>
					</td>
				</tr>
			</tbody>
		</table>

	</div>
</template>

<script>
import { onBeforeUnmount } from "vue";
import { Storage } from "@/dependencies/csh-libs.js";
import TimeTracker from "@/components/TimeTracker.vue";

export default {
	name: "ProjectTable",
	props: {
		appState: Object,
		projects: Array,
	},
	components: {
		TimeTracker
	},
	data() {
		return {
			togglStore: new Storage("togglStore"),
			togglRecall: {},
			openTracker: null,
			project: {},
			startInstance: {},
			projectOpen: false,

			// projectStarted: false,
		};
	},
	watch: {
		project() { },
		openTracker() {
			this.projectOpen = (this.openTracker && Object.keys(this.openTracker).length > 0) ? true : false;
		},
		appState: {
			handler(val) {
				if (val?.startInstance) {
					this.startInstance = val.startInstance;
					this.openTracker = val.startInstance;
				}
				console.log(val?.startInstance);
			},
			deep: true
		}
	},
	methods: {
		async getCurrentTimeEntries() {
			this.eventBus.emit("showHideLoader", true);

			const refreshResponse = await this.refreshAuthTokenAsNeeded(this.appState);
			if (refreshResponse?.code === 403) this.eventBus.emit("forceLogout");
			if (!refreshResponse?.success) {
				this.eventBus.emit("updateStatus", refreshResponse);
				return;
			} else if (refreshResponse?.code !== 304) {
				this.eventBus.emit("updateAppState", refreshResponse.appState);
			};

			let headerObj = new Headers();
			headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
			headerObj.append("Content-Type", "application/json; charset=utf-8");
			let requestUrl = new URL("/api/toggl/entries/current", this.baseUrl);

			let request = new Request(
				requestUrl.toString(), {
				method: 'GET',
				headers: headerObj,
			});

			try {
				let response = await fetch(request);
				let data = await response.json();

				if (data.code === 402) {
					this.serverStatus.code = 402;
					this.serverStatus.message = "Hourly API quota reached. Resets in 12 min.";
					this.serverStatus.success = false;
					this.eventBus.emit("updateStatus", (this.serverStatus));
					return;
				}

				this.openTracker = data?.currentEntries;
				this.togglStore.delete("openTracker");
				if (!this.openTracker) return;

				this.project = this.projects.filter(proj => proj.id === this.openTracker.project_id)[0];
				this.togglStore.add("project", this.project);
				this.togglStore.add("openTracker", this.openTracker);

				console.log(this.project);

				let updateAppState = this.appState;
				updateAppState.openTracker = this.openTracker;
				updateAppState.project = this.project;
				this.eventBus.emit("updateAppState", updateAppState);

			} catch (error) {
				console.error('Error posting data:', error);
				this.serverStatus.code = 500;
				this.serverStatus.message = `Error getting data: ${error}`;
				this.serverStatus.success = false;
				this.eventBus.emit("updateStatus", (this.serverStatus));
			} finally {
				this.eventBus.emit("showHideLoader", false);
			}
		},
	},
	mounted() {
		this.getCurrentTimeEntries();

		let store = this.togglStore.get();
		this.project = store?.project;
		this.openTracker = store?.openTracker;
		this.startInstance = store?.startInstance;
		this.projectOpen = (this.openTracker && Object.keys(this.openTracker).length > 0) ? true : false;

		let updateAppState = this.appState;
		updateAppState.openTracker = this?.openTracker;
		updateAppState.project = this?.project;
		this.eventBus.emit("updateAppState", updateAppState);
	},
	created() {
		this.eventBus.on("deselectTogglProject", () => {
			this.project = {};
		});
		onBeforeUnmount(() => {
			this.eventBus.off("deselectTogglProject");
		});
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header-row {
	text-transform: uppercase;
}

th,
td {
	text-align: left;
	position: relative;
}

th,
td div {
	border-radius: 12px;
	margin: 5px;
	padding: 5px 15px;
	font-weight: bold;
}

td:first-child div {
	color: #000;
	box-shadow: inset -3px -3px 6px 1px rgb(0 0 0 / 80%),
		inset 2px 2px 6px rgb(255 255 255 / 80%);
	cursor: pointer;
	user-select: none;
	transition: transform .2s ease;
}

td:first-child div:not(.disabled):hover {
	filter: brightness(1.5);
	transform: scale(1.015);
}

td:first-child .disabled {
	/* filter: brightness(0.75); */
	color: #444;
	cursor: not-allowed;
}

tr.header-row {
	background-color: #000;
}

tr.header-row * {
	border-radius: unset;
}

.running {
	position: absolute;
	top: 12px;
	right: 15px;
	background-color: green;
	border-radius: 10px;
	padding: 0 10px;
	border: 1px #fff solid;
	line-height: 1.4em;
	color: #fff;
	font-weight: 500;
}

@media (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 768px) {}

@media (min-width: 992px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) {}
</style>