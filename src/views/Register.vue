<template>

	<div class="wrapper">
		<h2>Sign Up</h2>
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
			<p>Already have an account? <RouterLink to="/login" title="Register here">Login here.</RouterLink>
			</p>
		</form>
	</div>

</template>

<script>
// @ is an alias to /src
import sessionMethods from "@/dependencies/sessionMethods";
import sharedScripts from "@/dependencies/sharedScripts";

export default {
	name: "RegisterUser",
	props: {
		appState: Object,
	},
	data() {
		return {
			postStatus: Object.assign({}, this.appStatus),
			userName: "",
			password: "",
			confirmPassword: "",
			errState: false,
			isLoggedOn: false,
		};
	},
	watch: {
		appState: {
			handler(val, oldVal) {
				console.log("appState Changed")
			},
			deep: true,
		},
	},
	methods: {
		async register() {
			try {
				let body = {
					userName: this.userName,
					password: this.password,
				};

				if (!this.userName || !this.password) {
					this.postStatus.message = "Please provide a valid phone number and password.";
					this.postStatus.success = false;
					this.eventBus.emit("updateStatus", this.postStatus);
					this.errState = true;
					return this.postStatus;
				}

				const response = await fetch('/api/auth/register', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body)
				});

				const data = await response.json();

				if (data?.success) {
					this.postStatus.code = data?.code;
					this.postStatus.message = data?.message;
					this.postStatus.success = data?.success;
					this.eventBus.emit("updateStatus", (this.postStatus));
				}

				this.errState = false;

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
.err {
	border: 2px #f00 solid;
}

#view {
	margin: 30px auto;
	padding: 15px;
	background-color: rgb(71 68 196 / 40%);
}

#login {
	position: absolute;
	top: 230px;
	right: 0;
	width: 80%;
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
</style>
