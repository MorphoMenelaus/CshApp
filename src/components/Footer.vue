<template>
	<footer>
		<div id="serverInfo">
			<small class="version" v-if="serverVersion">Server Version: {{ serverVersion }}</small>
			<small class="appVersion" v-if="this.appCurrentVersion">App Version: {{ this.appCurrentVersion }}</small>
		</div>
		<h3>Csh App</h3>
		<div class="btn-container">
			<button class="btn" @click="eventBus.emit('contactEmail', true)">Contact Form</button>
		</div>
	</footer>
</template>

<script>
export default {
	name: 'Footer',
	props: {
		serverVersion: String
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
	top: 0;
	left: 0;
	padding: 5px 15px;
	z-index: 500;
}

.btn-container {
	position: absolute;
	right: 15px;
	top: 15px;
}

.btn-container button {
	font-size: .8em;
}
</style>
