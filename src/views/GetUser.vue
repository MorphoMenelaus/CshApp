<template>

	<div class="wrapper">
		<h2>Sign Up</h2>
		<p>Please fill this form to create an account.</p>
		<!-- @submit.prevent blocks page reloads and executes your logic -->
		<form @submit.prevent="handleSubmit" method="get">
			<div class="form-group">
				<label>User ID</label>
				<input v-model="userId" type="text" name="userName" class="form-control">
			</div>
			<button @click="getUser">Get User</button>
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
	name: "GetUser",
	props: {},
	components: {},
	data() {
		return {
			userId: "",
			responseStatus: Object,
			// serverMessage: Object
		};
	},
	watch: {
	},
	methods: {
		async getUser() {

			console.log("getUser");

			// let requestUrl = new URL("/api/contacts", "https://cshapp.hardwick.design/");
			// let params = requestUrl.searchParams;

			// if (this.userId)
			// 	params.set("userId", this.userId);

			// requestUrl.search = params.toString();

			try {
				const response = await fetch(`/api/contacts/${this.userId}`)
				const data = await response.json()
				// this.serverMessage.value = data.message
				this.eventBus.emit("getUsers", data);
			} catch (error) {
				console.error('Error fetching data:', error)
				// this.serverMessage.value = 'Failed to load server data.'
				this.eventBus.emit("getUsers", error);
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