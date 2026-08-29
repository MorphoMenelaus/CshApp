<script setup>
import { ref, inject } from 'vue';
import { tokenInterceptFetch } from "@/dependencies/csh-libs.js";

const baseUrl = inject('baseUrl');
const closeChat = inject("closeChat");
const updateStatus = inject('sendUpdateStatus');

const props = defineProps({
	appState: Object,
	isMobile: Boolean
});

let showHideLoader = ref(false);
let codeSnippet = ref("");
let projectTitle = ref("");
let description = ref("");
let techStack = ref("");
let analysis = ref("");

const explainCode = async () => {

	if (!codeSnippet.value || !techStack.value) {
		console.error("Code snippet and tech stack inputs are required");
		return;
	}

	showHideLoader.value = true;

	let body = {
		codeSnippet: codeSnippet.value,
		projectTitle: projectTitle.value,
		description: description.value,
		techStack: techStack.value
	};

	let headerObj = new Headers();
	headerObj.append("Authorization", `Bearer ${props.appState.accessToken}`);
	headerObj.append("Content-Type", "application/json; charset=utf-8");
	let requestUrl = new URL("/api/gemini/explain-code", baseUrl);

	let request = new Request(
		requestUrl.toString(), {
		method: 'POST',
		headers: headerObj,
		body: JSON.stringify(body)
	});

	try {
		const response = await tokenInterceptFetch(request);
		const data = await response.json();

		if (!data?.success) {
			updateStatus(data);
		}

		let formattedJson = JSON.stringify(data.analysis, null, '\t');
		analysis.value = formattedJson;

	} catch (error) {
		console.error('Error posting data:', error);
		let serverStatus = {
			code: 500,
			message: `Error getting data: ${error}`,
			success: false
		}
		updateStatus(serverStatus);
	} finally {
		showHideLoader.value = false;
	}
};

const clear = () => {
	jobDescription.value = "";
	profile.value = "";
	analysis.value = "";
}

</script>

<template>
	<div>
		<div id="chat">
			<div id="chat-container">
				<Transition name="fade">
					<div v-if="showHideLoader" id="loading-icon" class="loading">
						<div class="spinner-pulse"></div>
						<h3>Thinking...</h3>
						<p>Please, be patient.</p>
						<button class="btn" @click="closeChat()" title="Abort and close chat box">Abort</button>
					</div>
				</Transition>
				<div id="header">
					<h1>AI Code Review</h1>
					<h2>Reviews code patterns with suggestions.</h2>
				</div>
				<form @submit.prevent="explainCode" method="get">
					<div class="form-group">
						<a class="external" href="https://www.minifier.org/text-minifier"
							title="Minifier | minifier.org" target="_blank">Minifier &#128279;</a>
						<label for="projectTitle">Project Title:</label>
						<input id="projectTitle" title="Project Title" v-model="projectTitle" type="text"
							name="projectTitle" class="form-control" placeholder="Project Title" />
						<label for="description">Description:</label>
						<textarea id="description" title="Description" v-model="description" type="text"
							name="description" class="form-control" placeholder="Description">Description</textarea>
						<label for="techStack">Tech Stack:</label>
						<textarea id="techStack" title="Tech Stack" v-model="techStack" type="text" name="techStack"
							class="form-control" placeholder="Tech Stack">Tech Stack</textarea>
						<label for="codeSnippet">Code Snippet:</label>
						<textarea id="codeSnippet" title="Code Snippet" v-model="codeSnippet" type="text"
							name="codeSnippet" class="form-control" placeholder="Code Snippet"></textarea>
					</div>
					<div class="button-container">
						<button class="btn" @click="explainCode()">Submit</button>
						<button class="btn" @click="clear()">Clear</button>
						<button class="btn" @click="closeChat()">Close</button>
					</div>
				</form>
			</div>
			<Transition name="slide-up">
				<div id="answer" v-if="analysis">
					<h2 class="output-header">AI Output <small v-if="isMobile" class="link"
							@click="clear()">Clear</small></h2>
					<pre class="output">{{ analysis }}</pre>
				</div>
			</Transition>
		</div>
	</div>
</template>

<style scoped>
h1,
h2 {
	text-align: center;
}

#chat {
	position: fixed;
	top: 105px;
	width: 100vw;
	height: calc(100vh - 181px);
	display: grid;
	align-content: start;
	justify-content: center;
	background-color: rgb(0 0 0 / 50%);
}

#chat-container {
	position: fixed;
	left: 0;
	right: 0;
	width: 95%;
	max-width: 30em;
	justify-self: center;
	background: aliceblue;
	color: #333;
	padding: 15px;
	border-radius: 12px;
	border: 1px #333 solid;
	overflow: hidden auto;
	max-height: 65vh;
}

#header {
	border-bottom: 1px #fff solid;
	background-color: #313b64;
	color: #c1c1c1;
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	padding-bottom: 15px;
}

form {
	margin-top: 6em;
}

.form-group {
	display: flex;
	flex-direction: column;
}

label {
	text-align: center;
	font-weight: bold;
}

textarea,
input {
	background-color: #cdb2f5;
	color: #000;
	padding: 5px;
	border-radius: 8px;
	font-size: 1em;
}

textarea {
	min-height: 2em;
}

.button-container {
	display: flex;
	width: 100%;
	justify-content: space-evenly;
	margin: 30px auto 15px;
}

#answer {
	position: fixed;
	max-height: 70vh;
	bottom: 50px;
	color: #000;
	overflow: hidden auto;
	left: 0;
	right: 0;
}

.output-header {
	margin: auto;
	padding: 5px 30px;
	width: fit-content;
	background-color: #ffffff;
	border-radius: 8px 8px 0 0;
	border: 1px #000 solid;
	border-bottom-width: 0;
}

.output {
	background-color: #d7d7d7;
	width: 100%;
	margin: auto;
	padding: 30px;
	border-radius: 12px 12px 0 0;
	border: 1px rgb(0 0 0 / 50%) solid;
}

.uiDarkMode .output {
	background: linear-gradient(#0f225d 5%, #060626 50%);
	color: #aaa;
	border: 1px #666 solid;
}

#description {
	margin-bottom: 30px;
}

.external {
	display: flex;
	align-self: center;
	padding: 0 15px;
	text-decoration: none;
}

.external:hover {
	text-decoration: underline;
}

#loading-icon {
	position: absolute;
	height: 100%;
	right: 0;
	bottom: 0;
	left: 0;
	display: grid;
	align-content: center;
	background-color: rgb(0 0 0 / 60%);
	backdrop-filter: blur(10px);
	z-index: 1;
	user-select: none;
}

#loading-icon {
	margin-top: 15px;
	color: #eee;
	font-size: 1.5em;
	text-align: center;
}

#loading-icon .btn {
	display: flex;
	justify-self: center;
	margin-top: 15px;
}

.spinner-pulse,
.spinner-pulse:before,
.spinner-pulse:after {
	background-color: #61a7ff;
	width: 30px;
	height: 30px;
}

.spinner-pulse:before {
	left: -40px;
}

.spinner-pulse:after {
	left: 40px;
}

@media (max-width: 767px) {}

@media (min-width: 768px) {
	#chat {
		top: 120px;
	}

	textarea {
		min-height: 5em;
	}

	#answer {
		position: absolute;
		max-height: 50vh;
		bottom: 60px;
		left: unset;
		right: unset;
	}

	.output[data-v-0e02bc1f] {
		width: 80%;
	}
}

@media (min-width: 992px) {}

@media (min-width: 1200px) {}
</style>