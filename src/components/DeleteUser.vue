<template>

	<div id="delete">
		<div class="wrapper">
			<h2>Delete Your Account?</h2>
			<p>WARNING!</p>
			<p>This action cannot be undone.</p>
			<div class="button-container">
				<button class="btn delete" @click="deleteUser()">Delete</button>
				<button class="btn" @click="eventBus.emit('cancelDeleteUser')">Cancel</button>
			</div>
		</div>
	</div>

</template>

<script>
// @ is an alias to /src
// import session from "@/dependencies/sessionMethods";
// import sharedScripts from "@/dependencies/sharedScripts";
import router from "@/router";

export default {
	name: "DeleteUser",
	props: {
		appState: Object,
	},
	data() {
		return {
			deleteStatus: Object.assign({}, this.appNotify),
		};
	},
	watch: {
	},
	methods: {
		async deleteUser() {
			let confirmDelete = confirm(
				`Are you sure you want to DELETE, ${this.appState.user.userName}`
			);
			if (!confirmDelete) return false;

			let headerObj = new Headers();
			headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
			headerObj.append("Content-Type", "application/json; charset=utf-8");
			let requestUrl = new URL(`/api/users/${this.appState.user.userId}`, this.baseUrl);

			let request = new Request(
				requestUrl.toString(), {
				method: 'DELETE',
				headers: headerObj,
			});

			try {

				const response = await fetch(request);
				const data = await response.json();

				this.deleteStatus.code = data?.code;
				this.deleteStatus.message = data?.message;
				this.deleteStatus.success = data?.success;
				this.eventBus.emit("updateStatus", this.deleteStatus);

				this.eventBus.emit("UserDeleted");
				router.push("/");

			} catch (error) {
				console.error('Error posting data:', error);
				this.deleteStatus.code = 400;
				this.deleteStatus.message = `Error deleting user: ${error}`;
				this.deleteStatus.success = true;
				this.eventBus.emit("updateStatus", this.deleteStatus);
			}
		},
	},
	mounted() {
	},
	created() {
	},
};
</script>

<!-- scoped attribute to limit CSS to this component only -->
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
	backdrop-filter: blur(8px);
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
	box-shadow: inset -6px -6px 20px 1px rgb(0 0 0 / 30%),
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

.link {
	text-decoration: underline;
	color: #4c88ff;
	cursor: pointer;
	user-select: none;
}

.link:hover {
	color: #ff6600;
}
</style>
