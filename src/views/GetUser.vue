<template>

	<div class="wrapper">

		<h1>Show User</h1>
		<p>Please enter user ID.</p>
		<!-- @submit.prevent blocks page reloads and executes your logic -->
		<form @submit.prevent="handleSubmit" method="get">
			<div class="form-group">
				<label for="userId">User ID</label>
				<input v-model="userId" id="userId" type="text" name="userId" class="form-control"
					placeholder="User ID" />
			</div>
			<button @click="getUser" class="btn">Get User</button>
		</form>

		<div class="user-lists-container">
			<table v-if="user && Object.keys(user).length > 0">
				<thead>
					<tr class="header-row">
						<th v-for="(label, index) in Object.keys(user)" :key="index">{{ this.toTitleCase(label)
						}}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr class="data-row" v-for="(item, index) in user" :key="index">
						<td v-for="(column, idx) in item" :key="idx">{{ column }}</td>
					</tr>
				</tbody>
			</table>
		</div>

	</div>

</template>

<script>
export default {
	name: "GetUser",
	props: {
		appState: Object
	},
	components: {},
	data() {
		return {
			notify: Object.assign({}, this.appNotify),
			userId: "",
			user: {},
		};
	},
	watch: {
	},
	methods: {
		async getUser() {

			let headerObj = new Headers();
			headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
			headerObj.append("Content-Type", "application/json; charset=utf-8");
			let requestUrl = new URL(`/api/users/${this.userId}`, this.baseUrl);
			// let params = requestUrl.searchParams;

			let request = new Request(
				requestUrl.toString(), {
				method: 'GET',
				headers: headerObj,
			});

			try {
				let response = await fetch(request);

				const data = await response.json();

				if (data?.success)
					this.user = data.user;

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