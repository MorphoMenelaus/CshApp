<template>

	<div class="wrapper">
		<h1>Show User</h1>
		<p>Please enter user ID.</p>
		<!-- @submit.prevent blocks page reloads and executes your logic -->
		<form @submit.prevent="handleSubmit" method="get">
			<div class="form-group">
				<label>User ID</label>
				<input v-model="userId" type="text" name="userName" class="form-control" placeholder="User ID">
			</div>
			<button @click="getUser">Get User</button>
		</form>

		<div class="user-lists-container">
			<table v-if="usersList && usersList.length > 0">
				<thead>
					<tr class="header-row">
						<th v-for="(label, index) in Object.keys(usersList[0])" :key="index">{{ this.toTitleCase(label)
						}}
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

		<div class="user-lists-container">
			<table v-if="userPreferences && Object.keys(userPreferences).length > 0">
				<thead>
					<tr class="header-row">
						<th v-for="(label, index) in Object.keys(userPreferences[0])" :key="index">{{
							this.toTitleCase(label)
						}}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr class="data-row" v-for="(user, index) in userPreferences" :key="index">
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
// import { onBeforeUnmount } from "vue";

export default {
	name: "GetUser",
	props: {},
	components: {},
	data() {
		return {
			userId: "",
			responseStatus: Object,
			// serverMessage: Object,
			usersList: [],
			userPreferences: {}
		};
	},
	watch: {
	},
	methods: {
		async getUser() {

			console.log("getUser");

			// let requestUrl = new URL("/api/users", "https://cshapp.hardwick.design/");
			// let params = requestUrl.searchParams;

			// if (this.userId)
			// 	params.set("userId", this.userId);

			// requestUrl.search = params.toString();

			try {
				const response = await fetch(`/api/users/${this.userId}`)
				const data = await response.json()

				this.usersList = data;

				// this.serverMessage.value = data.message
				this.eventBus.emit("getUsers", data);

				this.getUserPreferences();

			} catch (error) {
				console.error('Error fetching data:', error)
				// this.serverMessage.value = 'Failed to load server data.'
				this.eventBus.emit("getUsers", error);
			}
		},
		async getUserPreferences() {

			console.log("getUsegetUserPreferences");

			try {
				const response = await fetch(`/api/users/prefs/${this.userId}`)
				const data = await response.json()

				console.log(data);

				this.userPreferences = data;

				// this.serverMessage.value = data.message
				this.eventBus.emit("getUsers", data);
			} catch (error) {
				console.error('Error fetching data:', error)
				// this.serverMessage.value = 'Failed to load server data.'
				this.eventBus.emit("getUsers", error);
			}
		},
	},
	mounted() {
	},
	created() {
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper {
	margin: 15px auto;
	padding: 15px;
	height: calc(100vh - 200px);
}

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

.user-lists-container {
	max-height: calc(100vh - 190px);
	overflow: hidden auto;
}

table {
	width: 100%;
	margin: 30px auto;
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