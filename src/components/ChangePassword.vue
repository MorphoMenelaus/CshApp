<template>

	<div id="change-password">
		<div class="wrapper">
			<!-- <div class="btn-container">
				<button @click="closePopup()" class="close-modal" title="Close This Dialog">✕</button>
			</div> -->
			<h1>Password Change</h1>
			<p style="margin: 15px 0;"><span class="warning">Warning!</span> After changing your password you will have
				to log in again.</p>
			<form @submit.prevent="changePassword" method="post">
				<div class="form-group" :class="errState && !currentPassword.length > 0 ? 'err' : ''">
					<label>Current Password</label>
					<input v-model.trim="currentPassword" type="password" name="currentPassword" class="form-control">
				</div>
				<div class="form-group" :class="errState && !password.length > 0 ? 'err' : ''">
					<label>New Password</label>
					<input v-model.trim="password" type="password" name="password" class="form-control">
				</div>
				<div class="form-group">
					<label>Confirm New Password</label>
					<input v-model.trim="confirmPassword" type="password" name="confirmPassword" class="form-control">
				</div>
				<div class="button-container">
					<button class="btn" type='submit' title="Change password">Submit</button>
					<button @click="closePopup()" class="btn cancel" title="Cancel">Cancel</button>
				</div>
			</form>
		</div>
	</div>

</template>

<script>
import { onBeforeUnmount } from 'vue';

export default {
	name: "RegisterUser",
	props: {
		appState: Object,
	},
	data() {
		return {
			serverStatus: Object.assign({}, this.appNotify),
			currentPassword: "",
			password: "",
			confirmPassword: "",
			errState: false,
			isLoggedOn: false,
			siteKey: this.reCaptchaSiteKey
		};
	},
	watch: {
	},
	methods: {
		closePopup() {
			this.eventBus.emit("closeChangePassword");
		},
		async changePassword() {
			this.eventBus.emit("showHideLoader", true);

			const refreshResponse = await this.refreshAuthTokenAsNeeded(this.appState);
			if (!refreshResponse.success) {
				let mergedStatus = { ...this.serverStatus, ...refreshResponse };
				this.eventBus.emit("updateStatus", mergedStatus);
				return;
			}

			try {
				let body = {
					userId: this.appState.user.userId,
					currentPassword: this.currentPassword,
					password: this.password,
				};

				if (!this.currentPassword || !this.password) {
					this.serverStatus.message = "Please provide current password and new password.";
					this.serverStatus.success = false;
					this.eventBus.emit("updateStatus", this.serverStatus);
					this.errState = true;
					return this.serverStatus;
				}

				let headerObj = new Headers();
				headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
				headerObj.append("Content-Type", "application/json; charset=utf-8");
				let requestUrl = new URL('/api/users/password', this.baseUrl);

				let request = new Request(
					requestUrl.toString(), {
					method: 'POST',
					headers: headerObj,
					body: JSON.stringify(body)
				});

				let response = await fetch(request);
				const data = await response.json();

				this.serverStatus.code = data?.code;
				this.serverStatus.message = data?.message;
				this.serverStatus.success = data?.success;
				this.eventBus.emit("updateStatus", (this.serverStatus));

				if (data?.success)
					this.eventBus.emit("changePassword", true);

				this.errState = data?.success;

				this.eventBus.emit("forceLogout");

			} catch (error) {
				console.error('Error posting data:', error);
				this.serverStatus.code = 400;
				this.serverStatus.message = `Error posting data: ${error}`;
				this.serverStatus.success = false;
				this.eventBus.emit("updateStatus", (this.serverStatus));
			} finally {
				this.addUserLog(this.appState, "User Changed Password");
				this.eventBus.emit("showHideLoader", false);
			}
		},
	},
	mounted() {
	},
	created() {
		this.eventBus.on("EscapeKeydown", () => {
			this.closePopup();
		});
		onBeforeUnmount(() => {
			this.eventBus.off("EscapeKeydown");
		});
	},
};
</script>

<!-- scoped attribute to limit CSS to this component only -->
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
	/* left: 10vw; */
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
	text-shadow: -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000,
		1px 1px 0px #000;
}

#change-password {
	position: absolute;
	left: 0;
	top: 0;
	display: grid;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: calc(100vh - 140px);
	background-color: rgb(0 0 0 / 50%);
	-webkit-backdrop-filter: blur(10px);
	backdrop-filter: blur(10px);
	z-index: 10000;
}

.button-container {
	display: flex;
	width: 100%;
	justify-content: space-evenly;
	margin: 30px auto 15px;
}

.wrapper {
	max-width: 30em;
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
