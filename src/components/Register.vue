<template>

	<div id="register">
		<div class="wrapper">
			<h2>Register</h2>
			<p>Please fill this form to create an account.</p>
			<!-- @submit.prevent blocks page reloads and executes your logic -->
			<form @submit.prevent="handleSubmit" method="post">
				<div class="form-group" :class="errState && !userName.length > 0 ? 'err' : ''">
					<label>Username</label>
					<input v-model.trim="userName" type="text" name="userName" class="form-control">
				</div>
				<div class="form-group" :class="errState && !password.length > 0 ? 'err' : ''">
					<label>Password</label>
					<input v-model.trim="password" type="password" name="password" class="form-control">
				</div>
				<div class="form-group">
					<label>Confirm Password</label>
					<input v-model.trim="confirmPassword" type="password" name="confirmPassword" class="form-control">
				</div>
				<button class="btn" @click="register()">Register</button>
				<p>Already have an account? <span class="link" title="Login here"
						@click="removeRegisterUserComponent()">Login here.</span>
				</p>
			</form>
		</div>
	</div>

</template>

<script>
// @ is an alias to /src
import session from "@/dependencies/sessionMethods";
// import sharedScripts from "@/dependencies/sharedScripts";

export default {
	name: "RegisterUser",
	props: {
		appState: Object,
	},
	data() {
		return {
			postStatus: Object.assign({}, this.appNotify),
			userName: "",
			password: "",
			confirmPassword: "",
			errState: false,
			isLoggedOn: false,
		};
	},
	watch: {
	},
	methods: {
		removeRegisterUserComponent() {
			this.eventBus.emit("registerUser", false);
		},
		async register() {
			try {
				let body = {
					userName: this.userName,
					password: this.password,
				};

				if (!this.userName || !this.password) {
					this.postStatus.message = "Please provide a user name and password.";
					this.postStatus.success = false;
					this.eventBus.emit("updateStatus", this.postStatus);
					this.errState = true;
					return this.postStatus;
				}

				const response = await fetch('/api/users/register', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body)
				});

				const data = await response.json();

				this.postStatus.code = data?.code;
				this.postStatus.message = data?.message;
				this.postStatus.success = data?.success;
				this.eventBus.emit("updateStatus", (this.postStatus));

				if (data?.success)
					this.eventBus.emit("registerUser", false);

				this.errState = data?.success;

			} catch (error) {
				console.error('Error posting data:', error);
				this.postStatus.code = 400;
				this.postStatus.message = `Error posting data: ${error}`;
				this.postStatus.success = true;
				this.eventBus.emit("updateStatus", (this.postStatus));
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

.err {
	border: 2px #f00 solid;
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
	backdrop-filter: blur(8px);
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

/* .loader {
	display: none;
	content: "";
	position: absolute;
	top: 15px;
	right: 15px;
	height: 32px;
	width: 32px;
	border: 2px solid;
	border-radius: 100%;
	border-color: red white blue black;
	animation: loader 0.5s linear infinite;
}
.loader.loading {
	display: block;
}
@keyframes loader {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(359deg);
	}
} */

#register {
	position: absolute;
	z-index: 10000;
	display: grid;
	width: 100%;
	height: calc(100vh - 140px);
	justify-content: center;
	background-color: rgb(0 0 0 / 30%);
	left: 0;
	top: 95px;
	align-items: center;
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
}

.wrapper .form-group {
	display: flex;
	align-content: center;
	flex-direction: column;
}

#register button {
	display: block;
	margin: 15px auto;
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
