<script setup>
import { useRoute } from "vue-router";
import GeneralPurpose from "@/components/GeneralPurpose.vue";

const aiDisclaimer = `Hi! I am Chris' AI assistant, powered by Google Gemini. 
			I am an experimental chatbot trained to answer questions about Chris' career, skills, and interests. 
			While I strive for accuracy, AI can occasionally hallucinate or make mistakes. 
			Please do not share any sensitive personal or confidential information in this chat.`;

const route = useRoute();
</script>

<template>
	<div id="disclaimers">
		<GeneralPurpose />
		<p>
			This site is protected by reCAPTCHA and the Google
			<strong>
				<a class="link" title="Google's Privacy Policy" target="_blank" href="https://policies.google.com/privacy">Privacy Policy</a>
			</strong>
			and
			<strong>
				<a class="link" title="Google's Terms of Service" target="_blank" href="https://policies.google.com/terms">Terms of Service</a>
			</strong>
			apply.
		</p>
		<small v-if="route.name === 'home'"
			>See full
			<RouterLink class="privacy-link" to="/about#privacy" title="Privacy Policy">privacy policy</RouterLink>
		</small>
	</div>
</template>

<style scoped>
strong {
	font-weight: bold;
}

#disclaimers {
	text-align: center;
	background-color: var(--vt-c-disc-light-1);
	border-radius: 8px;
	margin: 30px auto 0;
	padding: 15px 30px;
	width: fit-content;
}

.uiDarkMode #disclaimers {
	background-color: var(--vt-c-disc-dark-1);
}

.uiDarkMode a:visited {
	color: #f53cf5;
}
</style>
