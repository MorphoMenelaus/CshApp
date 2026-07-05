<template>

	<div id="preferences">
		<div class="wrapper">
			<h1>User Preferences</h1>
			<div v-if="admin">
				<p style="text-align: center;">Please enter user name to search.</p>
				<form id="userid-input" @submit.prevent="handleSubmit" method="get">
					<div class="form-group">
						<label for="userId">Search by User Name</label>
						<input @keyup="findUserByName()" v-model="keyword" id="keyword" type="text" name="keyword"
							class="form-control" placeholder="User Name" onfocus="this.select()" />
						<div id="user-select" v-if="usersList.length > 0">
							<span v-for="(item, index) in usersList" :key="index" @click="populateFields(item)">
								{{ item.userName }}
							</span>
						</div>
					</div>
					<button @click="getUser()" class="btn" title="Get User">Get User</button>
				</form>
			</div>
			<div id="get-set-user-prefs">
				<div class="form-container" v-if="user && Object.keys(user).length > 0">
					<h3 class="user-select-name">Current User: {{ user.userName }}</h3>
					<p v-if="appState.userName == 'guest'" class="guest">Fields are not
						editable with guest login.
						<br />Please, create an account to be able to edit on this site.
					</p>
					<form @submit.prevent="handleSubmit" method="put">
						<div class="fields">
							<div class="form-group">
								<label for="email">Email</label>
								<input id="email" v-model="email" maxlength="256"
									:readonly="appState.userName == 'guest'" />
							</div>
							<div class="form-group">
								<label for="lastName">Last Name</label>
								<input id="lastName" v-model="lastName" maxlength="64"
									:readonly="appState.userName == 'guest'" />
							</div>
							<div class="form-group">
								<label for="firstName">First Name</label>
								<input id="firstName" v-model="firstName" maxlength="64"
									:readonly="appState.userName == 'guest'" />
							</div>
							<div class="form-group">
								<label for="userNotes">User Notes</label>
								<small>(characters remaining: {{ charRemaining }})</small>
								<textarea id="userNotes" v-model="userNotes" :maxlength="maxlength"
									@keyup="charCounter()" :readonly="appState.userName == 'guest'"></textarea>
							</div>
						</div>
						<div class="drop-downs">
							<div class="form-group">
								<label for="uiDarkMode">UI DarkMode</label>
								<select v-model="uiDarkMode">
									<option v-for="(item, index) in boolOptions" :key="index" :value="item.value">
										{{ item.text }}
									</option>
								</select>
							</div>
							<div class="form-group">
								<label for="admin">Admin</label>
								<select v-model="userAdmin" v-if="admin">
									<option v-for="(item, index) in boolOptions" :key="index" :value="item.value">
										{{ item.text }}
									</option>
								</select>
								<small v-else>{{ userAdmin == 1 ? "True" : "False" }}</small>
							</div>
							<div class="form-group">
								<label for="siteAdmin">Site Admin</label>
								<select v-model="siteAdmin" v-if="admin">
									<option v-for="(item, index) in boolOptions" :key="index" :value="item.value">
										{{ item.text }}
									</option>
								</select>
								<small v-else>{{ siteAdmin == 1 ? "True" : "False" }}</small>
							</div>
							<div class="form-group">
								<label for="siteEditor">Site Editor</label>
								<select v-model="siteEditor" v-if="admin">
									<option v-for="(item, index) in boolOptions" :key="index" :value="item.value">
										{{ item.text }}
									</option>
								</select>
								<small v-else>{{ siteEditor == 1 ? "True" : "False" }}</small>
							</div>
							<div class="form-group">
								<label for="contributor">Contributor</label>
								<select v-model="contributor" v-if="admin">
									<option v-for="(item, index) in boolOptions" :key="index" :value="item.value">
										{{ item.text }}
									</option>
								</select>
								<small v-else>{{ contributor == 1 ? "True" : "False" }}</small>
							</div>
							<div class="form-group">
								<label for="contributor">User Verified</label>
								<select v-model="verified" :class="!verified ? 'not-ver' : ''" v-if="admin">
									<option v-for="(item, index) in boolOptions" :key="index" :value="item.value">
										{{ item.text }}
									</option>
								</select>
								<small v-else>{{ verified == 1 ? "True" : "False" }}</small>
							</div>
						</div>
					</form>
					<button v-if="appState.userName !== 'guest'" @click="updateUser()" class="btn"
						title="Update User Prefernces">Update User
						Prefernces</button>
				</div>
			</div>
		</div>
		<component :is="currentComponent" :appState="appState" />
		<div id="change-btn" v-if="user.userId === appState?.user?.userId">
			<button v-if="appState.userName !== 'guest'" @click="currentComponent = 'ChangePassword'" class="btn"
				title="Change Password">Change
				Password</button>
			<button v-if="appState.userName !== 'guest'" id="delete-button" class="btn delete"
				@click="currentComponent = 'DeleteUser'" title="Delete Account">Delete Account</button>
		</div>
	</div>

</template>

<script>
import { onBeforeUnmount } from "vue";
import ChangePassword from "@/components/ChangePassword.vue";
import DeleteUser from "@/components/DeleteUser.vue";

export default {
	name: "UserPreferences",
	props: {
		appState: Object,
		isMobile: Boolean
	},
	components: {
		ChangePassword,
		DeleteUser
	},
	data() {
		return {
			serverStatus: Object.assign({}, this.appNotify),
			admin: this.appState?.permissions?.admin,
			userId: this.appState?.user?.userId,
			boolOptions: [
				{ text: "True", value: "1" },
				{ text: "False", value: "0" },
			],
			user: {},
			usersList: [],
			userAdmin: false,
			email: "",
			lastName: "",
			firstName: "",
			siteAdmin: 0,
			siteEditor: 0,
			contributor: 0,
			uiDarkMode: 0,
			userNotes: "",
			verified: 0,
			currentComponent: null,
			keyword: "",
			maxlength: 1024,
			charRemaining: 1024,
		};
	},
	watch: {
		appState: {
			handler() {
				this.admin = this.appState?.user?.permissions?.admin;
			},
			deep: true,
		},
	},
	methods: {
		charCounter() {
			let currCount = this.userNotes.length;
			if (this.charRemaining <= this.maxlength)
				this.charRemaining = this.maxlength - currCount;
		},
		populateFields(user) {
			this.usersList = [];
			this.user = user;
			this.keyword = user.userName;

			this.userId = this.user.userId;
			this.email = this.user.email;
			this.lastName = this.user.lastName;
			this.firstName = this.user.firstName;
			this.userAdmin = this.user.admin;
			this.siteAdmin = this.user.siteAdmin;
			this.siteEditor = this.user.siteEditor;
			this.contributor = this.user.contributor;
			this.uiDarkMode = this.user.uiDarkMode;
			this.userNotes = this.user.userNotes;
			this.verified = this.user.verified;
		},
		async findUserByName() {

			if (this.keyword >= 0) {
				this.usersList = [];
				return;
			}

			const refreshResponse = await this.refreshAuthTokenAsNeeded(this.appState);
			if (!refreshResponse.success) {
				let mergedStatus = { ...this.serverStatus, ...refreshResponse };
				this.eventBus.emit("updateStatus", mergedStatus);
				return;
			}

			let headerObj = new Headers();
			headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
			headerObj.append("Content-Type", "application/json; charset=utf-8");
			let requestUrl = new URL(`/api/users/name/${this.keyword}`, this.baseUrl);

			let params = requestUrl.searchParams;
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

				if (data?.success)
					this.usersList = data.users;

			} catch (error) {
				console.error('Error fetching data:', error)
			}
		},
		async getUser() {
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
			let requestUrl = new URL(`/api/users/${this.userId}`, this.baseUrl);

			let params = requestUrl.searchParams;
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

				if (data?.success)
					this.populateFields(data.user);

			} catch (error) {
				console.error('Error fetching data:', error)
			} finally {
				this.eventBus.emit("showHideLoader", false);
			}
		},
		async updateUser() {
			this.eventBus.emit("showHideLoader", true);

			const refreshResponse = await this.refreshAuthTokenAsNeeded(this.appState);
			if (!refreshResponse.success) {
				let mergedStatus = { ...this.serverStatus, ...refreshResponse };
				this.eventBus.emit("updateStatus", mergedStatus);
				return;
			}

			let body = {
				email: this.email,
				lastName: this.lastName,
				firstName: this.firstName,
				admin: this.userAdmin,
				siteAdmin: this.siteAdmin,
				siteEditor: this.siteEditor,
				contributor: this.contributor,
				uiDarkMode: this.uiDarkMode,
				userNotes: this.userNotes,
				verified: this.verified
			};

			// let hasEmpty = Object.values(body).some(val => !val);

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

				if (data.success && this.user.userName === this.appState.userName) {
					let updateAppState = this.appState;
					updateAppState.user = data.user;
					this.eventBus.emit("updateAppState", updateAppState);
				}

				this.getUser();

				this.serverStatus.code = data.code;
				this.serverStatus.message = data.message;
				this.serverStatus.success = data.success;
				this.eventBus.emit("updateStatus", (this.serverStatus));

			} catch (error) {
				console.error('Error fetching data:', error)
			} finally {
				this.addUserLog(this.appState, "Update User Preferences");
				this.eventBus.emit("showHideLoader", false);
			}
		}
	},
	mounted() {
	},
	created() {
		this.getUser();
		this.eventBus.on("UserDeleted", () => {
			this.currentComponent = null;
			this.eventBus.emit("forceLogout");
		});
		this.eventBus.on("cancelDeleteUser", () => {
			this.currentComponent = null;
		});
		this.eventBus.on("closeChangePassword", () => {
			this.currentComponent = null;
		});
		onBeforeUnmount(() => {
			this.eventBus.off("UserDeleted");
			this.eventBus.off("cancelDeleteUser");
			this.eventBus.off("closeChangePassword")
		});
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#view {
	padding-bottom: 90px;
}

#userid-input {
	margin: auto;
	width: 25em;
}

.mobile #userid-input {
	width: unset;
}

h1,
h2,
h3,
.user-select-name {
	font-weight: bold;
	text-align: center;
}

.user-select-name {
	margin-top: 15px;
}

#listUsers {
	padding: 15px 15px 60px;
}

#get-set-user-prefs {
	display: flex;
	justify-content: center;
}

#get-set-user-prefs form {
	display: flex;
	justify-content: space-evenly;
}

.wrapper {
	padding: 15px;
}

.fields,
.drop-downs {
	margin: 15px;
}

.form-group {
	display: grid;
}

.form-group * {
	margin: 5px 0 0;
}

input {
	font-weight: normal;
	font-size: 1.25em;
}

#userNotes {
	font-size: 1em;
	font-family: "Roboto", sans-serif;
}

.uiDarkMode input {
	font-weight: bold;
}

textarea {
	min-height: 4.75em;
}

button.btn {
	display: block;
	margin: 15px auto 0;
}

#user-select {
	display: flex;
	flex-direction: column;
	background-color: #ccc;
	color: #000;
	font-weight: bold;
	border: 1px #000 solid;
}

#user-select span {
	cursor: pointer;
	padding: 0 10px 5px;
}

#user-select span:hover {
	background-color: #06f;
	color: #ccc;
}

.not-ver {
	border: 3px #f00 solid;
}

.guest {
	text-align: center;
	color: yellow;
	background-color: grey;
	border-radius: 8px;
	padding: 15px;
}

#change-btn {
	display: flex;
	align-items: center;
	justify-self: center;
	margin-top: 15px;
}

#change-btn .btn {
	margin: 0 15px;
}

.delete {
	background-color: #000;
	color: #f00;
	font-weight: bold;
}

@media (max-width: 767px) {
	.fields {
		width: 50%;
	}

	.form-group * {
		width: 100%;
	}
}
</style>