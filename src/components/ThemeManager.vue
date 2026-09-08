<script setup>
import { onMounted, ref, watch } from "vue";

const currentTheme = ref("dark");
const systemTheme = ref(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

function getThemePreference() {
	const savedTheme = localStorage.getItem("theme");
	if (savedTheme) return savedTheme;

	// If the user has never saved an override, set default to dark
	return "dark";
}

function applyTheme(theme) {
	document.documentElement.setAttribute("data-theme", theme);
	currentTheme.value = theme;
}

const handleThemeToggle = () => {
	// Determine new theme
	const activeTheme = document.documentElement.getAttribute("data-theme");
	const newTheme = activeTheme === "dark" ? "light" : "dark";

	// Save preference and apply changes
	localStorage.setItem("theme", newTheme);
	applyTheme(newTheme);
};

watch(currentTheme, (newValue, oldValue) => {
	console.log(`currentTheme changed from ${oldValue} to ${newValue}`);
});

onMounted(() => {
	currentTheme.value = getThemePreference();
	applyTheme(currentTheme.value);
});
</script>

<template>
	<div id="theme-button" v-if="systemTheme !== 'dark'">
		<button class="btn" title="Toggle and save theme override" @click="handleThemeToggle">Theme override: {{ currentTheme }}</button>
		<small
			>System Theme: <span>{{ systemTheme }}</span></small
		>
	</div>
</template>

<style scoped>
#theme-button {
	position: absolute;
	top: 0;
	right: 0.25em;
	display: flex;
	flex-direction: column;
	align-items: center;
	z-index: 1;
}

#theme-button small {
	line-height: 0;
}
</style>
