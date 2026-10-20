<script setup>
import { onBeforeMount, ref, inject } from "vue";
import { appNotify } from "@/dependencies/models.js";

defineOptions({
	inheritAttrs: false,
});

const props = defineProps({
	appState: Object,
});

const copyright = inject("copyright");
const baseUrl = inject("baseUrl");
const updateStatus = inject("sendUpdateStatus");
const forceLogout = inject("forceLogout");
const serverStatus = Object.assign({}, appNotify);
const userName = ref("");
const verificationCode = ref("");
const success = ref(false);

const verifyCode = async () => {
	try {
		let body = {
			userName: userName.value,
			verificationCode: verificationCode.value,
		};

		if (!userName.value || !verificationCode.value) {
			serverStatus.message = "Please provide a user name and verification code.";
			serverStatus.success = false;
			updateStatus(serverStatus);
			return serverStatus;
		}

		let headerObj = new Headers();
		headerObj.append("Content-Type", "application/json; charset=utf-8");
		let requestUrl = new URL("/api/users/verify", baseUrl);

		let request = new Request(requestUrl.toString(), {
			method: "POST",
			headers: headerObj,
			body: JSON.stringify(body),
		});

		let response = await fetch(request);
		const dataObj = await response.json();

		if (dataObj?.code === 403) {
			dataObj.forced = true;
			forceLogout(dataObj);
		}

		if (dataObj?.success) {
			serverStatus.code = 200;
			serverStatus.message = "Verification success. Please Log in to continue.";
			serverStatus.success = true;
			success.value = true;
		} else {
			serverStatus.code = dataObj.code;
			serverStatus.message = dataObj.message;
			serverStatus.success = dataObj.success;
		}

		updateStatus(serverStatus);
	} catch (e) {
		console.error(e);
	}
};

const resendVerifyCode = async () => {
	try {
		let body = {
			userName: userName.value,
			email: props.appState.user.email,
		};

		let headerObj = new Headers();
		headerObj.append("Content-Type", "application/json; charset=utf-8");
		let requestUrl = new URL("/api/mail/verify", baseUrl);

		let request = new Request(requestUrl.toString(), {
			method: "POST",
			headers: headerObj,
			body: JSON.stringify(body),
		});

		let response = await fetch(request);
		const dataObj = await response.json();

		if (dataObj?.code === 403) {
			dataObj.forced = true;
			forceLogout(dataObj);
		}

		if (dataObj?.success) {
			serverStatus.code = 200;
			serverStatus.message = "Verification code resent.";
			serverStatus.success = true;
		} else {
			serverStatus.code = dataObj.code;
			serverStatus.message = dataObj.message;
			serverStatus.success = dataObj.success;
		}

		updateStatus(serverStatus);
	} catch (e) {
		console.error(e);
	}
};

onBeforeMount(() => {
	let urlParams = new URLSearchParams(window.location.search);
	userName.value = props.appState?.userName || urlParams.get("userName");
	verificationCode.value = urlParams.get("verificationCode") || "";

	if (userName.value && verificationCode.value) verifyCode();
});
</script>

<template>
	<div>
		<div id="verify" v-if="!success">
			<div id="form-header">
				<h1>Please enter code to verify</h1>
			</div>
			<form class="input-section" @submit.prevent="verifyCode" method="post">
				<div class="inputs">
					<label for="verificationCode">Verification Code</label>
					<input id="verificationCode" type="verificationCode" name="verificationCode" v-model="verificationCode" placeholder="Code" />
				</div>
				<div class="verify-buttons">
					<button class="btn login-btn" type="button" @click="verifyCode()">Verify</button>
				</div>
			</form>
			<button class="btn resend" v-if="appState?.isLoggedOn" @click="resendVerifyCode()">Resend Verification Email</button>
		</div>
		<div v-else>
			<h1>Success!</h1>
			<h2>Your account has been verified.</h2>
			<h3 v-if="appState?.isLoggedOn">Please logout and log back in again.</h3>
			<h3 v-else>Click login in the upper right of the screen.</h3>
		</div>
	</div>
	<div id="copyright">
		<small v-html="copyright"></small>
	</div>
</template>

<style scoped>
h1,
h2,
h3 {
	text-align: center;
}

#verify {
	width: 100%;
	text-align: center;
	margin: 30px auto;
}

#verify button {
	font-size: 1.65em;
}

#verificationCode {
	text-align: center;
	font-size: 1.5em;
	width: 6em;
	font-family: "Space Mono", monospace;
}

.inputs {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.inputs input {
	margin: 15px auto 30px;
}

.resend {
	margin-top: 15px;
}
</style>
