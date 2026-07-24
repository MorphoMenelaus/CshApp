<template>
	<div id="time-tracker">
		<div>
			<div id="toggl-user" v-if="toggleUser">
				<h1 id="toggl-heading">Toggl Project Tracker</h1>
				<a href="https://toggl.com/" class="link" title="Toggl Track" target="_blank"><small>Toggl Full
						Website</small></a>
				<h1>{{ toggleUser.fullname }}</h1>
				<h2>User Id: {{ toggleUser.user_account_id }}</h2>

				<div class="btn-group">
					<button class="btn" @click="showAcountDetails = showAcountDetails ? false : true">Account
						Details</button>
				</div>

				<Transition name="slide-down">
					<ul v-if="showAcountDetails">
						<li v-for="(item, index) in toggleUser" :key="index">
							{{ index }}: {{ item }}
						</li>
					</ul>
				</Transition>
			</div>

			<ProjectTable v-if="projects?.length > 0" :appState="appState" :projects="projects" />

			<!-- <TimeEntries :appState="appState" :isMobile="isMobile" :windowWidth="windowWidth" /> -->

		</div>
	</div>
</template>

<script>
import { Storage } from "@/dependencies/csh-libs.js";
import ProjectTable from "@/components/ProjectTable.vue";
// import TimeEntries from "@/components/TimeEntries.vue";

export default {
	name: "TogglPOC",
	props: {
		appState: Object,
		isMobile: Boolean,
		windowWidth: Number
	},
	components: {
		// TimeEntries,
		ProjectTable
	},
	data() {
		return {
			serverStatus: Object.assign({}, this.appNotify),
			togglStore: new Storage("togglStore"),
			togglRecall: {},
			showAcountDetails: false,
			startDate: "",
			endDate: "",
			toggleUser: null,
			projects: [],
		};
	},
	watch: {
	},
	methods: {
		async getUserData() {
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

				let headerObj = new Headers();
				headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
				headerObj.append("Content-Type", "application/json; charset=utf-8");
				let requestUrl = new URL("/api/toggl/user", this.baseUrl);

				let request = new Request(
					requestUrl.toString(), {
					method: 'GET',
					headers: headerObj,
				});

				let response = await fetch(request);
				let data = await response.json();

				if (data.code === 402) {
					this.serverStatus.code = 402;
					this.serverStatus.message = "Hourly API quota reached. Resets in 12 min.";
					this.serverStatus.success = false;
					this.eventBus.emit("updateStatus", (this.serverStatus));
					return;
				}

				let timecode = new Date().getTime();
				data.users.timecode = timecode;

				this.toggleUser = data.users;
				this.togglStore.add("users", this.toggleUser);

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
		async getProjects() {
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
				let headerObj = new Headers();
				headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
				headerObj.append("Content-Type", "application/json; charset=utf-8");
				let requestUrl = new URL("/api/toggl/projects", this.baseUrl);

				let request = new Request(
					requestUrl.toString(), {
					method: 'GET',
					headers: headerObj,
				});

				let response = await fetch(request);
				let data = await response.json();

				if (data.code === 402) {
					this.serverStatus.code = 402;
					this.serverStatus.message = "Hourly API quota reached. Resets in 12 min.";
					this.serverStatus.success = false;
					this.eventBus.emit("updateStatus", (this.serverStatus));
					return;
				}

				let timecode = new Date().getTime();
				data.projects.timecode = timecode;

				this.projects = data.projects;

				this.togglStore.add("projects", this.projects);

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
		// 1 hour storage expire
		let current = new Date().getTime();
		if (current > this.togglRecall?.projects?.timecode + 3600000)
			this.getProjects();
		if (current > this.togglRecall?.users?.timecode + 3600000)
			this.getUserData();
	},
	created() {
		this.togglRecall = this.togglStore.get();
		if (this.isObjNullOrEmpty(this.togglRecall)) {
			this.togglStore.save({});
		}
		if (!this.togglRecall?.projects) {
			this.getProjects();
		}
		if (!this.togglRecall?.users) {
			this.getUserData();
		}
		this.projects = this.togglRecall?.projects;
		this.toggleUser = this.togglRecall?.users;
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2,
h3,
h4 {
	text-align: center;
}

#toggl-heading {
	font-size: 2.5em;
}

#toggl-user {
	width: 95%;
	max-width: 50em;
	/* margin: 15px auto; */
	background-color: #c1c1c1;
	color: #333;
	border-radius: 12px;
	border: 1px #333 solid;
}

.btn-group {
	display: flex;
	justify-content: center;
}

.btn-group .btn {
	margin: 15px;
}

#toggl-user ul {
	margin: 15px auto 30px;
	width: 95%;
}

#toggl-user a {
	padding: 0 0 10px;
	line-height: .75em;
	display: flex;
	justify-content: center;
}

#toggl-user a:hover {
	background-color: unset;
}

@media (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 768px) {
	#toggl-user {
		width: 80%;
	}
}

@media (min-width: 992px) {
	#toggl-user {
		width: 70%;
	}
}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) {}
</style>