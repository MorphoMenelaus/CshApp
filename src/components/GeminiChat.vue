<script setup>
import { ref, provide, inject, onMounted, onBeforeUnmount } from 'vue';
import { tokenInterceptFetch } from "@/dependencies/csh-libs.js";

const baseUrl = inject('baseUrl');
const showHideLoader = inject('showHideLoader');
const closeChat = inject("closeChat")


const props = defineProps({
	appState: Object
});

// console.log(appState);
console.log(props);

let question = ref("");
let answer = ref("");

const askQuestion = async () => {

	if (!question.value) {
		console.error("Question field is required");
		return;
	}

	// Remove html tags
	let reg = new RegExp(/(<([^>]+)>)/ig);
	let prompt = question.value.replace(reg, "");
	console.log(prompt);

	showHideLoader(true);

	let body = {
		prompt: prompt,
	};

	let headerObj = new Headers();
	// headerObj.append("Authorization", `Bearer ${appState.accessToken}`);
	headerObj.append("Content-Type", "application/json; charset=utf-8");
	let requestUrl = new URL("/api/gemini/question", baseUrl);

	let request = new Request(
		requestUrl.toString(), {
		method: 'POST',
		headers: headerObj,
		body: JSON.stringify(body)
	});

	try {
		const response = await fetch(request);
		const data = await response.json();
		answer.value = data.output;

	} catch (error) {
		console.error('Error posting data:', error);
		let serverStatus = {
			code: 500,
			message: `Error getting data: ${error}`,
			success: false
		}
	} finally {
		showHideLoader(false);
	}
};

const clear = () => {
	question.value = "";
	answer.value = "";
}

</script>

<template>
	<div>
		<div id="chat">
			<div id="chat-container">
				<div id="header">
					<h1>Ask AI</h1>
					<h2>Type Question Below</h2>
				</div>
				<form @submit.prevent="getFavoriteList" method="get">
					<div class="form-group">
						<label for="question">Question:</label>
						<textarea id="question" title="Question" v-model="question" type="text" name="Question"
							class="form-control" placeholder="What's on your mind..."></textarea>
					</div>
					<div class="button-container">
						<button class="btn" @click="askQuestion()">Submit</button>
						<button class="btn" @click="clear()">Clear</button>
						<button class="btn" @click="closeChat()">Close</button>
					</div>
				</form>
			</div>
			<Transition name="slide-up">
				<div id="answer" v-if="answer">
					<h2 class="output-header">AI Output</h2>
					<div v-html="answer" class="output"></div>
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
	top: 120px;
	width: 100vw;
	height: 100vh;
	display: grid;
	align-content: start;
	justify-content: center;
}

#chat-container {
	position: fixed;
	justify-self: center;
	background: aliceblue;
	color: #333;
	padding: 15px;
	border-radius: 12px;
	border: 1px #333 solid;
	overflow: hidden;
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

textarea {
	min-width: 25em;
	min-height: 5em;
	background-color: #cdb2f5;
	color: #000;
	padding: 5px;
	border-radius: 8px;
	font-size: 1em;
}

.button-container {
	display: flex;
	width: 100%;
	justify-content: space-evenly;
	margin: 30px auto 15px;
}

#answer {
	position: absolute;
	max-height: 50vh;
	bottom: 180px;
	color: #000;
}

.output-header {
	background-color: #ffffff;
	width: fit-content;
	padding: 5px 30px;
	border-radius: 8px 8px 0 0;
	margin: auto;
}

.output {
	background-color: #d7d7d7;
	width: 80%;
	margin: auto;
	padding: 30px;
	overflow: hidden auto;
	border-radius: 12px 12px 0 0;
}

@media (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 768px) {}

@media (min-width: 992px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) {}
</style>