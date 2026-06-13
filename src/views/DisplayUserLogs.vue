<template>

	<div id="listUsersLogs" class="input-heading">

		<h1>User Logs</h1>

		<div id="paging">
			<label for="limitOptions">Limit List</label>
			<select v-model="limit">
				<option v-for="(item, index) in limitOptions" :key="index" :value="item.value">{{ item.value }}</option>
			</select>
			<button class="prev-button" type="button" @click="previousPage()">previous</button>
			<button class="next-button" type="button" @click="nextPage()">next</button>
			<span :currentPage="currentPage">page {{ currentPage }}</span>
		</div>

		<div class="user-lists-container">
			<table v-if="logs && logs.length > 0">
				<thead>
					<tr class="header-row">
						<th v-for="(label, index) in Object.keys(logs[0])" :key="index">{{ this.toTitleCase(label)
						}}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr class="data-row" v-for="(user, index) in logs" :key="index">
						<td v-for="(column, index) in user" :key="index">{{ isUTCtime(column) ? new
							Date(column).toLocaleString() : column }}</td>
					</tr>
				</tbody>
			</table>
		</div>

	</div>

</template>

<script>
// @ is an alias to /src
// import { ref } from "vue";
// import session from "@/dependencies/sessionMethods";
// import router from "@/router";
import { onBeforeUnmount } from "vue";

export default {
	name: "DisplayUserLogs",
	props: {
		appState: Object
	},
	components: {},
	data() {
		return {
			status: Object.assign({}, this.status),
			limit: 5,
			offset: 0,
			currentPage: 1,
			limitOptions: [
				{ text: "5", value: 5 },
				{ text: "10", value: 10 },
				{ text: "15", value: 15 },
				{ text: "20", value: 20 },
				{ text: "50", value: 50 },
			],
			responseStatus: "",
			logs: [],
			labels: [
				"entryId",
				"userId",
				"userName",
				"actionPerformed",
				"dateTime",
			],
			bogusData: [
				{
					"entryId": 1,
					"userId": "0b91a221-6059-11f1-ab03-ea0526f21063",
					"userName": "chrish",
					"actionPerformed": "Password Changed",
					"dateTime": "2026-06-10T12:07:07.000Z"
				}, {
					"entryId": 1,
					"userId": "0b91a221-6059-11f1-ab03-ea0526f21063",
					"userName": "chrish",
					"actionPerformed": "Password Changed",
					"dateTime": "2026-06-10T12:07:07.000Z"
				}, {
					"entryId": 1,
					"userId": "0b91a221-6059-11f1-ab03-ea0526f21063",
					"userName": "chrish",
					"actionPerformed": "Password Changed",
					"dateTime": "2026-06-10T12:07:07.000Z"
				}
			]
		};
	},
	watch: {
		limit() {
			this.currentPage = 1;
			this.offset = null;
			// this.limit = this.limit;
			this.getUserLogs();
		},
	},
	methods: {
		async getUserLogs() {
			this.eventBus.emit("showHideLoader", true);
			this.eventBus.emit("checkIfRefreshNeeded");

			let headerObj = new Headers();
			headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
			headerObj.append("Content-Type", "application/json; charset=utf-8");
			let requestUrl = new URL("/api/userlogs/", this.baseUrl);

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

				const data = await response.json();
				if (data.success) {
					let logs = data.logs;
					this.logs = Array.isArray(logs) && logs.length > 0 ? logs : this.bogusData;
				}

				this.eventBus.emit("getUserLogs", this.logs);
			} catch (error) {
				this.logs = this.bogusData;
				console.error('Error fetching data:', error)
				this.eventBus.emit("getUserLogs", error);
			} finally {
				this.eventBus.emit("showHideLoader", false);
			}
		},
		previousPage() {
			if (this.currentPage == 1) return;
			this.currentPage--;
			this.offset = this.offset - this.limit;
			this.getUserLogs();
		},
		nextPage() {
			if (this.logs.length < this.limit) return;
			this.offset = this.offset + this.limit;
			this.currentPage++;
			this.getUserLogs();
		},
	},
	mounted() {
		this.getUserLogs();
	},
	created() {
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#view {
	padding-bottom: 90px;
}

h1 {
	font-weight: bold;
	text-align: center;
}

#listUsersLogs {
	/* margin-left: 20%; */
	padding: 15px 15px 60px;
	/* height: calc(100vh - 10em);*/
	/* overflow: hidden; */
}

.header-row {
	font-size: 1.5em;
	font-weight: bold;
	background-color: #666;
	color: #fff;
	border: 1px #f00 solid;
}

#paging {
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	width: 40%;
	margin: 15px auto;
}

/* .user-lists-container {
	height: calc(100vh - 18em);
	overflow: hidden auto;
} */

td {
	padding: 15px;
}

tr {
	transition: background-color 0.3s;
}

tr:nth-child(2n) {
	background-color: #414650;
}

tr.data-row:hover,
tr:nth-child(2n):hover {
	background-color: #dfdfdf;
	color: #000;
}

@media (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 768px) {}

@media (min-width: 992px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) {}
</style>