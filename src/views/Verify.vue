<template>

	<div>
		<div id="verify">
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
			<button class="btn resend" v-if="appState?.isLoggedOn" @click="resendVerifyCode()">Resend Verification Email</button>
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
			verificationCode: ""
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

				const response = await fetch('/api/users/verify', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body)
				});

				let dataObj = await response.json();

				if (dataObj?.success) {
					this.appNotify.code = 200;
					this.appNotify.message = "Verification success. Please Log in to continue.";
					this.appNotify.success = true;
					this.eventBus.emit("forceLogout");
					router.push("/");
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

				const response = await fetch('/api/mail/verify', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body)
				});

				let dataObj = await response.json();

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
