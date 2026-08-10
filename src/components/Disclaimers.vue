<template>
	<div id="disclaimers">
		<p>This web application was made using a <strong>Vue 3</strong> frontend with a <strong>NodeJS</strong> backend.
		</p>
		<p>
			This site is protected by reCAPTCHA and the Google
			<strong>
				<a title="Privacy Policy" target="_blank" href="https://policies.google.com/privacy">Privacy Policy</a>
			</strong> and
			<strong>
				<a title="Terms of Service" target="_blank" href="https://policies.google.com/terms">Terms
					of Service</a>
			</strong> apply.
		</p>
	</div>
</template>

<script>
export default {
	name: "Disclaimers",
	data() {
		return {
			aiDisclaimer: `Hi! I am Chris' AI assistant, powered by Google Gemini. 
			I am an experimental chatbot trained to answer questions about Chris' career, skills, and interests. 
			While I strive for accuracy, AI can occasionally hallucinate or make mistakes. 
			Please do not share any sensitive personal or confidential information in this chat.`
		};
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
strong {
	font-weight: bold;
}

#disclaimers {
	text-align: center;
	color: #222;
	background-color: rgb(219 221 247 / 80%);
	border-radius: 8px;
	margin: 30px auto 0;
	padding: 15px 30px;
	width: fit-content;
}
</style>