<script setup>
import { ref, shallowRef, inject, provide, watch, onBeforeMount } from "vue";
import { addUserLog, tokenInterceptFetch } from "@/dependencies/csh-libs.js";
import router from "@/router";
import ChangePassword from "@/components/ChangePassword.vue";
import DeleteUser from "@/components/DeleteUser.vue";
import locations from "@/dependencies/locations.json";
import { appNotify } from "@/dependencies/models.js";

const props = defineProps({
	appState: Object,
	isMobile: Boolean,
	forceLogoutEvent: Object,
});

const baseUrl = inject("baseUrl");
const updateStatus = inject("sendUpdateStatus");
const showHideLoader = inject("showHideLoader");
const updateAppState = inject("updateAppState");
const forceLogout = inject("forceLogout");
const serverStatus = Object.assign({}, appNotify);
const boolOptions = [
	{ text: "True", value: "1" },
	{ text: "False", value: "0" },
];

const admin = ref(props.appState?.permissions?.admin);
const userId = ref(props.appState?.user?.userId);
const user = ref({});
const usersList = ref([]);
const userAdmin = ref(false);
const email = ref("");
const lastName = ref("");
const firstName = ref("");
const siteAdmin = ref(0);
const siteEditor = ref(0);
const contributor = ref(0);
const uiDarkMode = ref(0);
const locationDefault = ref("Atlanta");
const userNotes = ref("");
const verified = ref(0);
const currentComponent = shallowRef(null);
const keyword = ref("");
const maxlength = ref(1024);
const charRemaining = ref(1024);
const location = ref(locations.filter((loc) => loc.city === locationDefault.value)[0]);
const locationOptions = ref(locations.toSorted((a, b) => a.city.localeCompare(b.city)));

const findUserByName = async () => {
	if (keyword.value >= 0) {
		usersList.value = [];
		return;
	}

	let headerObj = new Headers();
	headerObj.append("Authorization", `Bearer ${props.appState.accessToken}`);
	headerObj.append("Content-Type", "application/json; charset=utf-8");
	let requestUrl = new URL(`/api/users/name/${keyword.value}`, baseUrl);

	let params = requestUrl.searchParams;
	params.set("time", new Date().getTime());
	requestUrl.search = params.toString();

	let request = new Request(requestUrl.toString(), {
		method: "GET",
		headers: headerObj,
	});

	try {
		const response = await tokenInterceptFetch(request);
		const data = await response.json();

		if (data?.success) usersList.value = data.users;
	} catch (error) {
		console.error("Error fetching data:", error);
	}
};

const getUser = async () => {
	showHideLoader(true);

	let headerObj = new Headers();
	headerObj.append("Authorization", `Bearer ${props.appState.accessToken}`);
	headerObj.append("Content-Type", "application/json; charset=utf-8");
	let requestUrl = new URL(`/api/users/${userId.value}`, baseUrl);

	let params = requestUrl.searchParams;
	params.set("time", new Date().getTime());
	requestUrl.search = params.toString();

	let request = new Request(requestUrl.toString(), {
		method: "GET",
		headers: headerObj,
	});

	try {
		const response = await tokenInterceptFetch(request);
		const data = await response.json();

		if (data?.success) populateFields(data.user);
	} catch (error) {
		console.error("Error fetching data:", error);
	} finally {
		showHideLoader(false);
	}
};

const updateUser = async () => {
	showHideLoader(true);

	let body = {
		email: email.value,
		lastName: lastName.value,
		firstName: firstName.value,
		siteAdmin: siteAdmin.value,
		siteEditor: siteEditor.value,
		contributor: contributor.value,
		uiDarkMode: uiDarkMode.value,
		locationDefault: locationDefault.value,
		userNotes: userNotes.value,
		verified: verified.value,
	};

	let headerObj = new Headers();
	headerObj.append("Authorization", `Bearer ${props.appState.accessToken}`);
	headerObj.append("Content-Type", "application/json; charset=utf-8");
	let requestUrl = new URL(`/api/users/${userId.value}`, baseUrl);

	let request = new Request(requestUrl.toString(), {
		method: "PUT",
		headers: headerObj,
		body: JSON.stringify(body),
	});

	try {
		const response = await tokenInterceptFetch(request);
		const data = await response.json();

		if (data.success && user.value.userName === props.appState.userName) {
			let newAppState = props.appState;
			newAppState.user = data.user;
			updateAppState(newAppState);
		}

		getUser();

		serverStatus.code = data.code;
		serverStatus.message = data.message;
		serverStatus.success = data.success;
		updateStatus(serverStatus);
	} catch (error) {
		console.error("Error fetching data:", error);
	} finally {
		addUserLog(props.appState, "Update User Preferences");
		showHideLoader(false);
	}
};

const goBack = () => {
	router.back();
};

const charCounter = () => {
	let currCount = userNotes.value.length;
	if (charRemaining.value <= maxlength.value) charRemaining.value = maxlength.value - currCount;
};

const populateFields = (usr) => {
	usersList.value = [];
	user.value = usr;
	keyword.value = user.value.userName;

	userId.value = user.value.userId;
	email.value = user.value.email;
	lastName.value = user.value.lastName;
	firstName.value = user.value.firstName;
	userAdmin.value = user.value.admin;
	siteAdmin.value = user.value.siteAdmin;
	siteEditor.value = user.value.siteEditor;
	contributor.value = user.value.contributor;
	uiDarkMode.value = user.value.uiDarkMode;
	locationDefault.value = user.value.locationDefault || "Atlanta";
	userNotes.value = user.value.userNotes;
	verified.value = user.value.verified;
	location.value = locations.filter((loc) => loc.city === locationDefault.value)[0];
};

watch(
	() => props.appState,
	() => {
		admin.value = props.appState?.user?.permissions?.admin;
	},
	{ deep: true },
);

watch(location, () => {
	locationDefault.value = location.value.city;
});

watch(
	() => props.forceLogoutEvent,
	(res) => {
		currentComponent.value = null;
		res.forced = true;
		forceLogout(res);
	},
);

onBeforeMount(() => {
	getUser();
	provide("cancelDeleteUser", (bool) => (currentComponent.value = bool ? DeleteUser : null));
	provide("closeChangePassword", (bool) => (currentComponent.value = bool ? ChangePassword : null));
});
</script>

<template>
	<div id="preferences">
		<div class="wrapper">
			<h1>User Preferences</h1>
			<div v-if="admin">
				<p style="text-align: center">Please enter user name to search.</p>
				<form id="userid-input" @submit.prevent="handleSubmit" method="get">
					<div class="form-group">
						<label for="userId">Search by User Name</label>
						<input
							@keyup="findUserByName()"
							v-model="keyword"
							id="keyword"
							type="text"
							name="keyword"
							class="form-control"
							placeholder="User Name"
							onfocus="select()"
						/>
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
					<h3 class="user-select-name">Selected User: {{ user.userName }}</h3>
					<p v-if="appState.userName == 'guest'" class="guest">
						Fields are not editable with guest login. <br />Please, create an account to be able to edit on this site.
					</p>
					<form @submit.prevent="handleSubmit" method="put">
						<div class="fields">
							<div class="form-group">
								<label for="email">Email</label>
								<input id="email" v-model="email" maxlength="256" :readonly="appState.userName == 'guest'" />
							</div>
							<div class="form-group">
								<label for="lastName">Last Name</label>
								<input id="lastName" v-model="lastName" maxlength="64" :readonly="appState.userName == 'guest'" />
							</div>
							<div class="form-group">
								<label for="firstName">First Name</label>
								<input id="firstName" v-model="firstName" maxlength="64" :readonly="appState.userName == 'guest'" />
							</div>
							<div class="form-group">
								<label for="userNotes">User Notes</label>
								<small>(characters remaining: {{ charRemaining }})</small>
								<textarea
									id="userNotes"
									v-model="userNotes"
									:maxlength="maxlength"
									@keyup="charCounter()"
									:readonly="appState.userName == 'guest'"
								></textarea>
							</div>
						</div>
						<div class="drop-downs">
							<div class="form-group">
								<label for="location"
									>Location Default<br />
									<small>(for weather charts)</small>
								</label>
								<select v-model="location">
									<option v-for="(item, index) in locationOptions" :key="index" :value="item">
										{{ item.city }}
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
							<div class="form-group">
								<label for="admin">Admin</label>
								<small>{{ userAdmin == 1 ? "True" : "False" }}</small>
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
					<div class="btn-container">
						<button v-if="appState.userName !== 'guest'" @click="updateUser()" class="btn" title="Update User Prefernces">Save Prefernces</button>
						<button v-if="appState.userName !== 'guest'" @click="currentComponent = ChangePassword" class="btn" title="Change Password">
							Change Password
						</button>
					</div>
				</div>
			</div>
		</div>
		<component :is="currentComponent" :appState="appState" />
		<div id="change-btn" v-if="user.userId === appState?.user?.userId">
			<button class="btn back" @click="goBack()">Exit</button>
			<button v-if="appState.userName !== 'guest'" id="delete-button" class="btn delete" @click="currentComponent = DeleteUser" title="Delete Account">
				Delete Account
			</button>
		</div>
	</div>
</template>

<style scoped>
#view {
	padding-bottom: 90px;
}

#view.mobile {
	margin-top: 30px;
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

.mobile .form-group small {
	margin-top: 0;
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

.btn-container {
	display: flex;
	justify-self: center;
	justify-content: center;
}

.btn-container button {
	margin: 15px;
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
	justify-content: center;
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
