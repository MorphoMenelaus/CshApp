<template>
	<div>

	</div>
</template>

<script>
export default {
	name: "SomeView",
	props: {},
	components: {},
	data() {
		return {};
	},
	watch: {
		deepWatch: {
			// ** Deep watch example
			// ** Watches for changes to all properties of an object
			// handler(val, oldVal) {
			// 	// doSomething();
			// },
			// deep: true,
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
@media (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 768px) {}

@media (min-width: 992px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) {}
</style>