<script setup>
import { ref, inject, onBeforeMount } from "vue";
import { sendAnalyticsEvent } from "@/dependencies/csh-libs.js";
import { appNotify } from "@/dependencies/models.js";

const serverStatus = Object.assign({}, appNotify);
const updateStatus = inject("sendUpdateStatus");
const forceLogout = inject("forceLogout");

const commitEvents = ref([]);
const createEvents = ref([]);
const showMerged = ref(true);
const showPushed = ref(false);

const getGitHubCommits = async () => {
	try {
		let response = await fetch("https://api.github.com/users/MorphoMenelaus/events/public");
		let data = await response.json();

		commitEvents.value = data.filter((e) => e.type === "PullRequestEvent" && e.payload.action === "merged");
		createEvents.value = data.filter((e) => e.type === "CreateEvent");
		commitEvents.value = commitEvents.value.toSorted((a, b) => b.created_at.localeCompare(a.created_at));
		createEvents.value = createEvents.value.toSorted((a, b) => b.created_at.localeCompare(a.created_at));
	} catch (error) {
		console.error("Error posting data:", error);
		serverStatus.code = 500;
		serverStatus.message = `Error getting data: ${error}`;
		serverStatus.success = false;
		updateStatus(serverStatus);
	}
};

const toggleHandler = (toggle) => {
	switch (toggle) {
		case "showMerged":
			showMerged.value = !showMerged.value;
			showPushed.value = false;
			sendAnalyticsEvent("github_event", "show_merged");
			break;
		case "showPushed":
			showPushed.value = !showPushed.value;
			showMerged.value = false;
			sendAnalyticsEvent("github_event", "show_pushed");
			break;
		default:
			showPushed.value = showMerged.value = false;
			return;
	}
};

onBeforeMount(() => {
	getGitHubCommits();
});
</script>

<template>
	<div id="github-commits" :class="{ bg: !showMerged && !showPushed }">
		<h2
			:class="['text-center', { active: showMerged }]"
			@click="toggleHandler('showMerged')"
			:title="`${showMerged ? 'Hide ' : 'Show '}Latest Merged Commits`"
		>
			<i class="devicon-github-original" title="GitHub"></i>
			<i class="devicon-github-original colored" title="GitHub"></i>
			{{ `${showMerged ? "Hide" : "Show"}` }} Latest Merged Commits
		</h2>
		<h2
			:class="['text-center', { active: showPushed }]"
			@click="toggleHandler('showPushed')"
			:title="`${showPushed ? 'Hide ' : 'Show '}Latest Push Events`"
		>
			<i class="devicon-github-original" title="GitHub"></i>
			<i class="devicon-github-original colored" title="GitHub"></i>
			{{ `${showPushed ? "Hide" : "Show"}` }} Latest Push Events
		</h2>

		<div v-if="commitEvents.length > 0 && showMerged" class="slider">
			<div v-for="(commit, i) in commitEvents" :key="i" class="event">
				<span class="descip" :title="commit.payload.pull_request.head.ref.replaceAll('---', ' | ').replaceAll('-', ' ')">
					{{ commit.payload.pull_request.head.ref.replaceAll("-", " ") }}</span
				>
				<div class="flex-detail">
					<small :title="`Merged on: ${new Date(commit.created_at).toLocaleString()}`"
						>Merged on: {{ new Date(commit.created_at).toLocaleString() }}</small
					>
					<img class="author-icon" :src="commit.actor.avatar_url" :title="`Author: ${commit.actor.login}`" />
				</div>
			</div>
		</div>
		<div v-if="createEvents.length > 0 && showPushed" class="slider">
			<div v-for="(create, ci) in createEvents" :key="ci" class="event">
				<span class="descip" :title="create.payload.ref.replaceAll('---', ' | ').replaceAll('-', ' ')">
					{{ create.payload.ref.replaceAll("-", " ") }}</span
				>
				<div class="flex-detail">
					<small :title="`Created on: ${new Date(create.created_at).toLocaleString()}`"
						>Created on: {{ new Date(create.created_at).toLocaleString() }}</small
					>
					<img class="author-icon" :src="create.actor.avatar_url" :title="`Author: ${create.actor.login}`" />
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
	cursor: pointer;
}

h2:hover {
	background-color: rgb(90 135 191 / 30%);
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
</style>
