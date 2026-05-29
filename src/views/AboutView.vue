<template>
	<div class="about">
		<h1>This is an about page</h1>
	</div>
	<NumInputPad />
</template>

<script>
import NumInputPad from "@/components/NumInputPad.vue";

export default {
	components: {
		NumInputPad,
	},
	mounted() {
		this.consoleTest();
	},
	methods: {
		consoleTest() {
			console.log(`Current version: ${this.appCurrentVersion}`);
		},
	},
};
</script>

<style>
@media (min-width: 1024px) {
	.about {
		min-height: 100vh;
		display: flex;
		align-items: center;
	}
}
</style>
``