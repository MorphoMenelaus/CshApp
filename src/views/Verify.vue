<template>

	<div>
		<div id="verify" v-if="!success">
			<div id="form-header">
				<h1>Please enter code to verify</h1>
			</div>
			<form class="input-section" @submit.prevent="verifyCode" method="post">
				<div class="inputs">
					<label for="verificationCode">Verification Code</label>
					<input id="verificationCode" type="verificationCode" name="verificationCode"
						v-model="verificationCode" placeholder="Code" />
				</div>
				<div class="verify-buttons">
					<button class="btn login-btn" type="button" @click="verifyCode()">Verify</button>
				</div>
			</form>
			<button class="btn resend" v-if="appState?.isLoggedOn" @click="resendVerifyCode()">Resend Verification
				Email</button>
		</div>
		<div v-else>
			<h1>Success!</h1>
			<h2>Your account has been verified.</h2>
			<h3 v-if="appState?.isLoggedOn">Please logout and log back in again.</h3>
			<h3 v-else>Click login in the upper right of the screen.</h3>
		</div>
	</div>

</template>

<script>
// @ is an alias to /src
import router from "@/router";

export default {
	name: "Verify",
	props: {
		appState: Object,
	},
	data() {
		return {
			appNotify: Object.assign({}, this.appNotify),
			userName: "",
			verificationCode: "",
			success: false
		};
	},
	watch: {
	},
	methods: {
		async verifyCode() {
			try {
				let body = {
					userName: this.userName,
					verificationCode: this.verificationCode,
				};

				if (!this.userName || !this.verificationCode) {
					this.appNotify.message =
						"Please provide a user name and verification code.";
					this.appNotify.success = false;
					this.eventBus.emit("updateStatus", this.appNotify);
					return this.appNotify;
				}

				let headerObj = new Headers();
				headerObj.append("Content-Type", "application/json; charset=utf-8");
				let requestUrl = new URL('/api/users/verify', this.baseUrl);

				let request = new Request(
					requestUrl.toString(), {
					method: 'POST',
					headers: headerObj,
					body: JSON.stringify(body)
				});

				let response = await fetch(request);
				const dataObj = await response.json();

				if (dataObj?.success) {
					this.appNotify.code = 200;
					this.appNotify.message = "Verification success. Please Log in to continue.";
					this.appNotify.success = true;
					this.success = true;
					// this.eventBus.emit("forceLogout");
					// router.push("/");
				} else {
					this.appNotify.code = dataObj.code;
					this.appNotify.message = dataObj.message;
					this.appNotify.success = dataObj.success;
				}

				this.eventBus.emit("updateStatus", this.appNotify);

			} catch (e) {
				console.error(e);
			}
		},
		async resendVerifyCode() {
			try {
				let body = {
					userName: this.userName,
					email: this.appState.user.email,
				};

				let headerObj = new Headers();
				headerObj.append("Content-Type", "application/json; charset=utf-8");
				let requestUrl = new URL('/api/mail/verify', this.baseUrl);

				let request = new Request(
					requestUrl.toString(), {
					method: 'POST',
					headers: headerObj,
					body: JSON.stringify(body)
				});

				let response = await fetch(request);
				const dataObj = await response.json();

				if (dataObj?.success) {
					this.appNotify.code = 200;
					this.appNotify.message = "Verification code resent.";
					this.appNotify.success = true;
				} else {
					this.appNotify.code = dataObj.code;
					this.appNotify.message = dataObj.message;
					this.appNotify.success = dataObj.success;
				}

				this.eventBus.emit("updateStatus", this.appNotify);

			} catch (e) {
				console.error(e);
			}
		},
	},
	mounted() {
	},
	created() {
		let urlParams = new URLSearchParams(window.location.search);
		this.userName = this.appState?.userName || urlParams.get("userName");
		this.verificationCode = urlParams.get("verificationCode") || "";

		if (this.userName && this.verificationCode) this.verifyCode();
	},
};
</script>

<!-- scoped attribute to limit CSS to this component only -->
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

#verificationCode {
	text-align: center;
	font-size: 1.5em;
	width: 6em;
	font-family: 'Space Mono', monospace;
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
