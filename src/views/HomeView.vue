<script setup>
import TheWelcome from "../components/TheWelcome.vue";
// import Carousel from "../components/Carousel.vue";

// Props & Emits
const props = defineProps({
	appState: Object,
})
</script>

<template>
	<!-- <Carousel v-if="appState?.isLoggedOn" :appState="appState" /> -->
	<main>
		<TheWelcome />
	</main>
</template>

<style scoped>
#view {
	margin: 15px auto;
	padding: 15px;
	width: 80%;
}

main#view {
	z-index: -1;
	position: relative;
}

#view.mobile {
	margin: 0;
	padding: 0;
	width: 100%;
}
</style>
