<script setup>
import { inject, onBeforeMount, onBeforeUnmount } from "vue";
import { addUserLog, tokenInterceptFetch } from "@/dependencies/csh-libs.js";
import { appNotify } from "@/dependencies/models.js";

const props = defineProps({
	appState: Object,
});

const baseUrl = inject("baseUrl");
const updateStatus = inject("sendUpdateStatus");
const showHideLoader = inject("showHideLoader");
const cancelDeleteUser = inject("cancelDeleteUser");
const closeChangePassword = inject("closeChangePassword");
const forceLogout = inject("forceLogout");
// const serverStatus = Object.assign({}, appNotify);

const deleteUser = async () => {
	let confirmDelete = confirm(`Are you sure you want to DELETE, ${props.appState.user.userName}`);
	if (!confirmDelete) return false;

	showHideLoader(true);

	let headerObj = new Headers();
	headerObj.append("Authorization", `Bearer ${props.appState.accessToken}`);
	headerObj.append("Content-Type", "application/json; charset=utf-8");
	let requestUrl = new URL(`/api/users/${props.appState.user.userId}`, baseUrl);

	let request = new Request(requestUrl.toString(), {
		method: "DELETE",
		headers: headerObj,
	});

	try {
		const response = await tokenInterceptFetch(request);
		const data = await response.json();

		if (data.success) {
			let serverStatus = data;
			serverStatus.message = data?.success ? "Your account has been deleted." : data?.message;
			serverStatus.forced = true;
			forceLogout(serverStatus);
			addUserLog(props.appState, "User Deleted Account");
		}
	} catch (error) {
		console.error("Error posting data:", error);
		let serverStatus = Object.assign({}, appNotify);
		serverStatus.code = 400;
		serverStatus.message = `Error deleting user: ${error}`;
		serverStatus.success = true;
		updateStatus(serverStatus);
	} finally {
		showHideLoader(false);
	}
};

const keyDown = (e) => {
	if (e.key === "Escape") closeChangePassword();
};

onBeforeMount(() => {
	window.addEventListener("keydown", keyDown);
});

onBeforeUnmount(() => {
	window.removeEventListener("keydown", keyDown);
});
</script>
<template>
	<div id="delete">
		<div class="wrapper">
			<h2>Delete Your Account?</h2>
			<p>WARNING!</p>
			<p>This action cannot be undone.</p>
			<div class="button-container">
				<button class="btn delete" @click="deleteUser()">Delete</button>
				<button class="btn" @click="cancelDeleteUser()">Cancel</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
h2 {
	text-align: center;
}

#delete {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: grid;
	align-items: center;
	justify-content: center;
	background-color: rgb(50 55 63 / 80%);
	-webkit-backdrop-filter: blur(10px);
	backdrop-filter: blur(10px);
	z-index: 999999;
}

.wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 30px;
	background-color: #b60000;
	color: #fff;
	font-weight: bold;
	border: 1px rgb(100 100 100) solid;
	border-radius: 8px;
	box-shadow:
		inset -6px -6px 20px 1px rgb(0 0 0 / 30%),
		inset 6px 6px 20px 1px rgb(0 0 0 / 30%);
}

.button-container .btn {
	margin: 15px 15px 0;
}

.btn.delete {
	background-color: #000;
	color: #f00;
	font-weight: bold;
}
</style>
