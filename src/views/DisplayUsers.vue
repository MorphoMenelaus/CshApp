<template>

	<div id="listUsers" class="input-heading">

		<h1>List Users</h1>

		<div id="paging">
			<label for="limitOptions">Limit List</label>
			<select v-model="limit">
				<option v-for="(item, index) in limitOptions" :key="index" :value="item.value">{{ item.value }}</option>
			</select>
			<button class="prev-button" type="button" @click="previousPage($event)">previous</button>
			<button class="next-button" type="button" @click="nextPage($event)">next</button>
			<span :currentPage="currentPage">page {{ currentPage }}</span>
		</div>

		<div class="user-lists-container">
			<table v-if="usersList && usersList.length > 0">
				<thead>
					<tr class="header-row">
						<th v-for="(label, index) in Object.keys(usersList[0])" :key="index">{{ this.toTitleCase(label) }}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr class="data-row" v-for="(user, index) in usersList" :key="index">
						<td v-for="(column, index) in user" :key="index">{{ column }}</td>
					</tr>
				</tbody>
			</table>
		</div>

	</div>

</template>

<script>
// @ is an alias to /src
// import { ref } from "vue";
// import sessionMethods from "@/dependencies/sessionMethods";
// import router from "@/router";
import { onBeforeUnmount } from "vue";

export default {
	name: "DisplayUsers",
	props: {},
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
			this.limit = parseInt(this.limit);
			this.action = "openCashierBank";
			this.eventBus.emit("checkAndRefreshSession");
		},
	},
	methods: {
		async getUsers() {
			try {
				let response = await fetch('/api/users')
				let data = await response.json()
				this.usersList = Array.isArray(data) && data.length > 0 ? data : this.bogusData;
				// this.serverMessage = data.message
				this.eventBus.emit("getUsers", data);
			} catch (error) {
				this.usersList = this.bogusData;
				console.error('Error fetching data:', error)
				// serverMessage.value = 'Failed to load server data.'
				this.eventBus.emit("getUsers", error);
			}

		},
		async previousPage(e) {
			if (this.currentPage == 1) return;
			this.currentPage--;
			this.offset = this.offset - this.limit;
			// this.eventBus.emit("checkAndRefreshSession");
		},
		async nextPage(e) {
			if (this.bankList.length < this.limit) return;
			this.offset = this.offset + this.limit;
			this.currentPage++;
			// this.eventBus.emit("checkAndRefreshSession");
		},
	},
	mounted() {
		this.getUsers();
		this.eventBus.emit("eventTest", "Component Mounted");
	},
	created() {
		this.eventBus.emit("eventTest", "Component Created");
		// onBeforeUnmount(() => {
		// 	this.eventBus.off("eventTest");
		// });
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
	font-weight: bold;
	text-align: center;
}

#listUsers {
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

table {
	width: 100%;
	text-align: center;
	position: relative;
	border: 1px #666 solid;
}

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