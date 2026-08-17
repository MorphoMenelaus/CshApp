<template>
	<div>
		<div id="time-entries">
			<h1>Time Entries</h1>
			<div class="input-fields">
				<div class="form-group">
					<label for="startDate">Start date:</label>
					<input v-model="startDate" type="date" id="startDate" name="startDate" min="" max="endDate" />
				</div>
				<div class="form-group">
					<label for="endDate">End date:</label>
					<input v-model="endDate" type="date" id="endDate" name="endDate" min="startDate" max="" />
				</div>
				<div class="btn-group">
					<button class="btn" @click="getTimeEntries()">Get Entries</button>
				</div>
			</div>
			<div v-if="timeEntries.length > 0">
				<div id="non-mobile" v-if="!isMobile">
					<table v-if="timeEntries && timeEntries.length > 0">
						<thead>
							<tr class="header-row">
								<th v-for="(label, index) in Object.keys(timeEntries[0])" :key="index">{{
									this.toTitleCase(label)
								}}
								</th>
							</tr>
						</thead>
						<tbody>
							<tr class="data-row" v-for="(user, index) in timeEntries" :key="index">
								<td v-for="(column, index) in user" :key="index">{{ isUTCtime(column) ? new
									Date(column).toLocaleString() : column }}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div id="mobile" v-if="isMobile">
					<table v-for="(item, index) in timeEntries" :key="index">
						<tr class="header-row" v-for="(key, event, index) in Object.keys(item)" :key="index">
							<th>{{ this.toTitleCase(key) }}</th>
							<td>{{ isUTCtime(item[key]) ? new Date(item[key]).toLocaleString() : item[key] }}</td>
						</tr>
					</table>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
import { inject } from "vue";
import { tokenInterceptFetch } from "@/dependencies/csh-libs.js";

export default {
	name: "TimeEntries",
	props: {
		appState: Object,
		isMobile: Boolean
	},
	components: {},
	data() {
		return {
			showHideLoader: inject('showHideLoader'),
			updateStatus: inject('sendUpdateStatus'),
			serverStatus: Object.assign({}, this.appNotify),
			startDate: new Date().toISOString().split('T')[0],
			endDate: new Date().toISOString().split('T')[0],
			timeEntries: [],
		};
	},
	watch: {
	},
	methods: {
		async getTimeEntries() {
			this.showHideLoader(true);

			let headerObj = new Headers();
			headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
			headerObj.append("Content-Type", "application/json; charset=utf-8");
			let requestUrl = new URL("/api/toggl/entries", this.baseUrl);

			let params = requestUrl.searchParams;
			params.set("start_date", this.startDate);
			params.set("end_date", this.endDate);
			requestUrl.search = params.toString();

			let request = new Request(
				requestUrl.toString(), {
				method: 'GET',
				headers: headerObj,
			});

			try {
				const response = await tokenInterceptFetch(request);
				const data = await response.json();

				this.timeEntries = data.timeEntries;

			} catch (error) {
				console.error('Error posting data:', error);
				this.serverStatus.code = 500;
				this.serverStatus.message = `Error getting data: ${error}`;
				this.serverStatus.success = false;
				this.updateStatus(this.serverStatus);
			} finally {
				this.showHideLoader(false);
			}
		},
	},
};
</script>

<style scoped>
h1,
h2,
h3,
h4 {
	text-align: center;
}

#time-entries {
	background-color: #c1c1c1;
	color: #333;
	border-radius: 12px;
	border: 1px #333 solid;
}

.input-fields {
	display: flex;
	justify-content: center;
	margin: 15px;
}
</style>
