<script setup>
import { ref, inject, onBeforeUnmount, onBeforeMount } from "vue";
import { addUserLog, tokenInterceptFetch } from "@/dependencies/csh-libs.js";
import { useWindowEvent } from "@/composables/useCommonEvents.js";
import { appNotify } from "@/dependencies/models.js";

const props = defineProps({
	appState: Object,
});

const baseUrl = inject("baseUrl");
const updateStatus = inject("sendUpdateStatus");
const showHideLoader = inject("showHideLoader");
const closeChangePassword = inject("closeChangePassword");
const forceLogout = inject("forceLogout");
const currentPassword = ref("");
const password = ref("");
const confirmPassword = ref("");
const errState = ref(false);

const changePassword = async () => {
	let serverStatus = Object.assign({}, appNotify);

	if (!currentPassword.value || !password.value) {
		serverStatus.message = "Please provide current password and new password.";
		serverStatus.success = false;
		updateStatus(serverStatus);
		return;
	}

	if (password.value !== confirmPassword.value) {
		serverStatus.message = "New Password and Confirm Password do not match.";
		serverStatus.success = false;
		updateStatus(serverStatus);
		showHideLoader(false);
		return;
	}

	try {
		showHideLoader(true);

		let body = {
			userId: props.appState.user.userId,
			currentPassword: currentPassword.value,
			password: password.value,
		};

		let headerObj = new Headers();
		headerObj.append("Authorization", `Bearer ${props.appState.accessToken}`);
		headerObj.append("Content-Type", "application/json; charset=utf-8");
		let requestUrl = new URL("/api/users/password", baseUrl);

		let request = new Request(requestUrl.toString(), {
			method: "POST",
			headers: headerObj,
			body: JSON.stringify(body),
		});

		const response = await tokenInterceptFetch(request);
		const data = await response.json();

		serverStatus.code = data?.code;
		serverStatus.message = data?.message;
		serverStatus.success = data?.success;

		if (serverStatus.code === 401) {
			updateStatus(serverStatus);
			showHideLoader(false);
			return;
		}

		if (serverStatus.success) {
			addUserLog(props.appState, "User Changed Password");
			forceLogout(data);
		}
	} catch (error) {
		console.error("Error posting data:", error);
		serverStatus.code = 400;
		serverStatus.message = `Error posting data: ${error}`;
		serverStatus.success = false;
		updateStatus(serverStatus);
	} finally {
		showHideLoader(false);
	}
};

useWindowEvent("keydown", (e) => {
	if (e?.key === "Escape") closeChangePassword();
});
</script>

<template>
	<div id="change-password">
		<div class="wrapper">
			<h1>Password Change</h1>
			<p style="margin: 15px 0"><span class="warning">Warning!</span> After changing your password you will have to log in again.</p>
			<form method="post">
				<div class="form-group" :class="errState && !currentPassword.length > 0 ? 'err' : ''">
					<label>Current Password</label>
					<input v-model.trim="currentPassword" type="password" name="currentPassword" class="form-control" />
				</div>
				<div class="form-group" :class="errState && !password.length > 0 ? 'err' : ''">
					<label>New Password</label>
					<input v-model.trim="password" type="password" name="password" class="form-control" />
				</div>
				<div class="form-group">
					<label>Confirm New Password</label>
					<input v-model.trim="confirmPassword" type="password" name="confirmPassword" class="form-control" />
				</div>
				<div class="button-container">
					<button class="btn" type="button" title="Change password" @click="changePassword()">Submit</button>
					<button @click="closePopup()" class="btn cancel" title="Cancel">Cancel</button>
				</div>
			</form>
		</div>
	</div>
</template>

<style scoped>
h1 {
	text-align: center;
}

.err {
	border: 2px #f00 solid;
}

.warning {
	font-weight: bold;
	color: rgb(195, 195, 0);
}

#view {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 30px auto;
	padding: 15px 30px;
	height: fit-content;
	background-color: rgb(71 68 196 / 40%);
	border-radius: 8px;
}

form {
	display: flex;
	flex-direction: column;
}

.input-section {
	background: rgb(71 68 196 / 40%);
	padding: 30px;
	position: relative;
	top: 0;
	-webkit-backdrop-filter: blur(10px);
	backdrop-filter: blur(10px);
	border-radius: 12px;
	box-shadow: inset -1px -1px 15px 1px rgb(13 28 37 / 50%);
	max-width: 30em;
}

.login-status {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	position: fixed;
	top: 0;
	right: 0;
	padding: 5px 10px;
	font-size: 0.625em;
	background-color: #32373f;
	border-radius: 0 0 0 0.4em;
	border: 1px #5b88c0 solid;
}

.login-status button {
	user-select: none;
	margin: 8px auto;
	padding: 5px;
}

label[for="casinoId"] {
	text-align: center;
	text-transform: uppercase;
	text-shadow:
		-1px -1px 0px #000,
		1px -1px 0px #000,
		-1px 1px 0px #000,
		1px 1px 0px #000;
}

#change-password {
	position: fixed;
	top: 90px;
	left: 0;
	display: grid;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: calc(100vh - 140px);
	background-color: rgb(0 0 0 / 50%);
	color: #c1c1c1;
	-webkit-backdrop-filter: blur(10px);
	backdrop-filter: blur(10px);
	z-index: 10000;
}

.mobile #change-password > div {
	width: 90%;
	margin: auto;
}

.button-container {
	display: flex;
	width: 100%;
	justify-content: space-evenly;
	margin: 30px auto 15px;
}

.wrapper {
	max-width: 24em;
	align-content: center;
	background-color: #313b64;
	height: fit-content;
	padding: 15px 30px;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	position: relative;
}

.btn-container {
	position: absolute;
	top: -15px;
	right: -15px;
}

.button-container {
	display: flex;
}

.wrapper .form-group {
	display: flex;
	align-content: center;
	flex-direction: column;
}
</style>
