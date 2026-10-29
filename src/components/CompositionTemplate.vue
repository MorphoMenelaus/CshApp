<script setup>
import { ref, watch, provide, inject, onMounted, onBeforeMount, onBeforeUnmount } from "vue";

const props = defineProps({
	appState: Object,
});

const refVar = ref("Test String");
const watchOne = ref("watchOne");
const watchTwo = ref("watchTwo");
console.log(refVar.value);
console.log(watchOne.value);
console.log(watchTwo.value);

watch(
	() => props.appState,
	(newVal) => {
		console.log(newVal);
	},
	{ deep: true },
);

watch([watchOne, watchTwo], ([newOne, newTwo], [oldOne, oldTwo]) => {
	if (newOne !== oldOne) {
		console.log(newOne);
	}
	if (newTwo !== oldTwo) {
		console.log(newTwo);
	}
});

onBeforeMount(() => {
	console.log("BeforeMount");
});

onMounted(() => {
	console.log("Mounted");
});

onBeforeUnmount(() => {
	console.log("BeforeUnmount");
});
</script>

<template>
	<div>
		<div id="template">
			<div>{{ refVar }}</div>
			<div>{{ appState }}</div>
		</div>
	</div>
</template>

<style scoped>
#template {
	background-color: #000;
	color: #fff;
}

@media (max-width: 767px) {
}

@media (min-width: 768px) and (max-width: 991px) {
}

@media (min-width: 768px) {
}

@media (min-width: 992px) {
}

@media (min-width: 992px) and (max-width: 1199px) {
}

@media (min-width: 1200px) {
}
</style>
