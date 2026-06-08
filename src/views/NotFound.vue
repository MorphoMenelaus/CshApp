<template>

	<div>
		<h1 class="not-found">404</h1>
		<h2 class="centered">The page that was requested was not found.</h2>
		<h3 class="centered">
			<RouterLink to="/" title="Home" >Take Me Home!</RouterLink>
		</h3>
	</div>

</template>

<script>
// @ is an alias to /src
import { ref } from "vue";
// import session from "@/dependencies/sessionMethods";
import router from "@/router";
import { onBeforeUnmount } from "vue";

export default {
	name: "NotFound",
	props: {},
	components: {},
	data() {
		return {};
	},
	watch: {
		deepWatch: {
			// Deep watch example
			// Watches for changes to all properties of an object
			handler(val, oldVal) {
				// doSomething();
			},
			deep: true,
		},
		otherWatch() {
			// doSomething();
			// maybe this.$forceUpdate();
		},
	},
	methods: {
	},
	mounted() {
	},
	created() {
		// this.eventBus.emit("eventTest", "Component Created");
		// onBeforeUnmount(() => {
		// 	this.eventBus.off("eventTest");
		// });
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1.not-found {
	font-size: 3em;
	text-align: center;
}

.centered {
	text-align: center;
}

@media (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 768px) {}

@media (min-width: 992px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) {}
</style>