<script setup>
import { ref, inject, onBeforeMount } from "vue";
import { appNotify } from "@/dependencies/models.js";

const serverStatus = Object.assign({}, appNotify);
const updateStatus = inject("sendUpdateStatus");
const forceLogout = inject("forceLogout");

const limitList = 9;
const commitEvents = ref([]);
const showMerged = ref(true);
const showPushed = ref(false);

const getGitHubCommits = async () => {
	try {
		let response = await fetch("https://api.github.com/users/MorphoMenelaus/events/public");
		let data = await response.json();

		commitEvents.value = data.filter((e) => (e.type === "PullRequestEvent" && e.payload?.action === "merged") || e.type === "CreateEvent");
		// limit list length
		commitEvents.value = commitEvents.value.slice(0, limitList);
		commitEvents.value = commitEvents.value.toSorted((a, b) => b.created_at.localeCompare(a.created_at));
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
	<div id="github-commits" :class="{ bg: !showMerged && !showPushed }">
		<h2 class="julius-sans text-center" title="Latest Merged Commits">
			<i class="devicon-github-original" title="GitHub"></i>
			<i class="devicon-github-original colored" title="GitHub"></i>
			Latest GitHub Commits
		</h2>
		<div v-if="commitEvents.length > 0" class="slider">
			<div v-for="(commit, i) in commitEvents" :key="i" class="event">
				<span
					v-if="commit.type === 'PullRequestEvent'"
					class="descip"
					:title="commit.payload?.pull_request?.head?.ref.replaceAll('---', ' | ').replaceAll('-', ' ')"
				>
					{{ commit.payload?.pull_request?.head?.ref.replaceAll("-", " ") }}</span
				>
				<span v-else class="descip" :title="commit.payload?.ref.replaceAll('---', ' | ').replaceAll('-', ' ')">
					{{ commit.payload?.ref.replaceAll("-", " ") }}</span
				>
				<div class="flex-detail">
					<small
						:title="
							(commit.payload?.action === 'merged' ? `Merged #${commit.payload?.number} on: ` : `Created on: `) +
							new Date(commit.created_at).toLocaleString()
						"
					>
						<span :class="['event-action', { merged: commit.payload?.action === 'merged' }]">{{
							commit.payload?.action === "merged" ? `Merged #${commit.payload?.number}:` : "Created:"
						}}</span>
						{{ new Date(commit.created_at).toLocaleString() }}</small
					>
					<img class="author-icon" :src="commit.actor.avatar_url" :title="`Author: ${commit.actor.login}`" />
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
h2 {
	position: relative;
	margin: 0.25em auto;
	border-radius: 8px;
	user-select: none;
	font-weight: bold;
}

.active::after {
	content: "🠔";
	position: absolute;
	top: -0.25em;
	margin-left: 0.25em;
	font-size: 1.5em;
	font-weight: bold;
	color: #08c;
	color: #00aaff;
}

.uiDarkMode .active::after {
	color: #00aaff;
}

.slider {
	margin-bottom: 1em;
}

#github-commits {
	margin: 1em auto;
	background-color: #e7e7e7;
	width: fit-content;
	padding: 1em;
	border: 1px solid rgb(128 128 128 / 50%);
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

.bg {
	background: url(/img/git-merge.png) no-repeat;
	background-position: center 60%;
	background-size: 90% 30%;
	background-repeat: no-repeat;
	background-blend-mode: color-burn;
}

.uiDarkMode .bg {
	background-blend-mode: screen;
}

.flex-detail {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
}

.author-icon {
	width: 28px;
	height: 28px;
	object-fit: contain;
	cursor: help;
}

.event-action {
	background-color: #5a87bf;
	color: white;
	/* font-weight: bold; */
	padding: 1px 4px;
	border-radius: 4px;
}

.merged {
	background-color: green;
}
</style>
