<template>

	<div class="wrapper">

		<h1>Display User</h1>
		<p style="text-align: center;">Please enter user ID.</p>
		<!-- @submit.prevent blocks page reloads and executes your logic -->
		<form @submit.prevent="handleSubmit" method="get">
			<div class="form-group">
				<label for="userId">User ID</label>
				<input v-model="userId" id="userId" type="text" name="userId" class="form-control"
					placeholder="User ID" />
			</div>
			<button @click="getUser" class="btn">Get User</button>
		</form>

		<div id="get-set-user-prefs">

			<div class="user-lists-container" v-if="user && Object.keys(user).length > 0">
				<table v-for="(item, index) in Object.keys(user)" :key="index">
					<tr>
						<th class="header-row">{{ this.toTitleCase(item) }}</th>
						<td>{{ user[item] }}</td>
					</tr>
				</table>
			</div>

			<div class="form-container" v-if="user && Object.keys(user).length > 0">
				<form @submit.prevent="handleSubmit" method="put">
					<div class="form-group">
						<label for="email">Email</label>
						<input id="email" v-model="email" maxlength="256" />
					</div>
					<div class="form-group">
						<label for="lastName">Last Name</label>
						<input id="lastName" v-model="lastName" maxlength="64" />
					</div>
					<div class="form-group">
						<label for="firstName">First Name</label>
						<input id="firstName" v-model="firstName" maxlength="64" />
					</div>
					<div class="form-group">
						<label for="admin">Admin</label>
						<input id="admin" v-model="admin" maxlength="1" />
					</div>
					<div class="form-group">
						<label for="siteAdmin">Site Admin</label>
						<input id="siteAdmin" v-model="siteAdmin" maxlength="1" />
					</div>
					<div class="form-group">
						<label for="siteEditor">Site Editor</label>
						<input id="" v-model="siteEditor" maxlength="1" />
					</div>
					<div class="form-group">
						<label for="contributor">Contributor</label>
						<input id="contributor" v-model="contributor" maxlength="1" />
					</div>
					<div class="form-group">
						<label for="uiDarkMode">UI DarkMode</label>
						<input id="uiDarkMode" v-model="uiDarkMode" maxlength="1" />
					</div>
					<div class="form-group">
						<label for="userNotes">User Notes</label>
						<textarea id="userNotes" v-model="userNotes" maxlength="1024"></textarea>
					</div>
				</form>
				<button @click="updateUser()" class="btn">Upate User Prefernces</button>
			</div>
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
			"email": "",
			"lastName": "",
			"firstName": "",
			"admin": 0,
			"siteAdmin": 0,
			"siteEditor": 0,
			"contributor": 0,
			"uiDarkMode": 0,
			"userNotes": ""
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

				this.email = this.user.email;
				this.lastName = this.user.lastName;
				this.firstName = this.user.firstName;
				this.admin = this.user.admin;
				this.siteAdmin = this.user.siteAdmin;
				this.siteEditor = this.user.siteEditor;
				this.contributor = this.user.contributor;
				this.uiDarkMode = this.user.uiDarkMode;
				this.userNotes = this.user.userNotes;

				// this.serverMessage.value = data.message
				this.eventBus.emit("getUsers", data);

			} catch (error) {
				console.error('Error fetching data:', error)
				// this.serverMessage.value = 'Failed to load server data.'
				this.eventBus.emit("getUsers", error);
			}
		},
		async updateUser() {
			let body = {
				email: this.email,
				lastName: this.lastName,
				firstName: this.firstName,
				admin: this.admin,
				siteAdmin: this.siteAdmin,
				siteEditor: this.siteEditor,
				contributor: this.contributor,
				uiDarkMode: this.uiDarkMode,
				userNotes: this.userNotes
			};

			console.log("updateUser");

			let hasEmpty = Object.values(body).some(val => !val);

			// if (hasEmpty) {
			// 	this.notify.message = `Every input field must have a value`;
			// 	this.notify.success = false;
			// 	this.eventBus.emit("updateStatus", (this.notify));
			// }

			let headerObj = new Headers();
			headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
			headerObj.append("Content-Type", "application/json; charset=utf-8");
			let requestUrl = new URL(`/api/users/${this.userId}`, this.baseUrl);

			let request = new Request(
				requestUrl.toString(), {
				method: 'PUT',
				headers: headerObj,
				body: JSON.stringify(body)
			});

			try {
				let response = await fetch(request);
				const data = await response.json();

				if (data.success) {
					this.notify.code = data.code;
					this.notify.message = data.message;
					this.notify.success = data.success;
					this.eventBus.emit("updateStatus", (this.notify));
					this.getUser();
				}

			} catch (error) {
				console.error('Error fetching data:', error)
				// this.serverMessage.value = 'Failed to load server data.'
				this.eventBus.emit("getUsers", error);
			}
		}
	},
	mounted() {
	},
	created() {
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#view.wrapper {
	height: fit-content;
	margin: 15px auto;
	padding: 15px 0 60px;
	overflow: hidden auto;
	width: 100%;
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

#get-set-user-prefs {
	display: flex;
	justify-content: center;
}

.header-row {
	padding: 0 15px;
	font-weight: bold;
	background-color: #666;
	color: #fff;
}

.user-lists-container {
	max-height: calc(100vh - 190px);
	/* overflow: auto; */
	margin-top: 20px;
}

table {
	display: contents;
	width: 100%;
	margin: 30px auto;
	border-collapse: collapse;
	border: 1px #666 solid;
}

td {
	padding: 10px 15px;
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

.form-group {
	display: flex;
	width: 30%;
	margin: 0 auto 15px;
	display: grid;
}

.form-group * {
	margin: 5px 0 0;
}

textarea {
	min-height: 4em;
	min-width: 13em;
}

button.btn {
	display: block;
	/* width: 10em; */
	margin: 15px auto;
}

@media (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 768px) {}

@media (min-width: 992px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) {}
</style>