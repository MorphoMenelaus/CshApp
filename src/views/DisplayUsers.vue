<template>

	<div id="listUsers" class="input-heading">

		<h1>List Users</h1>

		<div id="paging">
			<label for="limitOptions">Limit{{ isMobile ? '' : ' List' }}</label>
			<select v-model="limit">
				<option v-for="(item, index) in limitOptions" :key="index" :value="item.value">{{ item.value }}</option>
			</select>
			<button class="prev-button btn" type="button" @click="previousPage()"
				title="Previous Page">previous</button>
			<button class="next-button btn" type="button" @click="nextPage()" title="Next Page">next</button>
			<span :currentPage="currentPage">page {{ currentPage }}</span>
		</div>

		<div class="user-lists-container">

			<div v-if="usersList.length > 0">
				<div id="non-mobile" v-if="!isMobile">
					<table v-if="usersList && usersList.length > 0">
						<thead>
							<tr class="header-row">
								<th v-for="(label, index) in Object.keys(usersList[0])" :key="index">{{
									this.toTitleCase(label)
								}}
								</th>
							</tr>
						</thead>
						<tbody>
							<tr class="data-row" v-for="(user, index) in usersList" :key="index">
								<td v-for="(column, index) in user" :key="index" :class="column === true ? 'true' : ''">
									{{ isUTCtime(column) ? new Date(column).toLocaleString() : column }}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div id="mobile" v-if="isMobile">
					<table v-for="(item, index) in usersList" :key="index">
						<tr class="header-row" v-for="(key, event, index) in Object.keys(item)" :key="index">
							<th>{{ this.toTitleCase(key) }}</th>
							<td :class="item[key] === true ? 'true' : ''">{{ isUTCtime(item[key]) ? new
								Date(item[key]).toLocaleString() : item[key] }}</td>
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
// import { ref } from "vue";
// import session from "@/dependencies/sessionMethods";
// import router from "@/router";

export default {
	name: "DisplayUsers",
	props: {
		appState: Object,
		isMobile: Boolean
	},
	components: {},
	data() {
		return {
			serverStatus: Object.assign({}, this.appNotify),
			limit: 5,
			offset: 0,
			currentPage: 1,
			limitOptions: [
				{ text: "5", value: "5" },
				{ text: "10", value: "10" },
				{ text: "15", value: "15" },
				{ text: "20", value: "20" },
				{ text: "50", value: "50" },
			],
			// serverMessage: "Loading...",
			responseStatus: "",
			usersList: [],
			usersLabels: [
				"userId",
				"userCreated",
				"userName",
				"admin",
				"siteAdmin",
				"siteEditor",
				"isContributor",
				"userNotes",
			],
		};
	},
	watch: {
		limit() {
			this.currentPage = 1;
			this.offset = null;
			this.getUsers();
		},
		usersList() {
			this.usersList.forEach(user => {
				Object.keys(user).forEach(key => {
					if (key === "admin" || key === "verified" || key === "siteAdmin" || key === "siteEditor" || key === "contributor" || key === "uiDarkMode")
						user[key] = user[key] === 1 ? true : false;
				});
			});
		}
	},
	methods: {
		async getUsers() {
			this.eventBus.emit("showHideLoader", true);

			const refreshResponse = await this.refreshAuthTokenAsNeeded(this.appState);
			if (!refreshResponse.success) {
				let mergedStatus = { ...this.serverStatus, ...refreshResponse };
				this.eventBus.emit("updateStatus", mergedStatus);
				return;
			}

			let headerObj = new Headers();
			headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
			headerObj.append("Content-Type", "application/json; charset=utf-8");
			let requestUrl = new URL("/api/users/", this.baseUrl);

			let params = requestUrl.searchParams;
			params.set("limit", this.limit);
			params.set("time", new Date().getTime());
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
					this.usersList = data.users;
				}
			} catch (error) {
				console.error('Error fetching data:', error)
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
			if (this.usersList.length < this.limit) return;
			this.offset = this.offset + this.limit;
			this.currentPage++;
			this.getUserLogs();
		},
	},
	mounted() {
		this.getUsers();
	},
	created() {
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#view {
	padding-bottom: 80px;
}

h1 {
	font-weight: bold;
	text-align: center;
}

#listUsers {
	padding: 15px 15px 60px;
}

table {
	text-align: center;
	border: 1px solid #666;
	border-radius: 10px;
	width: 100%;
	margin: 30px auto;
	padding: 5px;
	position: relative;
	background-color: #ddd;
	color: #000;
}

.uiDarkMode table {
	background-color: inherit;
	color: inherit;
}

.header-row {
	font-weight: bold;
	color: #fff;
	border: 1px #f00 solid;
}

#paging {
	color: #000;
	max-width: 30em;
}

.uiDarkMode #paging {
	color: #c1c1c1;
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

th {
	padding: 5px 15px;
	background-color: #aaa;
	color: #000;
	font-weight: bold;
}

td {
	border-bottom: 1px #aaa solid;
}

@media (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 768px) {}

@media (min-width: 992px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) {}
</style>