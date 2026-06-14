<template>

	<div id="listUsers" class="input-heading">

		<h1>List Users</h1>

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
						<th>{{ key }}</th>
						<td>{{ isUTCtime(item[key]) ? new Date(item[key]).toLocaleString() : item[key] }}</td>
					</tr>
				</table>
			</div>

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
	name: "DisplayUsers",
	props: {
		appState: Object,
		isMobile: Boolean
	},
	components: {},
	data() {
		return {
			status: Object.assign({}, this.status),
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
				"isAdmin",
				"siteAdmin",
				"siteEditor",
				"isContributor",
				"userNotes",
			],
			bogusData: [
				{
					"userId": "b59cda6d-5870-11f1-8c64-ea0526f21063",
					"userCreated": "2026-05-25T19:34:08.000Z",
					"userName": "Chris3",
					"password": "bogusData",
					"isAdmin": 0,
					"siteAdmin": 0,
					"siteEditor": 0,
					"isContributor": 1,
					"userNotes": ""
				},
				{
					"userId": "86731354-5847-11f1-8c64-ea0526f21063",
					"userCreated": "2026-05-25T14:39:20.000Z",
					"userName": "Chris2",
					"password": "bogusData",
					"isAdmin": 0,
					"siteAdmin": 0,
					"siteEditor": 1,
					"isContributor": 0,
					"userNotes": ""
				},
				{
					"userId": "e85e2ac1-563b-11f1-8c64-ea0526f21063",
					"userCreated": "2026-05-23T00:11:09.000Z",
					"userName": "Chris",
					"password": "bogusData",
					"isAdmin": 1,
					"siteAdmin": 1,
					"siteEditor": 0,
					"isContributor": 0,
					"userNotes": "Some user notes for testing."
				}
			]
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
					if (key === "admin" || key === "siteAdmin" || key === "siteEditor" || key === "contributor" || key === "uiDarkMode")
						user[key] = user[key] === 1 ? true : false;
				});
			});
		}
	},
	methods: {
		async getUsers() {
			this.eventBus.emit("showHideLoader", true);
			this.eventBus.emit("checkIfRefreshNeeded");

			let headerObj = new Headers();
			headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
			headerObj.append("Content-Type", "application/json; charset=utf-8");
			let requestUrl = new URL("/api/users/", this.baseUrl);

			let params = requestUrl.searchParams;
			params.set("limit", this.limit);
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
					let users = data.users;
					this.usersList = Array.isArray(users) && users.length > 0 ? users : this.bogusData;
				}

				this.eventBus.emit("getUsers", this.usersList);
			} catch (error) {
				this.usersList = this.bogusData;
				console.error('Error fetching data:', error)
				this.eventBus.emit("getUsers", error);
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

.header-row {
	font-size: 1.5em;
	font-weight: bold;
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

.mobile #paging {
	width: 90%;
	margin: 30px auto 0;
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