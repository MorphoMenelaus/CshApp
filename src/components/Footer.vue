<template>
	<footer>
		<div id="serverInfo">
			<small class="version" v-if="serverVersion">Server Version: {{ serverVersion }}</small>
			<small class="appVersion" v-if="this.appCurrentVersion">App Version: {{ this.appCurrentVersion }}</small>
		</div>
		<h3 id="name-contact" title="Contact Me" @click="openThisModalCloseOthers()">{{ isMobile ? 'CSH' : 'Chris Hardwick' }}</h3>
		<div class="btn-container">
			<button title="Contact Me" class="btn" @click="openThisModalCloseOthers()">Contact Me</button>
		</div>
	</footer>
</template>

<script>
export default {
	name: 'Footer',
	props: {
		serverVersion: String,
		isMobile: Boolean
	},
	methods: {
		openThisModalCloseOthers() {
			// Control the state of both components
			let payload = {
				register: false,
				login: false
			}
			this.eventBus.emit("registerUser", payload);
			this.eventBus.emit("contactEmail", true);
		}
	},
	mounted() {
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
footer {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 3em;
	align-content: center;
	background-color: #313b64;
	border-top: 1px #fff solid;
	color: var(--color-text);
}

h3 {
	text-align: center;
	color: #fff;
}

#serverInfo {
	position: absolute;
	display: flex;
	flex-direction: column;
	top: 5px;
	left: 0;
	padding: 5px 15px;
	z-index: 500;
	font-size: 18px;
}

.btn-container {
	position: absolute;
	right: 15px;
	top: 15px;
	font-size: 18px;
}

.btn-container button {
	font-size: 1.25em;
}

#name-contact {
	cursor: pointer;
	font-size: 1.25em;
}

#name-contact:hover {
	color: #f60;
}
</style>
