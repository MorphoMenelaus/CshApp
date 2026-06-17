<template>

	<div id="preferences">
		<div class="wrapper">
			<h1>User Preferences</h1>
			<div v-if="admin">
				<p style="text-align: center;">Please enter user ID.</p>
				<!-- @submit.prevent blocks page reloads and executes your logic -->
				<form id="userid-input" @submit.prevent="handleSubmit" method="get">
					<div class="form-group">
						<label for="userId">User ID</label>
						<input v-model="userId" id="userId" type="text" name="userId" class="form-control"
							placeholder="User ID" />
					</div>
					<button @click="getUser" class="btn" title="Get User">Get User</button>
				</form>
			</div>
			<div id="get-set-user-prefs">
				<div class="form-container" v-if="user && Object.keys(user).length > 0">
					<form @submit.prevent="handleSubmit" method="put">
						<div class="fields">
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
								<label for="userNotes">User Notes</label>
								<textarea id="userNotes" v-model="userNotes" maxlength="1024"></textarea>
							</div>
						</div>
						<div class="drop-downs">
							<div class="form-group" v-if="admin">
								<label for="admin">Admin</label>
								<select v-model="admin">
									<option v-for="(item, index) in boolOptions" :key="index" :value="item.value">
										{{ item.text }}
									</option>
								</select>
							</div>
							<div class="form-group" v-if="admin">
								<label for="siteAdmin">Site Admin</label>
								<select v-model="siteAdmin">
									<option v-for="(item, index) in boolOptions" :key="index" :value="item.value">
										{{ item.text }}
									</option>
								</select>
							</div>
							<div class="form-group" v-if="admin">
								<label for="siteEditor">Site Editor</label>
								<select v-model="siteEditor">
									<option v-for="(item, index) in boolOptions" :key="index" :value="item.value">
										{{ item.text }}
									</option>
								</select>
							</div>
							<div class="form-group" v-if="admin">
								<label for="contributor">Contributor</label>
								<select v-model="contributor">
									<option v-for="(item, index) in boolOptions" :key="index" :value="item.value">
										{{ item.text }}
									</option>
								</select>
							</div>
							<div class="form-group">
								<label for="uiDarkMode">UI DarkMode</label>
								<select v-model="uiDarkMode">
									<option v-for="(item, index) in boolOptions" :key="index" :value="item.value">
										{{ item.text }}
									</option>
								</select>
							</div>
						</div>
					</form>
					<button @click="updateUser()" class="btn" title="Update User Prefernces">Update User
						Prefernces</button>
				</div>
			</div>
		</div>
		<component :is="currentComponent" :appState="appState" />
		<div id="change-btn">
			<button @click="currentComponent = 'ChangePassword'" class="btn" title="Change Password">Change
				Password</button>
		</div>
	</div>

</template>

<script>
import { onBeforeUnmount } from "vue";
import ChangePassword from "@/components/ChangePassword.vue";

export default {
	name: "UserPreferences",
	props: {
		appState: Object,
		isMobile: Boolean
	},
	components: {
		ChangePassword
	},
	data() {
		return {
			notify: Object.assign({}, this.appNotify),
			admin: this.appState.permissions.admin,
			userId: this.appState.user.userId,
			boolOptions: [
				{ text: "true", value: "1" },
				{ text: "false", value: "0" },
			],
			user: {},
			"email": "",
			"lastName": "",
			"firstName": "",
			"siteAdmin": 0,
			"siteEditor": 0,
			"contributor": 0,
			"uiDarkMode": 0,
			"userNotes": "",
			currentComponent: null
		};
	},
	watch: {
		appState: {
			handler(val, oldVal) {
				this.admin = this.appState?.user?.permissions?.admin;
			},
			deep: true,
		},
	},
	methods: {
		async getUser() {
			this.eventBus.emit("showHideLoader", true);
			this.eventBus.emit("checkIfRefreshNeeded");

			let headerObj = new Headers();
			headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
			headerObj.append("Content-Type", "application/json; charset=utf-8");
			let requestUrl = new URL(`/api/users/${this.userId}`, this.baseUrl);

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

				this.eventBus.emit("getUsers", data);

			} catch (error) {
				console.error('Error fetching data:', error)
				// this.serverMessage.value = 'Failed to load server data.'
				this.eventBus.emit("getUsers", error);
			} finally {
				this.eventBus.emit("showHideLoader", false);
			}
		},
		async updateUser() {
			this.eventBus.emit("showHideLoader", true);
			this.eventBus.emit("checkIfRefreshNeeded");

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
					this.getUser();
				}

				this.notify.code = data.code;
				this.notify.message = data.message;
				this.notify.success = data.success;
				this.eventBus.emit("updateStatus", (this.notify));

			} catch (error) {
				console.error('Error fetching data:', error)
				// this.serverMessage.value = 'Failed to load server data.'
				this.eventBus.emit("getUsers", error);
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
		this.eventBus.on("closeChangePassword", () => {
			this.currentComponent = null;
		});
		onBeforeUnmount(() => {
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
h2 {
	font-weight: bold;
	text-align: center;
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
	font-weight: bold;
	font-size: 1.25em;
}

textarea {
	min-height: 4.75em;
}

button.btn {
	display: block;
	margin: 15px auto 0;
}
</style>