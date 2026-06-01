<template>

	<div class="wrapper">
		<h2>Sign Up</h2>
		<p>Please fill this form to create an account.</p>
		<!-- @submit.prevent blocks page reloads and executes your logic -->
		<form @submit.prevent="handleSubmit" method="post">
			<div class="form-group">
				<label>Username</label>
				<input v-model.trim="userName" type="text" name="userName" class="form-control">
			</div>
			<div class="form-group">
				<label>Password</label>
				<input v-model.trim="password" type="password" name="password" class="form-control">
			</div>
			<div class="form-group">
				<label>Confirm Password</label>
				<input v-model.trim="confirmPassword" type="password" name="confirmPassword" class="form-control">
			</div>
			<button @click="registerUser">Register</button>
			<p>Already have an account? <a href="/">Login here</a>.</p>
		</form>
	</div>

</template>

<script>
// @ is an alias to /src
// import { ref } from "vue";
// import sessionMethods from "@/dependencies/sessionMethods";
// import router from "@/router";
// import { onBeforeUnmount } from "vue";

export default {
	name: "RegisterUser",
	props: {},
	components: {},
	data() {
		return {
			userName: "",
			password: "",
			confirmPassword: "",
			responseStatus: Object
		};
	},
	watch: {
		userName() {
			// console.log("UserName input changed")
		},
		password() {
			// console.log("Password input changed")
		},
	},
	methods: {
		async registerUser() {
			let body = {
				userName: this.userName,
				password: this.password
			}

			try {

				const response = await fetch('/api/contacts', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body)
				});

				const data = await response.json();
				this.responseStatus.value = `Server replied: ${data?.message}`
				this.eventBus.emit("userRegistered", data);

			} catch (error) {
				console.error('Error posting data:', error)
				this.eventBus.emit("userRegistered", error);
			}
		},
	},
	mounted() {
		this.eventBus.emit("eventTest", "Component Mounted");
	},
	created() {
		this.eventBus.emit("eventTest", "Component Created");
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@media (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 768px) {}

@media (min-width: 992px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) {}
</style>