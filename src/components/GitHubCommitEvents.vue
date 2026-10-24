<script setup>
import { ref, inject, onBeforeMount } from "vue";
import { appNotify } from "@/dependencies/models.js";

const serverStatus = Object.assign({}, appNotify);
const updateStatus = inject("sendUpdateStatus");
const forceLogout = inject("forceLogout");

const commitEvents = ref([]);

const getGitHubCommits = async () => {
	try {
		let response = await fetch("https://api.github.com/users/MorphoMenelaus/events/public");
		let data = await response.json();

		commitEvents.value = data.filter((e) => e.type === "PullRequestEvent" && e.payload.action === "merged");
	} catch (error) {
		console.error("Error posting data:", error);
		serverStatus.code = 500;
		serverStatus.message = `Error getting data: ${error}`;
		serverStatus.success = false;
		updateStatus(serverStatus);
	}
};

onBeforeMount(() => {
	getGitHubCommits();
});
</script>

<template>
	<div id="github-commits">
		<h2 class="text-center">
			<i class="devicon-github-original"></i>
			<i class="devicon-github-original colored"></i>
			Latest GitHub Commits
		</h2>
		<div>
			<div v-for="(commit, i) in commitEvents" :key="i" class="event">
				<span class="descip" :title="commit.payload.pull_request.head.ref.replaceAll('---', ' | ').replaceAll('-', ' ')">
					{{ commit.payload.pull_request.head.ref.replaceAll("-", " ") }}</span
				>
				<small :title="`Merged on: ${new Date(commit.created_at).toLocaleString()}`"
					>Merged on: {{ new Date(commit.created_at).toLocaleString() }}</small
				>
			</div>
		</div>
	</div>
</template>

<style scoped>
#github-commits {
	margin: 1em auto;
	background-color: #e7e7e7;
	width: fit-content;
	padding: 1em;
	border: 1px #555 solid;
	border-radius: 12px;
	width: 100%;
	min-width: 0;
}

i.colored,
.uiDarkMode i:not(.colored) {
	display: inline;
}

.uiDarkMode i.colored,
i:not(.colored) {
	display: none;
}

.uiDarkMode #github-commits {
	background-color: #222;
}

.event {
	background-color: aliceblue;
	margin: 0.2em auto;
	padding: 0.1em 0.5em;
	border-radius: 8px;
	border: 1px rgb(128 128 128 / 50%) solid;
	display: flex;
	flex-direction: column;
	cursor: default;
}

.uiDarkMode .event {
	background-color: #1c2138;
}

.descip {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.event small {
	font-size: 0.6em;
}
</style>
